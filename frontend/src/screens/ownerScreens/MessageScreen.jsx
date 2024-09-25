import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import "./style.css";
import SideBarOwner from "../../components/ownerComonents/SideBar.jsx";
import { useOwnerChatListQuery } from "../../slice/ownerSlice/ownerApiSlice.js";

const socket = io("http://localhost:5000");

const MessageScreen = () => {
  const navigate = useNavigate();
  const { ownerInfo } = useSelector((state) => state.ownerAuth);
  const ownerId = ownerInfo._id;

  const {
    data: chatList = [],
    isLoading: isChatListLoading,
    refetch,
  } = useOwnerChatListQuery({ ownerId });

  const [updatedChatList, setUpdatedChatList] = useState(chatList);
  const [newMessageChatIds, setNewMessageChatIds] = useState(new Set()); // To track chats with new messages
  const [selectedChatId, setSelectedChatId] = useState(null); // To keep track of the selected chat

  const handleChatClick = (chatId, customerName) => {
    setSelectedChatId(chatId); // Update the selected chat
    setNewMessageChatIds((prev) => {
      const updatedSet = new Set(prev);
      updatedSet.delete(chatId); // Remove the chat from new messages when clicked
      return updatedSet;
    });
    navigate(`/owner/chat/${chatId}`, {
      state: { ownerId, chatId, customerName },
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
    // Listen for new messages from the socket
    socket.on("newMessage", (newMessageData) => {
      const { chatId, message, timestamp } = newMessageData;

      // Update the chat list with the new message
      setUpdatedChatList((prevChatList) =>
        prevChatList.map((chat) =>
          chat.chatId === chatId
            ? {
                ...chat,
                lastMessage: {
                  message,
                  timestamp,
                },
              }
            : chat
        )
      );

      // Add chatId to newMessageChatIds if the chat is not selected
      if (chatId !== selectedChatId) {
        setNewMessageChatIds((prev) => new Set(prev).add(chatId));
      }
    });

    return () => {
      socket.off("newMessage");
    };
  }, [selectedChatId]); // Re-run effect if selectedChatId changes

  // Effect to refetch chat list when the component mounts or changes
  useEffect(() => {
    refetch();
  }, [refetch]);

  // Update the updatedChatList when the initial chatList is loaded
  useEffect(() => {
    setUpdatedChatList(chatList);
  }, [chatList]);

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
              {updatedChatList.map((chat) => (
                <li
                  key={chat.chatId}
                  onClick={() =>
                    handleChatClick(chat.chatId, chat.participants[0])
                  }
                  className="chat-item"
                >
                  <div className="chat-info ms-2">
                    <b>{chat.participants[0]}</b>
                    <p>{chat.lastMessage?.message || "No messages yet"}{newMessageChatIds.has(chat.chatId) && (
                      <span className="pill">New</span>
                    )}</p>
                    
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
  