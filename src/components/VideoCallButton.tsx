"use client";

import { VideoCameraIcon } from '@heroicons/react/24/outline';
import { DisconnectReason } from 'livekit-client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  beginCallAttempt,
  CallEventData,
  createCallId,
  finishCallAttempt,
  isCallEventForActiveCall,
  isCallEventForConsultation,
} from '@/utils/videoCall';
import VideoRoom from './VideoRoom';

interface VideoCallButtonProps {
  consultationId: number;
  userId: string;
  socket?: any;
  isConsultationOpen: boolean;
}

type CallDirection = 'incoming' | 'outgoing';

const VideoCallButton: React.FC<VideoCallButtonProps> = ({
  consultationId,
  userId,
  socket,
  isConsultationOpen,
}) => {
  const [token, setToken] = useState('');
  const [isCallActive, setIsCallActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [incomingCall, setIncomingCall] = useState<CallEventData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const connectingRef = useRef(false);
  const activeCallIdRef = useRef<string | null>(null);
  const callDirectionRef = useRef<CallDirection>('outgoing');
  const roomMountedRef = useRef(false);
  const suppressDisconnectSignalRef = useRef(false);
  const endSignalSentRef = useRef(false);
  const autoAnswerHandledRef = useRef(false);

  const resetCall = () => {
    setIncomingCall(null);
    setIsCallActive(false);
    setToken('');
    setIsConnecting(false);
    roomMountedRef.current = false;
    finishCallAttempt(connectingRef);
  };

  const emitEndOnce = (reason: 'ended' | 'declined') => {
    if (!socket || endSignalSentRef.current) return;
    endSignalSentRef.current = true;
    socket.emit('videoCallEnded', {
      room: `${consultationId}`,
      consultationId,
      callId: activeCallIdRef.current,
      endedBy: 'doctor',
      reason,
      timestamp: new Date().toISOString(),
    });
  };

  useEffect(() => {
    if (!socket) return;

    const handleVideoCallStarted = (data: CallEventData & { initiatedBy?: string }) => {
      if (data.initiatedBy === 'doctor') return;
      if (!isCallEventForConsultation(data, consultationId)) return;
      if (roomMountedRef.current || connectingRef.current) return;

      activeCallIdRef.current = data.callId ?? null;
      endSignalSentRef.current = false;
      setError(null);
      setIncomingCall(data);
    };

    const handleVideoCallEnded = (data: CallEventData) => {
      if (!isCallEventForActiveCall(data, consultationId, activeCallIdRef.current)) return;

      suppressDisconnectSignalRef.current = roomMountedRef.current;
      resetCall();
      activeCallIdRef.current = null;
    };

    socket.on('videoCallStarted', handleVideoCallStarted);
    socket.on('videoCallEnded', handleVideoCallEnded);

    return () => {
      socket.off('videoCallStarted', handleVideoCallStarted);
      socket.off('videoCallEnded', handleVideoCallEnded);
    };
  }, [socket, consultationId]);

  const fetchTokenAndJoin = useCallback(async (direction: CallDirection) => {
    if (!beginCallAttempt(connectingRef)) return;

    callDirectionRef.current = direction;
    if (direction === 'outgoing') {
      activeCallIdRef.current = createCallId();
      endSignalSentRef.current = false;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const authToken = localStorage.getItem('labass_doctor_token');
      if (!authToken) throw new Error('Authentication token not found');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/get-token`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: `doctor_${userId}`,
          roomName: `consultation_${consultationId}`,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate call token: ${response.statusText}`);
      }

      const data = await response.json();
      if (!data.token) throw new Error('The call token was missing from the response.');

      setIncomingCall(null);
      setToken(data.token);
      roomMountedRef.current = true;
      setIsCallActive(true);
    } catch (caughtError) {
      activeCallIdRef.current = direction === 'outgoing' ? null : activeCallIdRef.current;
      setError(caughtError instanceof Error ? caughtError.message : 'Failed to start the call.');
    } finally {
      setIsConnecting(false);
      finishCallAttempt(connectingRef);
    }
  }, [consultationId, userId]);

  useEffect(() => {
    if (!isConsultationOpen || autoAnswerHandledRef.current || typeof window === 'undefined') return;

    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('autoAnswer') !== 'true') return;

    autoAnswerHandledRef.current = true;
    searchParams.delete('autoAnswer');
    const query = searchParams.toString();
    window.history.replaceState(null, '', `${window.location.pathname}${query ? `?${query}` : ''}`);
    void fetchTokenAndJoin('incoming');
  }, [fetchTokenAndJoin, isConsultationOpen]);

  const handleConnected = () => {
    if (!socket) return;

    const eventName = callDirectionRef.current === 'outgoing'
      ? 'videoCallStarted'
      : 'videoCallJoined';

    socket.emit(eventName, {
      room: `${consultationId}`,
      consultationId,
      callId: activeCallIdRef.current,
      initiatedBy: 'doctor',
      userId,
      timestamp: new Date().toISOString(),
    });
  };

  const handleDisconnected = (reason?: DisconnectReason) => {
    if (suppressDisconnectSignalRef.current) {
      suppressDisconnectSignalRef.current = false;
      return;
    }

    if (reason === DisconnectReason.DUPLICATE_IDENTITY) {
      setError('This call was opened from another tab or device.');
    } else {
      emitEndOnce('ended');
      if (reason && reason !== DisconnectReason.CLIENT_INITIATED) {
        setError('The call connection was lost. You can try again.');
      }
    }

    resetCall();
    activeCallIdRef.current = null;
  };

  const handleDecline = () => {
    emitEndOnce('declined');
    resetCall();
    activeCallIdRef.current = null;
  };

  if (!isConsultationOpen) return null;

  if (isCallActive && token) {
    return typeof document !== 'undefined'
      ? createPortal(
          <VideoRoom
            token={token}
            onDisconnect={handleDisconnected}
            onConnected={handleConnected}
            onError={setError}
          />,
          document.body,
        )
      : null;
  }

  if (incomingCall) {
    return (
      <div className="fixed inset-x-4 top-20 z-40 mx-auto max-w-md rounded-2xl border border-blue-200 bg-white p-5 shadow-2xl">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-blue-100 p-3 text-blue-700">
            <VideoCameraIcon className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900">Incoming video call</p>
            <p className="mt-1 text-sm text-gray-600">The patient is inviting you to join.</p>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            onClick={() => fetchTokenAndJoin('incoming')}
            disabled={isConnecting}
            className="rounded-lg bg-green-600 px-4 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-green-400"
          >
            {isConnecting ? 'Joining…' : 'Join'}
          </button>
          <button
            onClick={handleDecline}
            disabled={isConnecting}
            className="rounded-lg bg-gray-100 px-4 py-3 text-sm font-medium text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Decline
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-2 sm:flex-none">
      <button
        onClick={() => fetchTokenAndJoin('outgoing')}
        disabled={isConnecting}
        className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto sm:px-6 sm:py-3 ${
          isConnecting ? 'cursor-not-allowed bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isConnecting ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white" />
            <span>Connecting…</span>
          </>
        ) : (
          <>
            <VideoCameraIcon className="h-5 w-5" />
            <span>Start video call</span>
          </>
        )}
      </button>

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default VideoCallButton;
