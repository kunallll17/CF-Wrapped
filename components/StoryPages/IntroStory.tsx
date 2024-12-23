'use client';

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { UserStats } from "@/lib/types";
import { Trophy } from "lucide-react";

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
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#1a1d24] to-black">
      <div className="max-w-2xl w-full p-8 space-y-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl font-bold text-white mb-4">
            Your 2024 in Code
          </h1>
          <p className="text-xl text-gray-400">
            Let&apos;s explore your competitive programming journey
          </p>
        </motion.div>

        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: isVisible ? 1 : 0, opacity: isVisible ? 1 : 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="flex justify-center"
        >
          <div className="relative w-32 h-32 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-1">
            <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
              <Trophy className="w-16 h-16 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-white mb-2">@{stats.handle}</h2>
          <p className="text-xl text-gray-400">{stats.rating.currentRank}</p>
        </motion.div>
      </div>
    </div>
  );
} 