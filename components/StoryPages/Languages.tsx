'use client';

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { UserStats } from "@/lib/types";
import { Code2 } from "lucide-react";

interface LanguagesProps {
  stats: UserStats;
  onNext: () => void;
}

export default function Languages({ stats, onNext }: LanguagesProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#1a1d24] to-black">
      <div className="max-w-2xl w-full p-8 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-white mb-2">Your Language Mastery</h1>
          <p className="text-gray-400">Languages you&apos;ve conquered this year</p>
        </motion.div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: isVisible ? 1 : 0.8, opacity: isVisible ? 1 : 0 }}
          whileHover={{ scale: 1.05 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="bg-gradient-to-br from-pink-600/30 to-purple-600/30 p-6 rounded-xl 
                     hover:from-pink-500/40 hover:to-purple-500/40 
                     transition-all duration-300 shadow-lg hover:shadow-pink-500/20
                     cursor-pointer transform-gpu"
        >
          <div className="flex flex-col items-center space-y-4">
            <motion.div 
              className="p-3 bg-pink-500/30 rounded-full 
                        shadow-inner shadow-pink-400/20 backdrop-blur-sm"
              whileHover={{ 
                rotate: 360,
                transition: { duration: 0.6 }
              }}
            >
              <Code2 className="w-8 h-8 text-pink-300" />
            </motion.div>

            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">
                Top Language
              </h2>
              <p className="text-4xl font-bold text-pink-400 mb-2">
                {stats.topLanguage || "C++"}
              </p>
              <p className="text-gray-400 text-sm">
                Your go-to language for problem solving
              </p>
            </div>
          </div>
        </motion.div>

        {stats.languageStats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="grid grid-cols-2 gap-3"
          >
            {Object.entries(stats.languageStats)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 4)
              .map(([language, count], index) => {
                const gradients = [
                  'from-purple-600/30 to-pink-600/30 hover:from-purple-500/40 hover:to-pink-500/40 border-purple-500/30',
                  'from-blue-600/30 to-cyan-600/30 hover:from-blue-500/40 hover:to-cyan-500/40 border-blue-500/30',
                  'from-emerald-600/30 to-teal-600/30 hover:from-emerald-500/40 hover:to-teal-500/40 border-emerald-500/30',
                  'from-orange-600/30 to-amber-600/30 hover:from-orange-500/40 hover:to-amber-500/40 border-orange-500/30'
                ];

                const textColors = [
                  'text-purple-300',
                  'text-blue-300',
                  'text-emerald-300',
                  'text-orange-300'
                ];

                return (
                  <motion.div 
                    key={language}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ 
                      delay: 0.8 + index * 0.1,
                      duration: 0.5,
                      type: "spring",
                      stiffness: 100
                    }}
                    whileHover={{ 
                      scale: 1.05,
                      transition: { duration: 0.2 }
                    }}
                    className={`bg-gradient-to-br ${gradients[index]} 
                               p-3 rounded-lg transition-all transform-gpu cursor-pointer
                               border backdrop-blur-sm shadow-lg`}
                  >
                    <p className={`${textColors[index]} text-sm mb-1 font-medium`}>{language}</p>
                    <p className="text-2xl font-bold text-white">{count}</p>
                    <p className="text-xs text-gray-400">submissions</p>
                  </motion.div>
                );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
} 