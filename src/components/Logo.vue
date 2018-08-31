<template>
  <div class="logo-container">
    <div class="left-piece" :style="{
      'z-index' : angle % 180 - 90 > 45 || angle % 180 - 90 < -45 ? 0 : 1,
      'transform': `translate3d(-50%, -50%, 0) rotateX(-35.2643deg) rotateY(${angle % 180 - 90}deg) translateZ(50px)`
    }"/>
    <div class="right-piece" :style="{
      'transform': `translate3d(-50%, -50%, 0) rotateX(-35.2643deg) rotateY(${(angle + 90) % 180 - 90}deg) translateZ(50px)`
    }"/>
    <div class="top-piece-mask" :style="{
      'z-index': 91,
      'transform': `translate3d(-50%, -50%, 0) rotateX(54.7357deg) rotateZ(${-angle}deg) translateZ(50px)`
    }"/>
    <div class="top-piece" :style="{
      'z-index': 91,
      'transform': `translate3d(-50%, -50%, 0) rotateX(54.7357deg) rotateZ(${-angle}deg) translateZ(${50 + offsetTop}px)`
    }"/>
  </div>
</template>

<script>
export default {
  name: 'Logo',
  data () {
    return {
      angle: 0,
      offsetTop: 0,
      step: 0.4
    }
  },
  computed: {
    sinA () {
      return Math.sin(this.angle * Math.PI / 120)
    },
    cosA () {
      return Math.cos(this.angle * Math.PI / 120)
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
  perspective 400px
.logo-container div
  position absolute
  width 50%
  height 50%
  top 50%
  left 50%
.left-piece
  background-color #ffd633
.right-piece
  background-color #ffb81f
.top-piece-mask
  background-color #ffffff
.top-piece
  background-color #ea741d
</style>
