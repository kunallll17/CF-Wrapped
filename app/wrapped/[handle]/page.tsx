'use client';

import { useEffect, useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { UserStats } from '@/lib/types';
import { Crown, Zap, Trophy, Calendar, CalendarDays, Code2, Share2, Download } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import html2canvas from 'html2canvas';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

// Add this function to determine contribution color
function getContributionColor(count: number): string {
  if (count === 0) return 'bg-gray-800';
  if (count === 1) return 'bg-green-900';
  if (count <= 3) return 'bg-green-700';
  if (count <= 5) return 'bg-green-500';
  return 'bg-green-400';
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatContributionData(data: Record<string, number>) {
  const weeks: Array<Array<{ date: string; count: number }>> = [];
  const dates = Object.entries(data)
    .sort((a, b) => a[0].localeCompare(b[0]));

  // Initialize the first week
  let currentWeek: Array<{ date: string; count: number }> = [];
  
  // Get the first date and calculate its day of week (0 = Sunday, 6 = Saturday)
  const firstDate = new Date(dates[0][0]);
  const firstDayOfWeek = firstDate.getDay();
  
  // Add empty days before the first date
  for (let i = 0; i < firstDayOfWeek; i++) {
    currentWeek.push({ date: '', count: 0 });
  }

  // Process all dates
  dates.forEach(([date, count]) => {
    currentWeek.push({ date, count });
    
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  // Add remaining days to the last week if needed
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
  // Use handle's string to generate a consistent number between 1 and 20
  const hash = handle.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const avatarNumber = (hash % 20) + 1; // Assuming we have 20 avatars
  return `/avatars/avatar${avatarNumber}.png`; // Make sure your files are named this way
}

export default function WrappedPage({ params }: { params: { handle: string } }) {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
    if (!wrapperRef.current) return;
    
    try {
      const element = wrapperRef.current;
      const canvas = await html2canvas(element, {
        backgroundColor: '#000000',
        useCORS: true,
        scale: 2
      });
      
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `${params.handle}-codeforces-wrapped-2024.png`;
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
    }
  };

  const shareImage = async () => {
    if (!wrapperRef.current) return;
    
    try {
      const element = wrapperRef.current;
      const canvas = await html2canvas(element, {
        backgroundColor: '#000000',
        useCORS: true,
        scale: 2
      });
      
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        
        const filesArray = [
          new File(
            [blob],
            `${params.handle}-codeforces-wrapped-2024.png`,
            { type: 'image/png' }
          )
        ];

        if (navigator.share) {
          try {
            await navigator.share({
              files: filesArray,
              title: 'Codeforces Wrapped 2024',
              text: `Check out my Codeforces Wrapped 2024! @${params.handle}`,
            });
          } catch (error) {
            console.error('Error sharing:', error);
          }
        } else {
          // Fallback for browsers that don't support native sharing
          const shareUrl = canvas.toDataURL('image/png');
          window.open(
            `https://twitter.com/intent/tweet?text=Check%20out%20my%20Codeforces%20Wrapped%202024!%20@${params.handle}&url=${encodeURIComponent(window.location.href)}`,
            '_blank'
          );
        }
      });
    } catch (error) {
      console.error('Error generating image:', error);
    }
  };

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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-destructive">Failed to load stats</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div ref={wrapperRef} className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <div className="w-28 h-28 mx-auto rounded-full overflow-hidden bg-gray-800 relative">
            {stats?.handle && (
              <img
                src={getRandomAvatar(stats.handle)}
                alt={`${stats?.handle}'s avatar`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to a simple colored div with initials if image fails
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.parentElement!.style.backgroundColor = '#6366f1';
                  target.parentElement!.innerHTML = `
                    <div class="w-full h-full flex items-center justify-center text-2xl font-bold text-white">
                      ${stats.handle.substring(0, 2).toUpperCase()}
                    </div>
                  `;
                }}
              />
            )}
          </div>
          <h1 className="text-4xl font-bold">@{stats?.handle}</h1>
          <div className="text-purple-400 text-2xl font-semibold">2024 Year in Code</div>
        </div>

        {/* Contribution Graph */}
        <Card className="bg-gray-900 p-6 rounded-xl">
          <div className="space-y-4 max-w-full overflow-hidden">
            {stats && (
              <>
                {/* Month Labels */}
                <div className="relative w-full overflow-x-auto">
                  <div className="flex min-w-full px-1">
                    {getMonthLabels(formatContributionData(stats.contributionData)).map((label, index) => (
                      <div
                        key={index}
                        className="text-xs text-gray-400 absolute"
                        style={{
                          left: `${(label.index * 16)}px`, // 16px = cell width (12px) + gap (4px)
                        }}
                      >
                        {label.text}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contribution Grid */}
                <div className="relative w-full overflow-x-auto">
                  <div className="flex gap-1 min-w-full py-1">
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
          {/* Universal Rank */}
          <Card className="bg-[#2d2215] p-6 rounded-xl">
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <Crown className="text-yellow-500" />
              <span>Universal Rank</span>
            </div>
            <div className="text-yellow-500 text-2xl font-bold">
              Top {stats.universalRank}%
            </div>
          </Card>

          {/* Longest Streak */}
          <Card className="bg-[#231f2e] p-6 rounded-xl">
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <Zap className="text-purple-400" />
              <span>Longest Streak</span>
            </div>
            <div className="text-purple-400 text-2xl font-bold">
              {stats.longestStreak} days
            </div>
          </Card>

          {/* Total Submissions */}
          <Card className="bg-[#162321] p-6 rounded-xl">
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <Trophy className="text-emerald-400" />
              <span>Total Submissions</span>
            </div>
            <div className="text-emerald-400 text-2xl font-bold">
              {stats.totalSubmissions.toLocaleString()}
            </div>
          </Card>

          {/* Most Active Month */}
          <Card className="bg-[#2d2215] p-6 rounded-xl">
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <Calendar className="text-orange-400" />
              <span>Most Active Month</span>
            </div>
            <div className="text-orange-400 text-2xl font-bold">
              Top {stats.mostActiveMonth}
            </div>
          </Card>

          {/* Most Active Day */}
          <Card className="bg-[#162321] p-6 rounded-xl">
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <CalendarDays className="text-cyan-400" />
              <span>Most Active Day</span>
            </div>
            <div className="text-cyan-400 text-2xl font-bold">
              {stats.mostActiveDay}
            </div>
          </Card>

          {/* Top Language */}
          <Card className="bg-[#2d1f2e] p-6 rounded-xl">
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <Code2 className="text-pink-400" />
              <span>Top Language</span>
            </div>
            <div className="text-pink-400 text-2xl font-bold">
              {stats.topLanguage}
            </div>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 pt-8">
          <a href="/" className="hover:text-gray-400 transition-colors">
            codeforces-wrapped.com
          </a>
        </div>

        {/* Buttons - outside the content to be captured */}
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
        </div>
      </div>
    </div>
  );
} 