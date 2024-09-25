import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import io from "socket.io-client";
import "./style.css";
import SideBarOwner from "../../components/ownerComonents/SideBar";

const socket = io("http://localhost:5000");

const OwnerChatScreen = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesRef = useRef(null);

  const location = useLocation();
  const { userId, ownerId, chatId, customerName } = location.state;

  const fetchChat = async () => {
    try {
      const response = await fetch(`/api/chat/chat-details/${chatId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch chat");
      }
      const chatData = await response.json();
      console.log(chatData)
      setMessages(chatData.messages || []);
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
    fetchChat();

    socket.on("receiveMessage", (messageData) => {
      setMessages((prevMessages) => [...prevMessages, messageData]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [chatId]);

  const sendMessage = async () => {
    if (message.trim()) {
      const messageData = {
        sender: ownerId,
        userId: userId,
        ownerId,
        senderType: 'Owner',
        message,
        timestamp: new Date().toISOString(),
      };

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

  return (
    <div className="d-flex">
      <SideBarOwner />
      <div className="content">
        <div className="chat-container">
          <div className="chat-header">
            <h2>{customerName}</h2>
          </div>

          <div className="messages-container" ref={messagesRef}>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${
                  msg.senderType === 'Owner'? "sent" : "received"
                }`}
              >
                {console.log(msg.senderType)}
                <strong>{msg.senderType === 'Owner' ? "You" : `${customerName}`}</strong>:
                {msg.message}
                <div className="timestamp">{formatTime(msg.timestamp)}</div>
                {console.log(msg)}
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
      </div>
    </div>
  );
};

export default OwnerChatScreen;
