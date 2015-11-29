import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'

const width = 400
const height = 400
const speed = 255

function wrap(value, min, max) {
  if (value > max) return min
  if (value < min) return max
  return value
}

class Robot extends Component {
  static propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    a: PropTypes.number.isRequired
  }

  componentDidMount () {
    const context = ReactDOM.findDOMNode(this).getContext('2d')
    this.paint(context)
  }

  componentDidUpdate () {
    const context = ReactDOM.findDOMNode(this).getContext('2d')
    context.clearRect(0, 0, width, height)
    this.paint(context)
  }

  paint (context) {
    const { x, y, a } = this.props
    context.save()
    context.translate(x, y)
    context.rotate(a, 100, 100)
    context.fillStyle = '#F00'
    context.fillRect(-10, -10, 20, 20)
    context.fillStyle = '#000'
    context.fillRect(-10, -10, 4, 20)
    context.fillRect(6, -10, 4, 20)
    context.fillStyle = '#FF0'
    context.fillRect(-6, -10, 12, 2)
    context.restore()
  }

  render () {
    return <canvas width={width} height={height} />
  }
}

const W = 87
const A = 65
const S = 83
const D = 68

export class App extends Component {
  constructor (props, context) {
    super(props, context)
    this.state = { keys: [], x: width / 2, y: height / 2, a: 0 }
    this.handleTick = this.handleTick.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleKeyUp = this.handleKeyUp.bind(this)
  }

  componentDidMount () {
    document.addEventListener('keydown', this.handleKeyDown)
    document.addEventListener('keyup', this.handleKeyUp)
    requestAnimationFrame(this.handleTick)
  }

  componentWillUnmount () {
    document.removeEventListener('keydown', this.handleKeyDown)
    document.removeEventListener('keyup', this.handleKeyUp)
  }

  handleTick () {
    let { keys, x, y, a } = this.state
    if (~keys.indexOf(A)) a = a - 0.02
    if (~keys.indexOf(D)) a = a + 0.02
    if (~keys.indexOf(W)) {
      x = wrap(x + Math.sin(a), 0, width)
      y = wrap(y - Math.cos(a), 0, height)
    }
    if (~keys.indexOf(S)) {
      x = wrap(x - Math.sin(a), 0, width)
      y = wrap(y + Math.cos(a), 0, height)
    }
    this.setState({ x, y, a })
    requestAnimationFrame(this.handleTick)
  }

  handleKeyDown (e) {
    const keys = this.state.keys.concat(e.keyCode)
    this.setState({ keys })
  }

  handleKeyUp (e) {
    const keys = this.state.keys.filter(k => k !== e.keyCode)
    this.setState({ keys })
  }

  render () {
    return <Robot {...this.state}/>
  }
}
