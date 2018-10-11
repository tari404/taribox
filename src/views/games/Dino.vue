<template>
  <div id="dino-scene">
    <div id="dino-road">
      <frame :asset="road">
    </div>
    <div id="dino-player" :style="{
      'transform': `translateY(${-dinoJumpHeight}px)`
    }">
      <frame v-for="(url, name, index) in this.dino" :key="index"
        v-if="dinoStatus === name" :asset="url" />
    </div>
  </div>
</template>

<script>
import Frame from './Frame'

const MAX_JUMP_HEIGHT = 122

const NO_JUMP = 0
const JUMP_UP = 1
const JUMP_DOWN = 2

const dinoAssets = {
  default: require('@/assets/dino/dino_default.png'),
  leftLeg: require('@/assets/dino/dino_left_leg.png'),
  rightLeg: require('@/assets/dino/dino_right_leg.png')
}
const road = {
  road: require('@/assets/dino/road.png')
}

export default {
  name: 'Dino',
  data () {
    return {
      raf: 0,
      lastFrame: 0,

      assets: {
        ...dinoAssets,
        ...road
      },
      dino: {
        default: '',
        leftLeg: '',
        rightLeg: ''
      },
      road: '',

      dinoStatus: 'default',
      dinoJumping: NO_JUMP,
      dinoJumpHeight: 0
    }
  },
  components: {
    Frame
  },
  created () {
    const loadAssets = []
    for (const key in this.assets) {
      const img = new Image()
      loadAssets.push(new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
      }))
      img.src = this.assets[key]
    }
    Promise.all(loadAssets).then(this.init)
  },
  methods: {
    init () {
      for (const key in this.dino) {
        this.dino[key] = this.assets[key]
      }
      this.road = this.assets['road']

      this.bindEventListener()

      this.raf = requestAnimationFrame(this.render)
    },
    bindEventListener () {
      window.addEventListener('keydown', e => {
        switch (e.keyCode) {
          case 32:
            return this.dinoJump()
        }
      })
    },
    render (timer) {
      let delta = timer - this.lastFrame
      if (delta > 100) {
        delta = 0
      }
      this.lastFrame = timer
      if (this.dinoJumping === JUMP_UP) {
        const dy = 2 * Math.sqrt(1 - this.dinoJumpHeight / (MAX_JUMP_HEIGHT + 1))
        this.dinoJumpHeight += dy * MAX_JUMP_HEIGHT / 400 * delta
        if (this.dinoJumpHeight > MAX_JUMP_HEIGHT) {
          this.dinoJumpHeight = MAX_JUMP_HEIGHT
          this.dinoJumping = JUMP_DOWN
          this.dinoStatus = 'rightLeg'
        }
      } else if (this.dinoJumping === JUMP_DOWN) {
        const dy = 2 * Math.sqrt(1 - this.dinoJumpHeight / (MAX_JUMP_HEIGHT + 1))
        this.dinoJumpHeight -= dy * MAX_JUMP_HEIGHT / 400 * delta
        if (this.dinoJumpHeight < 0) {
          this.dinoJumpHeight = 0
          this.dinoJumping = NO_JUMP
          this.dinoStatus = 'default'
        }
      }
      this.raf = requestAnimationFrame(this.render)
    },
    dinoJump () {
      if (this.dinoJumping !== NO_JUMP) {
        return
      }
      this.dinoJumping = JUMP_UP
      this.dinoStatus = 'leftLeg'
    }
  },
  beforeDestroy () {
    if (this.raf) {
      cancelAnimationFrame(this.raf)
    }
  }
}
</script>

<style lang="stylus" scoped>
#dino-scene
  position relative
  width 600px
  height 240px
  border solid 1px #ddd
  overflow hidden
#dino-road
  position absolute
  width 2400px
  height 30px
  left 0
  bottom 20px
#dino-player
  position absolute
  width 88px
  height 94px
  bottom 20px
  left 28px
</style>
