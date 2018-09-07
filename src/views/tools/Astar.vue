<template>
  <div id="a-star">
    <div class="active" @click="genObstacles">Random obstacles</div>
    <div class="map">
      <div v-for="(node, i) in nodeStates" :key="i"
        :class="{
          'obstacle': obstacles[i],
          'open': node.state === 1,
          'close': node.state === 2,
          'passway': node.isPassway,
          'player': i === player,
          'goal': i === goal,
        }"
        @click.left="togglePlayer(i)"
        @click.middle="toggleObs(i)"
        @click.right.prevent="toggleGoal(i)">
        <p>{{node.g}}</p>
        <p>{{node.h}}</p>
        <span>{{node.h + node.g}}</span>
      </div>
    </div>
    <div class="options">Estimate func:
      <span @click="toggleFunc(0)" :class="{ 'active inactive': estFunc !== 0 }">Manhattan</span>
      <span @click="toggleFunc(1)" :class="{ 'active inactive': estFunc !== 1 }">Euclid</span>
      <span @click="toggleFunc(2)" :class="{ 'active inactive': estFunc !== 2 }">Chebyshev</span>
      <span @click="toggleFunc(3)" :class="{ 'active inactive': estFunc !== 3 }">Dijkstra</span>
    </div>
    <div class="options">Allow diagonal movement:
      <span @click="toggleDiagonal(true)" :class="{ 'active inactive': !allowDiagonal }">On</span>
      <span @click="toggleDiagonal(false)" :class="{ 'active inactive': allowDiagonal }">Off</span>
    </div>
    <div class="options">
      <span class="active" @click="genAStar(false)">Run</span>
      <span class="active" @click="genAStar(true)">Run to end</span>
    </div>
    <div class="options" :class="{ 'inactive': !program }">
      <span :class="{ 'active': program }" @click="nextStep">Next</span>
      <span :class="{ 'active': program }" @click="autoRun">Auto run</span>
      <span :class="{ 'active': program }" @click="runToEnd">Run to end</span>
    </div>
  </div>
</template>

<script>
const neighbors = [
  { x: 0, y: -1 },
  { x: -1, y: 0 },
  { x: 0, y: 1 },
  { x: 1, y: 0 }
]
const obNeighbors = [
  { x: -1, y: -1 },
  { x: 1, y: -1 },
  { x: 1, y: 1 },
  { x: -1, y: 1 }
]

class NodeState {
  constructor () {
    this.reset()
  }
  reset () {
    this.state = 0
    this.isPassway = false
    this.g = ''
    this.h = ''
  }
}
const nodeStates = []
const rows = 15
for (let i = 0; i < 10 * rows; i++) {
  nodeStates.push(new NodeState())
}

