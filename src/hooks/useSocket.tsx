import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

export function useSocket(url: string, userId: string, setIsSubmitting: any) {
  const socketRef = useRef<Socket | null>(null);
  const [connectionId, setConnectionId] = useState<string>("");
  const [submissionData, setSubmissionData] = useState<any>(null);
  const [socketReady, setSocketReady] = useState(false);

  useEffect(() => {
    const socket = io(url, { transports: ["websocket"] });
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Connected to socket server", socket.id);
      socket.emit("setUserId", userId);

      // Wait a short delay to ensure Redis mapping updates
      setTimeout(() => {
        socket.emit("getConnectionId", userId);
      }, 300);
    });

    socket.on("connectionId", (data: string) => {
      console.log("🎯 Got connectionId", data);
      setConnectionId(data);
      setSocketReady(true); // ✅ Mark as ready
    });

    socket.on("submissionPayloadResponse", (data: any) => {
      try {
        if (
          data?.response?.status &&
          data?.response?.output &&
          data?.userId === userId
        ) {
          setIsSubmitting(false);
          setSubmissionData({
            status: data.response.status,
            output: data.response.output,
            submissionId: data.submissionId,
          });
        }
      } catch (err) {
        console.error("Error parsing socket data:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("⚠️ Disconnected from socket server");
      setSocketReady(false);
    });

    return () => {
      socket.disconnect();
    };
  }, [url, userId]);

  return {
    socketRef,
    connectionId,
    socketReady,
    submissionData,
    setSubmissionData,
  };
}
