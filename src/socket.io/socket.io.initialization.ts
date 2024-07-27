// socket.io/socket.io.initialization.ts
// This script enhances the initialization of Socket.IO to handle reconnection issues effectively.
// It ensures that the socket is connected before sending messages by managing reconnections and exposing the connection state.

"use client";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

const useSocket = (url: string) => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [attemptingReconnection, setAttemptingReconnection] = useState(false);

  useEffect(() => {
    const initializeSocket = () => {
      socketRef.current = io(url, {
        reconnectionAttempts: 5, // Maximum number of reconnection attempts
        reconnectionDelay: 1000, // Delay between reconnection attempts in milliseconds
      });

      socketRef.current.on("connect", () => {
        setIsConnected(true);
        setAttemptingReconnection(false);
        console.log("Socket connected:", socketRef.current?.id);
      });

      socketRef.current.on("disconnect", () => {
        setIsConnected(false);
        console.log("Socket disconnected");
      });

      socketRef.current.on("reconnect_attempt", (attempt) => {
        setAttemptingReconnection(true);
        console.log(`Reconnection attempt ${attempt}`);
      });

      socketRef.current.on("reconnect_failed", () => {
        setAttemptingReconnection(false);
        console.log("Reconnection failed");
      });
    };

    initializeSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [url]);

  // Function to emit events, only if the socket is connected
  const emitEvent = (event: string, data: any) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit(event, data);
    } else {
      console.warn("Socket is not connected. Cannot send message.");
    }
  };

  return {
    socket: socketRef.current,
    isConnected,
    attemptingReconnection,
    emitEvent,
  };
};

export default useSocket;
