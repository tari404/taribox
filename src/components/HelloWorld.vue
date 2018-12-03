<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>
      不定时更新的各种各样<router-link to="tools">Web小工具</router-link>
      <br>
      或者一些<router-link to="games">小游戏</router-link>
    </p>
    <a target="_blank" href="https://github.com/tari404/taribox">GitHub</a>
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
