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
  verdict: string;
  problem: {
    contestId?: number;
    index: string;
    name: string;
    rating?: number;
  };
}

export interface UserStats {
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
}

export interface ApiError {
  status: number;
  message: string;
}