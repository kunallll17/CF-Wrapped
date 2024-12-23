'use client';

import { useEffect, useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { UserStats } from '@/lib/types';
import { Crown, Zap, Trophy, Calendar, CalendarDays, Code2, Share2, Download, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import html2canvas from 'html2canvas';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';
import { motion } from "framer-motion";
import StoryContainer from '@/components/StoryPages/StoryContainer';
import { toast } from "@/components/ui/use-toast";

export const dynamic = 'force-dynamic';

function getContributionColor(count: number): string {
  if (count === 0) return 'bg-[#1b1f23]';
  if (count === 1) return 'bg-[#0e4429]';
  if (count <= 3) return 'bg-[#006d32]';
  if (count <= 5) return 'bg-[#26a641]';
  return 'bg-[#39d353]';
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatContributionData(data: Record<string, number>) {
  const weeks: Array<Array<{ date: string; count: number }>> = [];
  const dates = Object.entries(data)
    .sort((a, b) => a[0].localeCompare(b[0]));

  let currentWeek: Array<{ date: string; count: number }> = [];
  const firstDate = new Date(dates[0][0]);
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

function getMonthLabels(weeks: Array<Array<{ date: string; count: number }>>) {
  const labels: { text: string; index: number }[] = [];
  let lastMonth = -1;

  weeks.forEach((week, weekIndex) => {
    week.forEach(day => {
      if (day.date) {
        const date = new Date(day.date);
        const month = date.getMonth();
        if (month !== lastMonth) {
          labels.push({ text: MONTHS[month], index: weekIndex });
          lastMonth = month;
        }
      }
    });
  });

  return labels;
}

function getRandomAvatar(handle: string) {
  const hash = handle.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const avatarNumber = (hash % 20) + 1;
  return `/avatars/avatar${avatarNumber}.png`;
}

export default function WrappedPage({ params }: { params: { handle: string } }) {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showStory, setShowStory] = useState(true);
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);

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
        
        console.log('Fetched stats:', data);
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
      if (!element) {
        console.error('Element to capture not found!');
        return;
      }

      const canvas = await html2canvas(element, {
        logging: true,
        useCORS: true,
        backgroundColor: '#000000',
        scale: 2,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.getElementById('wrap');
          if (clonedElement) {
            clonedElement.style.backgroundColor = '#000000';
          }
        }
      });
      const dataUrl = canvas.toDataURL('image/png');

      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'wrapped_stats.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Failed to capture or download the image:', error);
    }
  };

  const shareImage = async () => {
    try {
      const element = document.getElementById('wrap');
      if (!element) {
        console.error('Element to capture not found!');
        return;
      }

      const canvas = await html2canvas(element, {
        backgroundColor: '#000000',
        useCORS: true,
        scale: 2,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.getElementById('wrap');
          if (clonedElement) {
            clonedElement.style.backgroundColor = '#000000';
          }
        }
      });
      
      canvas.toBlob(async (blob) => {
        if (!blob) {
          console.error('Failed to create blob');
          return;
        }
        
        const filesArray = [
          new File(
            [blob],
            `${params.handle}-codeforces-wrapped-2024.png`,
            { type: 'image/png' }
          )
        ];

        try {
          if (navigator.share && navigator.canShare({ files: filesArray })) {
            await navigator.share({
              files: filesArray,
              title: 'Codeforces Wrapped 2024',
              text: `Check out my Codeforces Wrapped 2024! @${params.handle}`,
            });
          } else {
            // Fallback for browsers that don't support native sharing
            const shareUrl = canvas.toDataURL('image/png');
            const shareText = encodeURIComponent(`Check out my Codeforces Wrapped 2024! @${params.handle}`);
            const shareLink = encodeURIComponent(window.location.href);
            
            window.open(
              `https://twitter.com/intent/tweet?text=${shareText}&url=${shareLink}`,
              '_blank'
            );
          }
        } catch (error) {
          console.error('Error sharing:', error);
          // Fallback to Twitter sharing if native sharing fails
          const shareText = encodeURIComponent(`Check out my Codeforces Wrapped 2024! @${params.handle}`);
          const shareLink = encodeURIComponent(window.location.href);
          
          window.open(
            `https://twitter.com/intent/tweet?text=${shareText}&url=${shareLink}`,
            '_blank'
          );
        }
      }, 'image/png');
    } catch (error) {
      console.error('Error generating image:', error);
    }
  };

  const handleDownloadSummary = () => {
    if (stats) {
      const summary = {
        username: params.handle,
        problemsSolved: stats.problemsSolved,
        maxRating: stats.rating?.maxRating,
        currentRating: stats.rating?.currentRating,
        mostActiveDay: stats.mostActiveDay,
        mostActiveMonth: stats.mostActiveMonth,
        totalSolved: stats.totalSolved, // Changed from problemsSolved to totalSolved
        topLanguage: stats.topLanguage,
      };

      const blob = new Blob([JSON.stringify(summary, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${params.handle}-github-summary.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const getProfilePicture = (handle: string) => {
    return `https://userpic.codeforces.org/user/avatar/${handle}`;
  };

  const profilePicture = stats?.profilePicture 
    ? stats.profilePicture.replace(/^http:/, 'https:')
    : null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-pulse text-xl text-white">Loading your coding journey...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white gap-4">
        <div className="text-xl text-red-400">{error}</div>
        <button 
          onClick={() => router.push('/')}
          className="text-blue-400 hover:underline"
        >
          Return to Home
        </button>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="min-h-screen bg-black text-white p-8"
    >
      {/* Wrap everything that should be captured in a div with id="wrap" */}
      <div id="wrap" className="max-w-3xl mx-auto space-y-8 bg-black">
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <div className="w-28 h-28 mx-auto rounded-full overflow-hidden bg-gray-800 relative">
            {stats?.profilePicture ? (
              <Image
                src={stats.profilePicture}
                alt={`${stats.handle}'s profile`}
                width={112}
                height={112}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Safely handle image error
                  try {
                    const target = e.target as HTMLImageElement;
                    const parent = target.parentElement;
                    
                    if (parent) {
                      // Hide the failed image
                      target.style.display = 'none';
                      
                      // Update parent element
                      parent.style.backgroundColor = '#6366f1';
                      parent.innerHTML = `
                        <div class="w-full h-full flex items-center justify-center text-2xl font-bold text-white">
                          ${stats.handle.substring(0, 2).toUpperCase()}
                        </div>
                      `;
                    }
                  } catch (error) {
                    console.error('Error handling image fallback:', error);
                  }
                }}
              />
            ) : (
              // Default fallback if no profile picture
              <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-white bg-[#6366f1]">
                {stats.handle.substring(0, 2).toUpperCase()}
              </div>
            )}
          </div>
          <h1 className="text-4xl font-bold">@{stats?.handle}</h1>
          <div className="text-purple-400 text-2xl font-semibold">2024 Year in Code</div>
        </div>

        {/* Contribution Graph */}
        <Card className="bg-[#0d1117] p-6 rounded-xl hover:bg-[#161b22] transition-all duration-300">
          <div className="space-y-4">
            {stats && (
              <>
                {/* Contribution Grid - removed month labels section */}
                <div className="relative w-full overflow-hidden">
                  <div className="flex gap-1 py-1">
                    {formatContributionData(stats.contributionData).map((week, weekIndex) => (
                      <div key={weekIndex} className="grid grid-rows-7 gap-1">
                        {week.map((day, dayIndex) => (
                          <div
                            key={`${weekIndex}-${dayIndex}`}
                            className={`w-3 h-3 rounded-sm ${getContributionColor(day.count)}`}
                            title={day.date ? `${day.date}: ${day.count} contributions` : 'No contributions'}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Legend */}
                <div className="flex justify-between items-center text-sm text-gray-400 mt-2">
                  <span>{stats.totalSubmissions} submissions in 2024</span>
                  <div className="flex items-center gap-2">
                    <span>Less</span>
                    <div className="flex gap-1">
                      <div className="w-3 h-3 rounded-sm bg-gray-800" />
                      <div className="w-3 h-3 rounded-sm bg-green-900" />
                      <div className="w-3 h-3 rounded-sm bg-green-700" />
                      <div className="w-3 h-3 rounded-sm bg-green-500" />
                      <div className="w-3 h-3 rounded-sm bg-green-400" />
                    </div>
                    <span>More</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Current Rating */}
          <Card className="bg-[#162321] p-6 rounded-xl transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-[#1c2c28]">
            <div className="flex items-center gap-2 text-gray-400 mb-2 group">
              <Trophy className="text-yellow-400 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
              <span className="transition-colors duration-300 group-hover:text-yellow-400">Current Rating</span>
            </div>
            <div className={`text-2xl font-bold ${stats?.rating?.currentColor || 'text-gray-500'} transition-all duration-300 hover:scale-105`}>
              {stats?.rating?.current || 'Unrated'}
            </div>
            <div className={`text-sm ${stats?.rating?.currentColor || 'text-gray-500'} transition-all duration-300 hover:scale-105`}>
              {stats?.rating?.currentRank || 'Unrated'}
            </div>
          </Card>

          {/* Max Rating */}
          <Card className="bg-[#2d2215] p-6 rounded-xl transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-[#382a1a]">
            <div className="flex items-center gap-2 text-gray-400 mb-2 group">
              <Crown className="text-orange-400 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
              <span className="transition-colors duration-300 group-hover:text-orange-400">Highest Rating</span>
            </div>
            <div className={`text-2xl font-bold ${stats?.rating?.maxColor || 'text-gray-500'} transition-all duration-300 hover:scale-105`}>
              {stats?.rating?.maxRating || 'Unrated'}
            </div>
            <div className={`text-sm ${stats?.rating?.maxColor || 'text-gray-500'} transition-all duration-300 hover:scale-105`}>
              {stats?.rating?.maxRank || 'Unrated'}
            </div>
          </Card>

          {/* Universal Rank */}
          <Card className="bg-[#2d2215] p-6 rounded-xl transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-[#382a1a]">
            <div className="flex items-center gap-2 text-gray-400 mb-2 group">
              <Crown className="text-yellow-500 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
              <span className="transition-colors duration-300 group-hover:text-yellow-500">Universal Rank</span>
            </div>
            <div className="text-yellow-500 text-2xl font-bold transition-all duration-300 hover:scale-105">
              Top {stats?.universalRank}%
            </div>
          </Card>

          {/* Longest Streak */}
          <Card className="bg-[#231f2e] p-6 rounded-xl transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-[#2d2839]">
            <div className="flex items-center gap-2 text-gray-400 mb-2 group">
              <Zap className="text-purple-400 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
              <span className="transition-colors duration-300 group-hover:text-purple-400">Longest Streak</span>
            </div>
            <div className="text-purple-400 text-2xl font-bold transition-all duration-300 hover:scale-105">
              {stats?.longestStreak} days
            </div>
          </Card>

          {/* Total Submissions */}
          <Card className="bg-[#162321] p-6 rounded-xl transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-[#1c2c28]">
            <div className="flex items-center gap-2 text-gray-400 mb-2 group">
              <Trophy className="text-emerald-400 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
              <span className="transition-colors duration-300 group-hover:text-emerald-400">Total Submissions</span>
            </div>
            <div className="text-emerald-400 text-2xl font-bold transition-all duration-300 hover:scale-105">
              {stats?.totalSubmissions.toLocaleString()}
            </div>
          </Card>

          {/* Most Active Month */}
          <Card className="bg-[#2d2215] p-6 rounded-xl transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-[#382a1a]">
            <div className="flex items-center gap-2 text-gray-400 mb-2 group">
              <Calendar className="text-orange-400 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
              <span className="transition-colors duration-300 group-hover:text-orange-400">Most Active Month</span>
            </div>
            <div className="text-orange-400 text-2xl font-bold transition-all duration-300 hover:scale-105">
              {stats?.mostActiveMonth}
            </div>
          </Card>

          {/* Most Active Day */}
          <Card className="bg-[#162321] p-6 rounded-xl transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-[#1c2c28]">
            <div className="flex items-center gap-2 text-gray-400 mb-2 group">
              <CalendarDays className="text-cyan-400 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
              <span className="transition-colors duration-300 group-hover:text-cyan-400">Most Active Day</span>
            </div>
            <div className="text-cyan-400 text-2xl font-bold transition-all duration-300 hover:scale-105">
              {stats?.mostActiveDay}
            </div>
          </Card>

          {/* Top Language */}
          <Card className="bg-[#2d1f2e] p-6 rounded-xl transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-[#382639]">
            <div className="flex items-center gap-2 text-gray-400 mb-2 group">
              <Code2 className="text-pink-400 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
              <span className="transition-colors duration-300 group-hover:text-pink-400">Top Language</span>
            </div>
            <div className="text-pink-400 text-2xl font-bold transition-all duration-300 hover:scale-105">
              {stats?.topLanguage}
            </div>
          </Card>
        </div>

        {/* Power Level Card */}
        <Card className="bg-gray-900 p-6 rounded-xl">
          <div className="space-y-4 text-center">
            <div className="text-gray-400 text-sm">POWER LEVEL</div>
            <div className={`text-4xl font-bold ${stats?.powerClass.color} transition-all duration-300 hover:scale-105`}>
              {stats?.powerClass.title}
            </div>
            <div className="text-gray-400 text-sm">
              {stats?.powerClass.description}
            </div>
            
            {/* Power Level Progress */}
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-xs text-gray-400">
                <span>Next Level:</span>
                <span>
                  {stats && stats.totalSubmissions < 100 ? '100 submissions' :
                   stats?.totalSubmissions < 500 ? '500 submissions' :
                   stats?.totalSubmissions < 1000 ? '1000 submissions' :
                   stats?.totalSubmissions < 2000 ? '2000 submissions' :
                   stats?.totalSubmissions < 4000 ? '4000 submissions' :
                   stats?.totalSubmissions < 9000 ? '9000 submissions' :
                   'MAX LEVEL ACHIEVED! 🎉'}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Credits section - keep this inside the wrap div */}
        <div className="relative mt-12 pb-8">
          <div className="text-center">
            <div className="flex justify-center items-center space-x-8 text-sm text-gray-500">
              <Link
                href="https://github.com/kunallll17"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-purple-300 transition-colors"
              >
                Created by @kunallll17
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Buttons - moved outside the wrap div */}
      <div className="flex justify-center gap-4 mt-8">
        <Button
          onClick={downloadImage}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 
          transform hover:scale-105 transition-all duration-200 px-6 py-3 rounded-lg shadow-lg hover:shadow-xl"
        >
          <Download className="w-5 h-5 animate-bounce" />
          <span className="font-semibold">Download Wrap</span>
        </Button>
        <Button
          onClick={shareImage}
          className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 
          transform hover:scale-105 transition-all duration-200 px-6 py-3 rounded-lg shadow-lg hover:shadow-xl"
        >
          <Share2 className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" />
          <span className="font-semibold">Share Wrap</span>
        </Button>
        <Button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 
          transform hover:scale-105 transition-all duration-200 px-6 py-3 rounded-lg shadow-lg hover:shadow-xl"
        >
          <Home className="w-5 h-5" />
          <span className="font-semibold">Back to Home</span>
        </Button>
      </div>
    </motion.div>
  );
} 