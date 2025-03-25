import React, { useState, useEffect } from "react";
import axios from "axios";

const ChatRoomList = ({ onSelectRoom, onCreateRoom, onBack }) => {
    const [rooms, setRooms] = useState([]);
    const [newRoomName, setNewRoomName] = useState("");
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      fetchRooms();
    }, []);
  
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/chat/rooms");
        setRooms(response.data);
      } catch (error) {
        console.error("채팅방 목록 가져오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };
  
    const handleCreateRoom = async (e) => {
      e.preventDefault();
      if (!newRoomName.trim()) return;
  
      try {
        const response = await axios.post("/api/chat/room", { name: newRoomName });
        setRooms([...rooms, response.data]);
        setNewRoomName("");
        if (onCreateRoom) onCreateRoom(response.data);
      } catch (error) {
        console.error("채팅방 생성 실패:", error);
      }
    };
  
    return (
      <div className="h-full flex flex-col">
        <div className="border-b p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">채팅</h2>
            {onBack && (
              <button onClick={onBack} className="text-gray-500 hover:text-gray-700">
                나가기
              </button>
            )}
          </div>
  
          <form onSubmit={handleCreateRoom} className="flex">
            <input
              type="text"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              placeholder="새 채팅방 이름"
              className="flex-1 border p-2 rounded-l-md"
            />
            <button type="submit" className="bg-orange-500 text-white px-4 py-2 rounded-r-md">
              생성
            </button>
          </form>
        </div>
  
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-32">로딩 중...</div>
          ) : rooms.length === 0 ? (
            <div className="p-4 text-center text-gray-500">채팅방이 없습니다.</div>
          ) : (
            <ul>
              {rooms.map((room) => (
                <li
                  key={room.roomId}
                  onClick={() => onSelectRoom(room)}
                  className="border-b p-4 hover:bg-gray-100 cursor-pointer"
                >
                  <div className="font-medium">{room.name}</div>
                  <div className="text-sm text-gray-500">
                    {room.lastMessage || "새로운 채팅방"}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
};

export default ChatRoomList;