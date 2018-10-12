<template>
  <div class="game-frame" :style="{
    'background-image': `url(${asset})`,
    'background-position-x': bgOffsetX
  }" />
</template>

<script>
export default {
  name: 'Frame',
  props: [
    'asset',
    'scrollX'
  ],
  computed: {
    bgOffsetX () {
      const scrollX = this.scrollX
      if (typeof scrollX === 'number') {
        return scrollX + 'px'
      }
      return scrollX || '0'
    }
  }
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
