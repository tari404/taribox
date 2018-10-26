<template>
  <div id="tools">
    <div class="tari-nav">
      <div class="tari-logo">
        <logo-small @trigger="logoOnClick" />
      </div>
      <!-- <a class="github-link" target="_blank" href="https://github.com/existencer/taribox">GitHub</a> -->
    </div>
    <div class="flex-containe">
      <div v-if="showCatalog">
        <p class="tb-remarks">页面样式重构中...</p>
        <div class="tari-catalog">
          <div>
            <p class="tari-catalog-title">目录</p>
            <ul>
              <li v-for="(item, index) in catalog" :key="index">
                <router-link :to="'/tools/' + item.path">{{item.name}}</router-link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <router-view v-else />
    </div>
  </div>
</template>

<script>
import LogoSmall from '@/components/LogoSmall'
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
    LogoSmall
  }
}
</script>

<style lang="stylus" scoped>
#tools
  display flex
  width 100%
  height 100%
</style>
