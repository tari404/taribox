<template>
  <div class="center">
    <canvas width="400" height="400" id="test" />
  </div>
</template>

<script>
class Point {
  constructor (x, y) {
    this.x = x
    this.y = y
  }
}
const distance = (p1, p2) => Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2))
// const hslToRgb = (h, s, l) => {
//   var r, g, b
//   if (s === 0) {
//     r = g = b = l
//   } else {
//     const hue2rgb = (p, q, t) => {
//       if (t < 0) t += 1
//       if (t > 1) t -= 1
//       if (t < 1 / 6) return p + (q - p) * 6 * t
//       if (t < 1 / 2) return q
//       if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
//       return p
//     }

//     var q = l < 0.5 ? l * (1 + s) : l + s - l * s
//     var p = 2 * l - q

//     r = hue2rgb(p, q, h + 1 / 3)
//     g = hue2rgb(p, q, h)
//     b = hue2rgb(p, q, h - 1 / 3)
//   }

//   return [ r * 255, g * 255, b * 255 ]
// }

export default {
  name: 'Whiteboard',
  mounted () {
    const canvas = this.$el.querySelector('#test')
    const ctx = canvas.getContext('2d')
    const points = []
    for (let i = 0; i < 3; i++) {
      points.push(new Point(Math.random() * 200 - 100, Math.random() * 200 - 100))
    }
    const cW = canvas.width / 2
    const cH = canvas.height / 2
    for (let i = 0; i <= canvas.width; i++) {
      for (let j = 0; j <= canvas.height; j++) {
        const self = new Point(i - cW, cH - j)
        const disSum = points.reduce((sum, p) => {
          return sum + distance(p, self)
        }, 0)
        const d1 = distance(points[0], self)
        const d2 = distance(points[1], self)
        const d3 = distance(points[2], self)
        const l1 = d2 + d3
        const l2 = d1 + d3
        const l3 = d1 + d2
        if (l1 > 200 && l1 < 203) {
          ctx.fillStyle = 'red'
          ctx.globalAlpha = 1 - Math.abs(201.5 - l1) / 1.5
          ctx.fillRect(i - 0.5, j - 0.5, 1, 1)
        }
        if (l2 > 200 && l2 < 203) {
          ctx.fillStyle = 'green'
          ctx.globalAlpha = 1 - Math.abs(201.5 - l2) / 1.5
          ctx.fillRect(i - 0.5, j - 0.5, 1, 1)
        }
        if (l3 > 200 && l3 < 203) {
          ctx.fillStyle = 'blue'
          ctx.globalAlpha = 1 - Math.abs(201.5 - l3) / 1.5
          ctx.fillRect(i - 0.5, j - 0.5, 1, 1)
        }
        if (disSum > 400 && disSum < 404) {
          ctx.fillStyle = 'black'
          ctx.globalAlpha = 1 - Math.abs(402 - disSum) / 2
          ctx.fillRect(i - 0.5, j - 0.5, 1, 1)
        }
      }
    }
    ctx.globalAlpha = 1
    ctx.fillStyle = 'black'
    points.forEach(p => {
      ctx.beginPath()
      ctx.arc(cW + p.x, cH - p.y, 3, 0, Math.PI * 2)
      ctx.closePath()
      ctx.fill()
    })
  }
}
</script>

<style lang="stylus" scoped>
.center
  position fixed
  top 50%
  left 50%
  transform translate3d(-50%, -50%, 0)
#test
  border solid 1px #ddd
</style>
