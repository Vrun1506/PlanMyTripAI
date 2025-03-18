"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-black text-white font-sans">
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

      {/* Hero Section */}
      <main className="relative flex flex-col items-center justify-center flex-grow text-center px-6 pt-32">
        {/* Background glow effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent blur-3xl opacity-30" />

        <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-extrabold text-white leading-tight tracking-tight"
          >
            Plan Smart.
          </motion.h1>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="text-5xl md:text-7xl font-extrabold text-white leading-tight tracking-tight"
          >
            Travel Better.
          </motion.h1>
        </div>

        <Link
          href="/loginorregister"
          className="mt-30 bg-white text-black px-6 py-3 rounded-full text-lg font-medium hover:bg-gray-300 transition duration-200 shadow-md hover:shadow-lg"
        >
          Get Started
        </Link>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-500 text-sm">
        © {new Date().getFullYear()} PlanMyTrip.ai. All rights reserved.
      </footer>
    </div>
  );
}