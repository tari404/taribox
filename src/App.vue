<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<style lang="stylus">
body
  margin 0

#app
  font-family 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  text-align center
  color #50382c
  display flex
  justify-content center
  align-items center
  margin 0
  height 100vh
  width 100vw

#nav
  padding 30px
  a
    font-weight bold
    color #50382c
    &.router-link-exact-active
      color #ea741d
</style>
