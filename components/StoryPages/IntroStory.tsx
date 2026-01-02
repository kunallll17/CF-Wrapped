'use client';

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { UserStats } from "@/lib/types";
import { Sparkles } from "lucide-react";
import Image from "next/image";

interface IntroStoryProps {
  stats: UserStats;
  onNext: () => void;
}

export default function IntroStory({ stats, onNext }: IntroStoryProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="story-bg flex items-center justify-center">
      <div className="relative z-10 max-w-2xl w-full px-8 text-center">
        {/* Decorative elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 pointer-events-none"
        >
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-purple-400 rounded-full"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: 2,
                delay: i * 0.1,
                repeat: Infinity,
                repeatDelay: 3
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </motion.div>

        {/* Year badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8"
        >
          <Sparkles className="w-4 h-4 text-yellow-400" />
          <span className="text-sm text-white/80">Year in Review</span>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12"
        >
          <h1 className="text-6xl md:text-7xl font-bold mb-4">
            <span className="text-white">Your</span>
            <br />
            <span className="gradient-text">2025 in Code</span>
          </h1>
          <p className="text-xl text-zinc-400">
            Let's explore your competitive programming journey
          </p>
        </motion.div>

        {/* Profile section */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: isVisible ? 1 : 0, opacity: isVisible ? 1 : 0 }}
          transition={{ delay: 0.6, duration: 0.8, type: "spring" }}
          className="flex flex-col items-center"
        >
          {/* Avatar with glow */}
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-50 animate-pulse" />
            <div className="relative w-32 h-32 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-1">
              <div className="w-full h-full rounded-full overflow-hidden bg-[#0a0a0f]">
                {stats.profilePicture ? (
                  <Image
                    src={stats.profilePicture}
                    alt={stats.handle}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-white bg-gradient-to-br from-purple-600 to-pink-600">
                    {stats.handle.substring(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Handle and rank */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-white mb-2">@{stats.handle}</h2>
            <p className={`text-lg font-medium ${stats.rating?.currentColor || 'text-zinc-400'}`}>
              {stats.rating?.currentRank || 'Codeforces User'}
            </p>
          </motion.div>
        </motion.div>

        {/* Hint text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-sm text-zinc-500"
        >
          Tap to continue or use arrow keys
        </motion.p>
      </div>
    </div>
  );
}
