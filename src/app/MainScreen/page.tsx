"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function MainScreen() {
  const [input, setInput] = useState<string>("");
  const [isFlying, setIsFlying] = useState<boolean>(false);
  const [showImage, setShowImage] = useState<boolean>(false);
  const [contentVisible, setContentVisible] = useState<boolean>(true);
  const [file, setFile] = useState<File | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  //Whisper component
  const SpeechAgent = async () => {
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      const audioChunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });

        // Send the audio Blob to Whisper API
        const formData = new FormData();
        formData.append("file", audioBlob, "audio.webm");
        formData.append("model", "whisper-1");

        try {
          const response = await fetch(
            "https://alric-m8pwns3d-swedencentral.cognitiveservices.azure.com/openai/deployments/whisper/audio/translations?api-version=2024-06-01",
            {
              method: "POST",
              headers: {
                "api-key": "297BZ3Ty0wU6T2e0aCIPtYYSbzWyxL9eYjZBNszhVLUzP7bVlsrGJQQJ99BCACfhMk5XJ3w3AAAAACOG1udE", // Replace with your Azure API key
              },
              body: formData,
            }
          );

          if (!response.ok) {
            const errorDetails = await response.text();
            console.error("Error details:", errorDetails);
            throw new Error("Failed to transcribe audio");
          }

          const data = await response.json();
          setInput(data.text); // Update the input field with the transcribed text
          console.log("Transcription:", data.text);
        } catch (error) {
          console.error("Error transcribing audio:", error);
        }
      };

      mediaRecorder.start();

      // Stop recording after 5 seconds
      setTimeout(() => {
        mediaRecorder.stop();
        stream.getTracks().forEach((track) => track.stop());
      }, 10000); // Adjust the duration as needed
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handlePlanTrip = () => {
    setIsFlying(true);
    setTimeout(() => setShowImage(true), 1000); // Show image after 1 sec
    setTimeout(() => {
      setIsFlying(false);
      setShowImage(false);
      setContentVisible(false);
      document.title = "Results"; // Change the title of the webpage
    }, 2500); // Reset after takeoff
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      console.log("Uploaded file:", uploadedFile);

      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append("image", uploadedFile);

      // Send the file to the backend
      try {
        const response = await fetch("http://localhost:5001/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to upload file");
        }

        const data = await response.json();
        console.log("Uploaded file URL:", data.imageUrl); // Handle the uploaded file URL as needed
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-white text-black px-6 overflow-hidden">
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 bg-black transition-all duration-300 ${
          scrolled ? "shadow-lg" : ""
        } border-b border-white/10`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          <h1 className="text-2xl md:text-3xl text-white font-semibold tracking-wide">
            PlanMyTrip.ai
          </h1>

          <ul className="hidden md:flex space-x-10 text-lg font-light">
            <li>
              <Link href="/" className="text-white hover:text-gray-400 transition">
                Home
              </Link>
            </li>
            <li>
              <Link href="/MainScreen" className="text-white hover:text-gray-400 transition">
                Try it out!
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

          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={28} className="text-white" /> : <Menu size={28} className="text-white" />}
          </button>
        </div>

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
              <Link href="/MainScreen" className="block py-2 text-lg">
                Try it out!
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
      <br></br>
      <br></br>
      <br></br>
      {/* Glassmorphic Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full max-w-lg bg-white rounded-lg p-8 shadow-2xl mx-auto mt-20" // Center the dialog box
      >
        {contentVisible ? (
          <>
            <h2 className="text-3xl font-bold text-center tracking-wide mb-4">
              ✈️ Where to Next?
            </h2>
            <p className="text-gray-700 text-center mt-2 mb-4">
              Discover your next adventure effortlessly.
            </p>

            {/* Textarea for Input Field */}
            <div className="flex flex-col mb-4">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter details about your dream trip..."
                className="bg-gray-100 border border-gray-300 rounded-xl px-4 py-3 text-lg outline-none text-black placeholder-gray-400 h-24 resize-none" // Resize is disabled
              />
            </div>

            {/* Icons Below the Input Field */}
            <div className="flex justify-between items-center mb-4">
              <label className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-200 hover:bg-gray-300 transition cursor-pointer">
                <Image
                  src="/uploadicon.png" // Update with the correct path
                  alt="Upload"
                  width={32}
                  height={32}
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUpload}
                  className="hidden"
                />
              </label>
              <button className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-200 hover:bg-gray-300 transition ml-2">
                <Image
                  src="/speechicon.png" // Update with the correct path
                  alt="Voice"
                  width={32}
                  height={32}
                  onClick={SpeechAgent}
                />
              </button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePlanTrip}
                className="ml-auto w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md hover:bg-blue-700 transition-all"
              >
                <Image
                  src="/sendmessage.png" // Update with the correct path
                  alt="Send Message"
                  width={32}
                  height={32}
                />
              </motion.button>
            </div>

            {/* Image Takeoff Animation */}
            <AnimatePresence>
              {isFlying && showImage && (
                <motion.div
                  initial={{ y: 0 }}
                  animate={{ x: 200, y: -50, opacity: 0, rotate: 15 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  className="absolute left-1/2 bottom-20 transform -translate-x-1/2"
                >
                  <Image
                    src="/sendmessage.png" // Update with the correct path
                    alt="Send Message"
                    width={80}
                    height={80}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Displaying the uploaded file */}
            {file && (
              <div className="mt-4 text-center">
                <p>Uploaded file: {file.name}</p>
              </div>
            )}
          </>
        ) : (
          <h2 className="text-2xl text-center">Loading results...</h2>
        )}
      </motion.div>
    </div>
  );
}
