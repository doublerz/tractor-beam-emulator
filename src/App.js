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
    this._webrtc = new SimpleWebRTC({
      remoteVideosEl: this.refs.remotes
    })
    this._webrtc.joinRoom('beam')
    const canvas = ReactDOM.findDOMNode(this.refs.beam)
    const stream = canvas.captureStream(60)
    this._webrtc.webrtc.localStreams.push(stream)
    this._webrtc.on('createdPeer', (peer) => {
      peer.on('channelMessage', (peer, label, message) => {
        if (message.type === 'speeds') {
          this.setState({ speeds: message.payload })
        }
      })
    })
  }

  componentWillUnmount () {
    this._webrtc.leaveRoom()
  }

  render () {
    return (
      <div>
        <div className='remotes' ref='remotes'/>
        <TractorBeam ref='beam' {...this.state}/>
      </div>
    )
  }
}
