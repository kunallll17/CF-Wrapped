'use client';

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { UserStats } from "@/lib/types";
import { CheckCircle2, Target, Send } from "lucide-react";

interface ProblemSolvingProps {
  stats: UserStats;
  onNext: () => void;
}

export default function ProblemSolving({ stats, onNext }: ProblemSolvingProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedTotal, setAnimatedTotal] = useState(0);
  const [animatedAccepted, setAnimatedAccepted] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    
    // Animate numbers
    const totalTarget = stats.totalSubmissions || 0;
    const acceptedTarget = stats.acceptedSubmissions || 0;
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;
    
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      setAnimatedTotal(Math.round(totalTarget * easeOut));
      setAnimatedAccepted(Math.round(acceptedTarget * easeOut));
      
      if (step >= steps) clearInterval(timer);
    }, stepDuration);
    
    return () => clearInterval(timer);
  }, [stats.totalSubmissions, stats.acceptedSubmissions]);

  const acceptanceRate = stats.totalSubmissions > 0 
    ? ((stats.acceptedSubmissions / stats.totalSubmissions) * 100).toFixed(1)
    : 0;

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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
            <Target className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-emerald-300">Problem Solving</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Your Submission<br />
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">Statistics</span>
          </h1>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Total Submissions */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 30 }}
            animate={{ scale: isVisible ? 1 : 0.8, opacity: isVisible ? 1 : 0, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/10 
                       border border-blue-500/20 p-8 text-center group hover:border-blue-500/40 transition-colors duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <motion.div 
              className="relative p-4 bg-blue-500/20 rounded-2xl w-fit mx-auto mb-4"
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
            >
              <Send className="w-10 h-10 text-blue-400" />
            </motion.div>
            
            <p className="text-blue-300/80 text-sm font-medium mb-2">Total Submissions</p>
            <motion.h2 
              className="text-5xl font-bold text-white"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
            >
              {animatedTotal.toLocaleString()}
            </motion.h2>
          </motion.div>

          {/* Accepted Submissions */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 30 }}
            animate={{ scale: isVisible ? 1 : 0.8, opacity: isVisible ? 1 : 0, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500/20 to-green-500/10 
                       border border-emerald-500/20 p-8 text-center group hover:border-emerald-500/40 transition-colors duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <motion.div 
              className="relative p-4 bg-emerald-500/20 rounded-2xl w-fit mx-auto mb-4"
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
            >
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            </motion.div>
            
            <p className="text-emerald-300/80 text-sm font-medium mb-2">Accepted</p>
            <motion.h2 
              className="text-5xl font-bold text-white"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.7, type: "spring" }}
            >
              {animatedAccepted.toLocaleString()}
            </motion.h2>
          </motion.div>
        </div>

        {/* Acceptance Rate */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="text-center"
        >
          <div className="inline-block px-8 py-6 rounded-2xl bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 border border-white/10">
            <p className="text-zinc-400 text-sm mb-2">Acceptance Rate</p>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-5xl font-bold gradient-text">{acceptanceRate}</span>
              <span className="text-2xl text-zinc-400">%</span>
            </div>
            
            {/* Progress bar */}
            <div className="mt-4 h-2 w-48 bg-white/10 rounded-full overflow-hidden mx-auto">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${acceptanceRate}%` }}
                transition={{ delay: 1, duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-full"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
