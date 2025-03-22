// Chat Message DTO
export class ChatMessage {
    constructor(type, roomId, sender, message, senderId) {
      this.type = type;
      this.roomId = roomId;
      this.sender = sender;
      this.message = message;
      this.senderId = senderId;
      this.time = new Date();
    }
  }
  
  // Message Types Enum
  export const MessageType = {
    ENTER: "ENTER",
    TALK: "TALK",
    EXIT: "EXIT"
  };
  
  // Chat Room DTO
  export class ChatRoom {
    constructor(roomId = "", name = "") {
      this.roomId = roomId;
      this.name = name;
      this.lastMessage = "";
      this.lastMessageTime = null;
    }
  }