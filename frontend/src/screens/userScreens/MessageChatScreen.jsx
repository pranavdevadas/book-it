import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import "./style.css";
import {
  useChatDetailsQuery,
  useSaveMessagesMutation,
} from "../../slice/ownerSlice/ownerApiSlice";
import { IoMdArrowBack } from "react-icons/io";


const socket = io("http://localhost:5000");

const MessageChatScreen = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesRef = useRef(null);

  const location = useLocation();
  const { userId, chatId, ownerName } = location.state;

  const navigate = useNavigate()

  const {
    data: chatData,
    isLoading,
    refetch,
  } = useChatDetailsQuery({ chatId });

  const [saveMessage] = useSaveMessagesMutation();

  useEffect(() => {
    if (chatData) {
      setMessages(chatData.messages || []);
      refetch();
    }
  }, [chatData, refetch]);

  useEffect(() => {
    socket.on("receiveMessage", (messageData) => {
      setMessages((prevMessages) => [...prevMessages, messageData]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  const sendMessage = async () => {
    if (message.trim()) {
      const messageData = {
        chatId,
        sender: userId,
        senderType: "User",
        message,
        timestamp: new Date().toISOString(),
      };

      socket.emit("sendMessage", messageData);
      try {
        await saveMessage(messageData).unwrap();
        refetch();
      } catch (error) {
        console.error("Failed to send message:", error);
      }

      setMessage("");
    }
  };

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  const handleWheel = (event) => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop += event.deltaY;
      event.preventDefault();
    }
  };

  useEffect(() => {
    const currentRef = messagesRef.current;
    currentRef.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      currentRef.removeEventListener("wheel", handleWheel);
    };
  }, []);

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
      <IoMdArrowBack onClick={() => navigate(-1)} style={{ cursor: 'pointer' }} />
        <h2>{ownerName.charAt(0).toUpperCase() + ownerName.slice(1).toLowerCase()}</h2>
      </div>

      <div className="messages-container" ref={messagesRef}>
        {isLoading ? (
          <p>Loading messages...</p>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${
                msg.senderType === "User" ? "sent" : "received"
              }`}
            >
              <strong>
                {msg.senderType === "User" ? "You" : `${ownerName}`}
              </strong>
              : {msg.message}
              <div className="timestamp">{formatTime(msg.timestamp)}</div>
            </div>
          ))
        )}
      </div>

      <div className="input-container">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default MessageChatScreen;
