import { useState, useCallback, useRef } from 'react';
import { Room, ConnectionState, RoomEvent } from 'livekit-client';

interface UseVideoCallProps {
  consultationId: number;
  userId: string;
  socket?: any;
}

interface VideoCallState {
  isInCall: boolean;
  isConnecting: boolean;
  connectionState: ConnectionState;
  error: string | null;
  participants: number;
}

export const useVideoCall = ({ consultationId, userId, socket }: UseVideoCallProps) => {
  const [callState, setCallState] = useState<VideoCallState>({
    isInCall: false,
    isConnecting: false,
    connectionState: ConnectionState.Disconnected,
    error: null,
    participants: 0,
  });

  const roomRef = useRef<Room | null>(null);

  const generateToken = async (): Promise<string> => {
    const token = localStorage.getItem("labass_doctor_token");

    if (!token) {
      throw new Error("Authentication token not found");
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
    return data.token;
  };

  const startCall = useCallback(async () => {
    try {
      setCallState(prev => ({ ...prev, isConnecting: true, error: null }));

      // Generate LiveKit token
      const livekitToken = await generateToken();

      // Create and configure room
      const room = new Room();
      roomRef.current = room;

      // Set up event listeners
      room.on(RoomEvent.Connected, () => {
        setCallState(prev => ({
          ...prev,
          isInCall: true,
          isConnecting: false,
          connectionState: ConnectionState.Connected,
        }));

        // Notify other participant via socket
        if (socket) {
          socket.emit("videoCallStarted", {
            room: `${consultationId}`,
            initiatedBy: "doctor",
            timestamp: new Date(),
          });
        }
      });

      room.on(RoomEvent.Disconnected, () => {
        setCallState(prev => ({
          ...prev,
          isInCall: false,
          isConnecting: false,
          connectionState: ConnectionState.Disconnected,
        }));
      });

      room.on(RoomEvent.ParticipantConnected, () => {
        setCallState(prev => ({
          ...prev,
          participants: room.remoteParticipants.size + 1, // +1 for local participant
        }));
      });

      room.on(RoomEvent.ParticipantDisconnected, () => {
        setCallState(prev => ({
          ...prev,
          participants: room.remoteParticipants.size + 1,
        }));
      });

      room.on(RoomEvent.Reconnecting, () => {
        setCallState(prev => ({ ...prev, connectionState: ConnectionState.Reconnecting }));
      });

      // Connect to room with audio and video enabled
      await room.connect(process.env.NEXT_PUBLIC_LIVEKIT_URL!, livekitToken, {
        audio: true,
        video: true,
      });

    } catch (error) {
      console.error('Failed to start video call:', error);
      setCallState(prev => ({
        ...prev,
        isConnecting: false,
        error: error instanceof Error ? error.message : 'Failed to start call',
      }));
    }
  }, [consultationId, userId, socket]);

  const endCall = useCallback(async () => {
    try {
      if (roomRef.current) {
        await roomRef.current.disconnect();
        roomRef.current = null;
      }

      setCallState(prev => ({
        ...prev,
        isInCall: false,
        isConnecting: false,
        connectionState: ConnectionState.Disconnected,
        participants: 0,
      }));

      // Notify other participant via socket
      if (socket) {
        socket.emit("videoCallEnded", {
          room: `${consultationId}`,
          endedBy: "doctor",
          timestamp: new Date(),
        });
      }
    } catch (error) {
      console.error('Failed to end video call:', error);
    }
  }, [consultationId, socket]);

  const toggleAudio = useCallback(async () => {
    if (roomRef.current?.localParticipant) {
      const enabled = roomRef.current.localParticipant.isMicrophoneEnabled;
      await roomRef.current.localParticipant.setMicrophoneEnabled(!enabled);
    }
  }, []);

  const toggleVideo = useCallback(async () => {
    if (roomRef.current?.localParticipant) {
      const enabled = roomRef.current.localParticipant.isCameraEnabled;
      await roomRef.current.localParticipant.setCameraEnabled(!enabled);
    }
  }, []);

  return {
    callState,
    room: roomRef.current,
    startCall,
    endCall,
    toggleAudio,
    toggleVideo,
  };
};