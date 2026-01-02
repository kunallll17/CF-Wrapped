'use client';

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { UserStats } from "@/lib/types";
import { Zap, Sparkles } from "lucide-react";

interface PowerLevelStoryProps {
  stats: UserStats;
  onNext: () => void;
}

// Power level configurations
const powerLevelConfig: Record<string, { gradient: string; glow: string; icon: string }> = {
  "GOD MODE ⚡": {
    gradient: "from-yellow-400 via-orange-500 to-red-500",
    glow: "rgba(234, 179, 8, 0.5)",
    icon: "⚡"
  },
  "SUPER SAIYAN 🔥 💥": {
    gradient: "from-orange-400 via-red-500 to-pink-500",
    glow: "rgba(249, 115, 22, 0.5)",
    icon: "🔥"
  },
  "SAGE MODE 🌀": {
    gradient: "from-blue-400 via-cyan-500 to-teal-500",
    glow: "rgba(59, 130, 246, 0.5)",
    icon: "🌀"
  },
  "ELITE CLASS ⚡": {
    gradient: "from-purple-400 via-violet-500 to-indigo-500",
    glow: "rgba(139, 92, 246, 0.5)",
    icon: "⚡"
  },
  "NINJA 🥷": {
    gradient: "from-gray-400 via-zinc-500 to-slate-600",
    glow: "rgba(161, 161, 170, 0.5)",
    icon: "🥷"
  },
  "ADVENTURER 🌊": {
    gradient: "from-cyan-400 via-blue-500 to-indigo-500",
    glow: "rgba(6, 182, 212, 0.5)",
    icon: "🌊"
  },
  "ROOKIE 🌱": {
    gradient: "from-green-400 via-emerald-500 to-teal-500",
    glow: "rgba(34, 197, 94, 0.5)",
    icon: "🌱"
  }
};

export default function PowerLevelStory({ stats, onNext }: PowerLevelStoryProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showPowerLevel, setShowPowerLevel] = useState(false);

  const config = powerLevelConfig[stats.powerClass?.title] || powerLevelConfig["ROOKIE 🌱"];

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => setShowPowerLevel(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="story-bg flex items-center justify-center">
      <div className="relative z-10 max-w-2xl w-full px-8 text-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 mb-6">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-yellow-300">Power Analysis</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Your Power<br />
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">Level</span>
          </h1>
        </motion.div>

        {/* Power Level Display */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: showPowerLevel ? 1 : 0 }}
          transition={{ type: "spring", bounce: 0.5, duration: 1 }}
          className="relative mb-12"
        >
          {/* Animated rings */}
          {[1, 2, 3].map((ring) => (
            <motion.div
              key={ring}
              className={`absolute inset-0 rounded-full border-2 border-white/10`}
              style={{ 
                transform: `scale(${1 + ring * 0.2})`,
              }}
              animate={{
                opacity: [0.5, 0, 0.5],
                scale: [1 + ring * 0.2, 1.5 + ring * 0.2, 1 + ring * 0.2]
              }}
              transition={{
                duration: 2,
                delay: ring * 0.3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}

          {/* Main power level card */}
          <div 
            className={`relative p-10 rounded-3xl bg-gradient-to-br ${config.gradient} bg-opacity-20 border border-white/20`}
            style={{ 
              boxShadow: `0 0 60px ${config.glow}`,
            }}
          >
            {/* Sparkles */}
            <Sparkles className="absolute top-4 right-4 w-6 h-6 text-white/50 animate-pulse" />
            <Sparkles className="absolute bottom-4 left-4 w-6 h-6 text-white/50 animate-pulse" style={{ animationDelay: '0.5s' }} />
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="text-6xl mb-4">
                {stats.powerClass?.title?.split(' ').pop() || '🌱'}
              </div>
              <h2 className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}>
                {stats.powerClass?.title?.replace(/[^\w\s]/g, '').trim() || 'ROOKIE'}
              </h2>
            </motion.div>
          </div>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: showPowerLevel ? 1 : 0, y: showPowerLevel ? 0 : 20 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="space-y-4"
        >
          <p className="text-xl text-zinc-300">
            {stats.powerClass?.description || "Beginning your path to greatness!"}
          </p>
          
          {/* Stats summary */}
          <div className="flex justify-center gap-8 mt-8">
            <div className="text-center">
              <p className="text-3xl font-bold text-white">{stats.totalSubmissions?.toLocaleString()}</p>
              <p className="text-zinc-500 text-sm">Submissions</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">{stats.acceptedSubmissions?.toLocaleString()}</p>
              <p className="text-zinc-500 text-sm">Accepted</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
