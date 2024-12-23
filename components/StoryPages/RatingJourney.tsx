'use client';

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { UserStats } from "@/lib/types";
import { TrendingUp, Trophy } from "lucide-react";

interface RatingJourneyProps {
  stats: UserStats;
  onNext: () => void;
}

export default function RatingJourney({ stats, onNext }: RatingJourneyProps) {
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
          <h1 className="text-4xl font-bold text-white mb-4">Rating Journey</h1>
          <p className="text-gray-400">Your competitive achievements</p>
        </motion.div>

        <div className="grid grid-cols-2 gap-6">
          {/* Current Rating Tile */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: isVisible ? 1 : 0.8, opacity: isVisible ? 1 : 0 }}
            whileHover={{ 
              scale: 1.05,
              transition: { duration: 0.2 }
            }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="bg-gradient-to-br from-blue-600/30 to-indigo-600/30 p-6 rounded-xl 
                       hover:from-blue-500/40 hover:to-indigo-500/40 
                       transition-all duration-300 shadow-lg hover:shadow-blue-500/20
                       cursor-pointer transform-gpu"
          >
            <div className="flex flex-col items-center space-y-4">
              <motion.div 
                className="p-3 bg-blue-500/30 rounded-full 
                          shadow-inner shadow-blue-400/20 backdrop-blur-sm"
                whileHover={{ 
                  rotate: 360,
                  transition: { duration: 0.6 }
                }}
              >
                <TrendingUp className="w-8 h-8 text-blue-300" />
              </motion.div>
              <div className="text-center">
                <p className="text-blue-200/80 mb-1 font-medium">Current Rating</p>
                <h2 className={`text-4xl font-bold ${stats.rating.currentColor} drop-shadow-lg`}>
                  {stats.rating.current}
                </h2>
                <p className={`text-sm mt-1 ${stats.rating.currentColor} font-medium`}>
                  {stats.rating.currentRank}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Max Rating Tile */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: isVisible ? 1 : 0.8, opacity: isVisible ? 1 : 0 }}
            whileHover={{ 
              scale: 1.05,
              transition: { duration: 0.2 }
            }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="bg-gradient-to-br from-orange-600/30 to-rose-600/30 p-6 rounded-xl 
                       hover:from-orange-500/40 hover:to-rose-500/40 
                       transition-all duration-300 shadow-lg hover:shadow-orange-500/20
                       cursor-pointer transform-gpu"
          >
            <div className="flex flex-col items-center space-y-4">
              <motion.div 
                className="p-3 bg-orange-500/30 rounded-full 
                          shadow-inner shadow-orange-400/20 backdrop-blur-sm"
                whileHover={{ 
                  rotate: 360,
                  transition: { duration: 0.6 }
                }}
              >
                <Trophy className="w-8 h-8 text-orange-300" />
              </motion.div>
              <div className="text-center">
                <p className="text-orange-200/80 mb-1 font-medium">Max Rating</p>
                <h2 className={`text-4xl font-bold ${stats.rating.maxColor} drop-shadow-lg`}>
                  {stats.rating.maxRating}
                </h2>
                <p className={`text-sm mt-1 ${stats.rating.maxColor} font-medium`}>
                  {stats.rating.maxRank}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
