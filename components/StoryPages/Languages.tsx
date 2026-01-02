'use client';

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { UserStats } from "@/lib/types";
import { Code2, FileCode } from "lucide-react";

interface LanguagesProps {
  stats: UserStats;
  onNext: () => void;
}

// Language colors mapping
const languageColors: Record<string, string> = {
  'C++': '#00599C',
  'Python': '#3776AB',
  'Java': '#ED8B00',
  'JavaScript': '#F7DF1E',
  'C': '#555555',
  'C#': '#239120',
  'Ruby': '#CC342D',
  'Go': '#00ADD8',
  'Rust': '#CE422B',
  'Kotlin': '#7F52FF',
  'Swift': '#FA7343',
  'TypeScript': '#3178C6',
  'PHP': '#777BB4',
  'Scala': '#DC322F',
  'Haskell': '#5D4F85',
  'default': '#8B5CF6'
};

function getLanguageColor(lang: string): string {
  // Check if the language contains any of the keys
  for (const [key, color] of Object.entries(languageColors)) {
    if (lang.toLowerCase().includes(key.toLowerCase())) {
      return color;
    }
  }
  return languageColors.default;
}

export default function Languages({ stats, onNext }: LanguagesProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Get top 5 languages
  const sortedLanguages = Object.entries(stats.languageStats || {})
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const maxCount = sortedLanguages[0]?.[1] || 1;

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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
            <Code2 className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-300">Coding Arsenal</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Your Favorite<br />
            <span className="gradient-text">Languages</span>
          </h1>
        </motion.div>

        {/* Top Language Highlight */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: isVisible ? 1 : 0.8, opacity: isVisible ? 1 : 0 }}
          transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
          className="flex justify-center mb-12"
        >
          <div 
            className="relative p-8 rounded-3xl border border-white/10"
            style={{ 
              background: `linear-gradient(135deg, ${getLanguageColor(stats.topLanguage)}20 0%, transparent 100%)`,
              borderColor: `${getLanguageColor(stats.topLanguage)}40`
            }}
          >
            <div className="absolute inset-0 rounded-3xl opacity-20 blur-xl"
                 style={{ background: getLanguageColor(stats.topLanguage) }} />
            <div className="relative text-center">
              <FileCode className="w-16 h-16 mx-auto mb-4" style={{ color: getLanguageColor(stats.topLanguage) }} />
              <p className="text-zinc-400 text-sm mb-2">Most Used Language</p>
              <h2 className="text-4xl font-bold text-white">{stats.topLanguage}</h2>
              <p className="text-zinc-500 mt-2">
                {stats.languageStats?.[stats.topLanguage]?.toLocaleString() || 0} submissions
              </p>
            </div>
          </div>
        </motion.div>

        {/* Language bars */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="space-y-4"
        >
          {sortedLanguages.map(([lang, count], index) => (
            <motion.div
              key={lang}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
              className="group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium">{lang}</span>
                <span className="text-zinc-400 text-sm">{count.toLocaleString()}</span>
              </div>
              <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(count / maxCount) * 100}%` }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.8, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{ 
                    background: `linear-gradient(90deg, ${getLanguageColor(lang)}, ${getLanguageColor(lang)}80)`
                  }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
