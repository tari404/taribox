<template>
  <div>
    <span @click="start" v-if="!isStart">播放</span>
    <canvas id="webgl"/>
    <canvas width="400" height="1024" id="canvas"/>
  </div>
</template>

<script>
import * as THREE from 'three'
import OrbitControls from 'three-orbitcontrols'
import axios from 'axios'
const AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext
const audioCtx = new AudioContext()

let sourceNode, analyser, panner
function init () {
  sourceNode = audioCtx.createBufferSource()
  analyser = audioCtx.createAnalyser()
  panner = audioCtx.createPanner()

  axios.get(`${process.env.BASE_URL}music.mp3`, {
    responseType: 'arraybuffer'
  }).then(res => {
    audioCtx.decodeAudioData(res.data, buffer => {
      sourceNode.connect(analyser)
      analyser.connect(panner)
      panner.connect(audioCtx.destination)
      sourceNode.buffer = buffer
      sourceNode.loop = true
    })
  })
}

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 100)
camera.position.set(1, 1, 6)
scene.add(camera)
let renderer = null

const soundSource = new THREE.Mesh(
  new THREE.SphereGeometry(0.05, 32, 32),
  new THREE.MeshBasicMaterial({ color: 0xff6600 })
)
scene.add(soundSource)

const geometry = new THREE.SphereGeometry(0.4, 32, 32)
const material = new THREE.MeshStandardMaterial({
  color: 0x3399ff,
  roughness: 0.6,
  metalness: 0.05
})
const sphere = new THREE.Mesh(geometry, material)
scene.add(sphere)

var arrowHelperX = new THREE.ArrowHelper(
  new THREE.Vector3(1, 0, 0),
  new THREE.Vector3(1.8, 0, 0),
  0.4, 0xff0000, 0.2
)
var arrowHelperY = new THREE.ArrowHelper(
  new THREE.Vector3(0, 1, 0),
  new THREE.Vector3(0, 1.8, 0),
  0.4, 0x00ff00, 0.2
)
var arrowHelperZ = new THREE.ArrowHelper(
  new THREE.Vector3(0, 0, 1),
  new THREE.Vector3(0, 0, 1.8),
  0.4, 0x0000ff, 0.2
)
scene.add(arrowHelperX)
scene.add(arrowHelperY)
scene.add(arrowHelperZ)

const curve = new THREE.EllipseCurve(
  0, 0,
  2, 2,
  0, 2 * Math.PI,
  false, 0
)
const points = curve.getPoints(64)
const lineG = new THREE.Geometry().setFromPoints(points)
const lineM = new THREE.LineDashedMaterial({
  scale: 15,
  dashSize: 1,
  gapSize: 1
})
const lineX = new THREE.Line(lineG, lineM.clone())
lineX.computeLineDistances()
lineX.material.color = new THREE.Color(1, 0, 0)
const lineY = new THREE.Line(lineG, lineM.clone())
lineY.computeLineDistances()
lineY.material.color = new THREE.Color(0, 1, 0)
const lineZ = new THREE.Line(lineG, lineM.clone())
lineZ.computeLineDistances()
lineZ.material.color = new THREE.Color(0, 0, 1)
lineX.rotation.set(0, Math.PI / 2, 0)
lineY.rotation.set(Math.PI / 2, 0, 0)
scene.add(lineX)
scene.add(lineY)
scene.add(lineZ)

const light1 = new THREE.PointLight(0xffffff, 0.3)
light1.position.set(3, 3, -3)
camera.add(light1)
const light2 = new THREE.PointLight(0xffffff, 0.1)
light2.position.set(-1.5, -1.5, -6.5)
camera.add(light2)

const ambient = new THREE.AmbientLight(0xffffff, 0.8)
scene.add(ambient)

let isStart = false
let raf = 0
let canvasCtx
function render (time) {
  if (isStart) {
    const x = Math.sin(time / 1153) * 2
    const y = Math.sin(time / 1711) * 2
    const z = Math.sin(time / 1387) * 2
    panner.setPosition(x, y, z)
    soundSource.position.set(x, y, z)
    if (canvasCtx) {
      const array = new Uint8Array(analyser.frequencyBinCount)
      analyser.getByteFrequencyData(array)
      canvasCtx.clearRect(0, 0, 400, 1024)
      for (let i = 0; i < array.length; i += 8) {
        canvasCtx.fillRect(400 - array[i], 1016 - i, array[i], 6)
      }
    }
  }
  renderer.render(scene, camera)
  raf = requestAnimationFrame(render)
}

function updateCamera () {
  const aspect = innerWidth / innerHeight
  camera.aspect = aspect
  camera.updateProjectionMatrix()
  renderer.setSize(innerWidth, innerHeight)
}

export default {
  name: 'Audio',
  data () {
    return {
      isStart: false,
      ctx: null
    }
  },
  created () {
    init()
  },
  mounted () {
    window.addEventListener('resize', updateCamera)
    const canvas = this.$el.querySelector('#webgl')
    const ctx = canvas.getContext('webgl')
    canvasCtx = this.$el.querySelector('#canvas').getContext('2d')
    canvasCtx.fillStyle = '#ff9b1f'
    const controls = new OrbitControls(camera, canvas)
    controls.target = new THREE.Vector3(0, 0, 0)
    controls.minDistance = 5
    controls.minZoom = 0.7
    controls.maxDistance = 10
    controls.maxZoom = 2
    controls.update()
    renderer = new THREE.WebGLRenderer({ canvas, context: ctx })
    renderer.setSize(innerWidth, innerHeight)
    this.$el.appendChild(renderer.domElement)
    raf = requestAnimationFrame(render)
  },
  methods: {
    start () {
      isStart = true
      this.isStart = true
      sourceNode.start(0)
    }
  },
  beforeDestroy () {
    window.removeEventListener('resize', updateCamera)
    cancelAnimationFrame(raf)
    sourceNode.stop()
    isStart = false
    soundSource.position.set(0, 0, 0)
  }
}
</script>

<style lang="stylus" scoped>
span
  cursor pointer
  position fixed
  top 10px
  right 10px
  z-index 2
#webgl
  position fixed
  left 0
  top 0
#canvas
  height 100vh
  width 30vw
  position fixed
  right 0
  top 0
</style>
