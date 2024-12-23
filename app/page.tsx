'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Trophy } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
  const [handle, setHandle] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
    { handle: "tourist", description: "Legendary Competitive Programmer" },
    { handle: "cry", description: "Red Coder & Problem Setter" },
    { handle: "jiangly", description: "Competitive Programming Expert" },
    { handle: "aryanc403", description: "ICPC World Finalist" },
    { handle: "MridulAhi", description: "Expert Problem Solver" },
    { handle: "Dominater069", description: "Top Competitive Programmer" },
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
            <Link key={user.handle} href={`/wrapped/${user.handle}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer hover:scale-105">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Trophy className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">@{user.handle}</h3>
                      <p className="text-sm text-muted-foreground">{user.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <footer className="mt-8 text-center space-y-4">
          <div className="flex justify-center space-x-6 text-sm">
            <Link
              href="https://github.com/kunallll17"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Created by @kunallll17
            </Link>

            <Link
              href="https://github.com/kunallll17/CF-Wrapped/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Request a feature ⚡️ or report a bug 🐛
            </Link>

            <button
              onClick={() => {
                // Copy UPI ID to clipboard
                navigator.clipboard.writeText('9351415734@ptyes');
                alert('UPI ID copied to clipboard: 9351415734@ptyes');
              }}
              className="text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              Support Project 💝
            </button>
          </div>
        </footer>
      </div>
    </main>
  );
}
