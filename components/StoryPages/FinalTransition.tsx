'use client';

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { UserStats } from "@/lib/types";
import { Sparkles, ArrowRight } from "lucide-react";

interface FinalTransitionProps {
  stats: UserStats;
  onNext: () => void;
}

export default function FinalTransition({ stats, onNext }: FinalTransitionProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    // Auto-advance after 4 seconds
    const timer = setTimeout(() => {
      onNext();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onNext]);

  return (
    <div className="story-bg flex items-center justify-center">
      <div className="relative z-10 max-w-2xl w-full px-8 text-center">
        {/* Animated sparkles background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-yellow-400 rounded-full"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                y: [0, -100],
              }}
              transition={{
                duration: 2,
                delay: i * 0.1,
                repeat: Infinity,
                repeatDelay: 1
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${50 + Math.random() * 50}%`,
              }}
            />
          ))}
        </div>

        {/* Rotating sparkle icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", duration: 1 }}
          className="relative inline-block mb-12"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-2xl opacity-50" />
            <Sparkles className="w-24 h-24 text-yellow-400 relative z-10" />
          </motion.div>
        </motion.div>

        {/* Text content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="space-y-6"
        >
          <h1 className="text-5xl md:text-6xl font-bold">
            <span className="gradient-text">The moment</span>
            <br />
            <span className="text-white">has arrived!</span>
          </h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="text-2xl text-zinc-400"
          >
            Your 2025 Codeforces Wrapped Awaits...
          </motion.p>
        </motion.div>

        {/* Loading indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-12 flex justify-center"
        >
          <motion.div
            animate={{ x: [0, 10, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="flex items-center gap-2 text-zinc-500"
          >
            <span>Loading your summary</span>
            <ArrowRight className="w-4 h-4" />
          </motion.div>
        </motion.div>

        {/* Progress dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="mt-8 flex justify-center gap-2"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-purple-500"
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1,
                delay: i * 0.2,
                repeat: Infinity,
              }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
