"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface LoaderProps {
  text?: string;
  theme?: "white" | "dark";
}

const Loader: React.FC<LoaderProps> = ({
  text = "Loading...",
  theme = "white",
}) => {
  const [isVisible, setIsVisible] = useState(true);

  // Automatically fade out after load
  useEffect(() => {
    const timeout = setTimeout(() => setIsVisible(false), 1500);
    return () => clearTimeout(timeout);
  }, []);

  if (!isVisible) return null;

  const bgColor =
    theme === "white" ? "bg-white text-black" : "bg-black text-white";

  return (
    <motion.div
      className={`fixed inset-0 flex flex-col items-center justify-center ${bgColor} z-[9999]`}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin mb-4"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1 }}
      />
      <p className="text-lg font-medium tracking-wide">{text}</p>
    </motion.div>
  );
};

export default Loader;
