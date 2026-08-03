"use client";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const useSocket = (url: string, token: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [attemptingReconnection, setAttemptingReconnection] = useState(false);

  useEffect(() => {
    if (!url || !token) {
      setSocket(null);
      setIsConnected(false);
      return;
    }

    const socketInstance = io(url, {
      path: "/socket.io/",
      transports: ["polling", "websocket"],
      auth: { token },
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    const handleConnect = () => {
      setIsConnected(true);
      setAttemptingReconnection(false);
      console.log("Socket connected:", socketInstance.id);
    };
    const handleDisconnect = () => {
      setIsConnected(false);
      console.log("Socket disconnected");
    };
    const handleReconnectAttempt = (attempt: number) => {
      setAttemptingReconnection(true);
      console.log(`Reconnection attempt ${attempt}`);
    };
    const handleReconnectFailed = () => {
      setAttemptingReconnection(false);
      console.log("Reconnection failed");
    };

    socketInstance.on("connect", handleConnect);
    socketInstance.on("disconnect", handleDisconnect);
    socketInstance.io.on("reconnect_attempt", handleReconnectAttempt);
    socketInstance.io.on("reconnect_failed", handleReconnectFailed);
    setSocket(socketInstance);

    return () => {
      socketInstance.off("connect", handleConnect);
      socketInstance.off("disconnect", handleDisconnect);
      socketInstance.io.off("reconnect_attempt", handleReconnectAttempt);
      socketInstance.io.off("reconnect_failed", handleReconnectFailed);
      socketInstance.disconnect();
      setSocket(null);
    };
  }, [url, token]);

  // Function to emit events, only if the socket is connected
  const emitEvent = (event: string, data: any) => {
    if (socket && isConnected) {
      socket.emit(event, data);
    } else {
      console.warn("Socket is not connected. Cannot send message.");
    }
  };

  return {
    socket,
    isConnected,
    attemptingReconnection,
    emitEvent,
  };
};

export default useSocket;
