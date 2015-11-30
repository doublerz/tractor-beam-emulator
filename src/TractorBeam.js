import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'

const width = 400
const height = 400
const maxSpeed = 255

function wrap (value, min, max) {
  if (value > max) return min
  if (value < min) return max
  return value
}

export default class TractorBeam extends Component {
  static propTypes = {
    motors: PropTypes.array.isRequired
  }

  constructor (props, context) {
    super(props, context)
    this.state = { x: width / 2, y: height / 2, a: 0 }
    this.handleTick = this.handleTick.bind(this)
  }

  get style () {
    return {
      border: '1px solid black'
    }
  }

  componentDidMount () {
    const context = ReactDOM.findDOMNode(this).getContext('2d')
    this.paint(context)
    window.requestAnimationFrame(this.handleTick)
  }

  componentDidUpdate () {
    const context = ReactDOM.findDOMNode(this).getContext('2d')
    context.clearRect(0, 0, width, height)
    this.paint(context)
  }

  paint (context) {
    const { x, y, a } = this.state
    context.save()
    context.translate(x, y)
    context.rotate(a, 100, 100)
    context.fillRect(-10, -10, 4, 20)
    context.fillRect(6, -10, 4, 20)
    context.fillStyle = '#F00'
    context.fillRect(-6, -5, 12, 13)
    context.restore()
  }

  handleTick () {
    const { motors } = this.props
    let { x, y, a } = this.state

    const da = (motors[0] - motors[1]) / maxSpeed / 30
    a = wrap(a + da, -Math.PI, Math.PI)

    const direction = Math.sign(motors[0] + motors[1])
    const dx = Math.sin(a) * direction
    const dy = Math.cos(a) * direction
    x = wrap(x + dx, 0, width)
    y = wrap(y - dy, 0, height)

    this.setState({ x, y, a })
    window.requestAnimationFrame(this.handleTick)
  }

  render () {
    return (
      <canvas style={this.style} width={width} height={height}/>
    )
  }
}
