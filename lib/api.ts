import { CodeforcesUser, Submission } from './types';

const CF_API_BASE = 'https://codeforces.com/api';

export async function fetchUserInfo(handle: string): Promise<CodeforcesUser> {
  const res = await fetch(`${CF_API_BASE}/user.info?handles=${handle}`);
  const data = await res.json();
  
  if (data.status === 'FAILED') {
    throw new Error(data.comment);
  }
  
  const user = data.result[0];
  
  // Construct the avatar URL directly from handle
  const avatarUrl = `https://userpic.codeforces.org/user/${handle}/photo.jpg`;

  return {
    ...user,
    avatar: avatarUrl
  };
}

export async function fetchUserSubmissions(handle: string): Promise<Submission[]> {
  const res = await fetch(`${CF_API_BASE}/user.status?handle=${handle}`);
  const data = await res.json();
  
  if (data.status === 'FAILED') {
    throw new Error(data.comment);
  }
  
  return data.result;
}

// Instead of scraping, we'll generate contribution data from submissions
export function generateContributionData(submissions: Submission[]): Record<string, number> {
  const currentYear = new Date().getFullYear();
  const contributionData: Record<string, number> = {};
  
  // Initialize all dates of the current year
  const startDate = new Date(currentYear, 0, 1);
  const endDate = new Date();
  
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    contributionData[d.toISOString().split('T')[0]] = 0;
  }

  // Count submissions for each date
  submissions.forEach(submission => {
    const date = new Date(submission.creationTimeSeconds * 1000);
    if (date.getFullYear() === currentYear) {
      const dateStr = date.toISOString().split('T')[0];
      contributionData[dateStr] = (contributionData[dateStr] || 0) + 1;
    }
  });

  return contributionData;
}

export const RATE_LIMIT = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 5,
};