import React from "react";
import ChatMainContents from "./_components/chatMessagesarea";
import Header from "../../components/common/header";

const ChatPage: React.FC = () => {
  return (
    <div className="flex flex-col w-full h-screen text-lg bg-white mt-14 ">
      <Header title="Chat" showBackButton={true} />
      {/* <DoctorInfoCard /> */}
      <ChatMainContents />
    </div>
  );
};

export default ChatPage;
