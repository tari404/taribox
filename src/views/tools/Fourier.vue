<template>
  <div>
    <div>
      <canvas id="f-source" width="512" height="140"></canvas>
      <canvas id="g-source" width="140" height="140"></canvas>
      <canvas id="output" width="364" height="140"></canvas>
    </div>
    <input type="range" min="0" :max="maxF" step="any" v-model="f">
    <input type="range" min="1" max="10" step="0.1" v-model="power">
  </div>
</template>

<script>
const A1 = Math.random() * 0.8 + 0.2
const A2 = Math.random() * 0.8 + 0.2
const A3 = Math.random() * 0.8 + 0.2
const w1 = Math.random() * 7 + 1
const w2 = Math.random() * 7 + 1
const w3 = Math.random() * 7 + 1
const p1 = Math.random() * Math.PI * 2
const p2 = Math.random() * Math.PI * 2
const p3 = Math.random() * Math.PI * 2
const f = x => A1 * Math.sin(w1 * x * Math.PI * 2 + p1) +
  A2 * Math.sin(w2 * x * Math.PI * 2 + p2) +
  A3 * Math.sin(w3 * x * Math.PI * 2 + p3)

export default {
  name: 'Fourier',
  data () {
    return {
      maxF: 10,
      power: 6,
      f: 3,
      points: [],
      debounceTimer: 0
    }
  },
  watch: {
    f () {
      this.update()
    },
    power () {
      this.updatePoints()
      this.update()
    }
  },
  mounted () {
    const source = this.$el.querySelector('#f-source').getContext('2d')
    for (let x = 0; x < 512; x++) {
      const y = f(x / 512) * 30 + 70
      source.fillRect(x - 0.5, 140 - y - 0.5, 1, 1)
    }
    this.updatePoints()
    this.update()
  },
  methods: {
    updatePoints () {
      const points = []
      for (let i = 0; i < this.maxF; i += this.maxF / 364) {
        let x = 0
        let y = 0
        for (let j = 0; j < 512; j++) {
          const jj = j / 512 * this.power
          x += f(jj) * Math.cos(-2 * Math.PI * jj * i) / 512
          y -= f(jj) * Math.sin(-2 * Math.PI * jj * i) / 512
        }
        points.push({
          x: i,
          y: Math.sqrt(x * x + y * y) * 2
        })
      }
      this.points = points
    },
    update () {
      const source2 = this.$el.querySelector('#g-source').getContext('2d')
      let sx = 0
      let sy = 0
      source2.strokeStyle = '#0002'
      source2.fillStyle = 'red'
      source2.clearRect(0, 0, 140, 140)
      source2.beginPath()
      source2.moveTo(f(0) * 30 + 70, 70)
      for (let i = 0; i < 512; i++) {
        const ii = i / 512 * this.power
        const x = f(ii) * Math.cos(-2 * Math.PI * ii * this.f)
        const y = -f(ii) * Math.sin(-2 * Math.PI * ii * this.f)
        sx += x / 512
        sy += y / 512
        source2.lineTo(x * 30 + 70, 70 - y * 30)
      }
      source2.stroke()
      source2.beginPath()
      source2.arc(sx * 60 + 70, 70 - sy * 60, 3, 0, 2 * Math.PI)
      source2.closePath()
      source2.fill()
      const output = this.$el.querySelector('#output').getContext('2d')
      output.clearRect(0, 0, 364, 140)
      output.beginPath()
      this.points.forEach(point => {
        output.lineTo(point.x * 364 / this.maxF, 70 - 60 * point.y)
      })
      output.stroke()
      output.beginPath()
      output.moveTo(this.f * 364 / this.maxF, 0)
      output.lineTo(this.f * 364 / this.maxF, 140)
      output.closePath()
      output.stroke()
    }
  }
}
</script>

<style lang="stylus" scoped>
#f-source
  border solid 1px #333
  display block
  margin 2px
#g-source
  border solid 1px #333
  display block
  float left
  margin 2px
#output
  border solid 1px #333
  display block
  float right
  margin 2px
input
  width 100%
</style>
