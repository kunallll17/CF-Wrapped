'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserStats } from '@/lib/types';
import { X, ChevronLeft, ChevronRight, Volume2, VolumeX } from 'lucide-react';
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
import BackgroundMusic from '../Audio/BackgroundMusic';

interface StoryContainerProps {
  stats: UserStats;
  onComplete: () => void;
  onSkip: () => void;
}

const STORY_DURATION = 10000; // 10 seconds per story

export default function StoryContainer({ stats, onComplete, onSkip }: StoryContainerProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

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
    if (isPaused) return;
    
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
  }, [currentPage, goToNextPage, isPaused]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch(e.key) {
        case 'ArrowRight':
        case ' ':
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

  useEffect(() => {
    return () => {
      const audio = document.querySelector('audio');
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-[#0a0a0f] z-50 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-transparent to-pink-900/20" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-[128px]" />
      </div>
      
      <BackgroundMusic />
      
      {/* Progress bars */}
      <div className="absolute top-0 left-0 right-0 flex gap-1.5 p-4 z-20">
        {stories.map((_, idx) => (
          <div key={idx} className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
            <motion.div 
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
              initial={false}
              animate={{ 
                width: `${idx === currentPage ? progress : idx < currentPage ? 100 : 0}%` 
              }}
              transition={{ duration: 0.1, ease: 'linear' }}
            />
          </div>
        ))}
      </div>

      {/* Page indicator */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20">
        <span className="text-white/50 text-sm font-medium">
          {currentPage + 1} / {stories.length}
        </span>
      </div>

      {/* Navigation buttons */}
      <button 
        onClick={goToPrevPage}
        className={`absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full 
                   bg-white/5 backdrop-blur-sm border border-white/10
                   transition-all duration-300 hover:bg-white/10 hover:scale-110
                   ${currentPage === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>

      <button 
        onClick={goToNextPage}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full 
                   bg-white/5 backdrop-blur-sm border border-white/10
                   transition-all duration-300 hover:bg-white/10 hover:scale-110"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* Close button */}
      <button 
        onClick={onSkip}
        className="absolute top-4 right-4 z-20 p-2 rounded-full 
                   bg-white/5 backdrop-blur-sm border border-white/10
                   transition-all duration-300 hover:bg-white/10 hover:scale-110"
      >
        <X className="w-5 h-5 text-white" />
      </button>

      {/* Touch areas for mobile */}
      <div className="absolute inset-0 z-10 flex">
        <div 
          className="w-1/3 h-full cursor-pointer" 
          onClick={goToPrevPage}
          onMouseDown={() => setIsPaused(true)}
          onMouseUp={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        />
        <div 
          className="w-1/3 h-full"
          onMouseDown={() => setIsPaused(true)}
          onMouseUp={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        />
        <div 
          className="w-1/3 h-full cursor-pointer" 
          onClick={goToNextPage}
          onMouseDown={() => setIsPaused(true)}
          onMouseUp={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        />
      </div>

      {/* Story content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="h-full relative z-0"
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
