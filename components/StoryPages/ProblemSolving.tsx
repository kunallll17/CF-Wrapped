'use client';

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { UserStats } from "@/lib/types";
import { Code2 } from "lucide-react";

interface ProblemSolvingProps {
  stats: UserStats;
  onNext: () => void;
}

export default function ProblemSolving({ stats, onNext }: ProblemSolvingProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const averageSubmissions = Math.round(stats.totalSubmissions / 365);
  const averageText = averageSubmissions === 0 ? "<1" : averageSubmissions;

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#1a1d24] to-black">
      <div className="max-w-2xl w-full p-8 space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-white mb-4">Problem Solving Journey</h1>
          <p className="text-gray-400">Here&apos;s what you achieved this year</p>
        </motion.div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: isVisible ? 1 : 0.8, opacity: isVisible ? 1 : 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="grid grid-cols-2 gap-6"
        >
          <div className="bg-white/5 rounded-xl p-6 text-center">
            <h3 className="text-5xl font-bold text-green-400 mb-2">
              {stats.problemsSolved}
            </h3>
            <p className="text-gray-400">Problems Solved</p>
          </div>
          <div className="bg-white/5 rounded-xl p-6 text-center">
            <h3 className="text-5xl font-bold text-blue-400 mb-2">
              {stats.totalSubmissions}
            </h3>
            <p className="text-gray-400">Total Submissions</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="text-center"
        >
          <p className="text-2xl text-white mb-4">
            That&apos;s an average of{" "}
            <span className="text-purple-400">
              {averageText} submissions
            </span>{" "}
            per day!
          </p>
        </motion.div>
      </div>
    </div>
  );
} 