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

interface Hotel {
    id: number;
    name: string;
    coords: [number, number];
    image: string;
    description: string;
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

function hasNullValues(obj: any): boolean {
    if (obj === null) return true;
    if (typeof obj !== 'object') return false;

    return Object.values(obj).some(value => {
        if (Array.isArray(value)) return value === null;
        return hasNullValues(value);
    });
}

export function ChatProvider({ children }: { children: ReactNode }) {
    const [chat, setChat] = useState<ChatMessage[]>([]);
    const [travelDetails, setTravelDetails] = useState<TravelDetails>(blankTravelDetails);
    const [hotels, setHotels] = useState<Hotel[]>([]);

    useEffect(() => {
        console.log(travelDetails);
    }, [travelDetails]);

    useEffect(() => {
        console.log(hotels);
    }, [hotels]);

    /*async function sendMessage(message: string) {
        try {
            setTravelDetails({
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
            },);

            setHotels([
                {
                    id: 3088473,
                    name: "Private Unit / Private Bathroom Near BART & SF",
                    coords: [-122.46296, 37.688229],
                    description: "8.6 Fabulous (51 reviews) • 12 km from center • 2.9 km from beach • 2 beds, 1 bedroom, 1 bathroom",
                    image: "https://cf.bstatic.com/xdata/images/hotel/square500/173918065.jpg?k=9eec0e13af2af179b1b2b839cb015d9b228ee19379de155e8bb5b5a3ce100826&o=",
                },
                {
                    id: 240335,
                    name: "Studio 6-Mountlake Terrace, WA - Seattle",
                    coords: [-122.313427, 47.780028],
                    description: "7.1 Good (1013 reviews) • 19 km from center • 2 beds",
                    image: "https://cf.bstatic.com/xdata/images/hotel/square500/302550415.jpg?k=6fea6df9900f5b87c15a78f33519bcbda27389c69367471d0574b843ed1d2833&o=",
                },
                {
                    id: 301794,
                    name: "Sunnyside Inn and Suites",
                    coords: [-122.564127758266, 45.4305765197735],
                    description: "6.5 Pleasant (845 reviews) • 14 km from center • 2 hotel rooms, 2 beds",
                    image: "https://cf.bstatic.com/xdata/images/hotel/square500/365602704.jpg?k=3ec7fed5061228ca28e10c7677ffd9116c27a13742a09bd210e45559e1e2c82e&o=",
                }
            ]);

            setChat(chat => [
                ...chat,
                { role: "user", content: message },
                { role: "assistant", content: "Fuck you" }
            ]);
        } catch (error) {
            console.error('Error:', error);
            setChat(chat => [
                ...chat,
                { role: "assistant", content: "Sorry, there was an error processing your request." }
            ]);
        }
    }*/

    async function sendMessage(message: string) {
        // Add the user message to the chat
        const isFirstMessage = !Boolean(chat.length);
        setChat(chat => [
            ...chat,
            { role: "user", content: message }
        ]);

        // Send API call to the server to update travel details and generate a reply.
        try {
            let response: any;
            let newTravelDetails: TravelDetails;

            if (!isFirstMessage) {
                response = await axios.post('/api/updateTravelPlan', { messages: chat.map(message => message.content), travelDetails });

                newTravelDetails = response.data.newTravelDetails;
                setTravelDetails(newTravelDetails);
            } else {
                response = await axios.post('/api/createTravelPlan', { message, travelDetails });

                newTravelDetails = response.data.newTravelDetails;
                setTravelDetails(newTravelDetails);
            }
            
            // If there aren't missing details, fetch some hotels.
            if (!hasNullValues(newTravelDetails)) {
                try {
                    const { data } = await axios.post('/api/getHotels', { travelDetails: newTravelDetails });
                    setHotels(data.hotels.map((hotel: any) => {
                        return {
                            id: hotel.hotel_id,
                            name: hotel.property.name,
                            coords: [hotel.property.longitude, hotel.property.latitude],
                            description: hotel.accessibilityLabel,
                            image: hotel.property.photoUrls[0],
                        }
                    }));
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
