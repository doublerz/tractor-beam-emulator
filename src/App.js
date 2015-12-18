import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import SimpleWebRTC from 'simplewebrtc'
import TractorBeam from './TractorBeam'

export class App extends Component {
  constructor (props, context) {
    super(props, context)
    this.state = { speeds: [0, 0] }
  }

  componentDidMount () {
    this._webrtc = new SimpleWebRTC({})
    this._webrtc.joinRoom('tractor-beam')
    const canvas = ReactDOM.findDOMNode(this.refs.beam)
    const stream = canvas.captureStream(60)
    this._webrtc.webrtc.localStreams.push(stream)
    this._webrtc.on('createdPeer', (peer) => {
      peer.on('channelMessage', (peer, label, { type, payload }) => {
        if (type === 'speeds') this.setState({ speeds: payload })
      })
    })
  }

  componentWillUnmount () {
    this._webrtc.leaveRoom()
  }

  render () {
    return (
      <div>
        <TractorBeam ref='beam' {...this.state}/>
      </div>
    )
  }
}
