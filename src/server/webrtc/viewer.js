'use strict';

import {broadcaster} from './broadcaster.js'

export function beforeOffer(peerConnection) {
  console.log("viewer")
  const audioTransceiver = peerConnection.addTransceiver('audio');
  const videoTransceiver = peerConnection.addTransceiver('video');
  
  function onNewBroadcast({ connectionId, audioTrack, videoTrack }) {
    if(peerConnection.connectionId != connectionId) {
      console.log("viewer",peerConnection.connectionId, "ignoring new connection", connectionId)
      return
    }
    audioTransceiver.sender.replaceTrack(audioTrack),
    videoTransceiver.sender.replaceTrack(videoTrack) 
  }

  broadcaster.on('newBroadcast', onNewBroadcast)

  if (broadcaster.audioTrack && broadcaster.videoTrack) {
    onNewBroadcast(broadcaster);
  }

  const { close } = peerConnection;
  peerConnection.close = function() {
    broadcaster.removeListener('newBroadcast', onNewBroadcast);
    return close.apply(this, arguments);
  }
}
