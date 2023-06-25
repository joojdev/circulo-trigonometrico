// to nem aí se o código não está organizado
// programei isso aqui bêbado
// e se eu quiser fazer alguma modificação
// no futuro eu bebo denovo
// não me arrependo

// estou escrevendo isso do futuro
// me arrependo de ter bebido
// que código horrível

const Enum = {
  SINE: 0,
  COSSINE: 1
}

const wait = async (delay) => new Promise((resolve) => setTimeout(resolve, delay))

const degreeToRadiansText = (degree) => {
  let numerator = degree
  let denominator = 180

  let a = numerator
  let b = denominator
  let c

  while (b) {
    c = a % b
    a = b
    b = c
  }

  numerator /= a
  denominator /= a

  return [
    `${numerator == 1 ? '' : numerator}π`,
    `—`,
    denominator
  ]
}

function Canvas(selector, width, height) {
  this.selector = selector
  this.width = width
  this.height = height

  this.element = document.querySelector(this.selector)
  this.element.width = this.width
  this.element.height = this.height
  this.context = this.element.getContext('2d')

  this.context.clear = () => {
    this.context.clearRect(0, 0, this.width, this.height)
  }
}

function Circle(x, y, radius, color) {
  this.x = x
  this.y = y
  this.radius = radius
  this.color = color

  this.animateDraw = async (context, portions, duration) => {
    const degrees = Array(portions).fill(null).map((_, index) => [
      (index) * (360 / portions),
      (index + 1) * (360 / portions)
    ])

    for (const [start, end] of degrees) {
      context.beginPath()
      context.strokeStyle = this.color
      context.arc(this.x, this.y, this.radius, -(start / 180) * Math.PI, -(end / 180) * Math.PI, true)
      context.stroke()

      await wait(duration / portions)
    }
  }

  this.draw = (context) => {
    context.beginPath()
    context.strokeStyle = this.color
    context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI)
    context.stroke()
  }
}

function Cross(width, height, color) {
  this.width = width
  this.height = height
  this.color = color

  this.animateDraw = async (context, portions, duration) => {
    const lines = Array(portions).fill(null).map((_, index) => {
      return [
        [this.width / 2, index * (this.height / portions)],
        [this.width / 2, (index + 1) * (this.height / portions)],
        [index * (this.width / portions), this.height / 2],
        [(index + 1) * (this.width / portions), this.height / 2]
      ]
    })

    for (const [start1, end1, start2, end2] of lines) {
      context.beginPath()
      context.strokeStyle = this.color

      context.moveTo(start1[0], start1[1])
      context.lineTo(end1[0], end1[1])

      context.moveTo(start2[0], start2[1])
      context.lineTo(end2[0], end2[1])

      context.stroke()

      await wait(duration / portions)
    }
  }

  this.draw = (context) => {
    context.beginPath()
    context.strokeStyle = this.color

    context.moveTo(width / 2, 0)
    context.lineTo(width / 2, height)

    context.moveTo(0, height / 2)
    context.lineTo(width, height / 2)

    context.stroke()
  }
}

