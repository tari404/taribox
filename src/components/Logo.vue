<template>
  <div class="logo-box">
    <div class="logo-container">
      <div class="lr-piece" :style="{
        'z-index' : angle % 180 - 90 > 45 || angle % 180 - 90 < -45 ? 0 : 1,
        'transform': `translate3d(-50%, -50%, 0) rotateX(-35.2643deg) rotateY(${angle % 180 - 90}deg) translateZ(50px)`
      }"><div :style="{ 'opacity': alphaLeft }"/></div>
      <div class="lr-piece" :style="{
        'transform': `translate3d(-50%, -50%, 0) rotateX(-35.2643deg) rotateY(${(angle + 90) % 180 - 90}deg) translateZ(50px)`
      }"><div :style="{ 'opacity': alphaRight }"/></div>
      <div :style="{
        'transform': `translate3d(-50%, -50%, 0) rotateX(54.7357deg) rotateZ(${-angle}deg) translateZ(50px)`
      }"/>
      <div class="top-piece" :style="{
        'transform': `translate3d(-50%, -50%, 0) rotateX(54.7357deg) rotateZ(${-angle}deg) translateZ(${50 + offsetTop}px)`
      }"/>
    </div>
    <ul class="logo-ideas" :style-off="{ 'transform': `translateY(${25 * Math.cos(angle % 180 / 90 * Math.PI)}px)` }">
      <li v-for="(item, index) in texts" :key="index">
        <span class="rotate-char" v-for="(char, index) in item" :key="index">{{char}}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Logo',
  data () {
    return {
      raf: 0,

      angle: 45,
      offsetTop: 0,
      step: 0.2,

      texts: [
        '零碎的想法',
        '没有明确需求的杂物',
        '有意思的东西'
      ]
    }
  },
  computed: {
    alphaLeft () {
      const alpha = (this.angle % 180 - 45) / 90
      return Math.max(Math.min(alpha, 1), 0)
    },
    alphaRight () {
      const alpha = ((this.angle + 90) % 180 - 45) / 90
      return Math.max(Math.min(alpha, 1), 0)
    }
  },
  mounted () {
    this.raf = requestAnimationFrame(this.update)
    const chars = this.$el.querySelectorAll('.rotate-char')
    chars.forEach(char => {
      char.style.transform = `rotate(${Math.random() * 20 - 10}deg)`
    })
  },
  methods: {
    update (time) {
      this.angle += this.step
      this.offsetTop = Math.sin(time / 500) * 10 + 10
      this.raf = requestAnimationFrame(this.update)
    }
  },
  beforeDestroy () {
    cancelAnimationFrame(this.raf)
  }
}
</script>

<style lang="stylus" scoped>
.logo-box
  width 200px
  margin auto
  position relative
.logo-container
  position relative
  width 200px
  height 200px
  margin auto
.logo-container>div
  position absolute
  width 50%
  height 50%
  top 50%
  left 50%
.lr-piece
  background-color #ffd633
  div
    width 100%
    height 100%
    background-color #ffb81f
.top-piece-mask
  background-color #ffffff
.top-piece
  background-color #ff9b1f
.logo-ideas
  position absolute
  left 180px
  top 65px
  width 160px
  font-size 14px
  line-height 24px
  text-align left
  margin 0
  padding 0
  list-style none
  li:before
    content ''
    display inline-block
    vertical-align bottom
    width 6px
    height 6px
    margin 9px
    background-color #ffb81f
    transform rotate(45deg)
.rotate-char
  display inline-block
</style>
