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
          v-show="dinoStatus === name" :asset="url" />
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
// 通过Frame组件来保存每个图片，并通过参数来控制显示、位移、旋转等
import Frame from './Frame'

// 对游戏中需要的一些常量进行定义
const MAX_JUMP_HEIGHT = 122
const SPEED = distance => {
  // 游戏中移动的速度可以由移动的距离决定，
  // 目前为一定值，可以根据实际需求修改
  const speed = 300
  return speed
}

// 一些枚举值的定义，增加代码可读性
const NO_JUMP = 0
const JUMP_UP = 1
const JUMP_DOWN = 2

// 游戏需要的资源，提前声明再统一加载
const dinoAssets = {
  default: require('@/assets/dino/dino_default.png'),
  leftLeg: require('@/assets/dino/dino_left_leg.png'),
  rightLeg: require('@/assets/dino/dino_right_leg.png')
}
const roadAssets = {
  road: require('@/assets/dino/road.png')
}

export default {
  name: 'Dino',
  data () {
    return {
      raf: 0, // 动画渲染循环的标志，用于在组件销毁时释放循环
      lastFrame: 0, // 记录上一帧的时间用
      gameStart: false,
      spaceClicked: false,

      // 所有的游戏资源（图片）
      assets: {
        ...dinoAssets,
        ...roadAssets
      },
      // 和小恐龙相关的数据模型
      dino: {
        default: '',
        leftLeg: '',
        rightLeg: ''
      },
      dinoTimer: 0,
      dinoStatus: 'default',
      dinoJumping: NO_JUMP,
      dinoJumpHeight: 0,

      // 和道路相关的数据模型
      road: '',
      distance: 0
    }
  },
  created () {
    const loadAssets = []
    // 根据资源列表去加载相应的图片
    for (const key in this.assets) {
      const img = new Image()
      // Promise的使用会使得异步操作变的清楚明晰，建议熟悉并能掌握基础用法
      loadAssets.push(new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
      }))
      img.src = this.assets[key]
    }
    // 当所用的图片加载完成时初始化游戏
    Promise.all(loadAssets).then(this.init)
  },
  methods: {
    init () {
      // 分别将小恐龙和道路的图片资源绑定到对应的数据上
      for (const key in this.dino) {
        this.dino[key] = this.assets[key]
      }
      this.road = this.assets['road']

      // 绑定对于用户输入事件的监听
      this.bindEventListener()

      // 启动游戏渲染的循环
      this.raf = requestAnimationFrame(this.render)
    },
    bindEventListener () {
      window.addEventListener('keydown', this.keyDownEvent)
      window.addEventListener('keyup', this.keyUpEvent)
      // 注意mouseup时间需要绑定在document上，而touchend则不需要，
      // 可以思考为什么需要这样
      document.addEventListener('mouseup', this.releaseSpace)
    },
    render (timer) {
      // requestAnimationFrame方法会向调用的函数传递一个时间值，
      // 通过时间差来调整动画的步进等，可以使动画更流畅
      let delta = timer - this.lastFrame
      // 当在浏览器最小化或者当前标签页不显示时，不会渲染下一帧，
      // 因此下次激活页面时deltaTime值可能会过大（甚至超过1秒以上）
      // 过大的数字会导致处理逻辑出错，因此抛弃这些时间差过大的帧
      if (delta > 100) {
        delta = 0
      }
      this.lastFrame = timer

      // 如果小恐龙正在跳跃，则计算高度变化
      if (this.dinoJumping === JUMP_UP) {
        const dy = 2 * Math.sqrt(1 - this.dinoJumpHeight / (MAX_JUMP_HEIGHT + 1))
        this.dinoJumpHeight += dy * MAX_JUMP_HEIGHT / 400 * delta
        // 到达最高处，则开始下落
        if (this.dinoJumpHeight > MAX_JUMP_HEIGHT) {
          this.dinoJumpHeight = MAX_JUMP_HEIGHT
          this.dinoJumping = JUMP_DOWN
          this.dinoStatus = 'rightLeg'
        }
      } else if (this.dinoJumping === JUMP_DOWN) {
        const dy = 2 * Math.sqrt(1 - this.dinoJumpHeight / (MAX_JUMP_HEIGHT + 1))
        this.dinoJumpHeight -= dy * MAX_JUMP_HEIGHT / 400 * delta
        // 到达最低处，结束这次跳跃
        if (this.dinoJumpHeight < 0) {
          this.dinoJumpHeight = 0
          this.dinoTimer = 0
          this.dinoJumping = NO_JUMP
          this.dinoStatus = 'leftLeg'
          // 第一次跳跃落地以后游戏正式开始～
          // 也可以根据自己的想法设置在不同的时机开始游戏
          if (!this.gameStart) {
            this.gameStart = true
          }
        }
      }
      // *注-------------------------------------------------------
      // 每次高度的变化值为 dy * MAX_JUMP_HEIGHT / 400 * delta
      // 其中dy为在当前高度上的速度系数，是对抛物线所求的导数并用高度值y来表达
      // 系数 MAX_JUMP_HEIGHT / 400 表明在400毫秒的时间内可以跳到最高点
      // 最后乘以x（时间）的增量，即为y（高度）的增量
      // 可以尝试替换不通的速度曲线，复习一下微积分w；考虑为什么计算dy时要使用
      // MAX_JUMP_HEIGHT + 1 而不是 MAX_JUMP_HEIGHT
      // ----------------------------------------------------------

      // 当游戏启动后每一帧都会更新移动的距离和小恐龙的运动状态
      if (this.gameStart) {
        this.distance += SPEED(this.distance) / 1000 * delta
        this.updateDinoSprite(delta)
      }

      // 每一帧渲染完都会调用requestAnimationFrame，继续在下一帧执行同样的渲染
      // 一般设备每帧为16～17毫秒，浏览器会根据实际运行情况调整刷新率
      this.raf = requestAnimationFrame(this.render)
    },
    updateDinoSprite (deltaTime) {
      // 跳跃时腿是不会乱动的
      if (this.dinoJumping !== NO_JUMP) {
        return
      }
      this.dinoTimer += deltaTime
      // 每140毫秒左右腿会切换一次
      if (this.dinoTimer >= 140) {
        this.dinoTimer -= 140
        this.dinoStatus = this.dinoStatus === 'leftLeg' ? 'rightLeg' : 'leftLeg'
      }
    },
    keyDownEvent (e) {
      // 判断按下的键并触发不同的函数来处理
      // 可以通过console.log(e.keyCode)来确定键盘上的键都对应什么
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
      // 当一次跳跃未结束或者没有松开空格过时是不会再次起跳的
      if (this.dinoJumping !== NO_JUMP || this.spaceClicked) {
        return
      }
      // 起跳！
      this.dinoJumping = JUMP_UP
      this.dinoStatus = 'leftLeg'
    }
  },
  beforeDestroy () {
    // 释放循环和时间监听，养成良好的习惯，避免内存泄露
    window.removeEventListener('keydown', this.handelKeyEvent)
    window.removeEventListener('keyup', this.keyUpEvent)
    document.removeEventListener('mouseup', this.releaseSpace)
    if (this.raf) {
      cancelAnimationFrame(this.raf)
    }
  },
  components: {
    Frame
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
