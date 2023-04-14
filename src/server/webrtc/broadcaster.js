'use strict';
import EventEmitter from 'events';

export const broadcaster = new EventEmitter();
const { on } = broadcaster;

export function beforeOffer(peerConnection) {
  console.log("broadcaster")
  const audioTrack = broadcaster.audioTrack = peerConnection.addTransceiver('audio').receiver.track;
  const videoTrack = broadcaster.videoTrack = peerConnection.addTransceiver('video').receiver.track;
  const connectionId = peerConnection.externalId

  broadcaster.emit('newBroadcast', {
    connectionId,
    audioTrack,
    videoTrack
  });

  const { close } = peerConnection;
  peerConnection.close = function() {
    audioTrack.stop()
    videoTrack.stop()
    return close.apply(this, arguments);
  };
}
