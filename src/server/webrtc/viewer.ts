'use strict';

import { broadcastManager } from "./broadcaster.js";
import { BroadcastEvent } from "./BroadcastManager.js";

export function beforeOffer(peerConnection, options) {
  console.log("viewer.beforeOffer", options)
  const broadcastId = options.broadcastId
  const audioTransceiver = peerConnection.addTransceiver('audio');
  const videoTransceiver = peerConnection.addTransceiver('video');
  
  function onNewBroadcast(broadcastId: string) {
    const broadcast = broadcastManager.getBroadcast(broadcastId)
    if(!broadcast) return
    // console.log(audioTransceiver.sender, broadcast?.sourceAudioTrack)
    // console.log(videoTransceiver.sender, broadcast?.sourceVideoTrack)
    audioTransceiver.sender.replaceTrack(broadcast.sourceAudioTrack),
    videoTransceiver.sender.replaceTrack(broadcast.sourceVideoTrack) 
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
