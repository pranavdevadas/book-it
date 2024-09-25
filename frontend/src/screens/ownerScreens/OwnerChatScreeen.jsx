import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import io from "socket.io-client";
import "./style.css";
import SideBarOwner from "../../components/ownerComonents/SideBar";
import {
  useChatDetailsQuery,
  useSaveMessagesMutation,
} from "../../slice/ownerSlice/ownerApiSlice";

const socket = io("http://localhost:5000");

const OwnerChatScreen = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesRef = useRef(null);

  const location = useLocation();
  const {  ownerId, chatId, customerName } = location.state;

  const { data: chatData, isLoading, refetch } = useChatDetailsQuery({ chatId });

  const [saveMessage] = useSaveMessagesMutation();

  useEffect(() => {
    if (chatData) {
      setMessages(chatData.messages || []);
      refetch()
    }
  }, [chatData]);

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
        sender: ownerId,
        ownerId,
        senderType: "Owner",
        message,
        timestamp: new Date().toISOString(),
      };

      socket.emit("sendMessage", messageData);
      try {
        await saveMessage(messageData).unwrap();
        
        refetch()
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
    <div className="d-flex">
      <SideBarOwner />
      <div className="content">
        <div className="chat-container">
          <div className="chat-header">
            <h2>{customerName}</h2>
          </div>

          <div className="messages-container" ref={messagesRef}>
            {isLoading ? (
              <p>Loading messages...</p>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`message ${
                    msg.senderType === "Owner" ? "sent" : "received"
                  }`}
                >
                  <strong>
                    {msg.senderType === "Owner" ? "You" : `${customerName}`}
                  </strong>
                  : {msg.message}
                  <div className="timestamp">{formatTime(msg.timestamp)}</div>
                </div>
              ))
            )}
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
