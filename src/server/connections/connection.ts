//  https://github.com/node-webrtc/node-webrtc-examples.git
'use strict';

import EventEmitter from 'events';

export type ConnectionState = "open" | "closed"

export default class Connection extends EventEmitter {
  id: string
  state: ConnectionState
  constructor(id: string) {
    super();
    this.id = id;
    this.state = 'open';
  }

  close() {
    this.state = 'closed';
    this.emit('closed');
  }

  toJSON() {
    return {
      id: this.id,
      state: this.state
    };
  }
}
