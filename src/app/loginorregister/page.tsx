"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import "./loginorregister.css";

const images: string[] = [
  "/image1.jpg", "/image2.jpg", "/image3.jpg", "/image4.jpg", "/image5.jpg", 
  "/image6.jpg", "/image7.jpg", "/image8.jpg", "/image9.jpg", "/image10.jpg", 
  "/image11.jpg", "/image12.jpg", "/image13.jpg", "/image14.jpg", "/image15.jpg", 
  "/image16.jpg", "/image17.jpg", "/image18.jpg", "/image19.jpg", "/image20.jpg"
];

const LoginRegister: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  useEffect(() => {
    document.title = activeTab === "login" ? "Log In" : "Register";

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [activeTab]);

  return (
    <div className="slider-container">
      <div className="background-slider">
        <Image src={images[currentImageIndex]} alt="Background" fill className="object-cover" />
      </div>

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-lg p-10 bg-white/10 backdrop-blur-md rounded-xl shadow-lg">
        {/* Tabs */}
        <div className="flex justify-between mb-6">
          <button 
            className={`w-1/2 text-2xl font-bold py-2 ${activeTab === "login" ? "text-black bg-white" : "text-white"}`}
            onClick={() => setActiveTab("login")}
          >
            Log In
          </button>
          <button 
            className={`w-1/2 text-2xl font-bold py-2 ${activeTab === "register" ? "text-black bg-white" : "text-white"}`}
            onClick={() => setActiveTab("register")}
          >
            Register
          </button>
        </div>

        {/* Login Form */}
        {activeTab === "login" && (
          <form className="flex flex-col space-y-4">
            <input type="email" placeholder="Email" required className="input-field" />
            <input type="password" placeholder="Password" required className="input-field" />
            <button type="submit" className="submit-btn">Log In</button>
          </form>
        )}

        {/* Register Form */}
        {activeTab === "register" && (
          <form className="flex flex-col space-y-4">
            <input type="text" placeholder="First Name" required className="input-field" />
            <input type="text" placeholder="Surname" required className="input-field" />
            <input type="email" placeholder="Email Address" required className="input-field" />
            <input type="password" placeholder="Password" required className="input-field" />
            <div className="captcha-placeholder bg-gray-500 text-white py-3 rounded-md text-center">
              CAPTCHA Here
            </div>
            <button type="submit" className="submit-btn">Register</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginRegister;
