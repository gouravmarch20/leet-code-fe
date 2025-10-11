import { useEffect } from "react";
import { useSocket } from "./hooks/useSocket";

const Test = () => {
  const USER_ID = "DETRA_1";
  const { socketReady,  } = useSocket(
    import.meta.env.VITE_SOCKET_SERVICE,
    USER_ID,
    () => {}
  );

  useEffect(() => {
    if (socketReady) {
      console.log("🚀 Socket is ready — safe to send requests");
      // Now safe to call /sendPayload
    }
  }, [socketReady]);

  return <div>Test - Socket ready: {socketReady ? "✅" : "❌"}</div>;
};

export default Test;
