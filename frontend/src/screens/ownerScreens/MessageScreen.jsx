import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./style.css";
import SideBarOwner from "../../components/ownerComonents/SideBar.jsx";
import {
  useOwnerChatListQuery,
  useChatDetailsQuery,
} from "../../slice/ownerSlice/ownerApiSlice.js";

const MessageScreen = () => {
  const [selectedChatId, setSelectedChatId] = useState(null);
  const navigate = useNavigate();
  const { ownerInfo } = useSelector((state) => state.ownerAuth);
  const ownerId = ownerInfo._id;

  const {
    data: chatList = [],
    isLoading: isChatListLoading,
    refetch,
  } = useOwnerChatListQuery({ ownerId });

  useEffect(() => {
    refetch();
  }, [refetch, chatList]);

  const { data: chatDetails, error: chatDetailsError } = useChatDetailsQuery(
    selectedChatId ? { chatId: selectedChatId } : null
  );

  const handleChatClick = (chatId, customerName) => {
    setSelectedChatId(chatId);
    navigate(`/owner/chat/${chatId}`, {
      state: { userId: chatDetails?.customerId, ownerId, chatId, customerName },
    });
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  useEffect(() => {
    if (chatDetailsError) {
      console.error("Failed to fetch chat details:", chatDetailsError);
    }
  }, [chatDetailsError]);

  return (
    <div className="d-flex">
      <SideBarOwner />
      <div className="content">
        <div className="message-screen">
          <h2 className="text-center fw-bold">Your Messages</h2>
          {isChatListLoading ? (
            <p>Loading chat list...</p>
          ) : (
            <ul>
              {chatList.map((chat) => (
                <li
                  key={chat.chatId}
                  onClick={() =>
                    handleChatClick(chat.chatId, chat.participants[0])
                  }
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
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageScreen;
