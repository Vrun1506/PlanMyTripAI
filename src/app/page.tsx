"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import {
  Box,
  Flex,
  Heading,
  Button,
  Text,
  HStack,
  VStack,
  Link as ChakraLink,
  useDisclosure,
  Container,
} from "@chakra-ui/react";

export default function Home() {
  const { isOpen, onToggle } = useDisclosure();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Box minHeight="100vh" display="flex" flexDirection="column" bg="black" color="white">
      {/* Navbar */}
      <Box
        as="nav"
        position="fixed"
        top="0"
        left="0"
        width="100%"
        zIndex="50"
        backdropFilter="blur(16px)"
        transition="all 0.3s"
        bg={scrolled ? "rgba(0, 0, 0, 0.7)" : "rgba(0, 0, 0, 0.4)"}
        boxShadow={scrolled ? "lg" : "none"}
        borderBottom="1px solid"
        borderColor="whiteAlpha.100"
      >
        <Container maxW="7xl" mx="auto">
          <Flex justify="space-between" align="center" px="6" py="4">
            <Heading fontSize={{ base: "2xl", md: "3xl" }} fontWeight="semibold" letterSpacing="wide">
              PlanMyTrip.ai
            </Heading>

            {/* Desktop Nav */}
            <HStack gap="10" fontSize="lg" fontWeight="light" display={{ base: "none", md: "flex" }}>
              <Link href="/" color="white">
                Home
              </Link>
              <Link href="/" color="white">
                About
              </Link>
              <Button
                bg="white"
                color="black"
                px="6"
                py="2"
                borderRadius="full"
                fontWeight="medium"
                _hover={{ bg: "gray.300" }}
                transition="all 0.2s"
                boxShadow="md"
              >
                <Link href="/loginorregister">
                  Sign Up / Log In
                </Link>
              </Button>
            </HStack>

            {/* Mobile Menu Button */}
            <Box display={{ base: "block", md: "none" }}>
              <Button variant="ghost" onClick={onToggle} p="2">
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </Button>
            </Box>
          </Flex>

          {/* Mobile Dropdown */}
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <VStack
                display={{ base: "flex", md: "none" }}
                bg="black"
                color="white"
                textAlign="center"
                py="6"
                gap="4"
              >
                <ChakraLink as={Link} href="/" py="2" fontSize="lg" display="block">
                  Home
                </ChakraLink>
                <ChakraLink as={Link} href="/about" py="2" fontSize="lg" display="block">
                  About
                </ChakraLink>
                <Button
                  as={Link}
                  href="/loginorregister"
                  bg="white"
                  color="black"
                  borderRadius="full"
                  px="6"
                  py="3"
                  mx="6"
                  fontSize="lg"
                  fontWeight="medium"
                  boxShadow="md"
                  _hover={{ bg: "gray.300" }}
                  transition="all 0.2s"
                  display="block"
                >
                  Sign Up / Log In
                </Button>
              </VStack>
            </motion.div>
          )}
        </Container>
      </Box>

      {/* Hero Section */}
      <Box
        as="main"
        position="relative"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        flexGrow="1"
        textAlign="center"
        px="6"
        pt="32"
      >
        {/* Background glow effect */}
        <Box
          position="absolute"
          inset="0"
          bgGradient="linear(to-b, whiteAlpha.50, transparent)"
          filter="blur(96px)"
          opacity="0.3"
        />

        <Flex flexDirection={{ base: "column", md: "row" }} gap={{ base: "4", md: "8" }} alignItems="center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Heading
              fontSize={{ base: "5xl", md: "7xl" }}
              fontWeight="extrabold"
              color="white"
              lineHeight="tight"
              letterSpacing="tight"
            >
              Plan Smart.
            </Heading>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
          >
            <Heading
              fontSize={{ base: "5xl", md: "7xl" }}
              fontWeight="extrabold"
              color="white"
              lineHeight="tight"
              letterSpacing="tight"
            >
              Travel Better.
            </Heading>
          </motion.div>
        </Flex>

        <Button
          as={Link}
          href="/loginorregister"
          mt="60px"
          bg="white"
          color="black"
          px="6"
          py="3"
          borderRadius="full"
          fontSize="lg"
          fontWeight="medium"
          _hover={{ bg: "gray.300", boxShadow: "lg" }}
          transition="all 0.2s"
          boxShadow="md"
        >
          Get Started
        </Button>
      </Box>

      {/* Footer */}
      <Box as="footer" textAlign="center" py="6">
        <Text color="gray.500" fontSize="sm">
          © {new Date().getFullYear()} PlanMyTrip.ai. All rights reserved.
        </Text>
      </Box>
    </Box>
  );
}