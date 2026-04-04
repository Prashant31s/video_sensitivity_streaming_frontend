import { useEffect, useEffectEvent, useState } from "react";
import { io } from "socket.io-client";
import { api } from "../lib/api.js";

export function useSocket(token, onVideoEvent) {
  const [connected, setConnected] = useState(false);
  const handleVideoEvent = useEffectEvent(onVideoEvent);

  useEffect(() => {
    if (!token) {
      setConnected(false);
      return undefined;
    }

    const socket = io(api.apiUrl, {
      auth: { token }
    });

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));
    socket.on("video:progress", handleVideoEvent);
    socket.on("video:completed", handleVideoEvent);

    return () => {
      socket.disconnect();
      setConnected(false);
    };
  }, [token]);

  return connected;
}
