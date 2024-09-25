import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import "./style.css";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate, useLocation } from "react-router-dom";

const socket = io("http://localhost:5000");

const Chat = ({ userId, ownerId }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesRef = useRef(null);

  const location = useLocation();
  const { theatreName, city } = location.state || {};

  // Fetch chat history
  const fetchChat = async (userId, ownerId) => {
    try {
      const response = await fetch(`/api/chat/chats/${userId}/${ownerId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch chat");
      }
      const chatData = await response.json();
      setMessages(chatData?.messages || []);
    } catch (error) {
      console.error(error);
    }
  };

  const sendChatMessage = async (messageData) => {
    try {
      const response = await fetch("/api/chat/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageData),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const savedChat = await response.json();
      return savedChat;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchChat(userId, ownerId);

    socket.on("receiveMessage", (messageData) => {
      setMessages((prevMessages) => [...prevMessages, messageData]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [userId, ownerId]);

  const sendMessage = async () => {
    if (message.trim()) {
      const messageData = {
        sender: userId,
        ownerId: ownerId,
        senderType: "User",
        message,
        timestamp: new Date().toISOString(),
      };

      // Emit the message to the server
      socket.emit("sendMessage", messageData);

      try {
        await sendChatMessage(messageData);
      } catch (error) {
        console.log(error);
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

  const navigate = useNavigate();

  return (
    <div className="chat-container">
      <div className="chat-header">
        <IoMdArrowBack onClick={() => navigate(-1)}
          style={{cursor:'pointer'}}
        />
        <h2>{theatreName} ({city}) </h2>
      </div>

      <div className="messages-container" ref={messagesRef}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.sender === userId ? "sent" : "received"}`}
          >
            <strong>{msg.sender === userId ? "You" : "Owner"}</strong>:{" "}
            {msg.message}
            <div className="timestamp">{formatTime(msg.timestamp)}</div>
          </div>
        ))}
      </div>

      {/* Input Section */}
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

export default Chat;
