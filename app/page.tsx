'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Sparkles, Code2, Trophy, Zap, Github, Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Toaster } from "@/components/ui/toaster";
import { toast } from '@/hooks/use-toast';

// Particle component for background effect
function Particles() {
  return (
    <div className="particles">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 15}s`,
            animationDuration: `${15 + Math.random() * 10}s`,
          }}
        />
      ))}
    </div>
  );
}

// Animated gradient orbs
function GradientOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-purple-500/20 rounded-full blur-[128px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-pink-500/20 rounded-full blur-[128px] animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[128px]" />
    </div>
  );
}

// Feature card component
function FeatureCard({ icon: Icon, title, description, delay }: { icon: any; title: string; description: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="glass-card p-6 hover:bg-white/10 transition-all duration-300 group"
    >
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-6 h-6 text-purple-400" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-zinc-400 text-sm">{description}</p>
    </motion.div>
  );
}

export default function Home() {
  const [handle, setHandle] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const featuredUsers = [
    { handle: "tourist", description: "Legendary Grandmaster", image: "/tourist.png" },
    { handle: "cry", description: "Problem Setter", image: "/cry.png" },
    { handle: "jiangly", description: "Grandmaster", image: "/jiangly.png" },
    { handle: "Benq", description: "USACO Contributor", image: "/benq.png" },
    { handle: "MridulAhi", description: "Expert Coder", image: "/mridulahi.png" },
    { handle: "Dominater069", description: "Top Programmer", image: "/dominater069.png" }
  ];

  const generateWrapped = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!handle.trim()) {
      toast({
        title: "Handle required",
        description: "Please enter your Codeforces handle",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/stats?handle=${handle.trim()}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to fetch user data');

      router.push(`/wrapped/${handle.trim()}`);
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

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText('40488690');
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy');
    }
  };

  return (
    <main className="relative min-h-screen bg-[#0a0a0f] overflow-hidden">
      <GradientOrbs />
      <Particles />
      
      {/* Hero Section */}
      <div className="relative z-10 min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center px-4 py-20">
          <div className="max-w-4xl w-full text-center space-y-8">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-zinc-400"
            >
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span>2025 Edition Now Live</span>
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="space-y-4"
            >
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                <span className="text-white">Codeforces</span>
                <br />
                <span className="gradient-text">Wrapped</span>
              </h1>
              <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto">
                Relive your competitive programming journey. 
                See your stats, streaks, and achievements in a stunning visual story.
              </p>
            </motion.div>

            {/* Search Form */}
            <motion.form
              onSubmit={generateWrapped}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="max-w-md mx-auto space-y-4"
            >
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-500" />
                <div className="relative flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Enter your Codeforces handle"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    className="input-modern flex-1"
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="glow-button whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Loading...
                      </span>
                    ) : (
                      'Generate'
                    )}
                  </button>
                </div>
              </div>
              <p className="text-sm text-zinc-500">Best experienced on desktop</p>
            </motion.form>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12"
            >
              <FeatureCard
                icon={Code2}
                title="Submission Analysis"
                description="Track your coding activity throughout the year"
                delay={0.5}
              />
              <FeatureCard
                icon={Zap}
                title="Streak Stats"
                description="Discover your longest coding streaks"
                delay={0.6}
              />
              <FeatureCard
                icon={Trophy}
                title="Rating Journey"
                description="Visualize your competitive growth"
                delay={0.7}
              />
            </motion.div>
          </div>
        </div>

        {/* Featured Profiles Section */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="relative z-10 px-4 py-16 border-t border-white/5"
        >
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">
              Featured Profiles
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {featuredUsers.map((user, index) => (
                <Link
                  key={user.handle}
                  href={`/wrapped/${user.handle}`}
                  className="profile-card group text-center"
                >
                  <div className="relative w-16 h-16 mx-auto mb-3 rounded-full overflow-hidden ring-2 ring-white/10 group-hover:ring-purple-500/50 transition-all duration-300">
                    <Image
                      src={user.image}
                      alt={user.handle}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <h3 className="text-white font-medium text-sm truncate">{user.handle}</h3>
                  <p className="text-zinc-500 text-xs truncate">{user.description}</p>
                  <ChevronRight className="w-4 h-4 text-zinc-600 mx-auto mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Support Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="relative z-10 px-4 py-12 border-t border-white/5"
        >
          <div className="max-w-xl mx-auto text-center space-y-6">
            <div className="flex items-center justify-center gap-2 text-zinc-400">
              <Heart className="w-5 h-5 text-pink-500" />
              <span className="font-medium">Support the Project</span>
            </div>
            <p className="text-zinc-500 text-sm">
              If you find this tool helpful, consider supporting its development
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="relative">
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all duration-300"
                >
                  <span className="text-zinc-400 text-sm">UPI:</span>
                  <code className="text-white font-mono text-sm">40488690</code>
                </button>
                <AnimatePresence>
                  {showCopied && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-green-500 text-white text-sm rounded-lg whitespace-nowrap"
                    >
                      Copied!
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <a
                href="https://razorpay.me/@kunalsharma9430"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 hover:scale-105 text-sm font-medium"
              >
                Donate with Razorpay
              </a>
            </div>
          </div>
        </motion.section>

        {/* Footer */}
        <footer className="relative z-10 px-4 py-8 border-t border-white/5">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
            <Link
              href="https://github.com/kunallll17"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors"
            >
              <Github className="w-4 h-4" />
              Created by @kunallll17
            </Link>
            
            <Link
              href="https://github.com/kunallll17/CF-Wrapped/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-white transition-colors"
            >
              Report an issue or request a feature
            </Link>
          </div>
        </footer>
      </div>
      
      <Toaster />
    </main>
  );
}
