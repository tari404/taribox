<template>
  <div id="yyscoloful">
    <p class="tag">输入要染色的文字</p>
    <input class="yys-box" type="text" v-model="input" />
    <p class="tag">生成结果</p>
    <input class="yys-box" type="text" readonly="readonly" v-model="output" />
    <div id="yys-output-copy-btn">
      <copy-icon :status.sync="copyIconStatus" />
    </div>
    <p class="tag">预览效果</p>
    <div class="yys-box output">
      <span v-for="(item, index) in outputList"
        :style="{ 'color': item.color }"
        :key="index">{{item.text}}</span>
    </div>
    <div class="color-bar" :style="{ 'width': `${colorBarWidth}px` }"
      @mousedown="colorBarTouch($event)"
      @touchstart="colorBarTouch($event)">
      <canvas id="color-bar-bg" :width="colorBarWidth" height="32" />
      <div class="select-rect" :style="{
        'width': `${Math.abs(colorStart - colorEnd) - 2}px`,
        'transform': `translateX(${Math.min(colorStart, colorEnd) + 1}px)`
      }" />
      <div class="color-slide start-slide" :style="{
        'transform': `translateX(${colorStart}px)`,
        'background-color': getColor(colorStart, true)
      }" />
      <div class="color-slide end-slide" :style="{
        'transform': `translateX(${colorEnd}px)`,
        'background-color': getColor(colorEnd, true)
      }" />
    </div>
  </div>
</template>

<script>
import convert from 'color-convert'
import ClipboardJS from 'clipboard'
import CopyIcon from '@/components/commons/CopyIcon'

