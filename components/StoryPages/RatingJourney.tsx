'use client';

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { UserStats } from "@/lib/types";
import { TrendingUp, Trophy, Star } from "lucide-react";

interface RatingJourneyProps {
  stats: UserStats;
  onNext: () => void;
}

export default function RatingJourney({ stats, onNext }: RatingJourneyProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedCurrent, setAnimatedCurrent] = useState(0);
  const [animatedMax, setAnimatedMax] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    
    // Animate numbers
    const currentTarget = stats.rating?.current || 0;
    const maxTarget = stats.rating?.maxRating || 0;
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;
    
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      setAnimatedCurrent(Math.round(currentTarget * easeOut));
      setAnimatedMax(Math.round(maxTarget * easeOut));
      
      if (step >= steps) clearInterval(timer);
    }, stepDuration);
    
    return () => clearInterval(timer);
  }, [stats.rating?.current, stats.rating?.maxRating]);

  return (
    <div className="story-bg flex items-center justify-center">
      <div className="relative z-10 max-w-2xl w-full px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-blue-300">Rating Journey</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Your Competitive<br />
            <span className="gradient-text">Achievements</span>
          </h1>
        </motion.div>

        {/* Rating Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Current Rating */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, x: -50 }}
            animate={{ scale: isVisible ? 1 : 0.8, opacity: isVisible ? 1 : 0, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 
                       border border-blue-500/20 p-8 group hover:border-blue-500/40 transition-colors duration-300"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative flex flex-col items-center space-y-4">
              <motion.div 
                className="p-4 bg-blue-500/20 rounded-2xl"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <TrendingUp className="w-10 h-10 text-blue-400" />
              </motion.div>
              
              <div className="text-center">
                <p className="text-blue-300/80 text-sm font-medium mb-2">Current Rating</p>
                <motion.h2 
                  className={`text-5xl font-bold ${stats.rating?.currentColor || 'text-white'}`}
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                >
                  {animatedCurrent || 'Unrated'}
                </motion.h2>
                <p className={`text-lg mt-2 font-medium ${stats.rating?.currentColor || 'text-zinc-400'}`}>
                  {stats.rating?.currentRank || 'Unrated'}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Max Rating */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, x: 50 }}
            animate={{ scale: isVisible ? 1 : 0.8, opacity: isVisible ? 1 : 0, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500/20 to-rose-500/20 
                       border border-orange-500/20 p-8 group hover:border-orange-500/40 transition-colors duration-300"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative flex flex-col items-center space-y-4">
              <motion.div 
                className="p-4 bg-orange-500/20 rounded-2xl"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <Trophy className="w-10 h-10 text-orange-400" />
              </motion.div>
              
              <div className="text-center">
                <p className="text-orange-300/80 text-sm font-medium mb-2">Peak Rating</p>
                <motion.h2 
                  className={`text-5xl font-bold ${stats.rating?.maxColor || 'text-white'}`}
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.7, type: "spring" }}
                >
                  {animatedMax || 'Unrated'}
                </motion.h2>
                <p className={`text-lg mt-2 font-medium ${stats.rating?.maxColor || 'text-zinc-400'}`}>
                  {stats.rating?.maxRank || 'Unrated'}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Universal Rank */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-8 text-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/20">
            <Star className="w-6 h-6 text-yellow-400" />
            <div className="text-left">
              <p className="text-yellow-300/80 text-sm">Universal Rank</p>
              <p className="text-2xl font-bold text-yellow-400">Top {stats.universalRank}%</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
