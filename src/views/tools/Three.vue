<template>
  <div>
    <p>Three.js</p>
    <canvas id="c1" width="600" height="400"></canvas>
  </div>
</template>

<script>
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { SavePass } from 'three/examples/jsm/postprocessing/SavePass.js'

import magicTextFs from '@/assets/glsl/magicText.fs'

const THREE = window.THREE

const fastGaussianBlurShader = {
  uniforms: {
    tDiffuse: { value: null },
    uResolution: { value: new THREE.Vector2(300, 200) },
    uDirection: { value: new THREE.Vector2(1, 0) }
  },
  vertexShader: `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,

  fragmentShader: `
uniform sampler2D tDiffuse;
uniform vec2 uResolution;
uniform vec2 uDirection;
varying vec2 vUv;

vec4 blur9(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {
  vec4 color = vec4(0.0);
  vec2 off1 = vec2(1.3846153846) * direction;
  vec2 off2 = vec2(3.2307692308) * direction;
  color += texture2D(image, uv) * 0.2270270270;
  color += texture2D(image, uv + (off1 / resolution)) * 0.3162162162;
  color += texture2D(image, uv - (off1 / resolution)) * 0.3162162162;
  color += texture2D(image, uv + (off2 / resolution)) * 0.0702702703;
  color += texture2D(image, uv - (off2 / resolution)) * 0.0702702703;
  return color;
}

void main() {
  gl_FragColor = blur9(tDiffuse, vUv, uResolution, uDirection);
}
`
}

const magicShader = {
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: 0 },
    uAnimate: { value: 0 }
  },
  vertexShader: `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,

  fragmentShader: magicTextFs
}

const scene = new THREE.Scene()
const camera = new THREE.OrthographicCamera(-300, 300, 200, -200, 1, 200)
camera.position.set(0, 0, 100)
scene.add(camera)

const helper = new THREE.AxesHelper(50)
helper.position.z = 1
scene.add(helper)

const material = new THREE.MeshBasicMaterial({
  transparent: true
})
const mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(600, 400), material)
scene.add(mesh)

let composer = null
let renderer = null

const font = new THREE.WebGLRenderTarget(600, 400)

export default {
  name: 'Three',
  data () {
    return {
      handle: null,
      magic: null,
      clock: new THREE.Clock(true)
    }
  },
  mounted () {
    const canvas = document.createElement('canvas')
    canvas.width = 600
    canvas.height = 400

    const text = '测试ABC123'
    const ctx = canvas.getContext('2d')
    ctx.font = '100px ui-serif'
    const width = ctx.measureText(text).width
    ctx.fillText(text, 300 - width / 2, 200)

    material.map = new THREE.CanvasTexture(canvas)

    renderer = new THREE.WebGLRenderer({
      canvas: this.$el.querySelector('#c1'),
      antialias: true,
      alpha: true
    })
    // renderer.getContext().getExtension('OES_standard_derivatives')
    renderer.setClearColor(0xffffff)

    composer = new EffectComposer(renderer)

    var renderPass = new RenderPass(scene, camera)
    composer.addPass(renderPass)

    const blurMaterial = new THREE.ShaderMaterial(fastGaussianBlurShader)
    blurMaterial.uniforms.uResolution.value = new THREE.Vector2(600, 400)
    const horizontalBlur = new ShaderPass(blurMaterial)
    composer.addPass(horizontalBlur)
    composer.addPass(horizontalBlur)
    // composer.addPass(horizontalBlur)
    const blurMaterialCopy = blurMaterial.clone()
    blurMaterialCopy.uniforms.uDirection.value = new THREE.Vector2(0, 1)
    const verticalBlur = new ShaderPass(blurMaterialCopy)
    composer.addPass(verticalBlur)
    composer.addPass(verticalBlur)
    // composer.addPass(verticalBlur)

    const savePass = new SavePass(font)
    composer.addPass(savePass)
    composer.render()

    const magic = new ShaderPass(magicShader)
    magic.material.uniforms.uTime.value = this.clock.getElapsedTime()
    // magic.renderToScreen = true
    this.magic = magic

    this.handle = requestAnimationFrame(this.update)
  },
  beforeDestroy () {
    cancelAnimationFrame(this.handle)
  },
  methods: {
    update () {
      const t = this.clock.getElapsedTime()
      this.magic.material.uniforms.uTime.value = t
      this.magic.material.uniforms.uAnimate.value = t % 6 / 6
      this.magic.render(renderer, null, font)
      this.handle = requestAnimationFrame(this.update)
    }
  }
}
</script>

<style lang="stylus" scoped>
canvas
  display block
  margin 10px
</style>
