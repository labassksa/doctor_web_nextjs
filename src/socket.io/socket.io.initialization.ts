"use client";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

const useSocket = (url: string, token: string) => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [attemptingReconnection, setAttemptingReconnection] = useState(false);

  useEffect(() => {
    const initializeSocket = () => {
      socketRef.current = io(url, {
        path: "/socket.io/", // Match the backend's WebSocket path
        transports: ["websocket"], // Explicitly specify WebSocket transport
        auth: {
          token, // Pass the JWT token during the WebSocket handshake
        },
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
  }, [url, token]); // Add token as a dependency to ensure the socket is reinitialized if the token changes

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
