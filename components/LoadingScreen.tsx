"use client";

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Loader from './Loader';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

export default function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onLoadingComplete, 500); // Small delay before hiding
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(timer);
  }, [onLoadingComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-cosmic-blue flex items-center justify-center"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Animated space background */}
      <div className="fixed inset-0 bg-space-nebula animate-cosmic-drift opacity-60" />
      <div className="fixed inset-0 starfield-bg opacity-40" />
      
      {/* Main Loading Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Logo Container */}
        <div className="relative mb-6 md:mb-8">
          <Loader />
        </div>
        
        {/* App Title */}
        <h1 className="text-2xl md:text-4xl font-bold text-center mb-3 md:mb-4 bg-gradient-to-r from-stellar-purple via-cosmic-cyan to-meteor-orange bg-clip-text text-transparent animate-stellar-pulse">
          STELLAR INCINERATOR
        </h1>
        
        {/* Loading Text */}
        <div className="text-sm md:text-lg text-cosmic-cyan mb-6 md:mb-8 text-center animate-pulse">
          {progress < 30 && "Initializing cosmic systems..."}
          {progress >= 30 && progress < 60 && "Connecting to stellar network..."}
          {progress >= 60 && progress < 90 && "Preparing incineration protocols..."}
          {progress >= 90 && "Launch sequence initiated..."}
        </div>
        
        {/* Progress Bar */}
        <div className="w-full max-w-xs md:max-w-md mb-4 md:mb-6">
          <div className="flex justify-between text-xs md:text-sm text-gray-400 mb-2">
            <span>Loading</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-cosmic-blue/30 rounded-full h-1.5 md:h-2">
            <motion.div
              className="h-1.5 md:h-2 rounded-full bg-gradient-to-r from-stellar-purple via-cosmic-cyan to-meteor-orange"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      {/* Corner decorations */}
      <motion.div
        className="absolute top-10 left-10 w-8 h-8 border-l-2 border-t-2 border-stellar-purple/30"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 1 }}
      />
      <motion.div
        className="absolute top-10 right-10 w-8 h-8 border-r-2 border-t-2 border-cosmic-cyan/30"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
      />
      <motion.div
        className="absolute bottom-10 left-10 w-8 h-8 border-l-2 border-b-2 border-cosmic-cyan/30"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 1.4 }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-8 h-8 border-r-2 border-b-2 border-stellar-purple/30"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 1.6 }}
      />
    </motion.div>
  );
} 