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
  totalSolved: any;
  problemsSolved: any;
  handle: string;
  totalSubmissions: number;
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
    currentRating: any;
    current: number;
    maxRating: number;
    currentRank: string;
    maxRank: string;
    currentColor: string;
    maxColor: string;
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