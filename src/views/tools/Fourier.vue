<template>
  <div>
    <div class="ctrl">
      <div class="refresh">
        <span @click="refresh">刷新</span>
      </div>
      <div class="custom">
        <span>自定义输入信号</span>
        <input type="checkbox" v-model="custom">
      </div>
      <ul class="signal">
        <li>
          <input :disabled="drawing || custom" type="checkbox" v-model="switches[0]">
          <p>C: {{C.toFixed(4)}}</p>
        </li>
        <li v-for="n in 3" :key="n">
          <input :disabled="drawing || custom" type="checkbox" v-model="switches[n]">
          <p>A1: {{A[n - 1].toFixed(2)}}, ω1: {{w[n - 1].toFixed(6)}}, φ1: {{p[n - 1].toFixed(4)}}</p>
        </li>
      </ul>
    </div>
    <div class="graph">
      <canvas id="complex-plane" width="284" height="284"></canvas>
      <div style="float: left;">
        <canvas :class="{ 'drawing': drawing }" id="time-domain" width="512" height="140"></canvas>
        <canvas id="freq-domain" width="512" height="140"></canvas>
      </div>
    </div>
    <div class="input-range">
      <p class="label">初相位 {{Number(phi).toFixed(4)}}</p>
      <input :disabled="drawing" type="range" min="0" max="6.283" step="any" v-model="phi">
    </div>
    <div class="input-range">
      <p class="label">检测频率 {{sdf.toFixed(6)}}Hz</p>
      <input :disabled="drawing" type="range" min="0" :max="maxF" step="any" v-model="df">
    </div>
    <div class="input-range">
      <p class="label">频率微调</p>
      <input :disabled="drawing" type="range" :min="-maxF / 1000" :max="maxF / 1000" step="any" v-model="ddf">
    </div>
    <div class="input-range">
      <p class="label">采样时间 {{Number(power).toFixed(1)}}s</p>
      <input :disabled="drawing" type="range" min="1" max="10" step="0.1" v-model="power">
    </div>
  </div>
</template>