export default {
  name: 'YYSColorful',
  data () {
    return {
      colorBarWidth: 360,
      ctx: null,

      input: '',
      outputList: [],
      output: '',
      copyIconStatus: 'default',
      clipboard: null,

      colorReverse: false,
      colorPhi: 0,
      colorCtrls: [],
      colorStart: 0,
      colorEnd: 100,
      focusColorCtrlI: -1,
      mousePosX: 0
    }
  },
  watch: {
    input () {
      this.onInputChange()
    }
  },
  mounted () {
    const clipboard = new ClipboardJS('#yys-output-copy-btn', {
      text: () => {
        return this.output || ' '
      }
    })
    clipboard.on('success', () => {
      this.copyIconStatus = 'success'
    })
    clipboard.on('error', () => {
      this.copyIconStatus = 'error'
    })
    this.clipboard = clipboard
    const canvas = this.$el.querySelector('#color-bar-bg')
    this.ctx = canvas.getContext('2d')
    this.canvasUpdate()
    this.colorCtrls = this.$el.querySelectorAll('.color-slide')
    window.addEventListener('mousemove', this.colorBarDrag)
    window.addEventListener('touchmove', this.colorBarDrag)
    window.addEventListener('mouseup', this.colorBarDragEnd)
    window.addEventListener('touchend', this.colorBarDragEnd)
  },
  methods: {
    onInputChange () {
      this.genRainbowText()
    },
    colorBarTouch (e) {
      e.stopPropagation()
      e.preventDefault()
      const x = e.touches ? e.touches[0].screenX : e.screenX
      this.mousePosX = x
      const i = Array.prototype.indexOf.call(this.colorCtrls, e.target)
      if (i >= 0) {
        this.focusColorCtrlI = i
      } else {
        this.focusColorCtrlI = 2
      }
    },
    colorBarDrag (e) {
      const i = this.focusColorCtrlI
      if (i < 0) {
        return
      }
      e.stopPropagation()
      const orix = i ? this.colorEnd : this.colorStart
      const x = e.touches ? e.touches[0].screenX : e.screenX
      const dx = x - this.mousePosX
      this.mousePosX = x
      switch (i) {
        case 0:
          this.colorStart = Math.min(Math.max(0, orix + dx), this.colorBarWidth)
          break
        case 1:
          this.colorEnd = Math.min(Math.max(0, orix + dx), this.colorBarWidth)
          break
        case 2:
          const newPhi = this.colorPhi - dx
          this.colorPhi = newPhi < 0 ? newPhi + 360 : newPhi
          this.canvasUpdate()
          break
        default:
          return
      }
      this.genRainbowText()
    },
    colorBarDragEnd () {
      this.focusColorCtrlI = -1
    },
    getColor (h, needParse) {
      if (needParse) {
        h = this.colorPhi + h * 360 / this.colorBarWidth
      }
      return '#' + convert.hsv.hex(h, 90, 95)
    },
    genRainbowText () {
      this.outputList = []
      const k = 360 / this.colorBarWidth
      const sH = this.colorStart * k + this.colorPhi
      const eH = this.colorEnd * k + this.colorPhi
      const stringLength = this.input.length
      if (!stringLength) {
        this.stringifyOutput()
        return
      }
      const maxColorCount = Math.floor((100 - stringLength) / 8)
      const charCountPreColor = Math.floor(stringLength / maxColorCount)
      const charCountIncrease = stringLength % maxColorCount
      let step = eH - sH
      if (charCountPreColor === 0) {
        step /= (charCountIncrease - 1) || 1
      } else {
        step /= (maxColorCount - 1) || 1
      }
      let j = 0
      for (let i = 0; i < maxColorCount; i++) {
        const cutLenght = charCountPreColor + (i < charCountIncrease ? 1 : 0)
        const text = this.input.substr(j, cutLenght)
        const color = this.getColor(sH + i * step)
        this.outputList.push({
          text,
          color
        })
        j += cutLenght
        if (j >= stringLength) {
          break
        }
      }
      this.stringifyOutput()
    },
    stringifyOutput () {
      let output = ''
      this.outputList.forEach(el => {
        output += '#c' + el.color.substr(1, 6) + el.text
      })
      this.output = output
    },
    canvasUpdate () {
      for (let i = 0; i < this.colorBarWidth; i++) {
        this.ctx.fillStyle = this.getColor(i, true)
        this.ctx.fillRect(i, 0, 1, 32)
      }
    }
  },
  beforeDestroy () {
    window.removeEventListener('mousemove', this.colorBarDrag)
    window.removeEventListener('touchmove', this.colorBarDrag)
    window.removeEventListener('mouseup', this.colorBarDragEnd)
    window.removeEventListener('touchend', this.colorBarDragEnd)
    this.clipboard.destroy()
  },
  components: {
    CopyIcon
  }
}
</script>

<style lang="stylus" scoped>
#yyscoloful
  text-align left
  padding 30px 20px
  border-radius 10px
  background-color #ccb49a
  color #372e1f
  border solid 4px #4a3a2b
.tag
  margin 0
  padding 6px
  text-align left
  font-size 12px
  line-height 18px
#yys-output-copy-btn
  float right
  margin 7px 5px
  height 20px
  font-size 14px
  line-height 20px
  cursor pointer
.yys-box
  box-sizing border-box
  font-size 16px
  line-height 20px
  padding 6px
  border-radius 6px
  background-color #e2dbd3
  border solid 1px #896952
  box-shadow 1px 1px 1px #fff8 inset
  min-height 34px
input
  font-family inherit
  color inherit
  width 330px
.output
  width 360px
  word-break break-all
  margin-bottom 30px
.color-bar
  height 32px
  position relative
  .color-slide
    position absolute
    box-sizing border-box
    width 20px
    height 20px
    border-radius 10px
    border solid #fff 2px
    left -10px
    background-color red
    cursor pointer
  .start-slide
    top -10px
  .end-slide
    bottom -10px
#color-bar-bg
  border-radius 6px
  border solid 1px #896952
.select-rect
  border solid 2px #fff
  height 32px
  position absolute
  border-radius 6px
  top -1px
  left -1px
</style>
