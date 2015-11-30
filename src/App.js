import React, { Component } from 'react'
import TractorBeam from './TractorBeam'

const W = 87
const A = 65
const S = 83
const D = 68
const maxSpeed = 255

function clamp (value, min, max) {
  if (value > max) return max
  if (value < min) return min
  return value
}

function clampSpeed (value) {
  return clamp(value, -maxSpeed, maxSpeed)
}

export class App extends Component {
  constructor (props, context) {
    super(props, context)
    this.state = { keys: [], motors: [0, 0] }
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleKeyUp = this.handleKeyUp.bind(this)
  }

  componentDidMount () {
    document.addEventListener('keydown', this.handleKeyDown)
    document.addEventListener('keyup', this.handleKeyUp)
  }

  componentWillUnmount () {
    document.removeEventListener('keydown', this.handleKeyDown)
    document.removeEventListener('keyup', this.handleKeyUp)
  }

  updateKeys (keys) {
    let motors = [0, 0]
    let direction = 1
    if (~keys.indexOf(W)) {
      motors[0] = maxSpeed
      motors[1] = maxSpeed
    } else if (~keys.indexOf(S)) {
      direction = -1
      motors[0] = -maxSpeed
      motors[1] = -maxSpeed
    }
    if (~keys.indexOf(A)) {
      motors[0] = clampSpeed(motors[0] - maxSpeed / 2 * direction)
      motors[1] = clampSpeed(motors[1] + maxSpeed / 2 * direction)
    } else if (~keys.indexOf(D)) {
      motors[0] = clampSpeed(motors[0] + maxSpeed / 2 * direction)
      motors[1] = clampSpeed(motors[1] - maxSpeed / 2 * direction)
    }
    this.setState({ keys, motors })
  }

  handleKeyDown (e) {
    const keys = this.state.keys.concat(e.keyCode)
    this.updateKeys(keys)
  }

  handleKeyUp (e) {
    const keys = this.state.keys.filter(k => k !== e.keyCode)
    this.updateKeys(keys)
  }

  render () {
    return (
      <TractorBeam {...this.state}/>
    )
  }
}
