'use client';

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { UserStats } from "@/lib/types";
import { Sparkles } from "lucide-react";

interface FinalTransitionProps {
  stats: UserStats;
  onNext: () => void;
}

export default function FinalTransition({ stats, onNext }: FinalTransitionProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    // Show transition for 3 seconds then move to final wrap
    const timer = setTimeout(() => {
      onNext();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onNext]);

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#1a1d24] to-black">
      <div className="max-w-2xl w-full p-8 space-y-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.9 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-8"
        >
          <div className="flex justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="relative w-32 h-32"
            >
              <Sparkles className="w-full h-full text-yellow-400" />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-4"
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
              The moment has arrived!
            </h1>
            
            <p className="text-2xl text-gray-400">
              Your 2024 Codeforces Wrapped Awaits...
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
} 