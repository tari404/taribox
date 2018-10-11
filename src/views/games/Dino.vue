<template>
  <div id="dino-scene">
    <div id="dino-player">
      <frame v-for="(url, name, index) in this.dino" :key="index"
        v-if="dinoStatus === name" :asset="url" />
    </div>
  </div>
</template>

<script>
import Frame from './Frame'

const dinoAssets = {
  default: require('@/assets/dino/dino_default.png'),
  leftLeg: require('@/assets/dino/dino_left_leg.png'),
  rightLeg: require('@/assets/dino/dino_right_leg.png')
}

export default {
  name: 'Dino',
  data () {
    return {
      assets: {
        ...dinoAssets
      },
      dino: {
        default: '',
        leftLeg: '',
        rightLeg: ''
      },
      dinoStatus: 'default'
    }
  },
  components: {
    Frame
  },
  created () {
    const loadAssets = []
    for (const key in this.assets) {
      const img = new Image()
      loadAssets.push(new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
      }))
      img.src = this.assets[key]
    }
    Promise.all(loadAssets).then(this.init)
  },
  methods: {
    init () {
      for (const key in this.dino) {
        this.dino[key] = this.assets[key]
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
#dino-scene
  position relative
  width 600px
  height 200px
  border solid 1px #ddd
#dino-player
  position absolute
  width 88px
  height 94px
  bottom 20px
  left 40px
</style>
