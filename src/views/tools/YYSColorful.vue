<template>
  <div>
    <p class="tag">输入要染色的文字</p>
    <input type="text">
  </div>
</template>

<script>
export default {
  name: 'YYSColorful'
}
</script>

<style lang="stylus" scoped>
.tag
  margin 0
  padding 6px
  text-align left
  font-size 12px
input
  font-size 16px
  line-height 20px
  padding 6px
  border-radius 6px
  border none
  background-color #eee
  outline-color blue
</style>
