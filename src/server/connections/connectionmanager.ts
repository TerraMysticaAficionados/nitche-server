//  https://github.com/node-webrtc/node-webrtc-examples.git
'use strict';

import {v4 as uuidv4} from "uuid"
import DefaultConnection from "./connection.js"

interface ConnectionOptions {
  broadcastId: string,
  broadcaster: boolean|undefined
}

export interface ConnectionManagerOptions {
  Connection: new(id: string, options: ConnectionOptions) => DefaultConnection
  generateId: () => string
}

class ConnectionManager {

  createConnection: (options: ConnectionOptions) => DefaultConnection
  getConnection: (id: string) => DefaultConnection|null
  getConnections: () => DefaultConnection[]

  constructor(initOptions:Partial<ConnectionManagerOptions> = {}) {
    
    const options:ConnectionManagerOptions = {
      Connection: DefaultConnection,
      generateId: uuidv4,
      ...initOptions
    };

    const {
      Connection,
      generateId
    } = options;

    const connections = new Map<string,DefaultConnection>();
    const closedListeners = new Map();

    function createId() {
      do {
        const id = generateId();
        if (!connections.has(id)) {
          return id;
        }
      // eslint-disable-next-line
      } while (true);
    }

    function deleteConnection(connection:DefaultConnection) {
      // 1. Remove "closed" listener.
      const closedListener = closedListeners.get(connection);
      closedListeners.delete(connection);
      connection.removeListener('closed', closedListener);

      // 2. Remove the Connection from the Map.
      connections.delete(connection.id);
    }

    this.createConnection = (options) => {
      console.log("ConnectionManager.createConnection", options)
      const id = createId();
      const connection = new Connection(id, options);

      // 1. Add the "closed" listener.
      function closedListener() { deleteConnection(connection); }
      closedListeners.set(connection, closedListener);
      connection.once('closed', closedListener);

      // 2. Add the Connection to the Map.
      connections.set(connection.id, connection);

      return connection;
    };

    this.getConnection = id => {
      return connections.get(id) || null;
    };

    this.getConnections = () => {
      return [...connections.values()];
    };
  }

  toJSON() {
    return this.getConnections().map(connection => connection.toJSON());
  }
}

export default ConnectionManager;
