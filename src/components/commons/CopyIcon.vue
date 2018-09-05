<template>
  <svg width="20" height="20" :style="{
    'stroke': color
  }">
    <defs>
      <mask id="copyicon-rect-mask">
        <rect x="0" y="0" width="20" height="20" fill="#fff"></rect>
        <rect x="5" y="5" width="10" height="10" fill="#000"></rect>
      </mask>
    </defs>
    <rect x="3.5" y="6.5" width="10" height="10" mask="url(#copyicon-rect-mask)" />
    <rect x="6.5" y="3.5" width="10" height="10" />
    <g class="plus" :class="{
      'plus-hide': status === 'success',
      'plus-error': status === 'error'
    }">
      <line x1="8" y1="8.5" x2="15" y2="8.5" />
      <line x1="11.5" y1="5" x2="11.5" y2="12" />
    </g>
    <path class="tick" :class="{ 'tick-show': status === 'success' }"
      d="M8 9 L10.5 11.5 L16.5 5.5 L19 5.5" />
  </svg>
</template>

<script>
export default {
  name: 'CopyIcon',
  props: ['status'],
  computed: {
    color () {
      switch (this.status) {
        case 'success':
          return '#4a3a2b'
        case 'error':
          return '#4a3a2b'
        default:
          return '#4a3a2b'
      }
    }
  },
  watch: {
    status (_, oldValue) {
      if (oldValue === 'default') {
        setTimeout(() => {
          this.$emit('update:status', 'default')
        }, 1400)
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
svg
  fill none
  stroke-width 1
rect, line, path
  transition stroke .3s linear
.plus
  transition transform .3s
  transform-origin 11.5px 8.5px
.plus-hide
  transform scale(0)
.plus-error
  transform rotate(45deg)
.tick
  stroke-dasharray 15
  stroke-dashoffset 15
.tick-show
  stroke-dashoffset 0
  transition stroke-dashoffset .2s .2s
</style>
