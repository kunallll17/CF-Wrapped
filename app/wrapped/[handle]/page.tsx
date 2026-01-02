'use client';

import { useEffect, useState, useRef } from 'react';
import { UserStats } from '@/lib/types';
import { Crown, Zap, Trophy, Calendar, CalendarDays, Code2, Share2, Download, Home, ChevronLeft, ChevronRight, Flame, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import html2canvas from 'html2canvas';
import Link from 'next/link';
import { motion } from "framer-motion";
import StoryContainer from '@/components/StoryPages/StoryContainer';

export const dynamic = 'force-dynamic';

function getContributionColor(count: number): string {
  if (count === 0) return 'bg-white/5';
  if (count === 1) return 'bg-purple-900/50';
  if (count <= 3) return 'bg-purple-700/60';
  if (count <= 5) return 'bg-purple-500/70';
  return 'bg-purple-400/80';
}

function formatContributionData(data: Record<string, number>) {
  const weeks: Array<Array<{ date: string; count: number }>> = [];
  const dates = Object.entries(data).sort((a, b) => a[0].localeCompare(b[0]));

  let currentWeek: Array<{ date: string; count: number }> = [];
  
  const firstDate = new Date(dates[0]?.[0] || new Date());
  const firstDayOfWeek = firstDate.getDay();
  
  for (let i = 0; i < firstDayOfWeek; i++) {
    currentWeek.push({ date: '', count: 0 });
  }

  dates.forEach(([date, count]) => {
    currentWeek.push({ date, count });
    
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push({ date: '', count: 0 });
    }
    weeks.push(currentWeek);
  }

  return weeks;
}

export default function WrappedPage({ params }: { params: { handle: string } }) {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showStory, setShowStory] = useState(true);
  const router = useRouter();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/stats?handle=${params.handle}`);
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || 'Failed to fetch stats');
        }
        
        setStats(data);
      } catch (error: any) {
        console.error('Failed to fetch stats:', error);
        setError(error.message || 'Failed to load stats');
      } finally {
        setLoading(false);
      }
    };

    if (params.handle) {
      fetchStats();
    }
  }, [params.handle]);

  const downloadImage = async () => {
    try {
      const element = document.getElementById('wrap');
      if (!element) return;

      const canvas = await html2canvas(element, {
        backgroundColor: '#0a0a0f',
        scale: 2,
        useCORS: true,
      });
      
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `${params.handle}-codeforces-wrapped-2025.png`;
      link.click();
    } catch (error) {
      console.error('Failed to download:', error);
    }
  };

  const shareImage = async () => {
    try {
      const element = document.getElementById('wrap');
      if (!element) return;

      const canvas = await html2canvas(element, {
        backgroundColor: '#0a0a0f',
        scale: 2,
        useCORS: true,
      });
      
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        
        const file = new File([blob], `${params.handle}-codeforces-wrapped-2025.png`, { type: 'image/png' });

        if (navigator.share && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: 'Codeforces Wrapped 2025',
            text: `Check out my Codeforces Wrapped 2025! @${params.handle}`,
          });
        } else {
          const shareText = encodeURIComponent(`Check out my Codeforces Wrapped 2025! @${params.handle}`);
          const shareLink = encodeURIComponent(window.location.href);
          window.open(`https://twitter.com/intent/tweet?text=${shareText}&url=${shareLink}`, '_blank');
        }
      }, 'image/png');
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -200, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: 200, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto" />
          <p className="text-xl text-zinc-400">Loading your coding journey...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0f] text-white gap-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto">
            <span className="text-3xl">😕</span>
          </div>
          <p className="text-xl text-red-400">{error}</p>
        </div>
        <button 
          onClick={() => router.push('/')}
          className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors"
        >
          Return to Home
        </button>
      </div>
    );
  }

  if (!stats) return null;

  if (showStory) {
    return (
      <StoryContainer
        stats={stats}
        onComplete={() => setShowStory(false)}
        onSkip={() => setShowStory(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-[128px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 p-4 md:p-8"
      >
        {/* Wrap content for screenshot */}
        <div id="wrap" className="max-w-4xl mx-auto space-y-6 bg-[#0a0a0f] p-6 rounded-3xl">
          {/* Header */}
          <div className="text-center space-y-4 pb-6 border-b border-white/5">
            <div className="relative w-28 h-28 mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-50" />
              <div className="relative w-full h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-1">
                <div className="w-full h-full rounded-full overflow-hidden bg-[#0a0a0f]">
                  {stats.profilePicture ? (
                    <Image
                      src={stats.profilePicture}
                      alt={stats.handle}
                      width={112}
                      height={112}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl font-bold bg-gradient-to-br from-purple-600 to-pink-600">
                      {stats.handle.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <h1 className="text-4xl font-bold">@{stats.handle}</h1>
            <div className="gradient-text text-2xl font-semibold">2025 Year in Code</div>
          </div>

          {/* Contribution Graph */}
          <div className="glass-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-zinc-400 text-sm">
                {stats.totalSubmissions.toLocaleString()} submissions in 2025
              </span>
            </div>
            
            <div className="relative group">
              <div 
                ref={scrollContainerRef}
                className="overflow-x-auto scrollbar-none py-2"
              >
                <div className="flex gap-1" style={{ width: 'max-content' }}>
                  {formatContributionData(stats.contributionData).map((week, weekIndex) => (
                    <div key={weekIndex} className="grid grid-rows-7 gap-1">
                      {week.map((day, dayIndex) => (
                        <div
                          key={`${weekIndex}-${dayIndex}`}
                          className={`w-3 h-3 rounded-sm ${getContributionColor(day.count)} transition-colors duration-200 hover:ring-1 hover:ring-purple-400`}
                          title={day.date ? `${day.date}: ${day.count} submissions` : ''}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Scroll buttons */}
              <button
                onClick={scrollLeft}
                className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center
                           bg-black/50 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100
                           transition-opacity duration-200 hover:bg-black/70"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={scrollRight}
                className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center
                           bg-black/50 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100
                           transition-opacity duration-200 hover:bg-black/70"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Legend */}
            <div className="flex justify-end items-center gap-2 text-xs text-zinc-500">
              <span>Less</span>
              {[0, 1, 2, 4, 6].map((level) => (
                <div key={level} className={`w-3 h-3 rounded-sm ${getContributionColor(level)}`} />
              ))}
              <span>More</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Current Rating */}
            <div className="stat-card">
              <div className="flex items-center gap-2 text-zinc-400 mb-3">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <span className="text-sm">Current Rating</span>
              </div>
              <div className={`text-3xl font-bold ${stats.rating?.currentColor || 'text-zinc-400'}`}>
                {stats.rating?.current || 'Unrated'}
              </div>
              <div className={`text-sm ${stats.rating?.currentColor || 'text-zinc-500'}`}>
                {stats.rating?.currentRank || 'Unrated'}
              </div>
            </div>

            {/* Max Rating */}
            <div className="stat-card">
              <div className="flex items-center gap-2 text-zinc-400 mb-3">
                <Crown className="w-5 h-5 text-orange-400" />
                <span className="text-sm">Peak Rating</span>
              </div>
              <div className={`text-3xl font-bold ${stats.rating?.maxColor || 'text-zinc-400'}`}>
                {stats.rating?.maxRating || 'Unrated'}
              </div>
              <div className={`text-sm ${stats.rating?.maxColor || 'text-zinc-500'}`}>
                {stats.rating?.maxRank || 'Unrated'}
              </div>
            </div>

            {/* Universal Rank */}
            <div className="stat-card">
              <div className="flex items-center gap-2 text-zinc-400 mb-3">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="text-sm">Universal Rank</span>
              </div>
              <div className="text-3xl font-bold text-yellow-500">
                Top {stats.universalRank}%
              </div>
            </div>

            {/* Longest Streak */}
            <div className="stat-card">
              <div className="flex items-center gap-2 text-zinc-400 mb-3">
                <Flame className="w-5 h-5 text-orange-500" />
                <span className="text-sm">Longest Streak</span>
              </div>
              <div className="text-3xl font-bold text-orange-500">
                {stats.longestStreak} days
              </div>
            </div>

            {/* Total Submissions */}
            <div className="stat-card">
              <div className="flex items-center gap-2 text-zinc-400 mb-3">
                <Zap className="w-5 h-5 text-emerald-400" />
                <span className="text-sm">Total Submissions</span>
              </div>
              <div className="text-3xl font-bold text-emerald-400">
                {stats.totalSubmissions.toLocaleString()}
              </div>
            </div>

            {/* Most Active Month */}
            <div className="stat-card">
              <div className="flex items-center gap-2 text-zinc-400 mb-3">
                <Calendar className="w-5 h-5 text-blue-400" />
                <span className="text-sm">Most Active Month</span>
              </div>
              <div className="text-2xl font-bold text-blue-400">
                {stats.mostActiveMonth}
              </div>
            </div>

            {/* Most Active Day */}
            <div className="stat-card">
              <div className="flex items-center gap-2 text-zinc-400 mb-3">
                <CalendarDays className="w-5 h-5 text-cyan-400" />
                <span className="text-sm">Most Active Day</span>
              </div>
              <div className="text-xl font-bold text-cyan-400">
                {stats.mostActiveDay}
              </div>
            </div>

            {/* Top Language */}
            <div className="stat-card">
              <div className="flex items-center gap-2 text-zinc-400 mb-3">
                <Code2 className="w-5 h-5 text-pink-400" />
                <span className="text-sm">Top Language</span>
              </div>
              <div className="text-2xl font-bold text-pink-400">
                {stats.topLanguage}
              </div>
            </div>
          </div>

          {/* Power Level Card */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10 border border-white/10 p-8 text-center">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIiBzdHJva2Utd2lkdGg9IjIiLz48L2c+PC9zdmc+')] opacity-30" />
            
            <div className="relative">
              <p className="text-zinc-400 text-sm uppercase tracking-wider mb-4">Power Level</p>
              <h2 className={`text-5xl font-bold mb-4 ${stats.powerClass?.color || 'text-purple-400'}`}>
                {stats.powerClass?.title || 'ROOKIE'}
              </h2>
              <p className="text-zinc-400 max-w-md mx-auto">
                {stats.powerClass?.description || 'Beginning your path to greatness!'}
              </p>
            </div>
          </div>

          {/* Credits */}
          <div className="text-center pt-4 border-t border-white/5">
            <Link
              href="https://github.com/kunallll17"
              target="_blank"
              className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors"
            >
              Created by @kunallll17 • cf-wrapped.vercel.app
            </Link>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mt-8 max-w-4xl mx-auto">
          <button
            onClick={downloadImage}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 
                     rounded-xl font-semibold text-white transition-all duration-300 
                     hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
          >
            <Download className="w-5 h-5" />
            Download
          </button>
          <button
            onClick={shareImage}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 
                     rounded-xl font-semibold text-white transition-all duration-300 
                     hover:scale-105 hover:shadow-lg hover:shadow-green-500/25"
          >
            <Share2 className="w-5 h-5" />
            Share
          </button>
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 
                     rounded-xl font-semibold text-white transition-all duration-300 
                     hover:bg-white/10 hover:scale-105"
          >
            <Home className="w-5 h-5" />
            Home
          </button>
        </div>
      </motion.div>
    </div>
  );
}
