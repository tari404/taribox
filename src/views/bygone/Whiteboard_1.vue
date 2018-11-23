<template>
  <div class="center">
    <input type="range" min="0" max="1" step="any" v-model="threshold" disabled>
  </div>
</template>

<script>
import * as THREE from 'three'
import OrbitControls from 'three-orbitcontrols'
import JSZip from 'jszip'
import shader from '@/assets/glsl/volumeShader'

const scene = new THREE.Scene()
const canvas = document.createElement('canvas')
canvas.style.background = '#110015'
const ctx = canvas.getContext('webgl2')
const renderer = new THREE.WebGLRenderer({ canvas, context: ctx })
// const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000)
const h = 300
const aspect = innerWidth / innerHeight
const camera = new THREE.OrthographicCamera(-h * aspect / 2, h * aspect / 2, h / 2, -h / 2, 0.1, 1000)
camera.position.set(0, 0, 300)
camera.up.set(0, -1, 0)

function updateCamera () {
  const aspect = innerWidth / innerHeight
  const h = camera.top
  camera.left = -h * aspect
  camera.right = h * aspect
  camera.updateProjectionMatrix()
  renderer.setSize(innerWidth, innerHeight)
}
window.addEventListener('resize', updateCamera)

const renderthreshold = { value: 0.5 }

new THREE.FileLoader()
  .setResponseType('arraybuffer')
  .load(`${process.env.BASE_URL}head256x256x109.zip`, async data => {
    const zip = new JSZip()
    const jszip = await zip.loadAsync(data)
    const array = await jszip.files['head256x256x109'].async('uint8array')
    const texture = new THREE.DataTexture3D(array, 256, 256, 109)
    texture.format = THREE.RedFormat
    texture.type = THREE.UnsignedByteType
    texture.minFilter = texture.magFilter = THREE.LinearFilter
    texture.needsUpdate = true

    const gray = new THREE.TextureLoader().load(require('@/assets/cm_viridis.png'))

    const uniforms = THREE.UniformsUtils.clone(shader.uniforms)
    uniforms.u_data.value = texture
    uniforms.u_size.value.set(256, 256, 140)
    uniforms.u_clim.value.set(0.01, 0.9)
    uniforms.u_renderstyle.value = 2
    uniforms.u_renderthreshold = renderthreshold
    uniforms.u_cmdata.value = gray

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: shader.vertexShader,
      fragmentShader: shader.fragmentShader,
      side: THREE.BackSide
    })

    const geometry = new THREE.BoxBufferGeometry(256, 256, 140)
    geometry.translate(256 / 2, 256 / 2, 140 / 2)
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(-256 / 2, -256 / 2, -140 / 2)
    scene.add(mesh)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.minZoom = 0.5
    controls.maxZoom = 4
    controls.update()
  })

export default {
  name: 'Whiteboard',
  data () {
    return {
      raf: 0,

      threshold: '0.5',
      renderthreshold
    }
  },
  mounted () {
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
