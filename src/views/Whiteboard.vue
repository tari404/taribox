<template>
  <div class="center">
  </div>
</template>

<script>
import * as THREE from 'three'
import OrbitControls from 'three-orbitcontrols'
import GLTFLoader from 'three-gltf-loader'

const scene = new THREE.Scene()
const canvas = document.createElement('canvas')
canvas.style.backgroundColor = '#fff'
const ctx = canvas.getContext('webgl')
const renderer = new THREE.WebGLRenderer({ canvas, context: ctx })
// renderer.gammaFactor = 2.2
// renderer.gammaOutput = true
const aspect = innerWidth / innerHeight
const camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000)
// const h = 200
// const camera = new THREE.OrthographicCamera(-h * aspect / 2, h * aspect / 2, h / 2, -h / 2, 0.1, 1000)
camera.position.set(0, 200, 280)
camera.lookAt(0, 80, 0)
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

const gX = new THREE.Geometry()
gX.vertices.push(new THREE.Vector3(0, 0, 0))
gX.vertices.push(new THREE.Vector3(6, 0, 0))
const gY = new THREE.Geometry()
gY.vertices.push(new THREE.Vector3(0, 0, 0))
gY.vertices.push(new THREE.Vector3(0, 6, 0))
const gZ = new THREE.Geometry()
gZ.vertices.push(new THREE.Vector3(0, 0, 0))
gZ.vertices.push(new THREE.Vector3(0, 0, 6))

const lineX = new THREE.Line(gX, new THREE.LineBasicMaterial({ color: 0xff0000 }))
const lineY = new THREE.Line(gY, new THREE.LineBasicMaterial({ color: 0x00ff00 }))
const lineZ = new THREE.Line(gZ, new THREE.LineBasicMaterial({ color: 0x0000ff }))

const envlight = new THREE.HemisphereLight(0xffffff, 0xbbbbdd, 1)
// const light = new THREE.PointLight(0xffffff, 0.6, 1000)
// light.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ color: 0xff0040 })))
// light.position.set(30, 180, 200)
// const dirLight = new THREE.DirectionalLight(0xffffff, 0.5)
// dirLight.position.set(0, 0, 1)

const white = require('@/assets/white.png')
const map = new Array(6).fill(white)
var envMap = new THREE.CubeTextureLoader().load(map)

window.THREE = THREE

const standardShader = THREE.ShaderLib['standard']
const myMaterial = new THREE.ShaderMaterial({
  vertexShader: standardShader.vertexShader,
  fragmentShader: standardShader.fragmentShader,
  uniforms: standardShader.uniforms,
  lights: true,
  defines: {
    USE_MAP: true,
    USE_ENVMAP: true,
    ENVMAP_TYPE_CUBE: true
  }
})
// const myMaterial = new THREE.MeshStandardMaterial({
//   color: 0xff0000,
//   envMap,
//   envMapIntensity: 0.3
// })

const loader = new GLTFLoader()
loader.load(`${process.env.BASE_URL}2B/scene.gltf`, gltf => {
  gltf.scene.traverse(child => {
    if (child.isMesh) {
      // child.material.envMap = envMap
      // child.material.envMapIntensity = 0.3
      const temp = child.material
      child.material = myMaterial.clone()
      for (const key in child.material.uniforms) {
        if (temp.hasOwnProperty(key)) {
          child.material.uniforms[key].value = temp[key]
        }
      }
      child.material.uniforms['envMap'].value = envMap
      child.material.uniforms['envMapIntensity'].value = 0.5
    }
  })
  scene.add(gltf.scene)
}, undefined, console.warn)

scene.add(lineX)
scene.add(lineY)
scene.add(lineZ)

scene.add(envlight)
// scene.add(light)
// scene.add(dirLight)

const controls = new OrbitControls(camera, canvas)
controls.target = new THREE.Vector3(0, 80, 0)
controls.minZoom = 0.5
controls.maxZoom = 4
controls.update()

export default {
  name: 'Whiteboard',
  data () {
    return {
      raf: 0
    }
  },
  mounted () {
    window.addEventListener('resize', updateCamera)

    renderer.setSize(innerWidth, innerHeight)
    this.$el.appendChild(renderer.domElement)

    this.raf = requestAnimationFrame(this.render)
  },
  watch: {
    threshold (value) {
      this.renderthreshold.value = Number(value)
    }
  },
  methods: {
    render (timer) {
      const threshold = timer / 5000 % 1
      this.threshold = threshold.toString()

      renderer.render(scene, camera)

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
input
  position fixed
  bottom 40px
  left 50%
  transform translateX(-50%)
</style>
