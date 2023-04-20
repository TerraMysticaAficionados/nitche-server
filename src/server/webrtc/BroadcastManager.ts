import EventEmitter from 'events';
import Broadcast from './Broadcast';

export const BroadcastEvent = {
  newBroadcast: "newBroadcast",
  endBroadcast: "endBroadcast"
}

export interface IBroadcastManager extends EventEmitter {
  addBroadcast(broadcast: Broadcast): Broadcast
  hasBroadcast(id: string): boolean
  getBroadcast(id:string): Broadcast|undefined
  destroyBroadcast(id:string): 1|0
} 

export default class BroadcastManager extends EventEmitter implements IBroadcastManager {
  broadcastMap: Map<string, Broadcast>
  addBroadcast(broadcast: Broadcast): Broadcast {
    this.broadcastMap.set(broadcast.id, broadcast)
    this.emit(BroadcastEvent.newBroadcast, broadcast.id)
    return this.broadcastMap.get(broadcast.id)! //  throw if not found after creation.
  }
  hasBroadcast(id: string): boolean {
    return this.broadcastMap.has(id)
  }
  getBroadcast(id: string): Broadcast|undefined {
    return this.broadcastMap.get(id)
  }
  destroyBroadcast(id: string) {
    const broadcast = this.broadcastMap.get(id)
    if(!broadcast) {
      return 0
    }
    this.emit(BroadcastEvent.endBroadcast, broadcast.id)
    broadcast.destroy()
    if(this.broadcastMap.delete(id)) {
      return 1
    }
    return 0
  }
}