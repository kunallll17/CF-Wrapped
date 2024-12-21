'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Github, Code2, Trophy, Star } from 'lucide-react';
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
        variant: "destructive"
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
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const featuredUsers = [
    { handle: "tourist", description: "Legendary Competitive Programmer" },
    { handle: "Petr", description: "Creator of many CF problems" },
    { handle: "ecnerwala", description: "ICPC World Finalist" },
    { handle: "Um_nik", description: "Competitive Programming Expert" },
    { handle: "Benq", description: "USACO Guide Contributor" },
  ];

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
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
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

        <footer className="mt-16 text-center">
          <p className="text-sm text-muted-foreground">
            <Link
              href="https://github.com/kunallll17"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Request a feature ⚡️ or report a bug 🐛
            </Link>
          </p>
        </footer>
      </div>
    </main>
  );
}
