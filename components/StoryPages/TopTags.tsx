'use client';

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { UserStats } from "@/lib/types";
import { Tag, Hash } from "lucide-react";

interface TopTagsProps {
  stats: UserStats;
  onNext: () => void;
}

// Tag colors for visual variety
const tagColors = [
  { bg: 'from-purple-500/20 to-purple-500/5', border: 'border-purple-500/30', text: 'text-purple-300' },
  { bg: 'from-blue-500/20 to-blue-500/5', border: 'border-blue-500/30', text: 'text-blue-300' },
  { bg: 'from-cyan-500/20 to-cyan-500/5', border: 'border-cyan-500/30', text: 'text-cyan-300' },
  { bg: 'from-green-500/20 to-green-500/5', border: 'border-green-500/30', text: 'text-green-300' },
  { bg: 'from-orange-500/20 to-orange-500/5', border: 'border-orange-500/30', text: 'text-orange-300' },
];

export default function TopTags({ stats, onNext }: TopTagsProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Get top 5 tags with counts
  const sortedTags = Object.entries(stats.tagStats || {})
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const maxCount = sortedTags[0]?.[1] || 1;

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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-6">
            <Tag className="w-4 h-4 text-green-400" />
            <span className="text-sm text-green-300">Problem Categories</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Your Favorite<br />
            <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">Topics</span>
          </h1>
        </motion.div>

        {/* Top Tag Highlight */}
        {sortedTags.length > 0 && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: isVisible ? 1 : 0.8, opacity: isVisible ? 1 : 0 }}
            transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
            className="flex justify-center mb-10"
          >
            <div className="relative px-8 py-6 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/10 border border-green-500/30">
              <div className="absolute inset-0 rounded-2xl bg-green-500/10 blur-xl" />
              <div className="relative text-center">
                <Hash className="w-10 h-10 text-green-400 mx-auto mb-3" />
                <p className="text-green-300/80 text-sm mb-1">Most Solved Category</p>
                <h2 className="text-3xl font-bold text-white capitalize">{sortedTags[0][0]}</h2>
                <p className="text-zinc-500 mt-1">{sortedTags[0][1]} problems</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tags List */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="space-y-3"
        >
          {sortedTags.map(([tag, count], index) => {
            const colorScheme = tagColors[index % tagColors.length];
            const percentage = (count / maxCount) * 100;
            
            return (
              <motion.div
                key={tag}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                className={`relative overflow-hidden rounded-xl bg-gradient-to-r ${colorScheme.bg} border ${colorScheme.border} p-4`}
              >
                {/* Progress bar background */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.8, ease: "easeOut" }}
                  className="absolute inset-0 bg-white/5"
                />
                
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-medium">{index + 1}</span>
                    <span className={`font-semibold capitalize ${colorScheme.text}`}>{tag}</span>
                  </div>
                  <span className="text-zinc-400 font-medium">{count}</span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Empty state */}
        {sortedTags.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-zinc-500">No tag data available</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
