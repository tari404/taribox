<template>
  <div id="game-tar" class="flex-container">
    <div>
      <canvas id="tar-canvas" width="350" height="500"></canvas>
      <p style="margin: 4px 0;">Eyes</p>
      <input type="range" min="0" max="1" step="any" v-model="eyeROpen">
      <input type="range" min="0" max="1" step="any" v-model="eyeLOpen">
      <p style="margin: 4px 0;">Brow</p>
      <input type="range" min="-1" max="1" step="any" v-model="browAngle">
    </div>
  </div>
</template>

<script>
import { Live2D, Live2DModelWebGL, UtSystem } from '@/assets/live2d.min.js'
import model from '@/assets/live2d/tar.moc'

export default {
  name: 'Tar',
  data () {
    return {
      gl: null,
      eyeROpen: 1,
      eyeLOpen: 1,
      eyeBallX: 0,
      eyeBallY: 0,
      eyeBallXMoveTo: 0,
      eyeBallYMoveTo: 0,
      browAngle: 0,

      raf: 0
    }
  },
  mounted () {
    Live2D.init()
    const canvas = this.$el.querySelector('#tar-canvas')
    const gl = canvas.getContext('webgl', {
      alpha: true,
      premultipliedAlpha: true
    })
    Live2D.setGL(gl)
    this.gl = gl

    const live2DModel = Live2DModelWebGL.loadModel(model)
    this.live2DModel = live2DModel
    const t = 2 / live2DModel.getCanvasHeight()
    const mk = live2DModel.getCanvasWidth() / live2DModel.getCanvasHeight()
    const k = canvas.height / canvas.width
    const s = t * k
    const matrix4x4 = [
      s, 0, 0, 0,
      0, -t, 0, 0,
      0, 0, 1, 0,
      -k * mk * 1.04, 1, 0, 1
    ]
    live2DModel.setMatrix(matrix4x4)

    const texture0 = new Image()
    const texture1 = new Image()
    texture0.src = require('@/assets/live2d/tar.2048/texture_00.png')
    texture1.src = require('@/assets/live2d/tar.2048/texture_01.png')
    Promise.all([
      new Promise((resolve, reject) => { texture0.onload = resolve }),
      new Promise((resolve, reject) => { texture1.onload = resolve })
    ]).then(res => {
      live2DModel.setTexture(0, this.createTexture(texture0))
      live2DModel.setTexture(1, this.createTexture(texture1))
      this.raf = requestAnimationFrame(this.render)
    })

    addEventListener('mousemove', this.onMouseMove)
    addEventListener('mouseout', this.onMouseOut)
    addEventListener('touchmove', this.onTouchMove, { passive: false })
    addEventListener('touchend', this.onTouchEnd)
  },
  methods: {
    createTexture (image) {
      const gl = this.gl
      const texture = gl.createTexture()
      if (this.live2DModel.isPremultipliedAlpha() === false) {
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1)
      }
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST)
      gl.generateMipmap(gl.TEXTURE_2D)
      gl.bindTexture(gl.TEXTURE_2D, null)

      return texture
    },
    onMouseMove (e) {
      this.eyeBallXMoveTo = e.pageX / innerWidth * 2 - 1
      this.eyeBallYMoveTo = 1 - e.pageY / innerHeight * 2
    },
    onMouseOut (e) {
      var from = e.relatedTarget || e.toElement
      if (!from || from.nodeName === 'HTML') {
        console.log(1)
        this.eyeBallXMoveTo = 0
        this.eyeBallYMoveTo = 0
      }
    },
    onTouchMove (e) {
      console.log(2)
      if (e.target.tagName !== 'INPUT') {
        e.preventDefault()
      }
      const t = e.touches[0]
      this.eyeBallXMoveTo = t.pageX / innerWidth * 2 - 1
      this.eyeBallYMoveTo = 1 - t.pageY / innerHeight * 2
    },
    onTouchEnd () {
      this.eyeBallXMoveTo = 0
      this.eyeBallYMoveTo = 0
    },
    render () {
      const gl = this.gl
      const live2DModel = this.live2DModel

      this.eyeBallX += (this.eyeBallXMoveTo - this.eyeBallX) * 0.05
      this.eyeBallY += (this.eyeBallYMoveTo - this.eyeBallY) * 0.05

      gl.clearColor(0.9372, 0.9215, 0.9254, 1.0)
      gl.clear(gl.COLOR_BUFFER_BIT)

      const t1 = UtSystem.getUserTimeMSec() * 0.0001 * 13 * Math.PI
      const t2 = UtSystem.getUserTimeMSec() * 0.0001 * 11 * Math.PI
      const cycle = 3.0
      live2DModel.setParamFloat('PARAM_ANGLE_X', 10 * Math.sin(t1 / cycle))
      live2DModel.setParamFloat('PARAM_ANGLE_Y', 20 * Math.sin(t2 / cycle))
      live2DModel.setParamFloat('PARAM_EYE_R_OPEN', this.eyeROpen)
      live2DModel.setParamFloat('PARAM_EYE_L_OPEN', this.eyeLOpen)
      live2DModel.setParamFloat('PARAM_EYE_BALL_X', this.eyeBallX)
      live2DModel.setParamFloat('PARAM_EYE_BALL_Y', this.eyeBallY)
      live2DModel.setParamFloat('PARAM_BROW_R_ANGLE', this.browAngle)
      live2DModel.setParamFloat('PARAM_BROW_L_ANGLE', this.browAngle)

      live2DModel.update()
      live2DModel.draw()

      this.raf = requestAnimationFrame(this.render)
    }
  },
  beforeDestroy () {
    cancelAnimationFrame(this.raf)
    removeEventListener('mousemove', this.onMouseMove)
    removeEventListener('mouseout', this.onMouseOut)
    removeEventListener('touchmove', this.onTouchMove)
    removeEventListener('touchend', this.onTouchEnd)
  }
}
</script>

<style lang="stylus" scoped>
#game-tar
  background-color #efebec
  width 100%
  height 100%
</style>