function Square(x, y, radius, angle, color) {
  this.x = x
  this.y = y
  this.radius = radius
  this.angle = angle
  this.color = color

  this.animateDrawDashedLines = async (context, delay, offset) => {
    const angles = [this.angle, 180 - this.angle, 180 + this.angle, 360 - this.angle]
    const textDirections = angles.map((angle) => [Math.cos(angle * Math.PI / 180), Math.sin(angle * Math.PI / 180)])
    const points = angles.map((angle) => [Math.cos(angle * Math.PI / 180) * this.radius, Math.sin(angle * Math.PI / 180) * this.radius])

    const startPoint = [Math.cos(this.angle * Math.PI / 180) * this.radius, 0]
    let lastPoint = startPoint

    for (const [index, [pointX, pointY]] of points.entries()) {
      context.setLineDash([5, 5])
      context.strokeStyle = this.color
      context.beginPath()
      context.moveTo(this.x + lastPoint[0], this.y - lastPoint[1])
      context.lineTo(this.x + pointX, this.y - pointY)

      lastPoint = [pointX, pointY]
      context.stroke()

      const text = degreeToRadiansText(angles[index])
      context.textAlign = 'center'
      context.textBaseline = 'middle'

      for (let i = 0; i < text.length; i++) {
        context.fillText(text[i], this.x + pointX + textDirections[index][0] * offset, this.y - pointY - textDirections[index][1] * offset + i * 7)
      }

      context.fillText(`${angles[index]}°`, this.x + pointX + textDirections[index][0] * offset * 2.5, this.y - pointY - textDirections[index][1] * offset * 2.5)

      await wait(delay)
    }

    context.beginPath()
    context.moveTo(this.x + lastPoint[0], this.y - lastPoint[1])
    context.lineTo(this.x + startPoint[0], this.y - startPoint[1])

    const start1 = {
      x: this.x + Math.cos(angles[1] * Math.PI / 180) * this.radius,
      y: this.y - Math.sin(angles[1] * Math.PI / 180) * this.radius
    }
    const end1 = {
      x: this.x + Math.cos(angles[3] * Math.PI / 180) * this.radius,
      y: this.y - Math.sin(angles[3] * Math.PI / 180) * this.radius
    }
    context.moveTo(start1.x, start1.y)
    context.lineTo(end1.x, end1.y)
    const start2 = {
      x: this.x + Math.cos(angles[0] * Math.PI / 180) * this.radius,
      y: this.y - Math.sin(angles[0] * Math.PI / 180) * this.radius
    }
    const end2 = {
      x: this.x + Math.cos(angles[2] * Math.PI / 180) * this.radius,
      y: this.y - Math.sin(angles[2] * Math.PI / 180) * this.radius
    }
    context.moveTo(start2.x, start2.y)
    context.lineTo(end2.x, end2.y)
    context.stroke()
    await wait(delay)
  }

  this.drawDashedLines = async (context, offset) => {
    const angles = [this.angle, 180 - this.angle, 180 + this.angle, 360 - this.angle]
    const textDirections = angles.map((angle) => [Math.cos(angle * Math.PI / 180), Math.sin(angle * Math.PI / 180)])
    const points = angles.map((angle) => [Math.cos(angle * Math.PI / 180) * this.radius, Math.sin(angle * Math.PI / 180) * this.radius])

    const startPoint = [Math.cos(this.angle * Math.PI / 180) * this.radius, 0]
    let lastPoint = startPoint

    for (const [index, [pointX, pointY]] of points.entries()) {
      context.setLineDash([5, 5])
      context.strokeStyle = this.color
      context.beginPath()
      context.moveTo(this.x + lastPoint[0], this.y - lastPoint[1])
      context.lineTo(this.x + pointX, this.y - pointY)

      lastPoint = [pointX, pointY]
      context.stroke()

      const text = degreeToRadiansText(angles[index])
      context.textAlign = 'center'

      for (let i = 0; i < text.length; i++) {
        context.fillText(text[i], this.x + pointX + textDirections[index][0] * offset, this.y - pointY - textDirections[index][1] * offset + i * 7)
      }

      context.fillText(`${angles[index]}°`, this.x + pointX + textDirections[index][0] * offset * 2.5, this.y - pointY - textDirections[index][1] * offset * 2.5)
    }

    context.beginPath()
    context.moveTo(this.x + lastPoint[0], this.y - lastPoint[1])
    context.lineTo(this.x + startPoint[0], this.y - startPoint[1])

    const start1 = {
      x: this.x + Math.cos(angles[1] * Math.PI / 180) * this.radius,
      y: this.y - Math.sin(angles[1] * Math.PI / 180) * this.radius
    }
    const end1 = {
      x: this.x + Math.cos(angles[3] * Math.PI / 180) * this.radius,
      y: this.y - Math.sin(angles[3] * Math.PI / 180) * this.radius
    }
    context.moveTo(start1.x, start1.y)
    context.lineTo(end1.x, end1.y)
    const start2 = {
      x: this.x + Math.cos(angles[0] * Math.PI / 180) * this.radius,
      y: this.y - Math.sin(angles[0] * Math.PI / 180) * this.radius
    }
    const end2 = {
      x: this.x + Math.cos(angles[2] * Math.PI / 180) * this.radius,
      y: this.y - Math.sin(angles[2] * Math.PI / 180) * this.radius
    }
    context.moveTo(start2.x, start2.y)
    context.lineTo(end2.x, end2.y)

    context.stroke()
  }

  this.animateDrawLines = async (context, side, portions, duration, numerator, denominator) => {
    const positiveText = [numerator == 1 ? numerator : `√${numerator}`, '—', denominator]
    const negativeText = JSON.parse(JSON.stringify(positiveText))
    negativeText[1] = '- —'

    let sin = Math.sin(this.angle * Math.PI / 180) * this.radius
    let cos = Math.cos(this.angle * Math.PI / 180) * this.radius

    let points = Array(portions).fill(null).map((_, index) => {
      if (side == Enum.SINE) {
        return [
          [
            [this.x + (cos - (cos / portions) * index), this.y - sin],
            [this.x + (cos - (cos / portions) * (index + 1)), this.y - sin]
          ],
          [
            [this.x + (-cos + (cos / portions) * index), this.y - sin],
            [this.x + (-cos + (cos / portions) * (index + 1)), this.y - sin]
          ],
          [
            [this.x + (cos - (cos / portions) * index), this.y + sin],
            [this.x + (cos - (cos / portions) * (index + 1)), this.y + sin]
          ],
          [
            [this.x + (-cos + (cos / portions) * index), this.y + sin],
            [this.x + (-cos + (cos / portions) * (index + 1)), this.y + sin]
          ]
        ]
      } else if (side == Enum.COSSINE) {
        return [
          [
            [this.x + cos, this.y - sin + (sin / portions) * index],
            [this.x + cos, this.y - sin + (sin / portions) * (index + 1)]
          ],
          [
            [this.x + cos, this.y + sin - (sin / portions) * index],
            [this.x + cos, this.y + sin - (sin / portions) * (index + 1)]
          ],
          [
            [this.x - cos, this.y - sin + (sin / portions) * index],
            [this.x - cos, this.y - sin + (sin / portions) * (index + 1)]
          ],
          [
            [this.x - cos, this.y + sin - (sin / portions) * index],
            [this.x - cos, this.y + sin - (sin / portions) * (index + 1)]
          ]
        ]
      }
    })

    for (const pointGroup of points) {
      context.strokeStyle = this.color
      context.setLineDash([])

      for (const [start, end] of pointGroup) {
        context.beginPath()
        context.moveTo(start[0], start[1])
        context.lineTo(end[0], end[1])
        context.stroke()
      }

      await wait(duration / portions)
    }

    context.fillStyle = this.color
    context.textAlign = 'end'

    if (side == Enum.SINE) {
      for (let i = 1; i <= 3; i++) {
        context.fillText(positiveText[i - 1], this.x + 20, this.y - sin + 5 + 7 * i)
        context.fillText(negativeText[3 - i], this.x + 20, this.y + sin - 5 - 7 * i)

        context.beginPath()
        context.arc(this.x, this.y - sin, 4, 0, 2 * Math.PI)
        context.arc(this.x, this.y + sin, 4, 0, 2 * Math.PI)
        context.fill()
      }
    } else if (side == Enum.COSSINE) {
      for (let i = 1; i <= 3; i++) {
        context.fillText(positiveText[i - 1], this.x + cos + 20, this.y + 5 + 7 * i)
        context.fillText(negativeText[i - 1], this.x - cos + 20, this.y + 5 + 7 * i)

        context.beginPath()
        context.arc(this.x + cos, this.y, 4, 0, 2 * Math.PI)
        context.arc(this.x - cos, this.y, 4, 0, 2 * Math.PI)
        context.fill()
      }
    }
  }

  this.drawLines = async (context, side, numerator, denominator) => {
    const positiveText = [numerator == 1 ? numerator : `√${numerator}`, '—', denominator]
    const negativeText = JSON.parse(JSON.stringify(positiveText))
    negativeText[1] = '- —'

    let sin = Math.sin(this.angle * Math.PI / 180) * this.radius
    let cos = Math.cos(this.angle * Math.PI / 180) * this.radius

    let points

    if (side == Enum.SINE) {
      points = [
        [
          [this.x - cos, this.y - sin],
          [this.x + cos, this.y - sin]
        ],
        [
          [this.x - cos, this.y + sin],
          [this.x + cos, this.y + sin]
        ]
      ]
    } else if (side == Enum.COSSINE) {
      points = [
        [
          [this.x + cos, this.y - sin],
          [this.x + cos, this.y + sin]
        ],
        [
          [this.x - cos, this.y - sin],
          [this.x - cos, this.y + sin]
        ]
      ]
    }

    for (const [start, end] of points) {
      context.strokeStyle = this.color
      context.setLineDash([])

      context.beginPath()
      context.moveTo(start[0], start[1])
      context.lineTo(end[0], end[1])
      context.stroke()
    }

    context.fillStyle = this.color
    context.textAlign = 'end'

    if (side == Enum.SINE) {
      for (let i = 1; i <= 3; i++) {
        context.fillText(positiveText[i - 1], this.x + 20, this.y - sin + 5 + 7 * i)
        context.fillText(negativeText[3 - i], this.x + 20, this.y + sin - 5 - 7 * i)

        context.beginPath()
        context.arc(this.x, this.y - sin, 4, 0, 2 * Math.PI)
        context.arc(this.x, this.y + sin, 4, 0, 2 * Math.PI)
        context.fill()
      }
    } else if (side == Enum.COSSINE) {
      for (let i = 1; i <= 3; i++) {
        context.fillText(positiveText[i - 1], this.x + cos + 20, this.y + 5 + 7 * i)
        context.fillText(negativeText[i - 1], this.x - cos + 20, this.y + 5 + 7 * i)

        context.beginPath()
        context.arc(this.x + cos, this.y, 4, 0, 2 * Math.PI)
        context.arc(this.x - cos, this.y, 4, 0, 2 * Math.PI)
        context.fill()
      }
    }
  }
}

