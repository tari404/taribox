<template>
  <div class="center">
    <canvas width="500" height="500" />
  </div>
</template>

<script>
export default {
  name: 'Whiteboard',
  data () {
    return {
      raf: 0,
      i: 0
    }
  },
  mounted () {
    const ctx = this.$el.querySelector('canvas').getContext('2d')
    ctx.fillRect(0, 0, 500, 500)
    this.ctx = ctx
    this.raf = requestAnimationFrame(this.render)
  },
  methods: {
    render () {
      this.i++
      const ctx = this.ctx
      for (let i = this.i; i < this.i + 1; i += 0.02) {
        const r = (0.5 + Math.sin(i * 0.131 + 1.231) + Math.sin(i * 0.713 + 0.123)) * 100
        const x = 250 - r * Math.sin(i * 0.0939711)
        const y = 250 - r * Math.cos(i * 0.0939711)
        ctx.globalAlpha = 0.002
        ctx.fillStyle = '#000'
        ctx.fillRect(0, 0, 500, 500)
        ctx.globalAlpha = 1
        ctx.fillStyle = '#eef'
        ctx.fillRect(x - 0.5, y - 0.5, 1, 1)
      }
      this.raf = requestAnimationFrame(this.render)
    }
  },
  beforeDestroy () {
    cancelAnimationFrame(this.raf)
  }
}
</script>

<style lang="stylus" scoped>
canvas
  position fixed
  top 50%
  left 50%
  transform translate3d(-50%, -50%, 0)
</style>
