import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { MessageType } from "./ChatDTO";

class RedisSubscriber {
  constructor() {
    this.client = null;
    this.subscribers = new Map();
    this.connected = false;
  }

  connect() {
    const socket = new SockJS("/ws-stomp");
    this.client = new Client({
      webSocketFactory: () => socket,
      debug: (str) => {
        console.debug(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.client.onConnect = () => {
      this.connected = true;
      console.log("Connected to STOMP websocket");
      
      // Resubscribe to all previously subscribed rooms
      this.subscribers.forEach((callback, roomId) => {
        this.subscribeToRoom(roomId, callback);
      });
    };

    this.client.onStompError = (frame) => {
      console.error("STOMP Error", frame);
      this.connected = false;
    };

    this.client.activate();
  }

  disconnect() {
    if (this.client && this.client.connected) {
      this.client.deactivate();
      this.connected = false;
    }
  }

  subscribeToRoom(roomId, callback) {
    if (!this.connected) {
      // Store the subscription for when connection is established
      this.subscribers.set(roomId, callback);
      
      // Connect if not already connected
      if (!this.client) {
        this.connect();
      }
      return;
    }

    const subscription = this.client.subscribe(`/sub/chat/room/${roomId}`, (message) => {
      const receivedMessage = JSON.parse(message.body);
      callback(receivedMessage);
    });

    // Store subscription callback for reconnection
    this.subscribers.set(roomId, callback);
    
    return subscription;
  }

  unsubscribeFromRoom(roomId) {
    this.subscribers.delete(roomId);
  }

  sendMessage(message) {
    if (!this.connected || !this.client) {
      console.error("Cannot send message: not connected");
      return false;
    }

    this.client.publish({
      destination: "/pub/chat/message",
      body: JSON.stringify(message),
    });

    return true;
  }

  enterRoom(roomId, username, userId) {
    if (!this.connected || !this.client) {
      console.error("Cannot enter room: not connected");
      return false;
    }

    this.client.publish({
      destination: "/pub/chat/enter",
      body: JSON.stringify({
        type: MessageType.ENTER,
        roomId,
        sender: username,
        senderId: userId,
      }),
    });

    return true;
  }

  exitRoom(roomId, username, userId) {
    if (!this.connected || !this.client) {
      console.error("Cannot exit room: not connected");
      return false;
    }

    this.client.publish({
      destination: "/pub/chat/message",
      body: JSON.stringify({
        type: MessageType.EXIT,
        roomId,
        sender: username,
        senderId: userId,
      }),
    });

    return true;
  }
}

// Singleton instance
const redisSubscriber = new RedisSubscriber();
export default redisSubscriber;