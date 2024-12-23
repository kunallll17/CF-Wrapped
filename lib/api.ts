import { CodeforcesUser, Submission } from './types';

const FETCH_TIMEOUT = 10000; // 10 seconds

async function fetchWithTimeout(url: string, options: RequestInit = {}) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

const CF_API_BASE = 'https://codeforces.com/api';

export async function fetchUserInfo(handle: string) {
  const res = await fetch(`${CF_API_BASE}/user.info?handles=${handle}`);
  
  if (!res.ok) {
    throw new Error('Failed to fetch user info');
  }

  const data = await res.json();
  
  if (data.status === 'FAILED') {
    throw new Error(data.comment || 'Failed to fetch user info');
  }

  return data.result[0];
}

export async function fetchUserSubmissions(handle: string) {
  const res = await fetch(`${CF_API_BASE}/user.status?handle=${handle}`);
  
  if (!res.ok) {
    throw new Error('Failed to fetch submissions');
  }

  const data = await res.json();
  
  if (data.status === 'FAILED') {
    throw new Error(data.comment || 'Failed to fetch submissions');
  }

  return data.result;
}

export function generateContributionData(submissions: Submission[]): Record<string, number> {
  const contributionData: Record<string, number> = {};
  
  // Get current year
  const currentYear = new Date().getFullYear();
  
  // Initialize all dates in current year to 0
  for (let d = new Date(currentYear, 0, 1); d <= new Date(); d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    contributionData[dateStr] = 0;
  }

  // Count submissions
  submissions.forEach(submission => {
    const date = new Date(submission.creationTimeSeconds * 1000);
    
    // Only count submissions from current year
    if (date.getFullYear() === currentYear) {
      const dateStr = date.toISOString().split('T')[0];
      contributionData[dateStr] = (contributionData[dateStr] || 0) + 1;
    }
  });

  return contributionData;
}

// Helper function to format date consistently
export function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toISOString().split('T')[0];
}

// Helper function to get accepted submissions
export function getAcceptedSubmissions(submissions: Submission[]): Submission[] {
  return submissions.filter(sub => sub.verdict === 'OK');
}

export const RATE_LIMIT = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 5,
};