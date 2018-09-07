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
        @click.left="toggleObs(i)"
        @click.middle="toggleGoal(i)" />
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
  }
}
const nodeStates = []
for (let i = 0; i < 100; i++) {
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
        if (nx >= 0 && nx < 10 && ny >= 0 && ny < 10) {
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
          if (nx >= 0 && nx < 10 && ny >= 0 && ny < 10) {
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
        if (++step > 100) {
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
            openSet.push(y)
          }
        })
        yield {
          openSet,
          closeSet
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
          result.value.openSet.forEach(i => {
            this.nodeStates[i].state = 1
          })
          result.value.closeSet.forEach(i => {
            this.nodeStates[i].state = 2
          })
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
    position relative
    background-color #eee
.goal:after
  content ''
  position absolute
  width 24px
  height 24px
  border-radius 12px
  background-color green
  top 3px
  left 3px
.player:after
  content ''
  position absolute
  width 24px
  height 24px
  border-radius 12px
  background-color orange
  top 3px
  left 3px
.obstacle
  background-color #333 !important
.open
  background-color #999 !important
.close
  background-color #666 !important
.passway
  background-color #ffe000 !important
.options
  span
    margin 0 10px
.active
  cursor pointer
.inactive
  opacity .5
</style>
