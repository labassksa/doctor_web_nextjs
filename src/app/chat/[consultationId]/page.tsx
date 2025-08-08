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
import { acceptConsultation } from "../../../app/_controllers/doctorAcceptConsultation"; // Import acceptConsultation function

interface Message {
  id?: string;
  message: string;
  senderId: number;
  consultationId: number;
  isSent: boolean;
  read: boolean;
  attachmentUrl?: string;
  attachmentType?: string;
  recordedTime?: number;
}

const ChatPage: React.FC = () => {
  const [status, setStatus] = useState("");
  const [doctorInfo, setDoctorInfo] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [consultationInfo, setConsultationInfo] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loadingEndConsultation, setLoadingEndConsultation] = useState(false);
  const [acceptLoading, setAcceptLoading] = useState(false); // Loading state for accepting consultation
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(
    null
  ); // For acceptance confirmation
  const [showPatientHistory, setShowPatientHistory] = useState(false);

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
  const handleBackToFeed = () => {
    router.push("/"); // Navigate back to Feed page
  };

  useEffect(() => {
    const fetchConsultation = async () => {
      if (!consultationId) return;

      const result = await getConsultationById(Number(consultationId));

      if (result.error) {
        setErrorMessage(result.error);
      } else {
        setStatus(result.status);
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
      socket.off("messageStatus", handleMessageStatus);
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
        recordedTime: fileMessage.recordedTime,
      };

      setMessages((prevMessages) => [...prevMessages, newFileMessage]);
      socket.emit(
        "sendMessage",
        {
          room: `${consultationId}`,
          message: "",
          consultationId: Number(consultationId),
          senderId: Number(userId),
          attachmentUrl: fileMessage.attachmentUrl,
          attachmentType: fileMessage.attachmentType,
          recordedTime: fileMessage.recordedTime,
        },
        (response: { messageId: string }) => {
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
    setLoadingEndConsultation(true);

    try {
      const updatedConsultation = await endConsultation(Number(consultationId));

      if (updatedConsultation && updatedConsultation.status) {
        setStatus(updatedConsultation.status);
        setConsultationInfo(updatedConsultation);
      }

      setShowConfirmation(false);
    } catch (error) {
      console.error("Failed to end consultation:", error);
      setShowConfirmation(false);
    } finally {
      setLoadingEndConsultation(false);
    }
  };

  // Handle consultation acceptance
  const handleAcceptConsultation = async () => {
    setAcceptLoading(true);
    try {
      const updatedConsultation = await acceptConsultation(
        Number(consultationId)
      );

      if (updatedConsultation && updatedConsultation.status) {
        setStatus(updatedConsultation.status);
        setConsultationInfo(updatedConsultation);
        setConfirmationMessage("Consultation accepted successfully!");
      }
    } catch (error) {
      console.error("Failed to accept consultation:", error);
      setConfirmationMessage("Failed to accept consultation.");
    } finally {
      setAcceptLoading(false);
      setTimeout(() => setConfirmationMessage(null), 3000);
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
        <div className="fixed bg-white w-full border-b border-gray-200 mt-16">
          <div className="flex justify-between p-2">
            <button
              onClick={handleBackToFeed}
              className="text-blue-500 text-md hover:underline"
            >
              Back to Feed
            </button>
            {/* Conditionally show the Accept or End Consultation Button */}
            {status === ConsultationStatus.Paid && (
              <div className="p-2">
                <button
                  onClick={handleAcceptConsultation}
                  disabled={acceptLoading}
                  className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 bg-green-600 text-white text-xs py-2 sm:py-3 px-2 sm:px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  {acceptLoading ? "Accepting..." : "Accept Consultation"}
                </button>
              </div>
            )}

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
          </div>

          {/* Status Display */}
          <h2 className="text-xs flex flex-row p-2 font-semibold text-gray-900">
            Consultation Status: <span className={statusClass}>{status}</span>
          </h2>

          {consultationInfo && (
            <div className="flex flex-col space-y-2">
              <div className="flex flex-row">
                <p className="px-2 text-sm text-black">Patient Name:</p>
                <p className="mr-2 text-sm text-gray-500">
                  {consultationInfo.patient?.user?.firstName + " " +
                   consultationInfo.patient?.user?.lastName || "N/A"}
                </p>
                <p className="text-sm ml-2 text-black">Patient Age:</p>
                <p className="text-sm text-gray-500">
                  {consultationInfo.patient?.user?.dateOfBirth
                    ? calculateAge(consultationInfo.patient?.user?.dateOfBirth)
                    : "N/A"}
                </p>
              </div>
              
              {consultationInfo.previousConsultations && consultationInfo.previousConsultations.length > 0 && (
                <div className="px-2 pb-2">
                  <button
                    onClick={() => setShowPatientHistory(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white text-xs py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 relative z-10"
                  >
                    Patient History ({consultationInfo.previousConsultations.length})
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Display confirmation message if any */}
      {confirmationMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md shadow-md z-50">
          {confirmationMessage}
        </div>
      )}

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
                disabled={loadingEndConsultation}
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
                disabled={loadingEndConsultation}
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

      {/* Patient History Modal */}
      {showPatientHistory && consultationInfo?.previousConsultations && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Patient History - {consultationInfo.patient?.user?.firstName} {consultationInfo.patient?.user?.lastName}
              </h2>
              <button
                onClick={() => setShowPatientHistory(false)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-4 overflow-y-auto max-h-[70vh]">
              <div className="space-y-4">
                {consultationInfo.previousConsultations.map((consultation: any, index: number) => (
                  <div key={consultation.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-gray-900">
                          Consultation #{consultation.id}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          consultation.status === 'Closed' 
                            ? 'bg-red-100 text-red-700' 
                            : consultation.status === 'Open'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {consultation.status}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(consultation.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600 mb-1">Doctor:</p>
                        <p className="font-medium">{consultation.doctor?.user?.firstName} {consultation.doctor?.user?.lastName}</p>
                        <p className="text-gray-500">{consultation.doctor?.specialty}</p>
                      </div>
                      
                      <div>
                        <p className="text-gray-600 mb-1">Consultation Type:</p>
                        <p className="font-medium capitalize">{consultation.type}</p>
                      </div>
                      
                      {consultation.prescription && (
                        <div className="md:col-span-2">
                          <p className="text-gray-600 mb-1">Diagnosis:</p>
                          <div className="bg-white p-2 rounded border">
                            {consultation.prescription.diagnoses && consultation.prescription.diagnoses.length > 0 ? (
                              <ul className="list-disc list-inside text-sm">
                                {consultation.prescription.diagnoses.map((diagnosis: string, idx: number) => (
                                  <li key={idx}>{diagnosis}</li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-gray-500">No diagnosis recorded</p>
                            )}
                          </div>
                          
                          {consultation.prescription.pdfURL && (
                            <div className="mt-2">
                              <a
                                href={consultation.prescription.pdfURL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:text-blue-700 text-sm underline"
                              >
                                View Prescription PDF
                              </a>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {consultation.labTestPDFUrls && consultation.labTestPDFUrls.length > 0 && (
                        <div className="md:col-span-2">
                          <p className="text-gray-600 mb-1">Lab Tests:</p>
                          <div className="bg-white p-2 rounded border">
                            <div className="flex flex-wrap gap-2">
                              {consultation.labTestPDFUrls.map((labTestUrl: string, idx: number) => (
                                <a
                                  key={idx}
                                  href={labTestUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-500 hover:text-blue-700 text-sm underline"
                                >
                                  Lab Test {idx + 1} PDF
                                </a>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div>
                        <p className="text-gray-600 mb-1">Payment Status:</p>
                        <p className="font-medium">{consultation.payment?.paymentStatus || 'N/A'}</p>
                        <p className="text-gray-500">Amount: {consultation.payment?.invoiceValue || 'N/A'} SAR</p>
                      </div>
                      
                      <div>
                        <p className="text-gray-600 mb-1">Duration:</p>
                        <p className="font-medium">
                          {consultation.doctorJoinedAT && consultation.closedAt
                            ? `${Math.round((new Date(consultation.closedAt).getTime() - new Date(consultation.doctorJoinedAT).getTime()) / (1000 * 60))} minutes`
                            : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={() => setShowPatientHistory(false)}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Close
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
          isConsultationOpen={status === ConsultationStatus.Open}
        />
      </div>
    </div>
  );
};

export default ChatPage;
