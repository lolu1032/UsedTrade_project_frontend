import React, { useState, useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const ChatRoom = ({ room, onBack, userId, username }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [stompClient, setStompClient] = useState(null);
  const [connected, setConnected] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Connect to WebSocket
    const socket = new SockJS("/ws-stomp");
    const client = new Client({
      webSocketFactory: () => socket,
      debug: (str) => {
        console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = () => {
      setConnected(true);
      console.log("Connected to STOMP");

      // Subscribe to room messages
      client.subscribe(`/sub/chat/room/${room.roomId}`, (message) => {
        const receivedMessage = JSON.parse(message.body);
        setMessages((prevMessages) => [...prevMessages, receivedMessage]);
      });

      // Send ENTER message
      client.publish({
        destination: "/pub/chat/enter",
        body: JSON.stringify({
          type: "ENTER",
          roomId: room.roomId,
          sender: username,
          senderId: userId,
        }),
      });
    };

    client.onStompError = (frame) => {
      console.error("STOMP Error", frame);
      setConnected(false);
    };

    client.activate();
    setStompClient(client);

    // Cleanup on unmount
    return () => {
      if (client && client.connected) {
        // Send EXIT message
        client.publish({
          destination: "/pub/chat/message",
          body: JSON.stringify({
            type: "EXIT",
            roomId: room.roomId,
            sender: username,
            senderId: userId,
          }),
        });
        client.deactivate();
      }
    };
  }, [room.roomId, userId, username]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !connected || !stompClient) return;

    const chatMessage = {
      type: "TALK",
      roomId: room.roomId,
      sender: username,
      senderId: userId,
      message: newMessage,
    };

    stompClient.publish({
      destination: "/pub/chat/message",
      body: JSON.stringify(chatMessage),
    });

    setNewMessage("");
  };

  return (
    <div className="h-full flex flex-col">
      <div className="sticky top-0 bg-white z-10 border-b">
        <div className="flex justify-between items-center p-4">
          <button onClick={onBack} className="text-2xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <div className="font-bold">{room.name}</div>
          <div className="w-6"></div> {/* Empty space for alignment */}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-4 ${
              msg.senderId === userId ? "text-right" : "text-left"
            }`}
          >
            {msg.type === "ENTER" || msg.type === "EXIT" ? (
              <div className="text-center text-gray-500 text-sm my-2">
                {msg.message}
              </div>
            ) : (
              <>
                {msg.senderId !== userId && (
                  <div className="text-sm text-gray-500 mb-1">{msg.sender}</div>
                )}
                <div
                  className={`inline-block rounded-lg py-2 px-3 max-w-xs break-words ${
                    msg.senderId === userId
                      ? "bg-orange-500 text-white"
                      : "bg-white border"
                  }`}
                >
                  {msg.message}
                </div>
              </>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={sendMessage}
        className="border-t bg-white p-4 flex items-center"
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="메시지 입력..."
          className="flex-1 border rounded-md p-2 mr-2"
          disabled={!connected}
        />
        <button
          type="submit"
          className="bg-orange-500 text-white p-2 rounded-md"
          disabled={!connected}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default ChatRoom;