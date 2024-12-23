'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserStats } from '@/lib/types';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import IntroStory from './IntroStory';
import CodingArsenal from './CodingArsenal';
import ProblemSolving from './ProblemSolving';
import TopTags from './TopTags';
import Streaks from './Streaks';
import RatingJourney from './RatingJourney';
import PowerLevelStory from './PowerLevelStory';
import React from 'react';
import FinalTransition from './FinalTransition';
import Languages from './Languages';

interface StoryContainerProps {
  stats: UserStats;
  onComplete: () => void;
  onSkip: () => void;
}

const STORY_DURATION = 10000; // 10 seconds per story

export default function StoryContainer({ stats, onComplete, onSkip }: StoryContainerProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [progress, setProgress] = useState(0);

  const stories = [
    { id: 1, component: IntroStory },
    { id: 2, component: Languages },
    { id: 3, component: ProblemSolving },
    { id: 4, component: TopTags },
    { id: 5, component: Streaks },
    { id: 6, component: RatingJourney },
    { id: 7, component: PowerLevelStory },
    { id: 8, component: FinalTransition }
  ];

  const goToNextPage = useCallback(() => {
    if (currentPage === stories.length - 1) {
      onComplete();
    } else {
      setCurrentPage(p => p + 1);
      setProgress(0);
    }
  }, [currentPage, onComplete, stories.length]);

  const goToPrevPage = useCallback(() => {
    if (currentPage > 0) {
      setCurrentPage(p => p - 1);
      setProgress(0);
    }
  }, [currentPage]);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          goToNextPage();
          return 0;
        }
        return prev + (100 / (STORY_DURATION / 100));
      });
    }, 100);

    return () => clearInterval(timer);
  }, [currentPage, goToNextPage]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch(e.key) {
        case 'ArrowRight':
        case 'Space':
          goToNextPage();
          break;
        case 'ArrowLeft':
          goToPrevPage();
          break;
        case 'Escape':
          onSkip();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentPage, goToNextPage, goToPrevPage, onSkip]);

  return (
    <div className="fixed inset-0 bg-black z-50">
      {/* Progress bars */}
      <div className="absolute top-0 left-0 right-0 flex gap-1 p-2 z-10">
        {stories.map((_, idx) => (
          <div key={idx} className="h-1 flex-1 bg-gray-800 rounded overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-100"
              style={{ 
                width: `${idx === currentPage ? progress : idx < currentPage ? 100 : 0}%` 
              }}
            />
          </div>
        ))}
      </div>

      {/* Navigation buttons */}
      <button 
        onClick={goToPrevPage}
        className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 text-white hover:opacity-80 transition-opacity
          ${currentPage === 0 ? 'opacity-0 pointer-events-none' : 'opacity-50 hover:opacity-100'}`}
      >
        <ChevronLeft size={32} />
      </button>

      <button 
        onClick={goToNextPage}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 text-white opacity-50 hover:opacity-100 transition-opacity"
      >
        <ChevronRight size={32} />
      </button>

      {/* Close button */}
      <button 
        onClick={onSkip}
        className="absolute top-4 right-4 z-10 p-2 text-white hover:opacity-80"
      >
        <X size={24} />
      </button>

      {/* Story content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="h-full"
        >
          {React.createElement(stories[currentPage].component, {
            stats,
            onNext: goToNextPage
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
} 