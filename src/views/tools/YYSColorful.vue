<template>
  <div id="yyscoloful">
    <p class="tag">输入要染色的文字</p>
    <input type="text" v-model="input" />
    <p class="tag">生成结果</p>
    <input type="text" readonly="readonly" v-model="output" />
    <div id="yys-output-copy-btn">
      <copy-icon :status.sync="copyIconStatus" />
    </div>
    <p class="tag">预览效果</p>
    <div class="output">
      <span v-for="(item, index) in outputList"
        :style="{ 'color': '#' + item.color }"
        :key="index">{{item.text}}</span>
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
      input: '',
      outputList: [],
      output: '',
      copyIconStatus: 'default',
      rainbowConfig: {
        startHue: 0
      }
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
  },
  methods: {
    onInputChange () {
      this.genRainbowText()
    },
    genRainbowText () {
      this.outputList = []
      this.rainbowConfig.startHue = parseInt(Math.random() * 360)
      const sH = this.rainbowConfig.startHue
      const stringLength = this.input.length
      const maxColorCount = Math.floor((100 - stringLength) / 8)
      const charCountPreColor = Math.floor(stringLength / maxColorCount)
      const charCountIncrease = stringLength % maxColorCount
      let j = 0
      for (let i = 0; i < maxColorCount; i++) {
        const cutLenght = charCountPreColor + (i < charCountIncrease ? 1 : 0)
        const text = this.input.substr(j, cutLenght)
        const color = convert.hsv.hex(sH + i * 15, 100, 100)
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
      console.log(this.outputList)
      let output = ''
      this.outputList.forEach(el => {
        output += '#c' + el.color + el.text
      })
      this.output = output
    }
  },
  components: {
    CopyIcon
  }
}
</script>

<style lang="stylus" scoped>
#yyscoloful
  text-align left
.tag
  margin 0
  padding 6px
  text-align left
  font-size 12px
#yys-output-copy-btn
  float right
  margin 6px
  height 20px
  font-size 14px
  line-height 20px
  cursor pointer
input
  font-family inherit
  font-size 16px
  line-height 20px
  padding 6px
  border-radius 6px
  border none
  background-color #eee
  outline-color #ff9b1f
.output
  font-size 16px
  line-height 20px
  padding 6px
  border-radius 6px
  background-color #eee
  min-height 20px
</style>
