"use client";
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { VideoCameraIcon, VideoCameraSlashIcon } from '@heroicons/react/24/outline';
import { useVideoCall } from '../hooks/useVideoCall';
import VideoRoom from './VideoRoom';

interface VideoCallButtonProps {
  consultationId: number;
  userId: string;
  socket?: any;
  isConsultationOpen: boolean;
}

const VideoCallButton: React.FC<VideoCallButtonProps> = ({
  consultationId,
  userId,
  socket,
  isConsultationOpen,
}) => {
  const [livekitToken, setLivekitToken] = useState<string>('');
  const [isCallActive, setIsCallActive] = useState(false);
  const [incomingCall, setIncomingCall] = useState(false);

  const {
    callState,
    room,
    startCall,
    endCall,
    toggleAudio,
    toggleVideo,
  } = useVideoCall({
    consultationId,
    userId,
    socket,
  });

  // Listen for incoming video call events
  useEffect(() => {
    if (!socket) return;

    const handleVideoCallStarted = (data: any) => {
      if (data.initiatedBy !== 'doctor') {
        setIncomingCall(true);
      }
    };

    const handleVideoCallEnded = (data: any) => {
      setIncomingCall(false);
      setIsCallActive(false);
    };

    socket.on('videoCallStarted', handleVideoCallStarted);
    socket.on('videoCallEnded', handleVideoCallEnded);

    return () => {
      socket.off('videoCallStarted', handleVideoCallStarted);
      socket.off('videoCallEnded', handleVideoCallEnded);
    };
  }, [socket]);

  // Update call active state based on hook state
  useEffect(() => {
    setIsCallActive(callState.isInCall);
  }, [callState.isInCall]);

  const handleStartCall = async () => {
    try {
      const token = localStorage.getItem("labass_doctor_token");
      if (!token) {
        alert("Authentication token not found");
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/get-token`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: `doctor_${userId}`,
          roomName: `consultation_${consultationId}`,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate token: ${response.statusText}`);
      }

      const data = await response.json();
      setLivekitToken(data.token);

      await startCall();
    } catch (error) {
      console.error('Failed to start video call:', error);
      alert(`Failed to start video call: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleEndCall = async () => {
    await endCall();
    setLivekitToken('');
    setIsCallActive(false);
    setIncomingCall(false);
  };

  const handleJoinCall = async () => {
    setIncomingCall(false);
    await handleStartCall();
  };

  if (!isConsultationOpen) {
    return null;
  }

  // Show incoming call notification
  if (incomingCall && !isCallActive) {
    return (
      <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-blue-100 border border-blue-400 text-blue-700 px-6 py-4 rounded-lg shadow-lg z-40">
        <div className="flex items-center space-x-4">
          <VideoCameraIcon className="h-6 w-6" />
          <div>
            <p className="font-medium">Incoming Video Call</p>
            <p className="text-sm">Patient is starting a video call</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleJoinCall}
              className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700"
            >
              Join Call
            </button>
            <button
              onClick={() => setIncomingCall(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-600"
            >
              Decline
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show video room if call is active (render via portal to escape parent layout)
  if (isCallActive && livekitToken) {
    return typeof document !== 'undefined' ? createPortal(
      <VideoRoom
        room={room}
        token={livekitToken}
        onDisconnect={handleEndCall}
        isConnecting={callState.isConnecting}
      />,
      document.body
    ) : null;
  }

  // Show video call button
  return (
    <div className="flex-1 sm:flex-none p-2">
      <button
        onClick={handleStartCall}
        disabled={callState.isConnecting}
        className={`w-full sm:w-auto ${
          callState.isConnecting
            ? 'bg-blue-400'
            : 'bg-blue-600 hover:bg-blue-700'
        } text-white text-xs py-2 sm:py-3 px-4 sm:px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center space-x-2`}
      >
        {callState.isConnecting ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Connecting...</span>
          </>
        ) : (
          <>
            <VideoCameraIcon className="h-5 w-5" />
            <span>Start Video Call</span>
          </>
        )}
      </button>

      {callState.error && (
        <p className="text-red-600 text-xs mt-2">{callState.error}</p>
      )}
    </div>
  );
};

export default VideoCallButton;