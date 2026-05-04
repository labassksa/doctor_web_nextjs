/**
 * IncomingCallNotification Component
 * Shows a notification when receiving an incoming video call from patient
 * Listens to Socket.io 'videoCallStarted' event and push notifications
 */

'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface IncomingCall {
  consultationId: number;
  callerId: number;
  callerName: string;
  callerAvatar?: string;
}

export function IncomingCallNotification() {
  const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null);
  const router = useRouter();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Listen for incoming video call events
    // This event is emitted by the socket.io connection in the chat page

    const handleVideoCallStarted = (event: CustomEvent<IncomingCall>) => {
      console.log('[IncomingCallNotification] Incoming call received:', event.detail);
      setIncomingCall(event.detail);

      // Play ringtone
      if (audioRef.current) {
        audioRef.current.loop = true;
        audioRef.current.play().catch((error) => {
          console.error('[IncomingCallNotification] Error playing ringtone:', error);
        });
      }

      // Auto-dismiss after 60 seconds if not answered
      timeoutRef.current = setTimeout(() => {
        handleDecline();
      }, 60000); // 60 seconds
    };

    const handleVideoCallEnded = () => {
      console.log('[IncomingCallNotification] Call ended');
      setIncomingCall(null);
      stopRingtone();
      clearAutoTimeout();
    };

    // Listen for Socket.io events via custom events
    // The chat page will dispatch these custom events when it receives socket.io events
    window.addEventListener('video-call-started', handleVideoCallStarted as EventListener);
    window.addEventListener('video-call-ended', handleVideoCallEnded);

    // Also listen for push notification events
    window.addEventListener(
      'push-notification-incoming-call',
      handleVideoCallStarted as EventListener
    );

    return () => {
      window.removeEventListener('video-call-started', handleVideoCallStarted as EventListener);
      window.removeEventListener('video-call-ended', handleVideoCallEnded);
      window.removeEventListener(
        'push-notification-incoming-call',
        handleVideoCallStarted as EventListener
      );
      stopRingtone();
      clearAutoTimeout();
    };
  }, []);

  const stopRingtone = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const clearAutoTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const handleAnswer = () => {
    console.log('[IncomingCallNotification] Call answered');
    stopRingtone();
    clearAutoTimeout();
    setIncomingCall(null);

    // Navigate to chat page with the consultation
    router.push(`/chat/${incomingCall?.consultationId}`);
  };

  const handleDecline = () => {
    console.log('[IncomingCallNotification] Call declined');
    stopRingtone();
    clearAutoTimeout();

    // Emit videoCallEnded event to notify the caller
    if (incomingCall) {
      const event = new CustomEvent('decline-video-call', {
        detail: {
          consultationId: incomingCall.consultationId,
          reason: 'declined',
        },
      });
      window.dispatchEvent(event);
    }

    setIncomingCall(null);
  };

  if (!incomingCall) {
    return (
      <>
        {/* Hidden audio element for ringtone */}
        <audio ref={audioRef} src="/sounds/ringtone.mp3" preload="auto" />
      </>
    );
  }

  return (
    <>
      {/* Hidden audio element for ringtone */}
      <audio ref={audioRef} src="/sounds/ringtone.mp3" preload="auto" />

      {/* Incoming call overlay */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl">
          {/* Caller avatar */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center text-3xl font-bold text-indigo-600 border-4 border-indigo-500">
              {incomingCall.callerName?.charAt(0) || 'P'}
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-center mb-2">
            Incoming Video Call
          </h2>

          {/* Caller name */}
          <p className="text-xl text-center text-gray-700 mb-8">
            {incomingCall.callerName || 'Patient'}
          </p>

          {/* Action buttons */}
          <div className="flex gap-4 justify-center">
            {/* Decline button */}
            <button
              onClick={handleDecline}
              className="flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Decline
            </button>

            {/* Answer button */}
            <button
              onClick={handleAnswer}
              className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-colors animate-pulse"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Answer
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
