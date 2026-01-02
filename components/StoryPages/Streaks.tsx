'use client';

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { UserStats } from "@/lib/types";
import { Flame, Calendar, CalendarDays } from "lucide-react";

interface StreaksProps {
  stats: UserStats;
  onNext: () => void;
}

export default function Streaks({ stats, onNext }: StreaksProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedStreak, setAnimatedStreak] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    
    // Animate streak number
    const target = stats.longestStreak || 0;
    const duration = 1500;
    const steps = 40;
    const stepDuration = duration / steps;
    
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setAnimatedStreak(Math.round(target * easeOut));
      
      if (step >= steps) clearInterval(timer);
    }, stepDuration);
    
    return () => clearInterval(timer);
  }, [stats.longestStreak]);

  // Generate flame particles
  const flameParticles = [...Array(12)].map((_, i) => ({
    delay: i * 0.1,
    x: (Math.random() - 0.5) * 100,
    duration: 1 + Math.random() * 0.5
  }));

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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 mb-6">
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="text-sm text-orange-300">Consistency Stats</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Your Coding<br />
            <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">Streaks</span>
          </h1>
        </motion.div>

        {/* Main Streak Display */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: isVisible ? 1 : 0.8, opacity: isVisible ? 1 : 0 }}
          transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
          className="relative flex justify-center mb-12"
        >
          {/* Flame particles animation */}
          <div className="absolute inset-0 flex justify-center">
            {flameParticles.map((particle, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-orange-500"
                initial={{ opacity: 0, y: 0 }}
                animate={{ 
                  opacity: [0, 1, 0],
                  y: [-20, -80],
                  x: particle.x,
                  scale: [0, 1, 0]
                }}
                transition={{
                  duration: particle.duration,
                  delay: particle.delay,
                  repeat: Infinity,
                  repeatDelay: 0.5
                }}
                style={{ bottom: '20%' }}
              />
            ))}
          </div>

          <div className="relative">
            {/* Glow behind */}
            <div className="absolute inset-0 bg-gradient-to-t from-orange-500/30 to-red-500/30 rounded-full blur-3xl scale-150" />
            
            {/* Main flame icon */}
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative"
            >
              <Flame className="w-32 h-32 text-orange-500 drop-shadow-[0_0_30px_rgba(249,115,22,0.5)]" />
            </motion.div>
          </div>
        </motion.div>

        {/* Streak number */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="text-7xl md:text-8xl font-bold text-white mb-2">
            {animatedStreak}
          </div>
          <p className="text-xl text-orange-300">Day Streak</p>
          <p className="text-zinc-500 mt-2">Your longest coding streak</p>
        </motion.div>

        {/* Activity Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="grid grid-cols-2 gap-4"
        >
          {/* Most Active Month */}
          <div className="rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-500/5 
                         border border-purple-500/20 p-6 text-center">
            <Calendar className="w-8 h-8 text-purple-400 mx-auto mb-3" />
            <p className="text-purple-300/80 text-sm mb-1">Most Active Month</p>
            <p className="text-xl font-bold text-white">{stats.mostActiveMonth}</p>
          </div>

          {/* Most Active Day */}
          <div className="rounded-2xl bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 
                         border border-cyan-500/20 p-6 text-center">
            <CalendarDays className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
            <p className="text-cyan-300/80 text-sm mb-1">Most Active Day</p>
            <p className="text-xl font-bold text-white">{stats.mostActiveDay}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
