<template>
  <div class="center">
  </div>
</template>

<script>
import * as THREE from 'three'
import JSZip from 'jszip'

const scene = new THREE.Scene()
const canvas = document.createElement('canvas')
const ctx = canvas.getContext('webgl2')
const renderer = new THREE.WebGLRenderer({ canvas, context: ctx })
const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000)

const vs = `
#version 300 es
uniform float depth;
uniform vec2 size;
out vec3 vUv;
void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  // Convert position.xy to 1.0-0.0
  vUv.xy = position.xy / size + 0.5;
  vUv.y = 1.0 - vUv.y; // original data is upside down
  vUv.z = depth;
}
`

const fs = `
#version 300 es
precision highp float;
precision highp int;
precision highp sampler3D;
uniform sampler3D diffuse;
in vec3 vUv;
out vec4 out_FragColor;
void main() {
  vec4 color = texture( diffuse, vUv );
  // lighten a bit
  out_FragColor = vec4( color.rrr * 1.5, 1.0 );
}
`

const depth = { value: 0 }

new THREE.FileLoader()
  .setResponseType('arraybuffer')
  .load(require('../../static/head256x256x109.zip'), async data => {
    const zip = new JSZip()
    const jszip = await zip.loadAsync(data)
    const array = await jszip.files['head256x256x109'].async('uint8array')
    const texture = new THREE.DataTexture3D(array, 256, 256, 109)
    texture.format = THREE.RedFormat
    texture.type = THREE.UnsignedByteType
    texture.minFilter = texture.magFilter = THREE.LinearFilter
    texture.needsUpdate = true
    const material = new THREE.ShaderMaterial({
      uniforms: {
        diffuse: { value: texture },
        depth,
        size: { value: new THREE.Vector2(3, 3) }
      },
      vertexShader: vs,
      fragmentShader: fs
    })
    const geometry = new THREE.PlaneBufferGeometry(3, 3)
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)
  })

export default {
  name: 'Whiteboard',
  data () {
    return {
      raf: 0,

      depth,
      depthStep: 1 / (109 * 3)
    }
  },
  mounted () {
    camera.aspect = innerWidth / innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(innerWidth, innerHeight)
    this.$el.appendChild(renderer.domElement)

    camera.position.z = 5

    this.raf = requestAnimationFrame(this.render)
  },
  methods: {
    render (timer) {
      let value = this.depth.value
      value += this.depthStep
      if (value > 1.0 || value < -1.0) {
        if (value > 1.0) {
          value = 2.0 - value
        }
        if (value < -1.0) {
          value = -2.0 - value
        }
        this.depthStep = -this.depthStep
      }
      this.depth.value = value

      renderer.render(scene, camera)

      this.raf = requestAnimationFrame(this.render)
    }
  },
  beforeDestroy () {
    cancelAnimationFrame(this.raf)
  }
}
</script>

<style lang="stylus" scoped>
.center
  display flex
  flex-direction column
  justify-content center
  align-items center
  width 100%
  height 100%
canvas
  background-color #000
</style>
