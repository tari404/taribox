<template>
  <div>
    <p>Three.js</p>
    <canvas id="c1" width="300" height="300"></canvas>
    <canvas id="c2" width="300" height="300"></canvas>
  </div>
</template>

<script>
import * as THREE from 'three'

if (!window.THREE) {
  window.THREE = THREE
}

const f = (i, j) => Math.sin((i * 12.9898 + j * 78.233) % 3.14159265359) * 43758.5453 % 1

export default {
  name: 'Three',
  mounted () {
    const c1 = this.$el.querySelector('#c1').getContext('2d')
    const c2 = this.$el.querySelector('#c2').getContext('2d')
    for (let i = 0; i < 100; i++) {
      for (let j = 0; j < 100; j++) {
        c1.globalAlpha = f(i, j)
        c2.globalAlpha = Math.random()
        c1.fillRect(i * 3, j * 3, 3, 3)
        c2.fillRect(i * 3, j * 3, 3, 3)
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
canvas
  display block
  margin 10px
</style>
