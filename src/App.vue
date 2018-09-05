<template>
  <div id="app">
    <!-- <transition name="right-slip"> -->
    <router-view class="app-container" />
    <!-- </transition> -->
  </div>
</template>

<script>
export default {
  name: 'App',
  created () {
    window.addEventListener('touchmove', e => {
      e.preventDefault()
    }, {
      passive: false
    })
  }
}
</script>

<style lang="stylus">
body
  margin 0
  overflow hidden
  width 100%
  height 100%
.tb-remarks
  color #0004

#app
  font-family 'PingFang SC', 'Microsoft YaHei', sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  text-align center
  color #50382c
  margin 0
  width 100%
  height 100%

.app-container
  position absolute
  top 0
  left 0

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