export default {
  name: 'Astar',
  data () {
    return {
      program: null,
      estFunc: 0,
      allowDiagonal: true,

      player: 0,
      goal: 96,
      obstacles: [].fill.call({ length: nodeStates.length }, false),
      nodeStates,
      roads: [].fill.call({ length: nodeStates.length }, false)
    }
  },
  mounted () {
    window.vm = this
  },
  methods: {
    toggleObs (i) {
      if (this.player === i || this.goal === i) {
        return
      }
      this.resetProgram()
      this.obstacles[i] = !this.obstacles[i]
    },
    toggleGoal (i) {
      if (this.player === i) {
        return
      }
      this.resetProgram()
      this.obstacles[i] = false
      this.goal = i
    },
    togglePlayer (i) {
      if (this.goal === i) {
        return
      }
      this.resetProgram()
      this.obstacles[i] = false
      this.player = i
    },
    toggleFunc (funcNumber) {
      this.resetProgram()
      this.estFunc = funcNumber
    },
    toggleDiagonal (isAllowed) {
      this.resetProgram()
      this.allowDiagonal = isAllowed
    },
    genObstacles () {
      this.resetProgram()
      for (let i = 0; i < this.obstacles.length; i++) {
        if (i === this.player || i === this.goal) {
          this.obstacles[i] = false
        } else {
          this.obstacles[i] = Math.random() < 0.3
        }
      }
    },
    estDistance (start, goal) {
      const sx = start % 10
      const sy = Math.floor(start / 10)
      const gx = goal % 10
      const gy = Math.floor(goal / 10)
      const dx = Math.abs(sx - gx) * 2
      const dy = Math.abs(sy - gy) * 2
      switch (this.estFunc) {
        case 0:
          return dx + dy
        case 1:
          return Math.sqrt(dx * dx + dy * dy)
        case 2:
          return Math.min(dx, dy)
        case 3:
          return 0
        default:
          return dx + dy
      }
    },
    neighborNodesFrom (node) {
      const x = node % 10
      const y = Math.floor(node / 10)
      const neighborNodes = []
      neighbors.forEach(offset => {
        const nx = offset.x + x
        const ny = offset.y + y
        if (nx >= 0 && nx < rows && ny >= 0 && ny < rows) {
          const ni = nx + ny * 10
          if (!this.obstacles[ni]) {
            neighborNodes.push(ni)
          }
        }
      })
      if (this.allowDiagonal) {
        obNeighbors.forEach(offset => {
          const nx = offset.x + x
          const ny = offset.y + y
          if (nx >= 0 && nx < rows && ny >= 0 && ny < rows) {
            const ni = nx + ny * 10
            if (!this.obstacles[ni]) {
              neighborNodes.push(ni)
            }
          }
        })
      }
      return neighborNodes
    },
    distBetween (x, y) {
      if (this.allowDiagonal) {
        const dx = Math.abs(x - y) % 10
        const dy = Math.abs(Math.floor(x / 10) - Math.floor(y / 10))
        if (dx + dy === 1) {
          return 2
        } else {
          return 3
        }
      } else {
        return 2
      }
    },
    * aStar () {
      const closeSet = []
      const openSet = [this.player]
      const cameFrom = []
      const gScores = new Map()
      const hScores = new Map()
      const fScores = new Map()
      gScores.set(this.player, 0)
      const startHScore = this.estDistance(this.player, this.goal)
      hScores.set(this.player, startHScore)
      fScores.set(this.player, startHScore)
      let step = 0
      while (openSet.length) {
        if (++step > this.nodeStates.length) {
          break
        }
        let x = 0
        openSet.reduce((minFScore, i) => {
          const fs = fScores.get(i)
          if (fs < minFScore) {
            x = i
            return fs
          } else {
            return minFScore
          }
        }, Infinity)
        if (x === this.goal) {
          return cameFrom
        }
        openSet.splice(openSet.findIndex(item => item === x), 1)
        closeSet.push(x)
        const xgs = gScores.get(x)
        const logs = []
        this.neighborNodesFrom(x).forEach(y => {
          if (closeSet.findIndex(item => item === y) !== -1) {
            return
          }
          const updatedGScore = xgs + this.distBetween(x, y)
          let isBetter = false
          if (openSet.findIndex(item => item === y) === -1) {
            isBetter = true
          } else if (updatedGScore < gScores.get(y)) {
            isBetter = true
          }
          if (isBetter) {
            cameFrom[y] = x
            gScores.set(y, updatedGScore)
            const hScore = this.estDistance(y, this.goal)
            hScores.set(y, hScore)
            fScores.set(y, updatedGScore + hScore)
            if (openSet.findIndex(item => item === y) === -1) {
              openSet.push(y)
            }
            logs.push({
              id: y,
              g: updatedGScore,
              h: Math.round(hScore)
            })
          }
        })
        yield {
          close: x,
          logs
        }
      }
      return false
    },
    parseResult (links) {
      let forward = this.goal
      const path = [forward]
      for (let i = 0; i < links.length; i++) {
        path.push(links[forward])
        forward = links[forward]
        if (forward === this.player) {
          break
        }
      }
      path.forEach(i => {
        this.nodeStates[i].isPassway = true
      })
      // this.player = this.goal
      // let newGoal = Math.floor(Math.random() * this.nodeStates.length - 1)
      // newGoal += newGoal >= this.player ? 1 : 0
      // this.obstacles[newGoal] = false
      // this.goal = newGoal
    },
    resetProgram () {
      this.program = null
      this.nodeStates.forEach(nodeState => {
        nodeState.reset()
      })
    },
    genAStar (runToEnd) {
      this.resetProgram()
      this.program = this.aStar()
      const start = this.nodeStates[this.player]
      start.g = 0
      start.h = this.estDistance(this.player, this.goal)
      if (runToEnd) {
        console.log(runToEnd)
        this.runToEnd()
      }
    },
    nextStep () {
      if (this.program && this.program.next) {
        const result = this.program.next()
        if (result.done) {
          this.program = null
          if (result.value) {
            this.parseResult(result.value)
          }
        } else {
          result.value.logs.forEach(log => {
            const i = log.id
            const node = this.nodeStates[i]
            node.state = 1
            node.g = log.g
            node.h = log.h
          })
          this.nodeStates[result.value.close].state = 2
        }
        return result.done
      } else {
        return true
      }
    },
    autoRun () {
      if (!this.program) {
        return
      }
      const sitv = setInterval(() => {
        const done = this.nextStep()
        if (done) {
          clearInterval(sitv)
        }
      }, 60)
    },
    runToEnd () {
      if (!this.program) {
        return
      }
      let done = false
      while (!done) {
        done = this.nextStep()
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
@css {
  .map {
    grid: auto-flow / repeat(10, 1fr);
  }
}
.map
  width 309px
  margin 20px auto
  display grid
  grid-gap 1px
  div
    width 30px
    height 30px
    padding 1px
    box-sizing border-box
    position relative
    background-color #eee
  p
    margin 0
    font-size 12px
    line-height 14px
    text-align right
    opacity .4
  span
    position absolute
    top 0
    left 0
    line-height 30px
    color #fff
.obstacle
  background-color #6f6f6f !important
.open
  background-color #ffbc00 !important
.close
  background-color #ff9323 !important
.passway
  background-color #8ac300 !important
.goal
  background-color #19a000 !important
.player
  // content ''
  // position absolute
  // width 24px
  // height 24px
  // border-radius 12px
  // background-color orange
  // top 3px
  // left 3px
  background-color #00a9dc !important
.options
  span
    margin 0 10px
.active
  cursor pointer
.inactive
  opacity .5
</style>
