

export default class Broadcast {
  id: string
  sourcePeerConnection: RTCPeerConnection
  sourceAudioTrack: MediaStreamTrack
  sourceVideoTrack: MediaStreamTrack
  constructor(id:string, peerConnection:RTCPeerConnection) {
    this.id =  id
    this.sourcePeerConnection = peerConnection
    this.sourceAudioTrack = peerConnection.addTransceiver('audio').receiver.track;
    this.sourceVideoTrack = peerConnection.addTransceiver('video').receiver.track;

    const ogClose = this.sourcePeerConnection.close
    this.sourcePeerConnection.close = () => {
      this.destroy()
      return ogClose.apply(this.sourcePeerConnection, arguments)
    }
  }

  destroy() {
    this.sourcePeerConnection.getTransceivers().forEach(transceiver => {
      transceiver.stop()
    })
  }
}
