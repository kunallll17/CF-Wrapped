'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Trophy, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Toaster } from "@/components/ui/toaster";

export default function Home() {
  const [handle, setHandle] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [showCopied, setShowCopied] = useState(false);

  const generateWrapped = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!handle) {
      toast({
        title: "Error",
        description: "Please enter a Codeforces handle",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/stats?handle=${handle}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to fetch user data');

      router.push(`/wrapped/${handle}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || 'Something went wrong',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const featuredUsers = [
    { 
      handle: "tourist", 
      description: "Legendary Competitive Programmer",
      image: "/tourist.png"
    },
    { 
      handle: "cry", 
      description: "Red Coder & Problem Setter",
      image: "/cry.png"
    },
    { 
      handle: "jiangly", 
      description: "Competitive Programming Expert",
      image: "/jiangly.png"
    },
    { 
      handle: "Benq", 
      description: "USACO Guide Contributor",
      image: "/benq.png"
    },
    { 
      handle: "MridulAhi", 
      description: "Expert Problem Solver",
      image: "/mridulahi.png"
    },
    { 
      handle: "Dominater069", 
      description: "Top Competitive Programmer",
      image: "/dominater069.png"
    }
  ];

  function calculatePowerLevel(submissions: number, rank: string, longestStreak: number) {
    const maxSubmissions = 1000; // Example max submissions
    const maxStreak = 30; // Example max streak days
    const rankValue = getRankValue(rank); // Convert rank to a numerical value

    const normalizedSubmissions = (submissions / maxSubmissions) * 100;
    const normalizedRank = (rankValue / 8) * 100; // Assuming max rank value is 8
    const normalizedStreak = (longestStreak / maxStreak) * 100;

    // Weighted average
    const powerLevel = (0.5 * normalizedSubmissions) + (0.3 * normalizedRank) + (0.2 * normalizedStreak);
    
    return powerLevel;
  }

  function getRankValue(rank: string) {
    const rankMap = {
      "Newbie": 0,
      "Pupil": 1,
      "Specialist": 2,
      "Expert": 3,
      "Candidate Master": 4,
      "Master": 5,
      "International Master": 6,
      "Grandmaster": 7,
      "International Grandmaster": 8,
      "Legendary Grandmaster": 9
    };
    return rankMap[rank as keyof typeof rankMap] || 0; // Default to 0 if rank is unknown
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText('40488690');
      setShowCopied(true);
      // Hide the message after 2 seconds
      setTimeout(() => setShowCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy');
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 py-16 flex flex-col items-center">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Codeforces Wrapped</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Discover your competitive programming journey in 2024
          </p>
          
          <div className="max-w-md mx-auto">
            <form onSubmit={generateWrapped} className="flex gap-2 mb-4">
              <Input 
                placeholder="Enter your Codeforces handle"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                className="text-lg"
              />
              <Button 
                type="submit"
                disabled={loading}
                size="lg"
                className="bg-primary hover:bg-primary/90"
              >
                {loading ? 'Loading...' : 'Generate My Wrapped'}
              </Button>
            </form>
            <p className="text-sm text-muted-foreground">
              Best viewed on desktop
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">
          <h2 className="text-2xl font-semibold col-span-full mb-4">Featured Profiles</h2>
          {featuredUsers.map((user) => (
            <Link 
              key={user.handle} 
              href={`/wrapped/${user.handle}`}
              className="group relative overflow-hidden p-4 bg-[#1a1d24] rounded-xl transition-all duration-500 hover:bg-[#22262e] hover:scale-[1.02] hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 rounded-full overflow-hidden">
                  <Image
                    src={user.image}
                    alt={`${user.handle}'s avatar`}
                    fill
                    className="object-cover transform transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="transform transition-all duration-500 group-hover:translate-x-1">
                  <h3 className="text-white font-medium">{user.handle}</h3>
                  <p className="text-gray-400 text-sm">{user.description}</p>
                </div>
              </div>
              <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-600 transform transition-all duration-500 group-hover:translate-x-1 group-hover:text-white" />
            </Link>
          ))}
        </div>

        <div className="flex flex-col items-center space-y-4 p-6">
          <h2 className="text-2xl font-bold text-white">Support the Project</h2>
          <p className="text-gray-300 text-center">
            If you find this tool helpful, consider supporting its developer
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 relative">
            <button
              onClick={copyToClipboard}
              className="flex items-center space-x-2 bg-gray-700/50 p-3 rounded-lg
                         transform transition-all duration-200 hover:scale-105 hover:bg-gray-600/50
                         active:scale-95 cursor-pointer"
            >
              <span className="text-gray-300">UPI:</span>
              <code className="bg-gray-800 px-2 py-1 rounded">40488690</code>
            </button>

            {/* Copied message popup */}
            {showCopied && (
              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 
                            bg-green-500 text-white px-3 py-1 rounded-md text-sm
                            animate-fade-in-down">
                Copied to clipboard!
              </div>
            )}

            <a
              href="https://razorpay.me/@kunalsharma9430"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center px-4 py-2 bg-[#2b84ea] 
                       hover:bg-[#2474d0] text-white rounded-lg 
                       transform transition-all duration-200 hover:scale-105
                       active:scale-95"
            >
              <svg 
                className="w-5 h-5 mr-2" 
                viewBox="0 0 24 24" 
                fill="currentColor"
              >
                <path d="M8.75 21V3h6.5v18h-6.5zM3 21V9.5h3.75v11.5H3zm15.25 0V9.5H22v11.5h-3.75z" />
              </svg>
              Donate with Razorpay
            </a>
          </div>

          <p className="text-sm text-gray-400 mt-4">
            Your support helps maintain and improve CF Wrapped!
          </p>
        </div>

        <footer className="mt-8 text-center space-y-4">
          <div className="flex justify-center space-x-6 text-sm">
            <Link
              href="https://github.com/kunallll17"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Created by @kunallll17 🇮🇳
            </Link>

            <Link
              href="https://github.com/kunallll17/CF-Wrapped/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Request a feature ⚡️ or report a bug 🐛
            </Link>

            {/* <button
              onClick={() => {
                // Copy UPI ID to clipboard
                navigator.clipboard.writeText('40488690');
                alert('UPI ID copied to clipboard: 40488690 (It is a private UPI ID)');
              }}
              className="text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              Support Project 💝
            </button> */}
          </div>
        </footer>
      </div>
      <Toaster />
    </main>
  );
}
