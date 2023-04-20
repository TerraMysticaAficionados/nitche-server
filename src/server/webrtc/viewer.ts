'use strict';

import { broadcastManager } from "./broadcasts";
import { BroadcastEvent } from "./BroadcastManager";

export function beforeOffer(peerConnection) {
  const broadcastId = peerConnection.broadcastId
  const audioTransceiver = peerConnection.addTransceiver('audio');
  const videoTransceiver = peerConnection.addTransceiver('video');
  
  function onNewBroadcast(broadcastId: string) {
    const broadcast = broadcastManager.getBroadcast(broadcastId)
    if(!broadcast) return
    audioTransceiver.sender.replaceTrack(broadcast.sourceAudioTrack),
    videoTransceiver.sender.replaceTrack(broadcast.sourceAudioTrack) 
  }
  function onEndBroadcast() {
    peerConnection.close()
  }

  if(broadcastManager.hasBroadcast(broadcastId)) {
    console.log("viewer found broadcast", broadcastId)
    onNewBroadcast(broadcastId);
  }

  const { close } = peerConnection;
  peerConnection.close = function() {
    console.log(peerConnection.connectionId, "viewer stream closing")
    broadcastManager.removeListener('newBroadcast', onNewBroadcast);
    broadcastManager.removeListener('endBroadcast', onEndBroadcast);
    return close.apply(this, arguments);
  }
  
  broadcastManager.on(BroadcastEvent.newBroadcast, onNewBroadcast)
  broadcastManager.on(BroadcastEvent.endBroadcast, onEndBroadcast)
}
