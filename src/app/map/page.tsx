"use client";

import { useChat } from "@/components/ChatContext";
import { Box, Input, Button, VStack, Text } from "@chakra-ui/react";
import { useState } from "react";

import {AzureMap, AzureMapsProvider, IAzureMapOptions} from 'react-azure-maps'
import {AuthenticationType} from 'azure-maps-control'

// const option: IAzureMapOptions = {
//     authOptions: {
//         authType: AuthenticationType.subscriptionKey,
//         subscriptionKey: process.env.AZURE_MAPS_KEY!
//     },
// }

// const DefaultMap: React.FC = () => (
//     <div style={{height: '300px'}}>
//         <AzureMapsProvider>
//             <AzureMap options={option}>
//             </AzureMap>
//         </AzureMapsProvider>
//     </div>
// )

export const MapPage: React.FC = () => {
  const { chat, travelDetails, sendMessage } = useChat();

  const [input, setInput] = useState("");

  const onSend = () => {
    if (input.trim()) {
      sendMessage(input.trim());
      setInput("");
    }
  };

  return (
    <Box position="relative" w="100vw" h="100vh">
      {/* Full-screen Map component */}
      <Box position="absolute" top={0} left={0} w="100%" h="100%">
        <div style={{width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
          <div style={{width: "fit-content"}}>
            <pre>{JSON.stringify(travelDetails, null, 2)}</pre>
          </div>
        </div>
      </Box>

      {/* Chat Box */}
      <Box
        position="absolute"
        top={4}
        right={4}
        w={{ base: "90%", md: "300px" }}
        bg="white"
        p={4}
        boxShadow="md"
        borderRadius="md"
      >
        <VStack gap={2} maxH="300px" overflowY="auto">
          {chat.map((msg, index) => (
            msg.role === "user" ? (
              <Text key={index} bg="blue.200" alignSelf="flex-end" p={2} marginLeft={8} borderRadius="md">
                {msg.content}
              </Text>
            ) : (
              <Text key={index} bg="gray.200" alignSelf="flex-start" p={2} marginRight={8} borderRadius="md">
                {msg.content}
              </Text>
            )
          ))}
        </VStack>
        <Box display="flex" mt={2}>
          <Input
            flex={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
          />
          <Button ml={2} onClick={onSend} colorScheme="blue">
            Send
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default MapPage;