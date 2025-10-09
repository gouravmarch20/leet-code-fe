import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

export function useSocket(url: string, userId: string, setIsSubmitting: any) {
  const socketRef = useRef<Socket | null>(null);
  const [connectionId, setConnectionId] = useState<string>("");
  const [submissionData, setSubmissionData] = useState<any>(null);

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
      setConnectionId(data);
    });

    socket.on("submissionPayloadResponse", (data: any) => {
      try {
        // Validate structure before updating state
        console.log("debug_9", data?.response?.status, data?.userId, userId);
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
        } else {
          console.warn("⚠️ Invalid or unrelated socket data:", data);
        }
      } catch (err) {
        console.error("Error parsing socket data:", err);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [url, userId]);

  return { socketRef, connectionId, submissionData  , setSubmissionData};
}
