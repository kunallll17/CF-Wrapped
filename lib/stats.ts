// lib/stats.ts

import { CodeforcesUser, Submission, UserStats, PowerClass } from './types';
import { generateContributionData } from './api';

// Utility Functions

function getRankAndColor(rating: number): { rank: string; color: string } {
  if (rating === 0) return { rank: 'Unrated', color: 'text-gray-500' };
  if (rating < 1200) return { rank: 'Newbie', color: 'text-gray-500' };
  if (rating < 1400) return { rank: 'Pupil', color: 'text-green-500' };
  if (rating < 1600) return { rank: 'Specialist', color: 'text-cyan-500' };
  if (rating < 1900) return { rank: 'Expert', color: 'text-blue-500' };
  if (rating < 2100) return { rank: 'Candidate Master', color: 'text-purple-500' };
  if (rating < 2300) return { rank: 'Master', color: 'text-[#FFA500]' };
  if (rating < 2400) return { rank: 'International Master', color: 'text-[#FFA500]' };
  if (rating < 2600) return { rank: 'Grandmaster', color: 'text-[#FF0000]' };
  if (rating < 3000) return { rank: 'International Grandmaster', color: 'text-[#FF0000]' };
  return { rank: 'Legendary Grandmaster', color: 'text-[#FF0000]' };
}

function calculatePercentileRank(rating: number): number {
  // Codeforces rating distribution approximation
  const maxRating = 3800; // Highest possible rating
  const currentRating = Math.max(rating, 0);
  
  // Calculate percentile (lower is better, like actual ranks)
  return Math.round((1 - (currentRating / maxRating)) * 100);
}

function calculateUniversalRank(rating: number): number {
  if (rating === 0) return 100;
  
  // Codeforces uses these thresholds for ranks
  if (rating >= 3000) return 0.1;  // Legendary Grandmaster
  if (rating >= 2600) return 0.3;  // International Grandmaster
  if (rating >= 2400) return 1;    // Grandmaster
  if (rating >= 2300) return 2;    // International Master
  if (rating >= 2100) return 5;    // Master
  if (rating >= 1900) return 10;   // Candidate Master
  if (rating >= 1600) return 20;   // Expert
  if (rating >= 1400) return 50;   // Specialist
  if (rating >= 1200) return 70;   // Pupil
  return 100;                      // Newbie
}

// Helper function to convert rank string to number
function getRankPercentage(rank: string): number {
  return parseFloat(rank.replace('%', ''));
}

function calculatePowerLevel(stats: {
  universalRank: number;
  totalSubmissions: number;
  acceptedSubmissions: number;
}): PowerClass {
  // Calculate based primarily on total submissions
  const submissions = stats.totalSubmissions;

  if (submissions >= 9000) {
    return {
      title: "GOD MODE ⚡",
      color: "text-yellow-400",
      description: "Absolutely legendary! You've transcended mortal coding limits!"
    };
  } else if (submissions >= 4000) {
    return {
      title: "SUPER SAIYAN 🔥 💥",
      color: "text-orange-500",
      description: "Your power level is over 4000! Incredible mastery!"
    };
  } else if (submissions >= 2000) {
    return {
      title: "SAGE MODE 🌀",
      color: "text-blue-400",
      description: "You've achieved perfect harmony with the code!"
    };
  } else if (submissions >= 1000) {
    return {
      title: "ELITE CLASS ⚡",
      color: "text-purple-500",
      description: "Your dedication to competitive programming is outstanding!"
    };
  } else if (submissions >= 500) {
    return {
      title: "NINJA 🥷",
      color: "text-gray-300",
      description: "Stealthily solving problems with precision!"
    };
  } else if (submissions >= 100) {
    return {
      title: "ADVENTURER 🌊",
      color: "text-cyan-400",
      description: "Embarking on an epic coding journey!"
    };
  } else {
    return {
      title: "ROOKIE 🌱",
      color: "text-green-400",
      description: "Beginning your path to greatness!"
    };
  }
}

function calculateStreaks(contributionData: Record<string, number>): { current: number; longest: number } {
  let current = 0;
  let longest = 0;
  let currentStreak = 0;

  // Convert to array and sort by date
  const sortedDates = Object.entries(contributionData)
    .sort((a, b) => a[0].localeCompare(b[0]));

  // Calculate streaks
  for (let i = 0; i < sortedDates.length; i++) {
    const [date, count] = sortedDates[i];
    
    if (count > 0) {
      currentStreak++;
      longest = Math.max(longest, currentStreak);
    } else {
      currentStreak = 0;
    }

    // Check if this is today or the last submission
    const submissionDate = new Date(date);
    const today = new Date();
    if (submissionDate.toDateString() === today.toDateString()) {
      current = currentStreak;
    }
  }

  return { current, longest };
}

function calculateTopLanguage(submissions: Submission[]): string {
  const languageCounts: Record<string, number> = {};
  
  submissions.forEach(submission => {
    const lang = submission.programmingLanguage;
    languageCounts[lang] = (languageCounts[lang] || 0) + 1;
  });

  let topLanguage = 'Unknown';
  let maxCount = 0;

  Object.entries(languageCounts).forEach(([lang, count]) => {
    if (count > maxCount) {
      maxCount = count;
      topLanguage = lang;
    }
  });

  return topLanguage;
}

