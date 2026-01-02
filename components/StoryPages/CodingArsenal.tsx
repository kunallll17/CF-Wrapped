'use client';

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { UserStats } from "@/lib/types";
import { Code2, Trophy, Medal } from "lucide-react";

interface CodingArsenalProps {
  stats: UserStats;
  onNext: () => void;
}

const CodingArsenal = ({ stats, onNext }: CodingArsenalProps) => {
  const [isVisible, setIsVisible] = useState(false);

  // Sort languages by usage and get top 3
  const topLanguages = Object.entries(stats.languageStats || {})
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  // Medal styles for each position
  const medals = [
    { 
      icon: Trophy, 
      color: "text-yellow-400", 
      label: "Champion", 
      bgGradient: "from-yellow-500/20 to-amber-500/10", 
      border: "border-yellow-500/30",
      glow: "shadow-yellow-500/20"
    },
    { 
      icon: Medal, 
      color: "text-zinc-300", 
      label: "Runner Up", 
      bgGradient: "from-zinc-400/20 to-zinc-500/10", 
      border: "border-zinc-400/30",
      glow: "shadow-zinc-500/20"
    },
    { 
      icon: Medal, 
      color: "text-amber-600", 
      label: "Third Place", 
      bgGradient: "from-amber-600/20 to-amber-700/10", 
      border: "border-amber-600/30",
      glow: "shadow-amber-500/20"
    }
  ];

  useEffect(() => {
    setIsVisible(true);
  }, []);

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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 mb-6">
            <Code2 className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-yellow-300">Top Languages</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Your Coding<br />
            <span className="bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">Arsenal</span>
          </h1>
          <p className="text-zinc-400">Your most trusted companions</p>
        </motion.div>

        {/* Podium style display */}
        <div className="space-y-4">
          {topLanguages.map(([language, count], index) => {
            const MedalIcon = medals[index].icon;
            
            return (
              <motion.div
                key={language}
                initial={{ opacity: 0, x: -30, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.15, duration: 0.5, type: "spring" }}
                className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${medals[index].bgGradient} 
                  border ${medals[index].border} p-6 group hover:scale-[1.02] transition-transform duration-300
                  shadow-lg ${medals[index].glow}`}
              >
                {/* Shimmer effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent 
                                translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.2 }}
                      transition={{ duration: 0.5 }}
                      className={`p-3 rounded-xl bg-white/5`}
                    >
                      <MedalIcon className={`w-8 h-8 ${medals[index].color}`} />
                    </motion.div>
                    <div>
                      <p className={`text-2xl font-bold ${index === 0 ? 'bg-gradient-to-r from-yellow-400 to-amber-300 bg-clip-text text-transparent' : 'text-white'}`}>
                        {language}
                      </p>
                      <p className="text-sm text-zinc-400">{medals[index].label}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">{count.toLocaleString()}</p>
                    <p className="text-sm text-zinc-500">submissions</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="text-center mt-10"
        >
          <p className="text-zinc-400 text-lg">
            These languages helped you solve{" "}
            <span className="text-white font-bold">{stats.problemsSolved?.toLocaleString() || 0}</span> problems!
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default CodingArsenal;
