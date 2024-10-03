// useGlobalStore.js
import { io } from "socket.io-client";
import {create} from "zustand";

const useGlobalStore = create((set) => ({
  socket: null,  // Holds the socket connection
  updateTime: null, // Holds the last update time
  initializeSocket: () => {
    const newSocket = io("http://localhost:6969/");
    set({ socket: newSocket });

    // Clean up socket connection when no longer needed
    return () => {
      newSocket.disconnect();
    };
  },
  setUpdateTime: (time) => set({ updateTime: time }),
}));

export default useGlobalStore;
