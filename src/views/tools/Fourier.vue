<template>
  <div>
    <div class="refresh" @click="refresh">刷新</div>
    <ul class="signal">
      <li>
        <input type="checkbox" v-model="switches[0]">
        <p>C: {{C.toFixed(4)}}</p>
      </li>
      <li v-for="n in 3" :key="n">
        <input type="checkbox" v-model="switches[n]">
        <p>A1: {{A[n - 1].toFixed(2)}}, ω1: {{w[n - 1].toFixed(6)}}, φ1: {{p[n - 1].toFixed(4)}}</p>
      </li>
    </ul>
    <div class="graph">
      <canvas id="g-source" width="284" height="284"></canvas>
      <div style="float: left;">
        <canvas id="f-source" width="512" height="140"></canvas>
        <canvas id="output" width="512" height="140"></canvas>
      </div>
    </div>
    <div class="input-range">
      <p class="label">初相位 {{Number(phi).toFixed(4)}}</p>
      <input type="range" min="0" max="6.283" step="any" v-model="phi">
    </div>
    <div class="input-range">
      <p class="label">检测频率 {{sdf.toFixed(6)}}Hz</p>
      <input type="range" min="0" :max="maxF" step="any" v-model="df">
    </div>
    <div class="input-range">
      <p class="label">频率微调</p>
      <input type="range" :min="-maxF / 1000" :max="maxF / 1000" step="any" v-model="ddf">
    </div>
    <div class="input-range">
      <p class="label">采样时间 {{Number(power).toFixed(1)}}s</p>
      <input type="range" min="1" max="10" step="0.1" v-model="power">
    </div>
  </div>
</template>

<script>
export default {
  name: 'Fourier',
  data () {
    return {
      maxF: 10,
      power: 5,
      df: 3,
      ddf: 0,
      phi: 0,
      points: [],
      debounceTimer: 0,
      switches: [true, true, true, true],

      C: 0,
      A: [1, 1, 1],
      w: [1, 1, 1],
      p: [0, 0, 0]
    }
  },
  computed: {
    sdf () {
      return Math.max(Number(this.df) + Number(this.ddf), 0)
    }
  },
  watch: {
    phi () {
      this.update()
    },
    sdf () {
      this.update()
    },
    power () {
      this.updatePoints()
      this.update()
    },
    switches () {
      this.updatePoints()
      this.update()
    }
  },
  created () {
    this.updateInput()
    this.updatePoints()
  },
  mounted () {
    this.update()
  },
  methods: {
    f (x) {
      const C = this.C
      const [A1, A2, A3] = this.A
      const [w1, w2, w3] = this.w
      const [p1, p2, p3] = this.p
      const [s0, s1, s2, s3] = this.switches
      return x => (s0 ? C : 0) +
        (s1 ? A1 * Math.cos(w1 * x * Math.PI * 2 + p1) : 0) +
        (s2 ? A2 * Math.cos(w2 * x * Math.PI * 2 + p2) : 0) +
        (s3 ? A3 * Math.cos(w3 * x * Math.PI * 2 + p3) : 0)
    },
    refresh () {
      this.updateInput()
      this.updatePoints()
      this.update()
    },
    updateInput () {
      this.C = 0.5 - Math.random()
      for (let i = 0; i < 3; i++) {
        this.A[i] = Math.random() * 0.6 + 0.4
        this.w[i] = Math.random() * 7 + 1
        this.p[i] = Math.random() * Math.PI * 2
      }
    },
    updatePoints () {
      const points = []
      const f = this.f()
      for (let i = 0; i < this.maxF; i += this.maxF / 512) {
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
      const f = this.f()
      const sdf = this.sdf
      const phi = this.phi
      const source = this.$el.querySelector('#f-source').getContext('2d')
      source.clearRect(0, 0, 512, 140)
      source.beginPath()
      const dx = phi / 2 / Math.PI / sdf
      source.moveTo(0, 70 - f(-dx) * 20)
      for (let x = 0; x < 512; x++) {
        const y = f(x / 512 - dx) * 20 + 70
        source.lineTo(x, 140 - y)
      }
      source.strokeStyle = 'black'
      source.stroke()
      source.strokeStyle = 'red'
      if (sdf > 1) {
        const step = 1 / sdf
        for (let i = 0; i < 1; i += step) {
          source.beginPath()
          source.moveTo(i * 512, 0)
          source.lineTo(i * 512, 140)
          source.stroke()
        }
      }
      const source2 = this.$el.querySelector('#g-source').getContext('2d')
      let sx = 0
      let sy = 0
      source2.strokeStyle = '#0003'
      source2.clearRect(0, 0, 284, 284)
      source2.beginPath()
      source2.moveTo(142 + f(0) * 60 * Math.cos(-phi), 142 - f(0) * 60 * Math.sin(-phi))
      for (let i = 0; i < 512 * this.power; i++) {
        const ii = i / 512
        const x = f(ii) * Math.cos(-2 * Math.PI * ii * sdf - phi)
        const y = f(ii) * Math.sin(-2 * Math.PI * ii * sdf - phi)
        sx += x / 512
        sy += y / 512
        source2.lineTo(x * 60 + 142, 142 - y * 60)
      }
      source2.stroke()
      source2.fillStyle = 'red'
      source2.strokeStyle = 'red'
      source2.beginPath()
      source2.arc(sx * 60 / this.power + 142, 142 - sy * 60 / this.power, 2, 0, 2 * Math.PI)
      source2.closePath()
      source2.fill()
      source2.beginPath()
      source2.moveTo(142, 142)
      source2.lineTo(sx * 60 + 142, 142 - sy * 60)
      source2.stroke()
      const output = this.$el.querySelector('#output').getContext('2d')
      output.clearRect(0, 0, 512, 140)
      output.beginPath()
      output.strokeStyle = 'black'
      this.points.forEach(point => {
        output.lineTo(point.x * 512 / this.maxF, 70 - 60 * point.y)
      })
      output.stroke()
      output.strokeStyle = 'red'
      output.beginPath()
      output.moveTo(sdf * 512 / this.maxF, 0)
      output.lineTo(sdf * 512 / this.maxF, 140)
      output.closePath()
      output.stroke()
    }
  }
}
</script>

<style lang="stylus" scoped>
.graph
  margin-bottom 6px
  height 290px
  clear both
.refresh
  float left
  margin-top 50px
  line-height 22px
  cursor pointer
.signal
  float right
  margin 0
  padding 0
  font-size 12px
  line-height 18px
  font-family monospace
  text-align right
  li
    display flex
    flex-direction row-reverse
  p
    flex 0 0 auto
    margin 0
  input
    flex 0 0 12px
    margin 3px
#f-source
  border solid 1px #333
  display block
  margin 2px
#g-source
  border solid 1px #333
  display block
  float left
  margin 2px 0 2px 2px
#output
  border solid 1px #333
  display block
  margin 2px
.input-range
  text-align left
.label
  font-size 12px
  line-height 18px
  margin 0
  font-family monospace
input
  width 100%
</style>
