<template>
  <div>
    <h2>Tools</h2>
    <div v-if="showCatalog">
      <div v-for="(item, index) in catalog" :key="index">
        <router-link :to="'/tools/' + item.path">{{item.name}}</router-link>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import catalog from './tools/index.js'

export default {
  name: 'Tools',
  data () {
    return {
      showCatalog: this.$route.name === 'Tools',
      catalog
    }
  },
  watch: {
    '$route.name' (name) {
      this.showCatalog = name === 'Tools'
    }
  }
}
</script>
