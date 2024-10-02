"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import ChatMainContents from "../../chat/_components/chatMainContent";
import StickyMessageInput from "../../chat/_components/chatInputarea";
import useSocket from "../../../socket.io/socket.io.initialization";
import TabComponent from "../_presc-components/tabs";
import { getConsultationById } from "../_controller/getConsultationById";
import { calculateAge } from "../../../utils/calculateAge";
import { ConsultationStatus } from "@/models/consultation";
import { endConsultation } from "@/app/_controllers/endconsultation"; // Your consultation ending function

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
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Add state for error messages
  const [consultationInfo, setConsultationInfo] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loadingEndConsultation, setLoadingEndConsultation] = useState(false); // Add loading state for ending consultation
  const router = useRouter();
  const params = useParams();
  const messageEndRef = useRef<HTMLDivElement>(null);
  const consultationId = params.consultationId;
  const websocketURL = process.env.NEXT_PUBLIC_WEBSOCKET_URL || "";
  const token = localStorage.getItem("labass_doctor_token");
  const userId = localStorage.getItem("labass_doctor_userId");

  const statusClass = `inline-block px-4 mx-2 py-1 rounded-full text-xs font-medium ${
    status === ConsultationStatus.Open
      ? "bg-green-100 text-green-700 mb-1"
      : status === ConsultationStatus.Paid
      ? "bg-blue-100 text-blue-700 mb-1"
      : status === ConsultationStatus.Closed
      ? "bg-red-100 text-red-700 mb-1"
      : "bg-gray-200 text-gray-700 mb-1"
  }`;

  useEffect(() => {
    const fetchConsultation = async () => {
      if (!consultationId) return;

      const result = await getConsultationById(Number(consultationId));

      if (result.error) {
        // Handle the error
        setErrorMessage(result.error);
      } else {
        // Handle successful consultation fetch
        setStatus(
          result.status === ConsultationStatus.Paid
            ? ConsultationStatus.Paid
            : result.status === ConsultationStatus.Open
            ? ConsultationStatus.Open
            : result.status
        );
        setConsultationInfo(result);
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
    // Listen for the message status (read status) update
    const handleMessageStatus = ({
      messageId,
      read,
    }: {
      messageId: string;
      read: boolean;
    }) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === messageId ? { ...msg, read } : msg
        )
      );
    };

    socket.on("messageStatus", handleMessageStatus);
    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("messageStatus", handleMessageStatus); // Cleanup messageStatus listener
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
      // Emit the sendMessage event with file information
      socket.emit(
        "sendMessage",
        {
          room: `${consultationId}`,
          message: "", // No text for file message
          consultationId: Number(consultationId),
          senderId: Number(userId),
          attachmentUrl: fileMessage.attachmentUrl,
          attachmentType: fileMessage.attachmentType,
        },
        (response: { messageId: string }) => {
          // Update message with the correct messageId once confirmed by the backend
          setMessages((prevMessages) =>
            prevMessages.map((msg) =>
              msg === newFileMessage
                ? { ...msg, id: response.messageId, isSent: true }
                : msg
            )
          );
        }
      );
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
    setShowConfirmation(true);
  };

  const confirmEndConsultation = async () => {
    setLoadingEndConsultation(true); // Set loading to true when the request starts

    try {
      const updatedConsultation = await endConsultation(Number(consultationId));

      // Update the consultation status in the UI based on the response
      if (updatedConsultation && updatedConsultation.status) {
        setStatus(updatedConsultation.status);
        setConsultationInfo(updatedConsultation);
      }

      setShowConfirmation(false); // Close the modal after successful response
    } catch (error) {
      console.error("Failed to end consultation:", error);
      setShowConfirmation(false); // Close modal even if request fails
    } finally {
      setLoadingEndConsultation(false); // Set loading to false after request completes
    }
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
      <div className="sticky top-0 w-full bg-white z-50">
        <TabComponent />
      </div>

      <div className="flex flex-col min-h-screen bg-gray-100">
        <div className="sticky top-0 w-full bg-white z-50">
          <TabComponent />
        </div>

        <div
          className={`fixed bg-white w-full border-b border-gray-200 ${
            status === ConsultationStatus.Open || ConsultationStatus.Open
              ? "mt-16"
              : ""
          }`}
        >
          {/* Conditionally show the End Consultation Button only if the consultation is Open */}
          {status === ConsultationStatus.Open && (
            <div className="p-2">
              <button
                onClick={handleEndConsultation}
                className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 bg-red-600 text-white text-xs py-2 sm:py-3 px-2 sm:px-4 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                End Consultation
              </button>
            </div>
          )}

          {/* Status Display */}
          <h2 className="text-xs flex flex-row p-2 font-semibold text-gray-900">
            Consultation Status: <span className={statusClass}>{status}</span>
          </h2>

          {consultationInfo && (
            <div className=" flex flex-row">
              <p className=" px-2 text-sm text-gray-700">
                Patient Name:{" "}
                {consultationInfo.patient?.user?.lastName || "N/A"}
              </p>
              <p className="  text-sm text-gray-700">
                {consultationInfo.patient?.user?.firstName || "N/A"}
              </p>
              <p className="text-sm px-2 text-gray-700">
                Patient Age:{" "}
                {consultationInfo.patient?.user?.dateOfBirth
                  ? calculateAge(consultationInfo.patient?.user?.dateOfBirth)
                  : "N/A"}
              </p>
            </div>
          )}
        </div>
      </div>

      {showConfirmation && consultationInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md shadow-lg w-11/12 sm:w-1/2 lg:w-1/3">
            <p className="text-center text-black text-sm">
              Are you sure you want to end the consultation with{" "}
              {consultationInfo.patient?.user?.firstName || "the patient"}?
            </p>

            <div className="flex justify-end space-x-4 mt-4">
              <button
                onClick={() => setShowConfirmation(false)}
                disabled={loadingEndConsultation} // Disable button when loading
                className={`w-full sm:w-1/3 text-xs py-2 rounded-lg ${
                  loadingEndConsultation
                    ? "bg-gray-400"
                    : "bg-gray-500 hover:bg-gray-600"
                } text-white`}
              >
                Cancel
              </button>

              <button
                onClick={confirmEndConsultation}
                disabled={loadingEndConsultation} // Disable button when loading
                className={`w-full sm:w-1/3 text-xs py-2 rounded-lg ${
                  loadingEndConsultation
                    ? "bg-red-400"
                    : "bg-red-600 hover:bg-red-700"
                } text-white`}
              >
                {loadingEndConsultation ? (
                  <span className="spinner border-t-transparent border-white animate-spin inline-block w-4 h-4 border-2 rounded-full"></span>
                ) : (
                  "End Consultation"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-grow overflow-y-auto">
        <ChatMainContents
          consultationId={Number(consultationId)}
          messages={messages}
        />
        <div ref={messageEndRef} />
      </div>

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