function processSubmissionStats(submissions: Submission[]) {
  const languageCount = new Map<string, number>();
  const tagCount = new Map<string, number>();
  
  const thisYearSubmissions = submissions.filter(sub => {
    const subDate = new Date(sub.creationTimeSeconds * 1000);
    return subDate.getFullYear() === new Date().getFullYear();
  });

  thisYearSubmissions.forEach(submission => {
    // Process programming language
    if (submission.programmingLanguage) {
      languageCount.set(
        submission.programmingLanguage,
        (languageCount.get(submission.programmingLanguage) || 0) + 1
      );
    }
    
    // Process problem tags safely
    if (submission.problem.tags && Array.isArray(submission.problem.tags)) {
      submission.problem.tags.forEach(tag => {
        tagCount.set(tag, (tagCount.get(tag) || 0) + 1);
      });
    }
  });

  // Get top language
  let topLanguage = 'Unknown';
  let maxLangCount = 0;
  languageCount.forEach((count, lang) => {
    if (count > maxLangCount) {
      maxLangCount = count;
      topLanguage = lang;
    }
  });

  // Get top tags
  const topTags = Array.from(tagCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([tag]) => tag);

  return {
    topLanguage,
    topTags,
    languageStats: Object.fromEntries(languageCount),
    tagStats: Object.fromEntries(tagCount)
  };
}

// Main Function

export async function processUserStats(
  user: CodeforcesUser,
  submissions: Submission[]
): Promise<UserStats> {
  // Filter submissions for the current year
  const currentYear = new Date().getFullYear();
  const thisYearSubmissions = submissions.filter(submission => {
    const submissionDate = new Date(submission.creationTimeSeconds * 1000);
    return submissionDate.getFullYear() === currentYear;
  });

  // Generate contribution data from submissions
  const contributionData = generateContributionData(submissions);
  
  // Calculate universal rank
  const rankPercentile = calculatePercentileRank(user.rating);
  
  const acceptedSubmissions = thisYearSubmissions.filter(s => s.verdict === 'OK');
  
  // Process languages and tags
  const languageCount = new Map<string, number>();
  const tagCount = new Map<string, number>();
  
  thisYearSubmissions.forEach(submission => {
    languageCount.set(
      submission.programmingLanguage,
      (languageCount.get(submission.programmingLanguage) || 0) + 1
    );
    
    submission.problem.tags.forEach(tag => {
      tagCount.set(tag, (tagCount.get(tag) || 0) + 1);
    });
  });

  // Calculate streaks
  const streaks = calculateStreaks(contributionData);
  
  // Find most active day
  const submissionsByDate = new Map(Object.entries(contributionData));
  const mostActiveDate = Array.from(submissionsByDate.entries())
    .reduce((a, b) => (a[1] > b[1] ? a : b))[0];
  
  // Find most active month
  const monthlySubmissions = new Map<string, number>();
  Object.entries(contributionData).forEach(([date, count]) => {
    const month = date.substring(0, 7); // Format: YYYY-MM
    monthlySubmissions.set(month, (monthlySubmissions.get(month) || 0) + count);
  });
  
  const mostActiveMonth = Array.from(monthlySubmissions.entries())
    .reduce((a, b) => (a[1] > b[1] ? a : b))[0];
  
  // Calculate power class
  const powerClass = calculatePowerLevel({
    universalRank: calculateUniversalRank(user.rating),
    totalSubmissions: Object.values(contributionData).reduce((a, b) => a + b, 0),
    acceptedSubmissions: acceptedSubmissions.length
  });
  
  const submissionStats = processSubmissionStats(submissions);

  const ratingProgression = thisYearSubmissions
    .filter(s => s.verdict === 'OK' && s.problem.rating !== undefined)
    .map(s => ({
      date: new Date(s.creationTimeSeconds * 1000).toISOString().split('T')[0],
      rating: s.problem.rating || 0
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return {
    handle: user.handle,
    totalSubmissions: Object.values(contributionData).reduce((a, b) => a + b, 0),
    acceptedSubmissions: acceptedSubmissions.length,
    universalRank: calculateUniversalRank(user.rating),
    problemsSolved: new Set(acceptedSubmissions.map(s => s.problem.contestId + s.problem.index)).size,
    totalSolved: new Set(submissions.filter(s => s.verdict === 'OK').map(s => s.problem.contestId + s.problem.index)).size,
    longestStreak: streaks.longest,
    mostActiveMonth,
    mostActiveDay: mostActiveDate,
    contributionData,
    ratingProgression,
    topLanguage: submissionStats.topLanguage,
    topTags: submissionStats.topTags,
    languageStats: submissionStats.languageStats,
    tagStats: submissionStats.tagStats,
    lastUpdated: new Date(),
    powerClass,
    rating: {
      current: user.rating,
      maxRating: user.maxRating,
      currentRating: user.rating,
      currentRank: getRankAndColor(user.rating).rank,
      maxRank: getRankAndColor(user.maxRating).rank,
      currentColor: getRankAndColor(user.rating).color,
      maxColor: getRankAndColor(user.maxRating).color
    },
    profilePicture: ''
  };
}
