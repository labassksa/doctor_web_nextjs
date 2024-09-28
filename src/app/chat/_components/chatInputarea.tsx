"use client";
import React, { useState, useRef } from "react";
import axios from "axios";

interface StickyMessageInputProps {
  onSendMessage: (messageText: string, fileMessage?: any) => void; // Handle both text and file messages
  consultationId: number; // Ensure consultationId is passed down
}

const StickyMessageInput: React.FC<StickyMessageInputProps> = ({
  onSendMessage,
  consultationId,
}) => {
  const [inputFocused, setInputFocused] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingMessage, setRecordingMessage] = useState("");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const token = localStorage.getItem("labass_token");
  const userId = localStorage.getItem("labass_userId");

  // Focus input field
  const handleFocus = () => {
    setInputFocused(true);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file); // Store the selected file
      setIsModalOpen(true); // Open the modal when a file is selected
    }
  };

  const handleSendFile = async () => {
    if (selectedFile) {
      setIsUploading(true); // Show spinner while uploading

      // Handle file upload logic here
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append(
        "senderId",
        String(Number(localStorage.getItem("labass_userId")))
      ); // Use localStorage for senderId
      formData.append("consultationId", String(Number(consultationId))); // Use localStorage for consultationId
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/upload-consultation-attatchment`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem("labass_token")}`, // JWT token
            },
          }
        );
        // Pass the response to the parent component to update chat
        onSendMessage(message, response.data.chat);
        // Clear file and close modal
        setSelectedFile(null);
        setIsModalOpen(false);
        setIsUploading(false); // Hide spinner after upload
      } catch (error) {
        console.error("File upload failed:", error);
        setIsUploading(false); // Hide spinner on error
      }
    }
  };

  // Handle voice recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data); // Collect audio chunks
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingMessage("Recording..."); // UI feedback
    } catch (error) {
      console.error("Voice recording failed:", error);
      setRecordingMessage("Recording failed. Please try again.");
    }
  };

  const stopRecording = async () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });

        if (audioBlob) {
          setIsUploading(true); // Show spinner while uploading

          const formData = new FormData();
          formData.append("file", audioBlob, "voice_note.webm");
          formData.append("senderId", String(Number(userId)));
          formData.append("consultationId", String(consultationId));

          try {
            const response = await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL}/upload-consultation-attachment`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            // Send the voice note to the parent
            onSendMessage("", response.data.chat);
            setIsUploading(false); // Hide spinner
          } catch (error) {
            console.error("Voice note upload failed:", error);
            setIsUploading(false); // Hide spinner on error
          }
        }
      };
    }
  };

  // Handle sending text messages
  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message, null);
      setMessage(""); // Clear input after sending the message
    }
  };

  // Cancel file selection
  const handleCancelFile = () => {
    setSelectedFile(null);
    setIsModalOpen(false);
  };

  return (
    <div className="sticky bottom-0 bg-white p-4 flex items-center border-t w-full max-w-full h-auto min-h-[64px]">
      {/* File Upload Button */}
      <button className="p-2">
        <input
          type="file"
          onChange={handleFileChange}
          className="hidden"
          id="file-input"
        />
        <label htmlFor="file-input">
          <svg
            className="w-6 h-6 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            ></path>
          </svg>
        </label>
      </button>

      {/* Mic Button for Voice Recording */}
      <button
        className="p-2 mx-2"
        onMouseDown={startRecording} // Start recording on mouse down
        onMouseUp={stopRecording} // Stop recording on mouse up
      >
        <svg
          className={`w-6 h-6 ${
            isRecording ? "text-green-500" : "text-gray-500"
          }`} // Change color while recording
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 10V12C19 13.8565 18.2625 15.637 16.9497 16.9497C15.637 18.2625 13.8565 19 12 19M12 19C10.1435 19 8.36301 18.2625 7.05025 16.9497C5.7375 15.637 5 13.8565 5 12V10M12 19V23M8 23H16M12 1C11.2044 1 10.4413 1.31607 9.87868 1.87868C9.31607 2.44129 9 3.20435 9 4V12C9 12.7956 9.31607 13.5587 9.87868 14.1213C10.4413 14.6839 11.2044 15 12 15C12.7956 15 13.5587 14.6839 14.1213 14.1213C14.6839 13.5587 15 12.7956 15 12V4C15 3.20435 14.6839 2.44129 14.1213 1.87868C13.5587 1.31607 12.7956 1 12 1Z" />
        </svg>
      </button>

      {/* Message Input */}
      <input
        ref={inputRef}
        type="text"
        dir="rtl"
        placeholder="اكتب رسالة..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="flex-grow p-2 border text-black rounded-full outline-none w-full
             text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl
             px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 lg:px-10 lg:py-4"
        style={{ fontSize: "16px" }} // Prevent zoom on focus
        onFocus={handleFocus}
        onBlur={() => setInputFocused(false)}
      />

      {/* Send Button */}
      <button
        className={`p-2 ${inputFocused ? "text-green-500" : "text-gray-500"}`}
        onClick={handleSendMessage} // Send message when clicked
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path
            d="M2.5 12.5L21.5 3.5L14.5 12.5L21.5 21.5L2.5 12.5Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Modal to display the selected attachment */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg max-w-full sm:max-w-lg w-11/12 sm:w-full md:w-3/4 lg:w-1/2">
            <h2 className="text-md text-right font-bold mb-2">إضافة مرفقات</h2>

            {/* Preview the attachment */}
            {selectedFile?.type.startsWith("image/") ? (
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Selected Attachment"
                className="w-full h-auto mb-4 object-contain max-h-80"
              />
            ) : (
              <p className="text-sm mb-4">
                Selected File: {selectedFile?.name}
              </p>
            )}

            <div className="flex justify-end space-x-4">
              <button
                className="bg-red-500 text-white text-xs px-4 py-2 rounded"
                onClick={handleCancelFile}
              >
                إلغاء
              </button>

              <button
                className="bg-green-500 text-white text-xs px-4 py-2 rounded"
                onClick={handleSendFile} // Trigger the file upload logic
              >
                {isUploading ? (
                  <div className="spinner text-white"></div>
                ) : (
                  "إرسال"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StickyMessageInput;
