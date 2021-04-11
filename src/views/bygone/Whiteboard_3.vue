<template>
  <div class="center">
    <ul class="tools">
      <li>
        <input type="range" min="-2" max="2" step="0.1" v-model="lightX">
        <span>light X {{Number(lightX).toFixed(2)}}</span>
      </li>
      <li>
        <input type="range" min="-2" max="5" step="0.1" v-model="lightY">
        <span>light Y {{Number(lightY).toFixed(2)}}</span>
      </li>
      <li>
        <input type="range" min="-6" max="6" step="any" v-model="lightZ">
        <span>light Z {{Number(lightZ).toFixed(2)}}</span>
      </li>
      <li>
        <input type="range" min="0" max="30" step="any" v-model="lightDis">
        <span>distance {{Number(lightDis).toFixed(2)}}</span>
      </li>
      <li>
        <input type="range" min="0" max="5" step="any" v-model="lightDecay">
        <span>decay {{Number(lightDecay).toFixed(2)}}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import Stats from 'stats.js'
// import * as THREE from 'three'
import 'three/examples/js/controls/OrbitControls'
import 'three/examples/js/loaders/GLTFLoader'

const stats = new Stats()
stats.showPanel(0)

const THREE = window.THREE

const scene = new THREE.Scene()
const canvas = document.createElement('canvas')
canvas.style.backgroundColor = '#333'
const ctx = canvas.getContext('webgl')
const renderer = new THREE.WebGLRenderer({ canvas, context: ctx })
renderer.gammaFactor = 2.2
renderer.gammaOutput = true
renderer.setPixelRatio(window.devicePixelRatio)
const aspect = innerWidth / innerHeight
const camera = new THREE.PerspectiveCamera(30, aspect, 0.1, 100)
// const h = 30
// const camera = new THREE.OrthographicCamera(-h * aspect / 2, h * aspect / 2, h / 2, -h / 2, 0.1, 1000)
camera.position.set(4, 5, 10)
camera.lookAt(0, 0, 0)
camera.up.set(0, 1, 0)

function updateCamera () {
  const aspect = innerWidth / innerHeight
  // const h = camera.top
  // camera.left = -h * aspect
  // camera.right = h * aspect
  camera.aspect = aspect
  camera.updateProjectionMatrix()
  renderer.setSize(innerWidth, innerHeight)
}

// const gX = new THREE.Geometry()
// gX.vertices.push(new THREE.Vector3(0, 0, 0))
// gX.vertices.push(new THREE.Vector3(6, 0, 0))
// const gY = new THREE.Geometry()
// gY.vertices.push(new THREE.Vector3(0, 0, 0))
// gY.vertices.push(new THREE.Vector3(0, 6, 0))
// const gZ = new THREE.Geometry()
// gZ.vertices.push(new THREE.Vector3(0, 0, 0))
// gZ.vertices.push(new THREE.Vector3(0, 0, 6))

// const lineX = new THREE.Line(gX, new THREE.LineBasicMaterial({ color: 0xff0000 }))
// const lineY = new THREE.Line(gY, new THREE.LineBasicMaterial({ color: 0x00ff00 }))
// const lineZ = new THREE.Line(gZ, new THREE.LineBasicMaterial({ color: 0x0000ff }))

// scene.add(lineX)
// scene.add(lineY)
// scene.add(lineZ)

const envlight = new THREE.HemisphereLight(0xffffff, 0xbbbbdd, 1)
const light = new THREE.PointLight(0x0000ff, 1.0, 6, 0.8)
const light2 = new THREE.PointLight(0xff0000, 1.0, 6, 0.8)
const lightHelper = new THREE.PointLightHelper(light, 0.4)
light.position.set(-0.83, 5.08, 1.37)
light2.position.set(11.6, 10.8, -4.3)
// const dirLight = new THREE.DirectionalLight(0xffffff, 0.5)
// dirLight.position.set(0, 0, 1)

// const white = require('@/assets/white.png')
// const map = new Array(6).fill(white)
// var envMap = new THREE.CubeTextureLoader().load(map)

const loader = new THREE.GLTFLoader()
loader.load(`${process.env.BASE_URL}astropia/normal girl2.gltf`, gltf => {
  gltf.scene.traverse(child => {
    if (child.isMesh) {
      // child.material.envMap = envMap
      // child.material.envMapIntensity = 0.3
      window.mesh = child
    }
  })
  scene.add(gltf.scene)
}, undefined, console.warn)

scene.add(envlight)
scene.add(light)
// scene.add(light2)
// scene.add(dirLight)

scene.add(lightHelper)

const controls = new THREE.OrbitControls(camera, canvas)
controls.target = new THREE.Vector3(0, 4, 0)
controls.minZoom = 0.5
controls.maxZoom = 4
controls.update()

export default {
  name: 'Whiteboard',
  data () {
    return {
      raf: 0,
      lightX: '-0.83',
      lightY: '5.08',
      lightZ: '1.37',
      lightDis: '6',
      lightDecay: '0.8'
    }
  },
  mounted () {
    window.addEventListener('resize', updateCamera)
    document.body.appendChild(stats.dom)

    renderer.setSize(innerWidth, innerHeight)
    this.$el.appendChild(renderer.domElement)

    this.raf = requestAnimationFrame(this.render)
  },
  watch: {
    lightX (value) { light.position.x = Number(value) },
    lightY (value) { light.position.y = Number(value) },
    lightZ (value) { light.position.z = Number(value) },
    lightDis (value) {
      light.distance = Number(value)
      light2.distance = Number(value)
    },
    lightDecay (value) {
      light.decay = Number(value)
      light2.decay = Number(value)
    }
  },
  methods: {
    render (timer) {
      stats.begin()
      light.intensity = Math.sin(timer / 17.213) / 10 + 0.9
      light2.intensity = Math.sin(timer / 23.721) / 10 + 0.9
      renderer.render(scene, camera)

      stats.end()
      this.raf = requestAnimationFrame(this.render)
    }
  },
  beforeDestroy () {
    window.removeEventListener('resize', updateCamera)
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
.tools
  color #fff
  position fixed
  bottom 40px
  left 40px
  margin 0
  padding 0
  list-style none
  li
    display flex
    input
      display block
    span
      display block
      width 300px
      text-align left
      margin-left 4px
</style>
