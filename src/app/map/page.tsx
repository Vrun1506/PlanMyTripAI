'use client';

import { useState } from 'react';
import { Box, Textarea, Button, Text, Spinner, VStack, Heading, useToast } from '@chakra-ui/react';

export default function Home() {
  const [inputText, setInputText] = useState('');
  const [responseText, setResponseText] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/temp_openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: inputText }),
      });

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error.message);
      }
      setResponseText(data.choices[0].text);
    } catch (error: any) {
      console.error('Error generating response:', error);
      setResponseText('Error generating response.');
      toast({
        title: 'Error',
        description: error.message || 'Something went wrong!',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
    setLoading(false);
  };

  return (
    <Box maxW="lg" mx="auto" p={5}>
      <VStack spacing={4} align="stretch">
        <Heading as="h1" size="xl" textAlign="center">
          Azure OpenAI with Next.js
        </Heading>

        <Textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter your prompt here"
          size="md"
          minHeight="150px"
          borderColor="gray.300"
        />

        <Button
          onClick={handleGenerate}
          colorScheme="blue"
          isLoading={loading}
          loadingText="Generating..."
          size="lg"
        >
          Generate Response
        </Button>

        {loading && (
          <Box display="flex" justifyContent="center" mt={4}>
            <Spinner size="lg" />
          </Box>
        )}

        <Box mt={4}>
          <Heading as="h3" size="md">
            Response:
          </Heading>
          <Text
            mt={2}
            p={4}
            borderRadius="md"
            borderWidth="1px"
            borderColor="gray.300"
            backgroundColor="gray.50"
            whiteSpace="pre-wrap"
          >
            {responseText}
          </Text>
        </Box>
      </VStack>
    </Box>
  );
}