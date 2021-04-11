<template>
  <div class="center">
    <div class="container">
      <canvas id="c1" width="400" height="400"></canvas>
      <i :style="{ transform: `translate3d(${x*h}px,${-y*h}px,0)` }"></i>
    </div>
    <div class="container">
      <canvas id="c2" width="400" height="400"></canvas>
      <i data="i0" :style="{ transform: `translate3d(${ix*h}px,${-iy*h}px,0)` }"></i>
      <i style="background: blue;" :style="{ transform: `translate3d(${(ix-l+1)*h}px,${-(iy-l)*h}px,0)` }"></i>
      <i style="background: blue;" :style="{ transform: `translate3d(${(ix-l)*h}px,${-(iy-l+1)*h}px,0)` }"></i>
      <i style="background: red;" :style="{ transform: `translate3d(${(ix+m)*h}px,${-(iy+m)*h}px,0)` }"></i>
      <i data="v" :style="{ transform: `translate3d(${x*h}px,${-y*h}px,0)` }"></i>
    </div>
    <input type="range" min="-10" max="10" step="0.1" v-model="x">
    <input type="number" v-model="x">
    <input type="range" min="-10" max="10" step="0.1" v-model="y">
    <input type="number" v-model="y">
  </div>
</template>

<script>
export default {
  name: 'Whiteboard',
  data () {
    return {
      x: 0,
      y: 0,
      k: 0.366025403784439,
      l: 0.211324865405187,
      m: 0.577350269189626,

      h: 40,

      ix: 0,
      iy: 0
    }
  },
  watch: {
    x () {
      this.update()
    },
    y () {
      this.update()
    }
  },
  mounted () {
    const ctx1 = this.$el.querySelector('#c1').getContext('2d')
    const ctx2 = this.$el.querySelector('#c2').getContext('2d')
    // const k = 0.366025403784439 // 0.5*(sqrt(3.0)-1.0)
    const k = (Math.sqrt(3) - 1) / 2
    for (let i = -5; i <= 5; i++) {
      for (let j = -5; j <= 5; j++) {
        let ii = (i + (i + j) * k)
        let ij = (j + (i + j) * k)
        // ii -= (ii + ij) * this.l
        // ij -= (ii + ij) * this.l
        if (i === 0 && j === 0) {
          ctx1.fillStyle = '#000'
          ctx2.fillStyle = '#000'
        } else {
          ctx1.fillStyle = `hsl(${i * this.h + j * this.h}deg 80% 44%)`
          ctx2.fillStyle = `hsl(${i * this.h + j * this.h}deg 80% 44%)`
        }
        ctx1.fillRect(200 + i * this.h - 2, 200 - j * this.h - 2, 4, 4)
        // ctx2.fillRect(200 + i * this.h - 1, 200 - j * this.h - 1, 2, 2)
        ctx2.fillRect(200 + ii * this.h - 2, 200 - ij * this.h - 2, 4, 4)
      }
    }
  },
  methods: {
    update () {
      const i = Number(this.x)
      const j = Number(this.y)
      let ii = Math.floor(i + (i + j) * this.k)
      let ij = Math.floor(j + (i + j) * this.k)
      console.log(i + (i + j) * this.k, j + (i + j) * this.k)
      ii -= (ii + ij) * this.l
      ij -= (ii + ij) * this.l
      this.ix = ii
      this.iy = ij
    }
  }
}
</script>

<style lang="stylus" scoped>
.center
  display flex
  flex-direction column
  justify-content center
  align-items center
  width 100%
  height 100%
canvas
  margin 6px
  display block
  border solid 1px #aaa
.container
  position relative
  i
    position absolute
    top calc(50% - 3px)
    left calc(50% - 3px)
    width 6px
    height 6px
    border-radius 3px
    background-color #000
    &:after
      content attr(data)
      position absolute
      top 2px
      left 0
</style>
