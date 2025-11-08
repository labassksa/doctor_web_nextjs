"use client";
import React from 'react';
import { Room } from 'livekit-client';
import {
  LiveKitRoom,
  VideoConference,
  RoomAudioRenderer,
  useTracks,
} from '@livekit/components-react';
import '@livekit/components-styles';

interface VideoRoomProps {
  room: Room | null;
  token: string;
  onDisconnect: () => void;
  isConnecting: boolean;
}

const VideoRoom: React.FC<VideoRoomProps> = ({
  room,
  token,
  onDisconnect,
  isConnecting,
}) => {
  if (isConnecting) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700">Connecting to video call...</p>
        </div>
      </div>
    );
  }

  if (!room || !token) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black z-50">
      <style jsx global>{`
        .lk-control-bar {
          display: flex !important;
          visibility: visible !important;
          opacity: 1 !important;
          position: fixed !important;
          bottom: 0 !important;
          left: 0 !important;
          right: 0 !important;
          transform: none !important;
          transition: none !important;
          z-index: 9999 !important;
          background: rgba(0, 0, 0, 0.8) !important;
          padding: 12px !important;
          pointer-events: auto !important;
        }
        .lk-video-conference {
          display: flex !important;
          flex-direction: column !important;
          position: relative !important;
          height: 100vh !important;
        }
        .lk-video-conference .lk-control-bar-wrapper {
          display: flex !important;
          visibility: visible !important;
          opacity: 1 !important;
          position: fixed !important;
          bottom: 0 !important;
          left: 0 !important;
          right: 0 !important;
          z-index: 9999 !important;
        }
        .lk-video-conference .lk-control-bar-container {
          display: flex !important;
          visibility: visible !important;
          opacity: 1 !important;
        }
        /* Force controls to always show */
        [class*="control"] {
          visibility: visible !important;
          opacity: 1 !important;
          display: flex !important;
        }
        /* Mobile-specific fixes */
        @media (max-width: 768px) {
          .lk-control-bar {
            padding: 16px 8px !important;
            gap: 8px !important;
            justify-content: center !important;
          }
          .lk-control-bar button {
            min-width: 48px !important;
            min-height: 48px !important;
            touch-action: manipulation !important;
            -webkit-tap-highlight-color: transparent !important;
          }
          .lk-video-conference {
            touch-action: none !important;
          }
          /* Ensure buttons are touchable */
          .lk-button {
            pointer-events: auto !important;
            cursor: pointer !important;
          }
        }
        /* Prevent control bar from hiding on mobile */
        .lk-video-conference:hover .lk-control-bar,
        .lk-video-conference .lk-control-bar {
          opacity: 1 !important;
          visibility: visible !important;
          display: flex !important;
        }
      `}</style>
      <LiveKitRoom
        room={room}
        token={token}
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
        connect={true}
        onDisconnected={onDisconnect}
        style={{ height: '100vh', width: '100vw' }}
      >
        {/* Video Conference Layout with built-in controls */}
        <VideoConference />

        {/* Audio Renderer - handles audio tracks */}
        <RoomAudioRenderer />

        {/* Participant Count Display */}
        <ParticipantCount />
      </LiveKitRoom>
    </div>
  );
};

// Component to show participant count
const ParticipantCount: React.FC = () => {
  const tracks = useTracks();
  const participantCount = tracks.length > 0 ? new Set(tracks.map(track => track.participant.identity)).size : 0;

  return (
    <div className="absolute top-4 right-4 bg-gray-900 bg-opacity-80 text-white px-3 py-2 rounded-lg">
      <span className="text-sm">
        {participantCount} participant{participantCount !== 1 ? 's' : ''}
      </span>
    </div>
  );
};

export default VideoRoom;