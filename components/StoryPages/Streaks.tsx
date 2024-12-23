'use client';

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { UserStats } from "@/lib/types";
import { Flame } from "lucide-react";

interface StreaksProps {
  stats: UserStats;
  onNext: () => void;
}

export default function Streaks({ stats, onNext }: StreaksProps) {
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
          <h1 className="text-4xl font-bold text-white mb-4">Consistency is Key</h1>
          <p className="text-gray-400">Your dedication shows in the numbers</p>
        </motion.div>

        <div className="flex flex-col items-center gap-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: isVisible ? 1 : 0.8, opacity: isVisible ? 1 : 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="relative w-40 h-40 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-full animate-pulse opacity-50" />
              <Flame className="w-20 h-20 text-white" />
            </div>
            <div className="text-center">
              <h2 className="text-6xl font-bold text-white mb-2">{stats.longestStreak}</h2>
              <p className="text-2xl text-gray-400">Day Streak</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="text-center bg-gradient-to-r from-orange-500/20 to-red-500/20 p-6 rounded-xl"
          >
            <h3 className="text-xl text-orange-400 mb-2">Most Active Month</h3>
            <p className="text-3xl font-bold text-white">
              {stats.mostActiveMonth}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}