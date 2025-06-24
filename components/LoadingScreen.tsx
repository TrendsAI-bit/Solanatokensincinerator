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
      
      {/* Main loading content */}
      <div className="relative z-10 text-center">
        {/* New Loader Animation */}
        <motion.div
          className="mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="flex justify-center mb-4">
            <Loader />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-3xl font-bold text-star-white mb-2 font-orbitron"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Stellar Incinerator
        </motion.h1>

        <motion.p
          className="text-cosmic-cyan mb-8 text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Initializing cosmic systems...
        </motion.p>

        {/* Progress bar */}
        <div className="w-64 mx-auto mb-4">
          <div className="h-1 bg-cosmic-blue/40 rounded-full overflow-hidden backdrop-blur-sm border border-stellar-purple/20">
            <motion.div
              className="h-full bg-gradient-to-r from-stellar-purple via-cosmic-cyan to-meteor-orange"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>
          
          {/* Progress percentage */}
          <motion.div
            className="text-center mt-2 text-sm text-cosmic-cyan font-mono"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {progress}%
          </motion.div>
        </div>

        {/* Loading states text */}
        <motion.div
          className="text-sm text-stellar-purple/80 mt-4"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {progress < 30 && "Connecting to Solana network..."}
          {progress >= 30 && progress < 60 && "Loading wallet adapters..."}
          {progress >= 60 && progress < 90 && "Preparing token interfaces..."}
          {progress >= 90 && "Almost ready for launch..."}
        </motion.div>
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