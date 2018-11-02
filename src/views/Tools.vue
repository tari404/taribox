<template>
  <div id="tools">
    <div class="tari-nav">
      <div class="tari-logo">
        <logo-small @trigger="logoOnClick" />
      </div>
      <!-- <a class="github-link" target="_blank" href="https://github.com/existencer/taribox">GitHub</a> -->
    </div>
    <div class="flex-container">
      <div v-if="showCatalog" class="tari-catalog">
        <search />
        <ul>
          <li v-for="(item, index) in catalog" :key="index">
            <router-link :to="'/tools/' + item.path" class="tari-catalog-title">{{item.title}}</router-link>
            <p class="tari-catalog-intro">{{item.intro}}</p>
          </li>
        </ul>
      </div>
      <router-view v-else />
    </div>
  </div>
</template>

<script>
import LogoSmall from '@/components/LogoSmall'
import Search from '@/components/commons/Search'
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
  },
  methods: {
    logoOnClick (type) {
      switch (type) {
        case 't':
          return this.$router.push('/')
        case 'l':
          return this.$router.go(-1)
        case 'r':
          return this.$router.go(1)
      }
    }
  },
  components: {
    LogoSmall,
    Search
  }
}
</script>

<style lang="stylus" scoped>
#tools
  display flex
  width 100%
  height 100%
</style>
