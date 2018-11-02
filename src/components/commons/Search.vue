<template>
  <div class="search-box">
    <input class="search-bar" type="text" v-model="input" disabled>
    <svg width="40" height="32" viewBox="0, 0, 40, 32">
      <path d="M 30 26 l -5 -5 a 8 8 0 1 1 2 -3" />
    </svg>
  </div>
</template>

<script>
export default {
  name: 'Search',
  data () {
    return {
      input: '就这几条没什么可搜的，功能还没做呢 ﾟ∀ﾟ)σ'
    }
  }
}
</script>

<style lang="stylus" scoped>
.search-box
  position relative
  svg
    position absolute
    border-radius 5px
    top 0
    right 0
    cursor pointer
  path
    stroke #ccc
    stroke-width 2
    fill none
.search-bar
  width 100%
  height 32px
  line-height 30px
  border-radius 5px
  border solid 1px #ccc
  padding 0 9px
  font-size 14px
  box-sizing border-box
  color #ccc
</style>
