<template>
  <div class="home">
    <logo/>
    <HelloWorld msg="TarIboX"/>
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
