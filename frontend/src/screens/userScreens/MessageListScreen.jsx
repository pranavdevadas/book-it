import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { useMessageListQuery } from "../../slice/userSlice/userApiSlice";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import Loader from "../../components/userComponents/Loader";
import { useNavigate } from "react-router-dom";

const socket = io("http://localhost:5000");

function MessageListScreen() {
  const { userInfo } = useSelector((state) => state.auth);
  const userId = userInfo._id;

  const navigate = useNavigate();

  const {
    data: chatList = [],
    isLoading: isChatListLoading,
    refetch,
  } = useMessageListQuery({ userId });

  const [updatedChatList, setUpdatedChatList] = useState(chatList);
  const [newMessageChatIds, setNewMessageChatIds] = useState(new Set());
  const [selectedChatId, setSelectedChatId] = useState(null);

  const handleChatClick = (chatId, ownerName) => {
    setSelectedChatId(chatId);
    setNewMessageChatIds((prev) => {
      const updatedSet = new Set(prev);
      updatedSet.delete(chatId);
      return updatedSet;
    });
    navigate(`/message/${chatId}`, {
      state: { userId, chatId, ownerName },
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
    socket.on("newMessage", (newMessageData) => {
      const { chatId, message, timestamp } = newMessageData;

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

      if (chatId !== selectedChatId) {
        setNewMessageChatIds((prev) => new Set(prev).add(chatId));
      }
    });

    return () => {
      socket.off("newMessage");
    };
  }, [selectedChatId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    setUpdatedChatList(chatList);
  }, [chatList]);

  return (
    <Container className="mt-4 mb-4">
      <div className="message-screen">
        <h2 className="fw-bold text-center mt-3 mb-3">Messages</h2>
        {isChatListLoading ? (
          <Loader />
        ) : updatedChatList.length === 0 ? ( 
          <p className="text-center">No chats available</p>
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
                {console.log(chat)}
                <div className="chat-info ms-2">
                  <b>
                    {chat.participants[0].charAt(0).toUpperCase() +
                      chat.participants[0].slice(1).toLowerCase()}{" "}
                    &nbsp;(Theater Owner)
                  </b>
                  <p>{chat.lastMessage?.message || "No messages yet"}</p>
                </div>
                <span className="chat-time">
                  {newMessageChatIds.has(chat.chatId) && (
                    <span className="pill">New</span>
                  )}
                  {chat.lastMessage?.timestamp
                    ? formatTime(chat.lastMessage.timestamp)
                    : ""}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
    </Container>
  );
}

export default MessageListScreen;
