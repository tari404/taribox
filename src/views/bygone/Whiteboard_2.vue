<template>
  <div class="center">
  </div>
</template>

<script>
import * as THREE from 'three'
import OrbitControls from 'three-orbitcontrols'
import GLTFLoader from 'three-gltf-loader'

window.THREE = THREE

const scene = new THREE.Scene()
const canvas = document.createElement('canvas')
canvas.style.backgroundColor = '#333'
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

const standardShader = THREE.ShaderLib['standard']
const myMaterial = new THREE.ShaderMaterial({
  vertexShader: standardShader.vertexShader,
  /* eslint-disable */
  fragmentShader: `
#define PHYSICAL
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifndef STANDARD
	uniform float clearCoat;
	uniform float clearCoatRoughness;
#endif
varying vec3 vViewPosition;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <uv2_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <bsdfs>
#include <cube_uv_reflection_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <lights_physical_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	gl_FragColor = vec4( outgoingLight, diffuseColor.a );
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
  #include <dithering_fragment>
  gl_FragColor.rb = floor(gl_FragColor.rb / 0.05 + vec2(0.5)) * 0.05;
  float diffuse = dot(normal, vec3(0.0, 0.0, 1.0));
  float border = clamp(0.0, 1.0, diffuse * diffuse * 20.0);
  gl_FragColor.rgb = gl_FragColor.rgb * border + vec3(1.0, 1.0, 1.0) * (1.0 - border);
}
`,
  /* eslint-enable */
  uniforms: standardShader.uniforms,
  lights: true,
  defines: {
    USE_MAP: true,
    USE_ENVMAP: true,
    ENVMAP_TYPE_CUBE: true
  }
})

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
