"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import ChatMainContents from "../../chat/_components/chatMainContent";
import StickyMessageInput from "../../chat/_components/chatInputarea"; // Import StickyMessageInput
import useSocket from "../../../socket.io/socket.io.initialization";
import TabComponent from "../_presc-components/tabs";
import { getConsultationById } from "../_controller/getConsultationById";
import { calculateAge } from "../../../utils/calculateAge";

interface Message {
  id?: string;
  message: string;
  senderId: number;
  consultationId: number;
  isSent: boolean;
  read: boolean;
}

const ChatPage: React.FC = () => {
  const [status, setStatus] = useState("");
  const [doctorInfo, setDoctorInfo] = useState<any>(null);
  const [consultationInfo, setConsultationInfo] = useState<any>(null); // Store consultation data
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const messageEndRef = useRef<HTMLDivElement>(null);
  const consultationId = params.consultationId;
  const websocketURL = process.env.NEXT_PUBLIC_WEBSOCKET_URL || "";
  const token = localStorage.getItem("labass_token");
  const userId = localStorage.getItem("labass_userId");

  const statusClass = `inline-block px-4 mx-2 py-1 rounded-full text-xs font-medium ${
    status === "Open"
      ? "bg-green-100 text-green-700 mb-1"
      : status === "Paid"
      ? "bg-blue-100 text-blue-700 mb-1"
      : "bg-gray-200 text-gray-700 mb-1"
  }`;

  useEffect(() => {
    const fetchConsultation = async () => {
      if (!consultationId) return;

      const consultation = await getConsultationById(Number(consultationId));

      if (consultation && consultation.status) {
        setStatus(
          consultation.status === "Paid"
            ? "Paid"
            : consultation.status === "Open"
            ? "Open"
            : consultation.status
        );

        if (consultation.doctor && consultation.doctor.user) {
          setDoctorInfo(consultation.doctor);
        } else {
          setDoctorInfo(null);
        }

        setConsultationInfo(consultation); // Store consultation data
      }
    };

    fetchConsultation();
  }, [consultationId]);

  useEffect(() => {
    if (!token || !userId || !consultationId) {
      router.push("/login");
    }
  }, [token, userId, consultationId, router]);

  const { socket, isConnected } = useSocket(websocketURL, token || "");

  useEffect(() => {
    if (!socket || !userId || !consultationId) return;

    socket.emit("joinRoom", { room: `${consultationId}` });

    socket.emit(
      "loadMessages",
      { consultationId },
      (loadedMessages: Message[]) => {
        setMessages(loadedMessages);
        setLoading(false);
      }
    );

    const handleReceiveMessage = (newMessage: Message) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      if (newMessage.senderId !== Number(userId)) {
        socket.emit("messageReceived", { messageId: newMessage.id });
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [socket, userId, consultationId]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = (messageText: string, fileMessage?: any) => {
    if (!isConnected || !socket || !userId) {
      console.error(
        "Socket is not connected or userId is missing. Message cannot be sent."
      );
      return;
    }
    if (fileMessage) {
      const newFileMessage = {
        message: "",
        senderId: Number(userId),
        consultationId: Number(consultationId),
        isSent: true,
        read: false,
        attachmentUrl: fileMessage.attachmentUrl,
        attachmentType: fileMessage.attachmentType,
      };

      setMessages((prevMessages) => [...prevMessages, newFileMessage]);
    } else {
      const newMessage: Message = {
        message: messageText,
        senderId: Number(userId),
        consultationId: Number(consultationId),
        isSent: false,
        read: false,
      };

      setMessages((prevMessages) => [...prevMessages, newMessage]);

      socket.emit(
        "sendMessage",
        {
          room: `${consultationId}`,
          message: messageText,
          consultationId: Number(consultationId),
          senderId: Number(userId),
        },
        (response: { messageId: string }) => {
          setMessages((prevMessages) =>
            prevMessages.map((msg) =>
              msg === newMessage
                ? { ...msg, id: response.messageId, isSent: true }
                : msg
            )
          );
        }
      );
    }
  };

  const handleEndConsultation = () => {
    // Implement the logic for ending the consultation here
    console.log("Ending consultation");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center bg-gray-200 h-screen">
        <div
          className="spinner border-t-transparent border-gray-500 animate-spin inline-block w-8 h-8 border-4 rounded-full"
          role="status"
        ></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Fixed header */}
      <div className="sticky top-0 w-full bg-white z-50">
        <TabComponent />
      </div>
      {/* Patient Info and Status */}
      <div className="fixed bg-white  mt-16 w-full border-b border-gray-200">
        {/* End Consultation Button */}
        <div className="p-2">
          <button
            onClick={handleEndConsultation}
            className="w-full  bg-red-600 text-white text-xs py-2 px-2 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            End Consultation
          </button>
        </div>
        <h2 className="text-xs flex flex-row px-2 font-semibold text-gray-900">
          Consultation Status: <span className={statusClass}>{status}</span>
        </h2>
        {consultationInfo && (
          <div className="antialiased  flex flex-row">
            <p className="antialiased px-2 text-xs text-gray-700">
              Patient Name: {consultationInfo.patient?.user?.firstName || "N/A"}
            </p>
            <p className="text-xs px-2 text-gray-700">
              Patient Age:{" "}
              {consultationInfo.patient?.user?.dateOfBirth
                ? calculateAge(consultationInfo.patient?.user?.dateOfBirth)
                : "N/A"}
            </p>
          </div>
        )}
      </div>

      {/* ChatMainContents is scrollable */}
      <div className="flex-grow overflow-y-auto">
        <ChatMainContents
          consultationId={Number(consultationId)}
          messages={messages}
        />
        <div ref={messageEndRef} />
      </div>

      {/* StickyMessageInput is fixed at the bottom */}
      <div className="shrink-0 fixed bottom-0 w-full bg-white">
        <StickyMessageInput
          onSendMessage={handleSendMessage}
          consultationId={Number(consultationId)}
        />
      </div>
    </div>
  );
};

export default ChatPage;
