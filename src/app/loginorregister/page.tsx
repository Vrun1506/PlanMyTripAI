"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { auth0Config } from "../auth/auth0-config";
import { useRouter } from "next/navigation"; // Import useRouter

const images: string[] = [
  "/image1.jpg", "/image2.jpg", "/image3.jpg", "/image4.jpg", "/image5.jpg", 
  "/image6.jpg", "/image7.jpg", "/image8.jpg", "/image9.jpg", "/image10.jpg", 
  "/image11.jpg", "/image12.jpg", "/image13.jpg", "/image14.jpg", "/image15.jpg", 
  "/image16.jpg", "/image17.jpg", "/image18.jpg", "/image19.jpg", "/image20.jpg"
];

const handleLogin = async (email: string, password: string, router: ReturnType<typeof useRouter>, setError: React.Dispatch<React.SetStateAction<string | null>>) => {
  console.log("Login Function - Email:", email);
  console.log("Login Function - Password:", password);

  try {
    const response = await fetch(`https://planmytripai.uk.auth0.com/oauth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        grant_type: "password",
        username: email,
        password: password,
        client_id: auth0Config.clientId,
        connection: "Username-Password-Authentication",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Login Error Details:", errorData);
      setError("Invalid Email or Password");
      throw new Error("Login failed");
    }

    const data = await response.json();
    console.log("Access Token:", data.access_token);

    // Redirect to MainScreen after successful login
    router.push("/MainScreen");
  } catch (error) {
    console.error("Login Error:", error);
  }
};

const handleRegister = async (email: string, password: string) => {
  try {
    const response = await fetch(`https://planmytripai.uk.auth0.com/dbconnections/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: auth0Config.clientId,
        email,
        password,
        connection: "Username-Password-Authentication",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error Details:", errorData); // Log the error details
      throw new Error("Registration failed");
    }

    const data = await response.json();
    console.log("Registration Successful:", data);
  } catch (error) {
    console.error("Registration Error:", error);
  }
};

const handleGoogleLogin = () => {
  const googleLoginUrl = `https://planmytripai.uk.auth0.com/authorize?response_type=token&client_id=${auth0Config.clientId}&redirect_uri=${auth0Config.redirectUri}&connection=google-oauth2`;
  window.location.href = googleLoginUrl;
};

const handleMicrosoftLogin = () => {
  const microsoftLoginUrl = `https://${auth0Config.domain}/authorize?response_type=token&client_id=${auth0Config.clientId}&redirect_uri=http://localhost:3000/MainScreen&connection=windowslive&state=MainScreen`;
  window.location.href = microsoftLoginUrl;
};

const LoginRegister: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [error, setError] = useState<string | null>(null); // State for error message
  const router = useRouter();

  useEffect(() => {
    document.title = activeTab === "login" ? "Log In" : "Register";

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [activeTab]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLoginSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    setError(null); // Clear any previous error
    handleLogin(email, password, router, setError); // Pass setError to handleLogin
  };

  const handleRegisterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    handleRegister(email, password);
  };

  return (
    <div className="relative w-screen h-screen flex flex-col bg-black text-white">
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 backdrop-blur-lg transition-all duration-300 ${
          scrolled ? "bg-black/70 shadow-lg" : "bg-black/40"
        } border-b border-white/10`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-wide">
            PlanMyTrip.ai
          </h1>

          {/* Desktop Nav */}
          <ul className="hidden md:flex space-x-10 text-lg font-light">
            <li>
              <Link href="/" className="hover:text-gray-400 transition">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-gray-400 transition">
                About
              </Link>
            </li>
            <li>
              <Link
                href="/loginorregister"
                className="bg-white text-black px-6 py-2 rounded-full font-medium hover:bg-gray-300 transition shadow-md hover:shadow-lg"
              >
                Sign Up / Log In
              </Link>
            </li>
          </ul>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden flex flex-col items-center bg-black text-white text-center py-6 space-y-4"
          >
            <li>
              <Link href="/" className="block py-2 text-lg">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="block py-2 text-lg">
                About
              </Link>
            </li>
            <li>
              <Link
                href="/loginorregister"
                className="block py-3 bg-white text-black rounded-full px-6 mx-6 text-lg font-medium shadow-md hover:bg-gray-300 transition"
              >
                Sign Up / Log In
              </Link>
            </li>
          </motion.ul>
        )}
      </nav>

      {/* Background Image */}
      <div className="absolute inset-0">
        <Image 
          src={images[currentImageIndex]} 
          alt="Background" 
          fill 
          className="object-cover brightness-50 transition-opacity duration-500 ease-in-out" 
        />
      </div>

      {/* Auth Container */}
      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl mx-auto mt-24">
        {/* Tabs */}
        <div className="flex space-x-4 justify-center mb-6">
          <button 
            className={`text-lg font-semibold px-4 py-2 transition-all duration-300 ${
              activeTab === "login" ? "text-white border-b-2 border-white" : "text-gray-400"
            }`}
            onClick={() => setActiveTab("login")}
          >
            Log In
          </button>
          <button 
            className={`text-lg font-semibold px-4 py-2 transition-all duration-300 ${
              activeTab === "register" ? "text-white border-b-2 border-white" : "text-gray-400"
            }`}
            onClick={() => setActiveTab("register")}
          >
            Register
          </button>
        </div>

        {/* Form Container with AnimatePresence */}
        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait">
            {activeTab === "login" && (
              <motion.form 
                key="login"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="space-y-5"
                onSubmit={handleLoginSubmit}
              >
                <input 
                  type="email" 
                  name="email"
                  placeholder="Email" 
                  required 
                  className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all duration-300"
                />
                <input 
                  type="password" 
                  name="password"
                  placeholder="Password" 
                  required 
                  className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all duration-300"
                />
                {error && (
                  <div className="text-red-600 text-sm font-bold text-center p-2 rounded-md">
                    {error}
                  </div>
                )}
                <button 
                  type="submit" 
                  className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300"
                >
                  Log In
                </button>
                
                <button
                  type="button"
                  onClick={handleMicrosoftLogin}
                  className="w-full py-3 bg-white text-black font-semibold rounded-lg shadow-md hover:bg-gray-200 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <span>Login with Microsoft</span>
                  <img
                    src="/microsoftwow.png" // Replace with the path to your Microsoft logo
                    alt="Microsoft Logo"
                    className="w-5 h-5"
                  />
                </button>
              </motion.form>
            )}

            {activeTab === "register" && (
              <motion.form 
                key="register"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="space-y-5"
                onSubmit={handleRegisterSubmit}
              >
                <input 
                  type="email" 
                  name="email"
                  placeholder="Email Address" 
                  required 
                  className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all duration-300"
                />
                <input 
                  type="password" 
                  name="password"
                  placeholder="Password" 
                  required 
                  className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all duration-300"
                />
                <input 
                  type="repeat-password" 
                  placeholder="Repeat Password" 
                  required 
                  className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all duration-300"
                />
                <button 
                  type="submit" 
                  className="w-full py-3 bg-white text-black font-semibold rounded-lg shadow-md hover:bg-gray-200 transition-all duration-300"
                >
                  Register
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;
