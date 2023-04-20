//  https://github.com/node-webrtc/node-webrtc-examples.git
'use strict';

import ConnectionManager from './connectionmanager.js';
import WebRtcConnection from './webrtcconnection.js';

class WebRtcConnectionManager {
  constructor(options = {}) {
    options = {
      Connection: WebRtcConnection,
      ...options
    };

    const connectionManager = new ConnectionManager(options);

    this.createConnection = async (options = {}) => {
      console.log("WebRtcConnectionManager.createConnection", options)
      const connection = connectionManager.createConnection(options);
      await connection.doOffer();
      return connection;
    };

    this.getConnection = id => {
      return connectionManager.getConnection(id);
    };

    this.getConnections = () => {
      return connectionManager.getConnections();
    };
  }

  toJSON() {
    return this.getConnections().map(connection => connection.toJSON());
  }
}

WebRtcConnectionManager.create = function create(options) {
  return new WebRtcConnectionManager({
    Connection: function(id, requestOptions) {
      return new WebRtcConnection(id, {...options,...requestOptions});
    }
  });
};

export default WebRtcConnectionManager;
