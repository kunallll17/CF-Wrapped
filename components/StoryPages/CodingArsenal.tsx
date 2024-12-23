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
  const topLanguages = Object.entries(stats.languageStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  // Medal styles for each position
  const medals = [
    { icon: Trophy, color: "text-yellow-400", label: "Gold", bgGradient: "from-yellow-500/20 to-amber-500/20", border: "border-yellow-500/30" },
    { icon: Medal, color: "text-gray-300", label: "Silver", bgGradient: "from-gray-400/20 to-gray-500/20", border: "border-gray-400/30" },
    { icon: Medal, color: "text-amber-600", label: "Bronze", bgGradient: "from-amber-600/20 to-amber-700/20", border: "border-amber-600/30" }
  ];

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
      <div className="max-w-2xl w-full p-8 space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-white mb-4">Your Top Languages</h1>
          <p className="text-gray-400">Your most trusted coding companions</p>
        </motion.div>

        <div className="space-y-6">
          {topLanguages.map(([language, count], index) => {
            const MedalIcon = medals[index].icon;
            
            return (
              <motion.div
                key={language}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.2 }}
                className={`flex items-center justify-between p-6 rounded-lg bg-gradient-to-r ${medals[index].bgGradient} 
                  border ${medals[index].border} backdrop-blur-sm`}
              >
                <div className="flex items-center gap-4">
                  <MedalIcon className={`w-8 h-8 ${medals[index].color}`} />
                  <div>
                    <p className={`text-2xl font-bold ${index === 0 ? 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-300' : 'text-white'}`}>
                      {language}
                    </p>
                    <p className="text-sm text-gray-400">{medals[index].label} Medalist</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-white">{count}</p>
                  <p className="text-sm text-gray-400">submissions</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ delay: 1.5 }}
          className="text-center"
        >
          <p className="text-gray-400 text-lg">
            These languages helped you solve{" "}
            <span className="text-white font-bold">{stats.problemsSolved}</span> problems!
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default CodingArsenal; 