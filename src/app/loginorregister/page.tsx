"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const images: string[] = [
  "/image1.jpg", "/image2.jpg", "/image3.jpg", "/image4.jpg", "/image5.jpg", 
  "/image6.jpg", "/image7.jpg", "/image8.jpg", "/image9.jpg", "/image10.jpg", 
  "/image11.jpg", "/image12.jpg", "/image13.jpg", "/image14.jpg", "/image15.jpg", 
  "/image16.jpg", "/image17.jpg", "/image18.jpg", "/image19.jpg", "/image20.jpg"
];

const LoginRegister: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    document.title = activeTab === "login" ? "Log In" : "Register";

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [activeTab]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
              >
                <input 
                  type="email" 
                  placeholder="Email" 
                  required 
                  className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all duration-300"
                />
                <input 
                  type="password" 
                  placeholder="Password" 
                  required 
                  className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all duration-300"
                />
                <button 
                  type="submit" 
                  className="w-full py-3 bg-white text-black font-semibold rounded-lg shadow-md hover:bg-gray-200 transition-all duration-300"
                >
                  Log In
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
              >
                <input 
                  type="text" 
                  placeholder="First Name" 
                  required 
                  className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all duration-300"
                />
                <input 
                  type="text" 
                  placeholder="Surname" 
                  required 
                  className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all duration-300"
                />
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  required 
                  className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all duration-300"
                />
                <input 
                  type="password" 
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
