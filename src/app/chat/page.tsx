import React from "react";
import ChatMainContents from "./_components/chatMessagesarea";

const ChatPage: React.FC = () => {
  return (
    <div className="flex flex-col h-screen bg-white ">
      {/* <Header title="استشارة فورية" showBackButton={true} /> */}
      {/* <DoctorInfoCard /> */}
      <ChatMainContents />
    </div>
  );
};

export default ChatPage;
