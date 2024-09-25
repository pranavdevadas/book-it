import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./style.css";
import SideBarOwner from "../../components/ownerComonents/SideBar.jsx";

const MessageScreen = () => {
  const [chatList, setChatList] = useState([]);
  const navigate = useNavigate();

  const { ownerInfo } = useSelector((state) => state.ownerAuth);
  const ownerId = ownerInfo._id;

  const fetchChatList = async () => {
    try {
      const response = await fetch(`/api/chat/chat-list/${ownerId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch chat list");
      }
      const data = await response.json();
      setChatList(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchChatList();
  }, [ownerId]);

  const handleChatClick = async (chatId, customerName) => {
    try {
      const response = await fetch(`/api/chat/chat-details/${chatId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch chat details");
      }
      const chatDetails = await response.json();
      const userId = chatDetails.customerId;

      navigate(`/owner/chat/${chatId}`, { state: { userId, ownerId, chatId, customerName } });
    } catch (error) {
      console.error(error);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="d-flex">
      <SideBarOwner />
      <div className="content">
        <div className="message-screen">
          <h2 className="text-center fw-bold">Your Messages</h2>
          <ul>
            {chatList.map((chat) => (
              <li
                key={chat.chatId}
                onClick={() => handleChatClick(chat.chatId, chat.participants[0])}
                className="chat-item"
              >
                <div className="chat-info">
                  <b>{chat.participants[0]}</b>
                  <p>{chat.lastMessage?.message || "No messages yet"}</p>
                </div>
                <span className="chat-time">
                  {chat.lastMessage?.timestamp
                    ? formatTime(chat.lastMessage.timestamp)
                    : ""}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MessageScreen;
