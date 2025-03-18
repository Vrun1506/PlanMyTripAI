"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';

// Null values represent unknowns
export interface TravelDetails {
    travelDates: {
        startDate: string | null;
        endDate: string | null;
        isFlexible: boolean | null;
    };

    budget: number | null;
    interests: string[] | null;

    specialRequirements: string[] | null;
    preferredLanguage: string | null;
    transportation: ("train" | "flight" | "car" | "bus" | "cruise")[] | null;

    accommodationStarRating: number | null;
    accommodation: {
        location: string | null;
        type: "hotel" | "hostel" | "airbnb" | "bnb" | "resort" | null;
    }[];

    travelers: {
        adults: number | null;
        children: number | null;
        pets: number | null;
    };
}

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export interface ChatContextType {
    chat: ChatMessage[];
    travelDetails: TravelDetails;
    sendMessage: (message: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const blankTravelDetails = {
    travelDates: {
        startDate: null,
        endDate: null,
        isFlexible: null,
    },
    budget: null,
    interests: null,
    specialRequirements: null,
    preferredLanguage: null,
    transportation: null,
    accommodationStarRating: null,
    accommodation: [],
    travelers: {
        adults: null,
        children: null,
        pets: null,
    },
};

export function ChatProvider({ children }: { children: ReactNode }) {
    const [chat, setChat] = useState<ChatMessage[]>([]);
    const [travelDetails, setTravelDetails] = useState<TravelDetails>(blankTravelDetails);

    function sendMessage(message: string) {
        // Add to chat messages
        setChat(chat => [...chat, { role: "user", content: message }]);

        // Send api call to server to update travelDetails then send a response in the chat
        axios.post('/api/updateTravelPlan', { message, travelDetails })
            .then(response => {
                setTravelDetails(response.data.newTravelDetails);
                setChat(chat => [...chat, { role: "assistant", content: response.data.reply }]);
            })
            .catch(error => {
                console.error('Error:', error);
                setChat(chat => [...chat, { role: "assistant", content: "Sorry, there was an error processing your request." }]);
            });
    }

    return (
        <ChatContext.Provider
            value={{
                chat,
                travelDetails,
                sendMessage
            }}
        >
            {children}
        </ChatContext.Provider>
    );
}

export function useChat() {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
}

