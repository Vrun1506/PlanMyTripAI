"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

// Null values represent unknowns
export interface TravelDetails {
    // Dates in YYYY-MM-DD format
    travelDates: {
        startDate: string | null;
        endDate: string | null;
        isFlexible: boolean | null;
    };

    // Budget in dollars
    price: {
        min: number | null;
        max: number | null;
    };

    // A list of cities for the trip
    cities: string[] | null;

    // Average desired star rating
    accommodationStarRating: number | null;

    // Details of people on the trip
    travelers: {
        adults: number | null;
        children: number | null;
    };
    rooms: number | null;
}

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export interface ChatContextType {
    chat: ChatMessage[];
    travelDetails: TravelDetails;
    hotels: any[]; // Adjust type accordingly if you have a specific interface for hotels
    sendMessage: (message: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const blankTravelDetails: TravelDetails = {
    travelDates: {
        startDate: null,
        endDate: null,
        isFlexible: null,
    },
    price: {
        min: null,
        max: null,
    },
    cities: null,
    accommodationStarRating: null,
    travelers: {
        adults: null,
        children: null,
    },
    rooms: null,
};

export function ChatProvider({ children }: { children: ReactNode }) {
    const [chat, setChat] = useState<ChatMessage[]>([]);
    const [travelDetails, setTravelDetails] = useState<TravelDetails>(blankTravelDetails);
    const [hotels, setHotels] = useState<any[]>([]); // Initialize hotels state

    useEffect(() => {
        console.log(travelDetails);
    }, [travelDetails]);

    async function sendMessage(message: string) {
        // Add the user message to the chat
        setChat(chat => [
            ...chat,
            { role: "user", content: message }
        ]);

        const prevCities = travelDetails.cities;

        // Send API call to the server to update travel details and generate a reply.
        try {
            //const response = await axios.post('/api/updateTravelPlan', { message, travelDetails });
            const response = {
                data: {
                    newTravelDetails: {
                        travelDates: {
                            startDate: "2025-12-15",
                            endDate: "2025-12-30",
                            isFlexible: true
                        },
                        price: {
                            min: 1500,
                            max: 2500
                        },
                        cities: ["San Francisco", "Seattle", "Portland"],
                        accommodationStarRating: 4,
                        travelers: {
                            adults: 2,
                            children: 2
                        },
                        rooms: 2
                    },
                    reply: "Fuck you."
                }
            }

            const newTravelDetails = response.data.newTravelDetails;
            setTravelDetails(newTravelDetails);

            // If cities changed, fetch hotels and update state
            if (JSON.stringify(prevCities) !== JSON.stringify(newTravelDetails.cities)) {
                try {
                    const { data } = await axios.post('/api/getHotels', { travelDetails: newTravelDetails });
                    setHotels(data.hotels);
                    console.log("Hotels:", data.hotels);
                } catch (error) {
                    console.error('Error fetching hotels:', error);
                }
            }

            // Add assistant reply to chat
            setChat(chat => [
                ...chat,
                { role: "assistant", content: response.data.reply }
            ]);
        } catch (error) {
            console.error('Error:', error);
            setChat(chat => [
                ...chat,
                { role: "assistant", content: "Sorry, there was an error processing your request." }
            ]);
        }
    }

    return (
        <ChatContext.Provider
            value={{
                chat,
                travelDetails,
                hotels,
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