const SCREEN_WIDTH = 500
const SCREEN_HEIGHT = 500
const CIRCLE_RADIUS = 150

const screen = new Canvas('#screen', SCREEN_WIDTH, SCREEN_HEIGHT)

function drawCartesianPlane() {
  const cross = new Cross(SCREEN_WIDTH, SCREEN_HEIGHT, '#000000')
  cross.animateDraw(screen.context, 30, 1000).then(() => {
    const circle = new Circle(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, CIRCLE_RADIUS, '#ff0000')
    circle.animateDraw(screen.context, 100, 1000).then(async () => {
      const t = new Square(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, CIRCLE_RADIUS, 30, '#0000ff')
      const fv = new Square(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, CIRCLE_RADIUS, 45, '#00ff00')
      const s = new Square(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, CIRCLE_RADIUS, 60, '#ff00ff')
      await t.animateDrawDashedLines(screen.context, 200, 25)
      await fv.animateDrawDashedLines(screen.context, 200, 25)
      await s.animateDrawDashedLines(screen.context, 200, 25)
      await t.animateDrawLines(screen.context, Enum.SINE, 30, 1000, 1, 2)
      await fv.animateDrawLines(screen.context, Enum.SINE, 30, 1000, 2, 2)
      await s.animateDrawLines(screen.context, Enum.SINE, 30, 1000, 3, 2)
      await t.animateDrawLines(screen.context, Enum.COSSINE, 30, 1000, 3, 2)
      await fv.animateDrawLines(screen.context, Enum.COSSINE, 30, 1000, 2, 2)
      await s.animateDrawLines(screen.context, Enum.COSSINE, 30, 1000, 1, 2)
    })
  })
}

drawCartesianPlane()