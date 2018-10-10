<template>
  <div id="tools">
    <div class="tools-nav">
      <div class="tools-logo">
        <logo-small @trigger="logoOnClick" />
      </div>
    </div>
    <div class="tools-container">
      <div v-if="showCatalog">
        <p class="tb-remarks">页面样式重构中...</p>
        <div class="tools-catalog">
          <div>
            <p class="tools-catalog-title">目录</p>
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
#tools
  display flex
  width 100%
  height 100%
.tools-nav
  flex 0 0 200px
  width 200px
  height 150vh
  background-color #ff9b1f
  transition .8s
  position relative
.tools-logo
  width 100px
  height 100px
  position absolute
  top 10px
  left 50%
  transform translateX(-50%)
  transform-origin 50% 0
  transition transform .8s
.github-link
  color #fff
  margin-top 120px
  display block
  width 100%
  overflow hidden
  font-size 14px
.tools-container
  flex 1 1 100%
  display flex
  align-items center
  justify-content center

.tools-catalog
  display flex
  flex-direction column
  ul
    margin 4px 0
    padding 0
    text-align left
  li
    list-style none
    margin 2px 0
    padding 0 4px
.tools-catalog-title
  margin 0
  text-align left

@media screen and (max-width 600px)
  .tools-nav
    flex 0 0 50px
  .tools-logo
    transform translateX(-50%) scale(0.4)

@media screen and (max-width 400px)
  .tools-nav
    flex 0 0 0
    width 0
</style>
