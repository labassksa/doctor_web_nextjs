"use client";
import React, { useState } from 'react';
import { ConnectionState, DisconnectReason } from 'livekit-client';
import {
  LiveKitRoom,
  VideoConference,
  RoomAudioRenderer,
  StartAudio,
  useConnectionState,
  useRemoteParticipants,
} from '@livekit/components-react';
import '@livekit/components-styles';

interface VideoRoomProps {
  token: string;
  onDisconnect: (reason?: DisconnectReason) => void;
  onConnected?: () => void;
  onError?: (message: string) => void;
}

const VideoRoom: React.FC<VideoRoomProps> = ({
  token,
  onDisconnect,
  onConnected,
  onError,
}) => {
  const [roomError, setRoomError] = useState<string | null>(null);

  const reportError = (message: string) => {
    setRoomError(message);
    onError?.(message);
  };

  return (
    <div className="fixed inset-0 bg-black z-50">
      <style jsx global>{`
        /* iOS Safe Area Support */
        :root {
          --safe-area-inset-bottom: env(safe-area-inset-bottom, 0px);
        }

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
          padding-bottom: calc(12px + var(--safe-area-inset-bottom)) !important;
          pointer-events: auto !important;
          /* iOS-specific fixes */
          -webkit-transform: translate3d(0, 0, 0) !important;
          transform: translate3d(0, 0, 0) !important;
          -webkit-backface-visibility: hidden !important;
          backface-visibility: hidden !important;
        }

        .lk-video-conference {
          display: flex !important;
          flex-direction: column !important;
          position: relative !important;
          height: 100vh !important;
          /* iOS viewport fix */
          height: -webkit-fill-available !important;
          min-height: 100vh !important;
          min-height: -webkit-fill-available !important;
          width: 100vw !important;
          overflow: hidden !important;
          /* iOS smooth scrolling */
          -webkit-overflow-scrolling: touch !important;
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
          padding-bottom: var(--safe-area-inset-bottom) !important;
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
            padding-bottom: calc(16px + var(--safe-area-inset-bottom)) !important;
            gap: 8px !important;
            justify-content: center !important;
            flex-wrap: nowrap !important;
          }

          .lk-control-bar button {
            min-width: 48px !important;
            min-height: 48px !important;
            width: 48px !important;
            height: 48px !important;
            flex-shrink: 0 !important;
            touch-action: manipulation !important;
            -webkit-touch-callout: none !important;
            -webkit-tap-highlight-color: transparent !important;
            -webkit-user-select: none !important;
            user-select: none !important;
          }

          .lk-video-conference {
            touch-action: none !important;
            -webkit-touch-callout: none !important;
          }

          /* Ensure buttons are touchable */
          .lk-button {
            pointer-events: auto !important;
            cursor: pointer !important;
            -webkit-appearance: none !important;
            appearance: none !important;
          }
        }

        /* iOS-specific fixes */
        @supports (-webkit-touch-callout: none) {
          .lk-control-bar {
            position: fixed !important;
            bottom: env(safe-area-inset-bottom, 0) !important;
            padding-bottom: calc(16px + env(safe-area-inset-bottom, 0px)) !important;
          }

          .lk-video-conference {
            height: 100vh !important;
            height: -webkit-fill-available !important;
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
        token={token}
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
        connect={true}
        audio={true}
        video={true}
        onConnected={() => {
          setRoomError(null);
          onConnected?.();
        }}
        onDisconnected={onDisconnect}
        onError={(error) => reportError(error.message || 'Unable to connect to the call.')}
        onMediaDeviceFailure={(_, kind) =>
          reportError(
            kind === 'audioinput'
              ? 'Microphone access failed. Check your browser permission.'
              : 'Camera access failed. Check your browser permission.',
          )
        }
        style={{ height: '100vh', width: '100vw' }}
      >
        {/* Video Conference Layout with built-in controls */}
        <VideoConference />

        {/* Audio Renderer - handles audio tracks */}
        <RoomAudioRenderer />
        <CallStatus />
        <StartAudio label="Click to enable call audio" />
        {roomError && (
          <div className="fixed inset-x-4 top-16 z-[10000] mx-auto max-w-lg rounded-xl bg-red-600 px-4 py-3 text-center text-sm text-white shadow-lg">
            {roomError}
          </div>
        )}
      </LiveKitRoom>
    </div>
  );
};

const CallStatus = () => {
  const connectionState = useConnectionState();
  const remoteParticipants = useRemoteParticipants();

  const message = connectionState === ConnectionState.Reconnecting
    ? 'Reconnecting…'
    : connectionState === ConnectionState.Connected && remoteParticipants.length === 0
      ? 'Waiting for the other participant…'
      : null;

  if (!message) return null;

  return (
    <div className="fixed top-4 left-1/2 z-[10000] -translate-x-1/2 rounded-full bg-gray-900/85 px-4 py-2 text-sm text-white shadow-lg">
      {message}
    </div>
  );
};

export default VideoRoom;
