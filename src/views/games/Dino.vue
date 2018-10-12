<template>
  <div id="dino-game">
    <div id="dino-scene">
      <div id="dino-road">
        <frame :asset="road" :scrollX="-distance">
      </div>
      <div id="dino-player" :style="{
        'transform': `translateY(${-dinoJumpHeight}px)`
      }">
        <frame v-for="(url, name, index) in this.dino" :key="index"
          v-if="dinoStatus === name" :asset="url" />
      </div>
    </div>
    <div id="dino-space-key">
      <div :class="{
        'clicked': spaceClicked
      }"
      @mousedown.stop.prevent="clickSpace"
      @touchstart.stop.prevent="clickSpace"
      @touchend.stop.prevent="releaseSpace"
      >Space</div>
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
      gameStart: false,
      spaceClicked: false,

      assets: {
        ...dinoAssets,
        ...road
      },
      dino: {
        default: '',
        leftLeg: '',
        rightLeg: ''
      },
      dinoTimer: 0,
      dinoStatus: 'default',
      dinoJumping: NO_JUMP,
      dinoJumpHeight: 0,

      road: '',
      distance: 0
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
      window.addEventListener('keydown', this.keyDownEvent)
      window.addEventListener('keyup', this.keyUpEvent)
      document.addEventListener('mouseup', this.releaseSpace)
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
          if (!this.gameStart) {
            this.gameStart = true
          }
        }
      }

      if (this.gameStart) {
        this.distance += 300 / 1000 * delta
        this.updateDinoSprite(delta)
      }

      this.raf = requestAnimationFrame(this.render)
    },
    updateDinoSprite (deltaTime) {
      if (this.dinoJumping !== NO_JUMP) {
        return
      }
      this.dinoTimer += deltaTime
      if (this.dinoTimer >= 140) {
        this.dinoTimer -= 140
        this.dinoStatus = this.dinoStatus === 'leftLeg' ? 'rightLeg' : 'leftLeg'
      }
    },
    keyDownEvent (e) {
      switch (e.keyCode) {
        case 32:
          return this.clickSpace()
      }
    },
    keyUpEvent (e) {
      switch (e.keyCode) {
        case 32:
          return this.releaseSpace()
      }
    },
    clickSpace () {
      this.dinoJump()
      this.spaceClicked = true
    },
    releaseSpace () {
      this.spaceClicked = false
    },
    dinoJump () {
      if (this.dinoJumping !== NO_JUMP || this.spaceClicked) {
        return
      }
      this.dinoJumping = JUMP_UP
      this.dinoStatus = 'leftLeg'
    }
  },
  beforeDestroy () {
    window.removeEventListener('keydown', this.handelKeyEvent)
    window.removeEventListener('keyup', this.keyUpEvent)
    document.removeEventListener('mouseup', this.releaseSpace)
    if (this.raf) {
      cancelAnimationFrame(this.raf)
    }
  }
}
</script>

<style lang="stylus" scoped>
#dino-game
  margin 20px
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
#dino-space-key
  margin 14px auto 0
  width 240px
  height 40px
  border-radius 6px
  background-color #999
  div
    font-size 14px
    color #666
    line-height 38px
    text-align center
    width 100%
    height 100%
    border solid 1px #999
    border-radius 6px
    box-sizing border-box
    transform translateY(-6px)
    cursor pointer
    background-color #fff
    transition transform .2s, background-color .2s
  .clicked
    transform translateY(0px)
    background-color #f0f0f0
</style>
