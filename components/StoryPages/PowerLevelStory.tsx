'use client';

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { UserStats } from "@/lib/types";
import { Zap } from "lucide-react";

interface PowerLevelStoryProps {
  stats: UserStats;
  onNext: () => void;
}

export default function PowerLevelStory({ stats, onNext }: PowerLevelStoryProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#1a1d24] to-black">
      <div className="max-w-2xl w-full p-8 space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-white mb-4">Your Power Level</h1>
          <p className="text-gray-400">Based on your incredible achievements</p>
        </motion.div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: isVisible ? 1 : 0.8, opacity: isVisible ? 1 : 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="space-y-8 text-center"
        >
          <div className="flex justify-center">
            <div className="relative w-40 h-40 rounded-full bg-gradient-to-r from-yellow-500 to-red-500 p-1 animate-pulse">
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                <Zap className="w-20 h-20 text-white" />
              </div>
            </div>
          </div>

          <div>
            <h2 className={`text-5xl font-bold ${stats.powerClass.color} mb-4`}>
              {stats.powerClass.title}
            </h2>
            <p className="text-xl text-gray-400">{stats.powerClass.description}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 