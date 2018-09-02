<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>不定时更新的各种各样Web小工具</p>
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
