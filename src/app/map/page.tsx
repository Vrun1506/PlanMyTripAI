"use client";

import { useChat } from "@/components/ChatContext";
import { useState } from "react";
import dynamic from "next/dynamic";

// Create a wrapper component with disabled SSR
const Map = dynamic(() => import("@/components/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center h-screen gap-2">
      <span className="text-xl">Loading map...</span>
      <div className="animate-spin h-6 w-6 border-4 border-gray-300 border-t-blue-500 rounded-full"></div>
    </div>
  ),
});

export const MapPage: React.FC = () => {
  const { chat, sendMessage } = useChat();
  const [input, setInput] = useState("");

  const onSend = () => {
    if (input.trim()) {
      sendMessage(input.trim());
      setInput("");
    }
  };

  return (
    <div className="relative w-screen h-screen">
      {/* Full-screen Map component */}
      <div className="absolute inset-0">
        <Map points={[[-50, 47.6], [-74.006, 40.7128], [139.6917, 35.6895], [2.3522, 48.8566]]} />
      </div>

      {/* Chat Box */}
      <div className="absolute top-4 right-4 w-11/12 md:w-72 bg-white p-4 shadow-md rounded-md">
        <div className="flex flex-col gap-2 max-h-72 overflow-y-auto">
          {chat.map((msg, index) => (
            <div
              key={index}
              className={`p-2 rounded-md max-w-xs ${msg.role === "user" ? "bg-blue-200 self-end ml-8" : "bg-gray-200 self-start mr-8"}`}
            >
              {msg.content}
            </div>
          ))}
        </div>
        <div className="flex mt-2">
          <input
            className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
          />
          <button
            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            onClick={onSend}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
