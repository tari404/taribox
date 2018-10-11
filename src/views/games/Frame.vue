<template>
  <div class="game-frame" :style="{
    'background-image': `url(${asset})`
  }" />
</template>

<script>
export default {
  name: 'Frame',
  props: ['asset']
}
</script>

<style lang="stylus" scoped>
.game-frame
  position absolute
  top 0
  left 0
  width 100%
  height 100%
</style>
