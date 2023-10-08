function* waitForSeconds(seconds) {
  const start = Date.now()
  while (Date.now() - start < seconds * 1000) {
    yield
  }
}

function* flat(gen) {
  let generator = gen()
  while (true) {
    const r = generator.next()
    yield r.value
    if (r.done) generator = gen()
  }
}

class Unit {
  constructor() {
    this.gen = flat(() => this._update())
  }

  update() {
    return this.gen.next()
  }

  draw(ctx) {
    this._draw(ctx)
  }
}

class Star extends Unit {
  constructor(x, y, size) {
    super()
    this.x = x
    this.y = y
    this.size = size
    this.drawFunc = () => { }
    this.frequecy = Math.random() * 0.05
  }

  *_update() {
    this.x += 1
    this.y += 1
    yield* waitForSeconds(this.frequecy)
    this.y -= 1
    yield* waitForSeconds(this.frequecy)
    this.x -= 1
    this.y += 1
    yield* waitForSeconds(this.frequecy)
    this.y -= 1
    yield* waitForSeconds(this.frequecy)
  }

  _draw(ctx) {
    ctx.beginPath()
    ctx.moveTo(this.x + 35 * this.size, this.y)
    ctx.lineTo(this.x + 55 * this.size, this.y + 65 * this.size)
    ctx.lineTo(this.x, this.y + 25 * this.size)
    ctx.lineTo(this.x + 65 * this.size, this.y + 25 * this.size)
    ctx.lineTo(this.x + 10 * this.size, this.y + 65 * this.size)
    ctx.closePath()
    ctx.stroke()
  }
}

function main(ctx) {
  var units = [
    new Star(100, 100, .5),
    new Star(200, 200, 1),
    new Star(300, 300, 3),
  ]

  function animate() {
    units.forEach(unit => unit.update())
    ctx.clearRect(0, 0, 800, 600)
    ctx.save()
    units.forEach(unit => unit.draw(ctx))
    ctx.restore()
    requestAnimationFrame(animate)
  }

  animate()
}

(() => {
  const canvas = document.querySelector('#canvas')
  const ctx = canvas.getContext('2d')
  main(ctx)
})()
