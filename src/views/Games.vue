<template>
  <div id="games">
    <div class="tari-nav">
      <div class="tari-logo">
        <logo-small @trigger="logoOnClick" />
      </div>
    </div>
    <div class="flex-container">
      <div v-if="showCatalog">
        <p class="tb-remarks">页面样式重构中...</p>
        <div class="tari-catalog">
          <div>
            <p class="tari-catalog-title">目录</p>
            <ul>
              <li v-for="(item, index) in catalog" :key="index">
                <router-link :to="'/games/' + item.path">{{item.name}}</router-link>
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
import catalog from './games/index.js'

export default {
  name: 'Games',
  data () {
    return {
      showCatalog: this.$route.name === 'Games',
      catalog
    }
  },
  watch: {
    '$route.name' (name) {
      this.showCatalog = name === 'Games'
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
#games
  display flex
  width 100%
  height 100%
</style>
