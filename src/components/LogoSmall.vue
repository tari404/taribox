<template>
  <div class="logo-small">
    <div @click="trigger('t')" class="top-one">
      <svg width="100%" height="100%" viewBox="0, 0, 40, 40">
        <path d="M 23 30 l -5 -5 l -1 1 l -3 -12 l 12 3 l -1 1 l 5 5 l -4 4 l -5 -5" />
      </svg>
    </div>
    <div @click="trigger('l')" class="left-one">
      <svg width="100%" height="100%" viewBox="0, 0, 40, 40">
        <path d="M 14 20 L 26 20" />
        <path d="M 19 15 L 14 20 L 19 25" />
      </svg>
    </div>
    <div @click="trigger('r')" class="right-one">
      <svg width="100%" height="100%" viewBox="0, 0, 40, 40">
        <path d="M 14 20 L 26 20" />
        <path d="M 21 15 L 26 20 L 21 25" />
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LogoSmall',
  methods: {
    trigger (type) {
      this.$emit('trigger', type)
    }
  }
}
</script>

<style lang="stylus" scoped>
.logo-small
  width 100%
  height 100%
  position relative
  div
    width 40%
    height 40%
    position absolute
    top 50%
    left 50%
    background-color #fff
    cursor pointer
    transition background-color .3s
    &:hover
      background-color #ffd633
      transition background-color .6s
  .right-one
    transform-origin 0 50%
    transform skewY(-30deg) scaleX(0.866025)
  .left-one
    transform-origin 100% 50%
    transform translate3d(-100%, 0, 0) skewY(30deg) scaleX(0.866025)
  .top-one
    transform translate3d(-50%, -110%, 0) scale(1.224744, 0.707107) rotate(45deg)
path
  stroke #fff
  stroke-width 2
  fill none
</style>
