'use client';

import { Box, Button, Container, Heading, HStack, Icon, Input, InputGroup, Textarea, VStack } from '@chakra-ui/react';
import { CirclePlus, Group, Mic } from 'lucide-react';

export default function Home() {
  return (
    <Container maxW="container.md" centerContent className="h-screen flex items-center justify-center">
      <VStack gap={6} textAlign="center">
        <Heading as="h1" className="font-bold" size="6xl">
          Plan Your Next Dream Trip
        </Heading>
        <InputGroup endElement={
          <HStack gap={3} alignItems="start" height="100%" pt={3} pb={3}>
            <Icon boxSize="32px">
              <Mic />
            </Icon>
            <Icon boxSize="32px">
              <CirclePlus />
            </Icon>
          </HStack>
        }>
          <Textarea
            height="initial"
            size="lg"
            autoresize
            minH="3lh"
            maxH="10lh"
            placeholder="Describe your dream holiday..."
            variant="outline"
            resize="none"
          />
        </InputGroup>
      </VStack>
    </Container>
  );
}