export interface CodeforcesUser {
  handle: string;
  rating: number;
  maxRating: number;
  rank: string;
  maxRank: string;
  contribution: number;
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
  problemsSolved: any;
  totalSolved: any;
  handle: string;
  totalSubmissions: number;
  acceptedSubmissions: number;
  universalRank: string;
  longestStreak: number;
  mostActiveMonth: string;
  mostActiveDay: string;
  contributionData: Record<string, number>;
  powerClass: {
    title: string;
    color: string;
    description: string;
  };
  topLanguage: string;
  topTags: string[];
  languageStats: Record<string, number>;
  tagStats: Record<string, number>;
  ratingProgression: RatingPoint[];
  lastUpdated: Date;
  profilePicture: string;
  rating?: {
    maxRating: number;
    currentRating: number;
  };
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