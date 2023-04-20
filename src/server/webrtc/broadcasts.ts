'use strict';

// import EventEmitter from 'events';
// export const broadcaster = new EventEmitter();
// const { on } = broadcaster;

import Broadcast from "./Broadcast.js";
import BroadcastManager from "./BroadcastManager.js";

export const broadcastManager = new BroadcastManager()

export function beforeOffer(peerConnection) {
  const broadcastId = peerConnection.externalId
  const broadcast = new Broadcast(broadcastId, peerConnection)
  broadcastManager.addBroadcast(broadcast)
  const { close } = peerConnection;
  peerConnection.close = function() {
    broadcastManager.destroyBroadcast(broadcastId)
    return close.apply(this, arguments);
  };
}
