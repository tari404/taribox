<template>
  <div class="bg">
    <canvas id="c1"></canvas>
  </div>
</template>

<script>
const THREE = window.THREE

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 100)
camera.position.set(0, 0, -50)
camera.up.set(1, 0, 0)
camera.lookAt(0, 0, 0)
scene.add(camera)

const geometry = new THREE.BoxBufferGeometry(4, 10, 20)
const material = new THREE.MeshStandardMaterial({
  color: 0x3399ff,
  roughness: 0.6,
  metalness: 0.05
})
const sphere = new THREE.Mesh(geometry, material)
scene.add(sphere)

const light1 = new THREE.PointLight(0xffffff, 0.3)
light1.position.set(3, 3, -3)
camera.add(light1)
const light2 = new THREE.PointLight(0xffffff, 0.1)
light2.position.set(-1.5, -1.5, -6.5)
camera.add(light2)

var arrowHelperX = new THREE.ArrowHelper(
  new THREE.Vector3(10, 0, 0),
  new THREE.Vector3(18, 0, 0),
  4, 0xff0000, 2
)
var arrowHelperY = new THREE.ArrowHelper(
  new THREE.Vector3(0, 10, 0),
  new THREE.Vector3(0, 18, 0),
  4, 0x00ff00, 2
)
var arrowHelperZ = new THREE.ArrowHelper(
  new THREE.Vector3(0, 0, 10),
  new THREE.Vector3(0, 0, 18),
  4, 0x0000ff, 2
)
scene.add(arrowHelperX)
scene.add(arrowHelperY)
scene.add(arrowHelperZ)

let renderer = null

const toRradian = (a) => ((a || 0) * Math.PI) / 180

const listen = () => {
  window.addEventListener('deviceorientation', (e) => {
    sphere.rotation.set(toRradian(e.alpha), toRradian(e.beta), toRradian(e.gamma), 'ZXY')
  })
}

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
    const canvas = this.$el.querySelector('#c1')
    const ctx = canvas.getContext('webgl')
    renderer = new THREE.WebGLRenderer({ canvas, context: ctx })
    renderer.setSize(800, 500)
    this.handle = requestAnimationFrame(this.update)

    if (typeof DeviceMotionEvent.requestPermission === 'function') {
      document.onclick = () => {
        DeviceOrientationEvent.requestPermission().then((response) => {
          if (response === 'granted') {
            listen()
          }
        })
        document.onclick = null
      }
    } else {
      listen()
    }
  },
  beforeDestroy () {
    cancelAnimationFrame(this.handle)
  },
  methods: {
    update () {
      renderer.render(scene, camera)
      this.handle = requestAnimationFrame(this.update)
    }
  }
}
</script>

<style lang="stylus" scoped>
.bg
  width 100%
  height 100%
  display flex
  justify-content center
  align-items center
canvas
  display block
  margin 10px
</style>
