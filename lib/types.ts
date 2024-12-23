export interface CodeforcesUser {
  handle: string;
  rating: number;
  maxRating: number;
  rank: string;
  maxRank: string;
  contribution: number;
  titlePhoto?: string;
  avatar?: string;
}

export interface Submission {
  id: number;
  contestId?: number;
  creationTimeSeconds: number;
  programmingLanguage: string;
  verdict: string;
  problem: {
    contestId?: number;
    index: string;
    name: string;
    rating?: number;
    tags: string[];
  };
}

interface RatingPoint {
  date: string;
  rating: number;
}

export interface UserStats {
  handle: string;
  totalSubmissions: number;
  acceptedSubmissions: number;
  mostActiveDay: string;
  mostActiveMonth: string;
  topLanguage: string;
  powerClass: {
    title: string;
    description: string;
    color: string;
  };
  universalRank: number;
  longestStreak: number;
  contributionData: Record<string, number>;
  profilePicture: string;
  rating: {
    current: number;
    maxRating: number;
    currentRating: number;
    currentRank: string;
    maxRank: string;
    currentColor: string;
    maxColor: string;
  };
  problemsSolved: number;
  totalSolved: number;
  topTags: string[];
  languageStats: Record<string, number>;
  tagStats: Record<string, number>;
  lastUpdated: Date;
  ratingProgression: RatingPoint[];
}

export interface ApiError {
  status: number;
  message: string;
}

export interface PowerClass {
  title: string;
  color: string;
  description: string;
}