<script>
export default {
  name: 'Fourier',
  data () {
    return {
      canvasTD: null,
      ctxTD: null,
      ctxFD: null,
      ctxCP: null,

      maxF: 10,
      power: 5,
      df: 3,
      ddf: 0,
      phi: 0,
      points: [],
      debounceTimer: 0,

      custom: false,
      drawing: false,
      lastPos: [],
      customSignal: [],
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
    },
    custom (newSet) {
      if (newSet) {
        this.beforeDrawLine()
      } else {
        this.drawing = false
        this.updatePoints()
        this.update()
      }
    }
  },
  created () {
    this.updateInput()
    this.updatePoints()
  },
  mounted () {
    this.canvasTD = this.$el.querySelector('#time-domain')
    this.ctxTD = this.canvasTD.getContext('2d')
    this.ctxFD = this.$el.querySelector('#freq-domain').getContext('2d')
    this.ctxCP = this.$el.querySelector('#complex-plane').getContext('2d')
    this.update()
  },
  methods: {
    f () {
      if (this.custom) {
        const s = this.customSignal
        return x => {
          x = x + 100
          const left = Math.floor(x % 1 * 512)
          const right = Math.ceil(x % 1 * 512)
          const k = x % 1 * 512 % 1
          return s[left] + (s[right] - s[left]) * k
        }
      } else {
        const C = this.C
        const [A1, A2, A3] = this.A
        const [w1, w2, w3] = this.w
        const [p1, p2, p3] = this.p
        const [s0, s1, s2, s3] = this.switches
        return x => (s0 ? C : 0) +
          (s1 ? A1 * Math.cos(w1 * x * Math.PI * 2 + p1) : 0) +
          (s2 ? A2 * Math.cos(w2 * x * Math.PI * 2 + p2) : 0) +
          (s3 ? A3 * Math.cos(w3 * x * Math.PI * 2 + p3) : 0)
      }
    },
    refresh () {
      if (this.custom) {
        this.beforeDrawLine()
      } else {
        this.updateInput()
        this.updatePoints()
        this.update()
      }
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
      const ctxTD = this.ctxTD
      ctxTD.clearRect(0, 0, 512, 140)
      ctxTD.beginPath()
      const dx = phi / 2 / Math.PI / Math.max(sdf, 0.1)
      ctxTD.moveTo(0, 70 - f(-dx) * 20)
      for (let x = 0; x < 512; x++) {
        const y = 70 - f(x / 512 - dx) * 20
        ctxTD.lineTo(x, y)
      }
      ctxTD.strokeStyle = 'black'
      ctxTD.stroke()
      ctxTD.strokeStyle = 'red'
      if (sdf > 1) {
        const step = 1 / sdf
        for (let i = 0; i < 1; i += step) {
          ctxTD.beginPath()
          ctxTD.moveTo(i * 512, 0)
          ctxTD.lineTo(i * 512, 140)
          ctxTD.stroke()
        }
      }
      const ctxCP = this.ctxCP
      let sx = 0
      let sy = 0
      ctxCP.strokeStyle = '#0003'
      ctxCP.clearRect(0, 0, 284, 284)
      ctxCP.beginPath()
      ctxCP.moveTo(142 + f(0) * 60 * Math.cos(-phi), 142 - f(0) * 60 * Math.sin(-phi))
      for (let i = 0; i < 512 * this.power; i++) {
        const ii = i / 512
        const x = f(ii) * Math.cos(-2 * Math.PI * ii * sdf - phi)
        const y = f(ii) * Math.sin(-2 * Math.PI * ii * sdf - phi)
        sx += x / 512
        sy += y / 512
        ctxCP.lineTo(x * 60 + 142, 142 - y * 60)
      }
      ctxCP.stroke()
      ctxCP.fillStyle = 'red'
      ctxCP.strokeStyle = 'red'
      ctxCP.beginPath()
      ctxCP.arc(sx * 60 / this.power + 142, 142 - sy * 60 / this.power, 2, 0, 2 * Math.PI)
      ctxCP.closePath()
      ctxCP.fill()
      ctxCP.beginPath()
      ctxCP.moveTo(142, 142)
      ctxCP.lineTo(sx * 60 + 142, 142 - sy * 60)
      ctxCP.stroke()
      const ctxFD = this.ctxFD
      ctxFD.clearRect(0, 0, 512, 140)
      ctxFD.beginPath()
      ctxFD.strokeStyle = 'black'
      this.points.forEach(point => {
        ctxFD.lineTo(point.x * 512 / this.maxF, 70 - 60 * point.y)
      })
      ctxFD.stroke()
      ctxFD.strokeStyle = 'red'
      ctxFD.beginPath()
      ctxFD.moveTo(sdf * 512 / this.maxF, 0)
      ctxFD.lineTo(sdf * 512 / this.maxF, 140)
      ctxFD.closePath()
      ctxFD.stroke()
    },
    beforeDrawLine () {
      this.drawing = true
      this.ctxTD.clearRect(0, 0, 512, 140)
      this.canvasTD.addEventListener('mousedown', this.startDrawLine)
    },
    startDrawLine (e) {
      const ctxTD = this.ctxTD
      const ex = e.offsetX
      const ey = e.offsetY
      this.customSignal = []
      const y = (70 - ey) / 20
      for (let i = 0; i <= ex; i++) {
        this.customSignal.push(y)
      }
      ctxTD.strokeStyle = 'black'
      ctxTD.beginPath()
      ctxTD.moveTo(0, ey)
      ctxTD.lineTo(ex, ey)
      ctxTD.stroke()
      this.lastPos = [ex, ey]
      this.canvasTD.addEventListener('mousemove', this.drawLine)
      document.addEventListener('mouseup', this.endDrawLine)
    },
    drawLine (e) {
      const ex = e.offsetX
      const ey = e.offsetY
      const lx = this.lastPos[0]
      const dx = ex - lx
      if (dx <= 0 || ex > 512) {
        return
      } else {
        const y = (70 - ey) / 20
        const sy = (70 - this.lastPos[1]) / 20
        for (let i = lx + 1; i <= ex; i++) {
          this.customSignal.push(sy + (y - sy) / dx * (i - lx))
        }
      }
      const ctxTD = this.ctxTD
      ctxTD.beginPath()
      ctxTD.moveTo(...this.lastPos)
      ctxTD.lineTo(ex, ey)
      ctxTD.stroke()
      this.lastPos = [ex, ey]
    },
    endDrawLine (e) {
      const [lx, ly] = this.lastPos
      const sy = (70 - ly) / 20
      for (let i = lx + 1; i <= 512; i++) {
        this.customSignal.push(sy)
      }
      const ctxTD = this.ctxTD
      ctxTD.beginPath()
      ctxTD.moveTo(...this.lastPos)
      ctxTD.lineTo(512, ly)
      ctxTD.stroke()
      this.canvasTD.removeEventListener('mousedown', this.startDrawLine)
      this.canvasTD.removeEventListener('mousemove', this.drawLine)
      document.removeEventListener('mouseup', this.endDrawLine)
      this.drawing = false
      this.updatePoints()
      this.update()
    }
  }
}
</script>

<style lang="stylus" scoped>
.graph
  margin-bottom 6px
  display flex
  clear both
.ctrl
  display flex
.refresh
  flex 0 0 284px
  margin 3px
  margin-top 50px
  line-height 22px
  text-align left
  span
    cursor pointer
.custom
  margin-top 50px
  flex 1 0 auto
  text-align left
  span
    line-height 22px
    font-size 12px
  input
    display inline-block
    width 12px
    margin 3px
.signal
  flex 0 0 auto
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
#time-domain
  border solid 1px #333
  display block
  margin 2px
.drawing
  cursor crosshair
#complex-plane
  border solid 1px #333
  display block
  float left
  margin 2px 0 2px 2px
#freq-domain
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
