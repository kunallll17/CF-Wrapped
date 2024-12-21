import { CodeforcesUser, Submission, UserStats } from './types';
import { generateContributionData } from './api';

function calculatePercentileRank(rating: number): number {
  // Codeforces rating distribution approximation
  const maxRating = 3800; // Highest possible rating
  const currentRating = Math.max(rating, 0);
  
  // Calculate percentile (lower is better, like actual ranks)
  return Math.round((1 - (currentRating / maxRating)) * 100);
}

function calculateUniversalRank(rating: number): string {
  if (rating === 0) return "Unrated";
  
  // Codeforces uses these thresholds for ranks
  if (rating >= 3000) return "0.1"; // Legendary Grandmaster
  if (rating >= 2600) return "0.3"; // International Grandmaster
  if (rating >= 2400) return "1";   // Grandmaster
  if (rating >= 2300) return "2";   // International Master
  if (rating >= 2100) return "5";   // Master
  if (rating >= 1900) return "10";  // Candidate Master
  if (rating >= 1600) return "20";  // Expert
  if (rating >= 1400) return "50";  // Specialist
  if (rating >= 1200) return "70";  // Pupil
  return "100";                     // Newbie
}

// Helper function to convert rank string to number
function getRankPercentage(rank: string): number {
  return parseFloat(rank.replace('%', ''));
}

function calculatePowerLevel(stats: {
  universalRank: string;
  totalSubmissions: number;
  acceptedSubmissions: number;
}): PowerClass {
  // Convert rank percentage to number
  const rankPercentage = getRankPercentage(stats.universalRank);
  
  // Rest of the calculation remains same
  const submissionScore = Math.min(100, (stats.totalSubmissions / 1000) * 100);
  const accuracyScore = (stats.acceptedSubmissions / stats.totalSubmissions) * 100;
  
  const powerScore = (
    rankPercentage * 0.5 +
    submissionScore * 0.3 +
    accuracyScore * 0.2
  );

  // Power class definitions remain same...
  if (powerScore <= 5) {
    return {
      title: "LEGENDARY",
      color: "text-yellow-400",
      description: "Among the elite competitive programmers!"
    };
  }
  // ... rest of the power classes ...
}

// Update the interface to match the types
interface UserStats {
  handle: string;
  totalSubmissions: number;
  acceptedSubmissions: number;
  universalRank: string;  // Changed to string to match calculateUniversalRank return type
  longestStreak: number;
  mostActiveMonth: string;
  mostActiveDay: string;
  contributionData: Record<string, number>;
  powerClass: PowerClass;
}

export async function processUserStats(
  user: CodeforcesUser,
  submissions: Submission[]
): Promise<UserStats> {
  // Filter submissions for 2024 only
  const currentYear = new Date().getFullYear();
  const thisYearSubmissions = submissions.filter(submission => {
    const submissionDate = new Date(submission.creationTimeSeconds * 1000);
    return submissionDate.getFullYear() === currentYear;
  });

  // Generate contribution data from submissions
  const contributionData = generateContributionData(submissions);
  
  // Calculate correct universal rank
  const rankPercentile = calculateRankPercentile(user.rating);
  
  const acceptedSubmissions = thisYearSubmissions.filter(s => s.verdict === 'OK');
  
  // Process languages
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
  
  // Find most active month/day
  const submissionsByDate = new Map(Object.entries(contributionData));
  const mostActiveDate = Array.from(submissionsByDate.entries())
    .reduce((a, b) => (a[1] > b[1] ? a : b))[0];

  const monthlySubmissions = new Map<string, number>();
  Object.entries(contributionData).forEach(([date, count]) => {
    const month = date.substring(0, 7);
    monthlySubmissions.set(month, (monthlySubmissions.get(month) || 0) + count);
  });

  const mostActiveMonth = Array.from(monthlySubmissions.entries())
    .reduce((a, b) => (a[1] > b[1] ? a : b))[0];

  const powerClass = calculatePowerLevel({
    universalRank: calculateUniversalRank(user.rating),
    totalSubmissions: Object.values(contributionData).reduce((a, b) => a + b, 0),
    acceptedSubmissions: acceptedSubmissions.length
  });

  return {
    handle: user.handle,
    totalSubmissions: Object.values(contributionData).reduce((a, b) => a + b, 0),
    acceptedSubmissions: acceptedSubmissions.length,
    universalRank: calculateUniversalRank(user.rating),
    longestStreak: streaks.longest,
    mostActiveMonth,
    mostActiveDay: mostActiveDate,
    topLanguage: Array.from(languageCount.entries())
      .sort((a, b) => b[1] - a[1])[0]?.[0] || '',
    languageDistribution: Object.fromEntries(languageCount),
    tagDistribution: Object.fromEntries(tagCount),
    contributionData,
    ratingProgression: thisYearSubmissions
      .filter(s => s.verdict === 'OK')
      .map(s => ({
        date: new Date(s.creationTimeSeconds * 1000).toISOString().split('T')[0],
        rating: s.problem.rating || 0
      }))
      .sort((a, b) => a.date.localeCompare(b.date)),
    lastUpdated: new Date(),
    powerClass,
  };
}

function calculateRankPercentile(rating: number): number {
  // Codeforces rating distribution (approximate)
  const distributions = [
    { rating: 3000, percentile: 0.1 },
    { rating: 2400, percentile: 1 },
    { rating: 2100, percentile: 5 },
    { rating: 1900, percentile: 10 },
    { rating: 1600, percentile: 20 },
    { rating: 1400, percentile: 50 },
    { rating: 1200, percentile: 70 },
    { rating: 1000, percentile: 90 },
  ];
  
  for (const dist of distributions) {
    if (rating >= dist.rating) {
      return dist.percentile;
    }
  }
  return 100;
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