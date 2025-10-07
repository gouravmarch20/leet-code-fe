import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

export function useSocket(url: string, userId: string) {
  const socketRef = useRef<Socket | null>(null);
  const [connectionId, setConnectionId] = useState<string>("");
  const [submissionData, setSubmissionData] = useState<any>(null);
  console.log("socike", url);
  useEffect(() => {
    const socket = io(url);
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Connected to socket server", socket.id);
      socket.emit("setUserId", userId);
      socket.emit("getConnectionId", userId);
    });

    socket.on("disconnect", () => {
      console.log("⚠️ Disconnected from socket server");
    });

    socket.on("connectionId", (data: string) => {
      console.log("Connection Id received:", data);
      setConnectionId(data);
    });

    socket.on("submissionPayloadResponse", (data: any) => {
      console.log("Submission payload received:", data);
      setSubmissionData(data);
    });

    return () => {
      socket.disconnect();
    };
  }, [url, userId]);

  return { socketRef, connectionId, submissionData };
}
