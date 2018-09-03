<template>
  <div id="app">
    <transition name="right-slip">
      <router-view class="app-container" />
    </transition>
  </div>
</template>
<style lang="stylus">
body
  margin 0
  overflow hidden
.tb-remarks
  color #0004

#app
  font-family 'PingFang SC', 'Microsoft YaHei', sans-serif
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

.app-container
  position absolute

a
  color #ea741d
  text-decoration none

.right-slip-enter-active, .right-slip-leave-active
  transition transform .8s
.right-slip-leave-to
  transform translateX(-100vw)
.right-slip-enter
  transform translateX(100vw)
</style>
