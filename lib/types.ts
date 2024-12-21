export interface CodeforcesUser {
  handle: string;
  rating: number;
  maxRating: number;
  rank: string;
  maxRank: string;
  titlePhoto?: string;
  avatar: string;
  contribution: number;
}

export interface Submission {
  id: number;
  contestId: number;
  creationTimeSeconds: number;
  programmingLanguage: string;
  verdict: string;
  problem: {
    tags: string[];
    rating?: number;
    index: string;
    name: string;
  };
}

export interface UserStats {
  handle: string;
  totalSubmissions: number;
  acceptedSubmissions: number;
  universalRank: number;
  longestStreak: number;
  mostActiveMonth: string;
  mostActiveDay: string;
  topLanguage: string;
  languageDistribution: Record<string, number>;
  tagDistribution: Record<string, number>;
  contributionData: Record<string, number>;
  ratingProgression: Array<{ date: string; rating: number }>;
  lastUpdated: Date;
}

export interface ApiError {
  status: number;
  message: string;
}