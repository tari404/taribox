<template>
  <div>
    <canvas width="300" height="300" />
    <div v-if="!running">GAME OVER</div>
  </div>
</template>

<script>
const dire = {
  UP: Symbol('up'),
  LEFT: Symbol('left'),
  DOWN: Symbol('down'),
  RIGHT: Symbol('right')
}

export default {
  name: 'Snake',
  data () {
    return {
      running: false,
      ctx: null,
      raf: 0,
      lastFrame: 0,
      timer: 0,

      snakeDirection: dire.DOWN,
      snakeHead: { x: 14, y: 14 },
      snakeBody: [
        { x: 14, y: 13 },
        { x: 14, y: 12 },
        { x: 14, y: 11 },
        { x: 14, y: 10 },
        { x: 14, y: 9 }
      ]
    }
  },
  mounted () {
    const canvas = this.$el.querySelector('canvas')
    this.ctx = canvas.getContext('2d')
    this.ctx.fillStyle = '#444'
    document.addEventListener('keydown', this.onKeyDown)

    this.timer = 0
    this.running = true

    this.raf = requestAnimationFrame(this.render)
  },
  methods: {
    onKeyDown (e) {
      switch (e.keyCode) {
        case 37:
          this.snakeDirection = dire.LEFT
          break
        case 38:
          this.snakeDirection = dire.UP
          break
        case 39:
          this.snakeDirection = dire.RIGHT
          break
        case 40:
          this.snakeDirection = dire.DOWN
          break
      }
    },
    drawBorder () {
      for (let x = 0; x < 30; x++) {
        this.ctx.fillRect(x * 10 + 1, 1, 8, 8)
        this.ctx.fillRect(x * 10 + 1, 291, 8, 8)
      }
      for (let y = 1; y < 29; y++) {
        this.ctx.fillRect(1, y * 10 + 1, 8, 8)
        this.ctx.fillRect(291, y * 10 + 1, 8, 8)
      }
    },
    drawSnake () {
      this.ctx.fillRect(this.snakeHead.x * 10 + 1, this.snakeHead.y * 10 + 1, 8, 8)
      for (const body of this.snakeBody) {
        this.ctx.fillRect(body.x * 10 + 1, body.y * 10 + 1, 8, 8)
      }
    },
    updateFrame () {
      if (!this.running) {
        return
      }
      this.snakeBody.unshift({
        x: this.snakeHead.x,
        y: this.snakeHead.y
      })
      const tail = this.snakeBody.pop()
      switch (this.snakeDirection) {
        case dire.UP:
          this.snakeHead.y--
          break
        case dire.RIGHT:
          this.snakeHead.x++
          break
        case dire.DOWN:
          this.snakeHead.y++
          break
        case dire.LEFT:
          this.snakeHead.x--
          break
      }
      const s = this.snakeHead
      if (s.x <= 0 || s.x >= 29 ||
        s.y <= 0 || s.y >= 29 ||
        this.snakeBody.find(b => b.x === s.x && b.y === s.y)) {
        this.snakeHead = this.snakeBody.unshift()
        this.snakeBody.push(tail)
        this.gameover()
      }
    },
    render (time) {
      if (!this.lastFrame) {
        this.lastFrame = time
      }
      const delta = time - this.lastFrame
      this.lastFrame = time
      this.timer += delta
      while (this.timer > 800) {
        this.updateFrame()
        this.timer -= 800
      }
      this.ctx.clearRect(0, 0, 300, 300)
      this.drawBorder()
      this.drawSnake()

      this.raf = requestAnimationFrame(this.render)
    },
    gameover () {
      this.running = false
    }
  },
  beforeDestroy () {
    document.removeEventListener('keydown', this.onKeyDown)
    cancelAnimationFrame(this.raf)
  }
}
</script>
