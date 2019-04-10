<template>
  <div id="i18n-trans">
    <div id="i18nt-file" class="i18nt-button"
      @dragover.prevent
      @drop.prevent.stop="onDropFile">
      拖拽要翻译的文件至此<br>
      Drag and drop files to translate here
    </div>
    <div id="i18nt-reset" class="i18nt-button" @click="reset">
      重置<br>
      Reset
    </div>
    <div id="i18nt-reset" class="i18nt-button" @click="save">
      保存<br>
      Save
    </div>
    <div id="i18nt-download" class="i18nt-button" @click="download">
      下载翻译结果<br>
      Download translated files
    </div>
    <div class="i18nt-table">
      <table>
        <thead>
          <tr>
            <th width="20%">Name</th>
            <th width="40%">Value</th>
            <th width="40%">Translated</th>
          </tr>
        </thead>
        <tbody id="i18nt-box"></tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'I18nTrans',
  data () {
    return {
      protoObject: null,
      outputObject: null,
      dropBox: null,
      inputBox: null
    }
  },
  mounted () {
    this.dropBox = this.$el.querySelector('#i18nt-file')
    this.inputBox = this.$el.querySelector('#i18nt-box')
    const isSave = localStorage.getItem('isSave')
    if(isSave) {
      const protoObject =  localStorage.getItem('protoObject')
      const outputObject =  localStorage.getItem('outputObject')
      try {
        this.protoObject = JSON.parse(protoObject)
        this.outputObject = JSON.parse(outputObject)
      } catch (err) {
        this.reset()
        alert('解析失败，请向技术人员确认文件是否损坏')
      }
      this.parseInputBox(this.outputObject, 0, this.protoObject)
    }
  },
  methods: {
    onDropFile (e) {
      this.reset()
      const files = e.dataTransfer.files
      if (files[0]) {
        this.dropBox.innerHTML = files[0].name + '<br>已加载 Loaded'
        const reader = new FileReader()
        reader.readAsText(files[0])
        reader.onload = e => {
          try {
            this.protoObject = JSON.parse(e.target.result)
            this.outputObject = JSON.parse(e.target.result)
          } catch (err) {
            alert('解析失败，请向技术人员确认文件是否损坏')
          }
          this.parseInputBox(this.outputObject, 0)
        }
      } else {
        alert('没有选择文件')
      }
    },
    parseInputBox (obj, level, protoObject = false) {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const value = obj[key]
          let protoValue ;
          if (protoObject) {
            protoValue = protoObject[key]
          }

          if (typeof value === 'string') {
            const tr = document.createElement('tr')
            tr.className = 'level-' + Math.min(level, 7)
            const tdKey = document.createElement('td')
            tdKey.className = 'key'
            tdKey.innerHTML = key
            const tdValue = document.createElement('td')
            tdValue.className = 'value'
            tdValue.innerHTML = protoObject ? protoValue : value
            const tdInput = document.createElement('td')
            tdInput.setAttribute('contenteditable', 'plaintext-only')
            tdInput.className = 'input'
            if(protoObject) {
              if(protoValue !== value) {
                tdInput.innerText = value
              }
            }
            tdInput.addEventListener('blur', e => {
              const text = e.target.innerText
              if (text.replace(/\s*/g, '').length !== 0) {
                obj[key] = text.replace(/(^\s*)|(\s*$)|(\s*\n\s*)/g, '')
              }

            })
            tr.appendChild(tdKey)
            tr.appendChild(tdValue)
            tr.appendChild(tdInput)
            this.inputBox.appendChild(tr)
          } else if (typeof value === 'object') {
            this.parseInputBox(value, level + 1, protoValue)
          }
        }
      }
    },
    download () {
      if (!this.outputObject) {
        return
      }
      var eleLink = document.createElement('a')
      eleLink.download = 'output.json'
      eleLink.style.display = 'none'
      var blob = new Blob([JSON.stringify(this.outputObject, null, 2)])
      eleLink.href = URL.createObjectURL(blob)
      document.body.appendChild(eleLink)
      eleLink.click()
      document.body.removeChild(eleLink)
    },
    save () {
      const protoObject = JSON.stringify(this.protoObject)
      const outputObject = JSON.stringify(this.outputObject)

      localStorage.setItem('isSave', 'true')
      localStorage.setItem('protoObject', protoObject)
      localStorage.setItem('outputObject', outputObject)
      alert('Saved successfully')
    },
    reset () {
      this.protoObject = null
      this.outputObject = null
      this.dropBox.innerHTML = '拖拽要翻译的文件至此<br>Drag and drop files to translate here'
      this.inputBox.innerHTML = ''
      localStorage.removeItem('isSave')
      localStorage.removeItem('protoObject')
      localStorage.removeItem('outputObject')
    }
  }
}
</script>

<style lang="stylus" scoped>
#i18n-trans
  width 100%
  height 100%
  overflow auto
.i18nt-button
  height 40px
  padding 5px 10px
  text-align center
  line-height 20px
  font-size 14px
  border-radius 6px
  border solid 1px #333
  margin 20px
#i18nt-file
  width 300px
  float left
#i18nt-reset
  width 60px
  float left
  cursor pointer
#i18nt-download
  width 200px
  float right
  cursor pointer
.i18nt-table
  width 100%
  padding 10px
  clear both
  box-sizing border-box
table
  width 100%
  border-spacing 0
  line-height 1.5em
  text-align left
  word-break break-all
  border-top solid 1px #333
  border-bottom solid 1px #333
  box-sizing border-box
  >>> tbody
    td
      border-top solid 1px #bbb
    .key
      font-weight bold
      font-size 14px
    .value
      padding 2px 0.5em
      color #666
      font-size 12px
    .input
      padding 2px 0.5em
      background-color #fffef6
      font-size 12px
      outline #666
      &:focus
        outline none
        background-color #fff9e5
    .level-0>.key
      padding-left 0.5em
    .level-1>.key
      padding-left 1em
    .level-2>.key
      padding-left 1.5em
    .level-3>.key
      padding-left 2em
    .level-4>.key
      padding-left 2.5em
    .level-5>.key
      padding-left 3em
    .level-6>.key
      padding-left 3.5em
    .level-7>.key
      padding-left 4em
</style>
