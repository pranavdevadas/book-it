import React from "react";
import { useParams } from "react-router-dom"; 
import Chat from "../../components/userComponents/Chat";

function ChatScreen() {
  const { userId, ownerId } = useParams();
  return (
    <>
      <Chat userId={userId} ownerId={ownerId} /> 
    </>
  );
}

export default ChatScreen;
