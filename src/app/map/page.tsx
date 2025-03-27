"use client";

import { useChat } from "@/components/ChatContext";
import { useState } from "react";
import dynamic from "next/dynamic";

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

  interface Hotel {
    id: number;
    name: string;
    coords: [number, number];
    image: string;
    description: string;
  }

  const [hotels, setHotels] = useState<Hotel[]>([
    { id: 1, name: "Fattoria Degli Usignoli", coords: [11.5111369, 43.6999034], image: "https://cf.bstatic.com/xdata/images/hotel/square600/264987378.webp?k=3f5d44360f229895d9b7937cc1a6866bb9d271044da0339584479081819d5a60&o=", description: "Fattoria Degli Usignoli is a country resort made up of a 4 stars hotel with restaurant, 2 swimming pools, tennis, mountain bikes, horses, billiard." },
    { id: 2, name: "Casanova ai Tolentini", coords: [12.3183767, 45.4367723], image: "https://cf.bstatic.com/xdata/images/hotel/square600/245809891.webp?k=c88cdd4f2bfb54767acfaac63de4f02cd0b425a32d9fdff19a2f17a9afb89ac2&o=", description: "Well located in the Dorsoduro district of Venice, Casanova ai Tolentini is located 500 metres from Scuola Grande di San Rocco, 700 metres from Venice Santa Lucia Train Station and 1.5 km from Rialto..." },
    { id: 3, name: "Residenza Conte di Cavour & Rooftop", coords: [11.2554059, 43.7773549], image: "https://cf.bstatic.com/xdata/images/hotel/square600/111428400.webp?k=3fac3d38f071b1afeec301b39fca7c2b82a72569414e5787b56fa32df28a2177&o=", description: "Boasting a terrace, Residenza Conte di Cavour & Rooftop is a guest house situated in a historic building in the centre of Florence, close to Palazzo Vecchio." },
    { id: 4, name: "Guest House Relais Indipendenza", coords: [12.5027172, 41.9051009], image: "https://cf.bstatic.com/xdata/images/hotel/square600/655582792.webp?k=3707241306ea215d8983e0d29d8fa0ed4a1cd35db172614c4fb2d2e7041ea902&o=", description: "Just a 5-minute walk from Rome Termini Train Station, Guest House Relais Indipendenza offers classic-style rooms with LCD TV and free WiFi. La Sapienza University is a few steps away." }
  ]);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const onSend = () => {
    if (input.trim()) {
      sendMessage(input.trim());
      setInput("");
    }
  };

  const handleMapPointClick = (index: number) => {
    setSelectedIndex(index);
  };

  return (
    <div className="relative w-screen h-screen">
      <div className="absolute inset-0">
        <Map
          points={hotels.map(hotel => hotel.coords)}
          onClick={handleMapPointClick}
        />
      </div>

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

      <div className="absolute bottom-4 right-4 w-11/12 md:w-72 bg-white p-4 shadow-md rounded-md">
        <h3 className="font-bold mb-2">Selected Hotel</h3>
        {selectedIndex === -1 ? (
          <div className="text-gray-500">No hotel selected</div>
        ) : (
          <div className="p-2 rounded-md">
            <img src={hotels[selectedIndex].image} alt={hotels[selectedIndex].name} className="w-full h-32 object-cover rounded-md mb-2" />
            <div className="font-semibold">{hotels[selectedIndex].name}</div>
            <p className="text-gray-600 text-sm">{hotels[selectedIndex].description}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapPage;
