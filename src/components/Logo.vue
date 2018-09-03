<template>
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
</template>

<script>
export default {
  name: 'Logo',
  data () {
    return {
      angle: 45,
      offsetTop: 0,
      step: 0.3
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
    requestAnimationFrame(this.update)
  },
  methods: {
    update (time) {
      this.angle += this.step
      this.offsetTop = Math.sin(time / 500) * 6 + 6
      requestAnimationFrame(this.update)
    }
  }
}
</script>

<style lang="stylus" scoped>
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
</style>
