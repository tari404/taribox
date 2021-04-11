<template>
  <div class="bg">
    <canvas id="c1" :width="w" :height="h"></canvas>
  </div>
</template>

<script>
import { RawShaderMaterial } from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { SavePass } from 'three/examples/jsm/postprocessing/SavePass.js'
import { TexturePass } from 'three/examples/jsm/postprocessing/TexturePass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'

import magicTextFs from '@/assets/glsl/magicText.fs'

const WIDTH = 600
const HEIGHT = 400

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
    uAnimate: { value: 0 },
    uColor1: { value: new THREE.Color(0x000000) },
    uColor2: { value: new THREE.Color(0x000000) },
    uBackground: { value: new THREE.Color(0xffffff) }
  },
  vertexShader: `
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
attribute vec3 position;
attribute vec2 uv;
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,

  fragmentShader: magicTextFs
}

console.log(magicTextFs)

const scene = new THREE.Scene()
const camera = new THREE.OrthographicCamera(-WIDTH / 2, WIDTH / 2, HEIGHT / 2, -HEIGHT / 2, 1, 200)
camera.position.set(0, 0, 100)
scene.add(camera)

const material = new THREE.MeshBasicMaterial({
  transparent: true
})
const mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(WIDTH, HEIGHT), material)
scene.add(mesh)

let composer = null
let renderComposer = null
let renderer = null

// eslint-disable-next-line no-unused-vars
const font = new THREE.WebGLRenderTarget(WIDTH, HEIGHT)

export default {
  name: 'Three',
  data () {
    return {
      w: WIDTH,
      h: HEIGHT,
      handle: null,
      magic: null,
      clock: new THREE.Clock(true)
    }
  },
  mounted () {
    const canvas = document.createElement('canvas')
    canvas.width = WIDTH
    canvas.height = HEIGHT

    const ctx = canvas.getContext('2d')
    const text = 'οβελisκ'
    ctx.font = '100px sans-serif'
    // const text = 'hello world'
    // ctx.font = '100px monospace'
    // const text = '- GameOver -'
    // ctx.font = 'bold 100px serif'
    const width = ctx.measureText(text).width
    ctx.fillText(text, WIDTH / 2 - width / 2, HEIGHT / 2)

    material.map = new THREE.CanvasTexture(canvas)

    renderer = new THREE.WebGL1Renderer({
      canvas: this.$el.querySelector('#c1'),
      antialias: true,
      alpha: true
    })
    renderer.getContext().getExtension('OES_standard_derivatives')
    renderer.setClearColor(0xffffff)

    composer = new EffectComposer(renderer)

    var renderPass = new RenderPass(scene, camera)
    composer.addPass(renderPass)

    const blurMaterial = new THREE.ShaderMaterial(fastGaussianBlurShader)
    blurMaterial.uniforms.uResolution.value = new THREE.Vector2(WIDTH, HEIGHT)
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

    renderComposer = new EffectComposer(renderer)
    const copy = new TexturePass(font.texture)
    renderComposer.addPass(copy)

    const magicMaterial = new RawShaderMaterial(magicShader)
    magicMaterial.uniforms.uTime.value = this.clock.getElapsedTime()
    magicMaterial.uniforms.uColor1.value = new THREE.Color(0x52ddfc)
    magicMaterial.uniforms.uColor2.value = new THREE.Color(0x52ddfc)
    // magicMaterial.uniforms.uColor1.value = new THREE.Color(0xf10028)
    // magicMaterial.uniforms.uColor2.value = new THREE.Color(0xf10028)
    magicMaterial.uniforms.uBackground.value = new THREE.Color(0x0a0e15)
    magicMaterial.extensions.derivatives = true
    const magic = new ShaderPass(magicMaterial)
    this.magic = magic
    renderComposer.addPass(magic)
    renderComposer.addPass(new UnrealBloomPass(new THREE.Vector2(WIDTH, HEIGHT), 0.7, -2, 0.08))

    this.handle = requestAnimationFrame(this.update)
  },
  beforeDestroy () {
    cancelAnimationFrame(this.handle)
  },
  methods: {
    update () {
      const t = this.clock.getElapsedTime()
      this.magic.material.uniforms.uTime.value = t
      this.magic.material.uniforms.uAnimate.value = Math.max(0, t % 7 - 1) / 6
      // this.magic.render(renderer, null, font)
      renderComposer.render()
      this.handle = requestAnimationFrame(this.update)
    }
  }
}
</script>

<style lang="stylus" scoped>
.bg
  width 100%
  height 100%
  background-color #0a0e15
  display flex
  justify-content center
  align-items center
canvas
  display block
  margin 10px

@media screen and (max-width 500px)
  canvas
    transform rotate(90deg) translateY(150px)
</style>
