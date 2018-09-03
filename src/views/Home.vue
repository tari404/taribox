<template>
  <div id="home">
    <div>
      <logo/>
      <HelloWorld msg="TarIboX"/>
    </div>
  </div>
</template>

<script>
import HelloWorld from '@/components/HelloWorld.vue'
import Logo from '@/components/Logo.vue'

export default {
  name: 'home',
  components: {
    HelloWorld,
    Logo
  }
}
</script>

<style lang="stylus" scoped>
#home
  display flex
  width 100%
  height 100%
  justify-content center
  align-items center
</style>
