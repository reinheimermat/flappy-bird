function newElement(tagName, className) {
  const elem = document.createElement(tagName)
  elem.className = className
  return elem
}

function Barrier(reverse = false) {
  this.element = newElement("div", "barrier")

  const border = newElement("div", "border")
  const body = newElement("div", "body")
  this.element.appendChild(reverse ? body : border)
  this.element.appendChild(reverse ? border : body)

  this.setHeight = (height) => (body.style.height = `${height}px`)
}

function PairOfBarriers(height, opening, x) {
  this.element = newElement("div", "pair-of-barriers")

  this.upper = new Barrier(true)
  this.lower = new Barrier(false)

  this.element.appendChild(this.upper.element)
  this.element.appendChild(this.lower.element)

  this.drawOpening = () => {
    const upperHeight = Math.random() * height - opening
    const upperLower = height - opening - upperHeight
    this.upper.setHeight(upperHeight)
    this.lower.setHeight(upperLower)
  }

  this.getX = () => parseInt(this.element.style.left.split("px")[0])
  this.setX = (x) => (this.element.style.left = `${x}px`)
  this.getWidth = () => this.element.clientWidth

  this.drawOpening()
  this.setX(x)
}

function Barriers(height, width, opening, space, notifyScore) {
  this.pairs = [
    new PairOfBarriers(height, opening, width),
    new PairOfBarriers(height, opening, width + space),
    new PairOfBarriers(height, opening, width + space * 2),
    new PairOfBarriers(height, opening, width + space * 3),
  ]

  const displacement = 3
  this.animate = () => {
    this.pairs.forEach((pair) => {
      pair.setX(pair.getX() - displacement)

      // quando o elemento sair da área do jogo
      if (pair.getX() < pair.getWidth()) {
        pair.setX(pair.getX() + space * this.pairs.length)
        pair.drawOpening()
      }

      const meio = width / 2
      const crossedMiddle =
        pair.getX() + displacement >= meio && pair.getX() < meio
        if (crossedMiddle) notifyScore()
    })
  }
}

const barriers = new Barriers(700, 1200, 200, 400)
const gameArea = document.querySelector('[wm-flappy]')
barriers.pairs.forEach(pair => gameArea.appendChild(pair.element))

setInterval(() => {
    barriers.animate()
}, 20)
