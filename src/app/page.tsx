'use client';

import { Button, Container, Heading, Input, VStack } from '@chakra-ui/react';

export default function Home() {
  return (
    <Container maxW="container.md" centerContent className="h-screen flex items-center justify-center">
      <VStack spacing={6} textAlign="center">
        <Heading as="h1" className="font-bold" size="2xl">
          Plan Your Next Dream Trip
        </Heading>
        <Input placeholder="Describe your dream holiday" variant="outline" width="60%" />
      </VStack>
    </Container>
  );
}