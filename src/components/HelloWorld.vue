<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>不定时更新的各种各样<router-link to="tools">Web小工具</router-link></p>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  }
}
</script>
