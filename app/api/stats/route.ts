import { NextResponse } from 'next/server';
import { fetchUserInfo, fetchUserSubmissions } from '@/lib/api';
import { processUserStats } from '@/lib/stats';

export const dynamic = 'auto';
export const revalidate = 3600; // Revalidate every hour

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
  if (rating < 4000) return { rank: 'Legendary Grandmaster', color: 'text-[#FF0000]' };
  return { rank: 'Tourist', color: 'text-[#FF0000]' };
}

async function getUserInfo(handle: string) {
  try {
    const response = await fetch(`https://codeforces.com/api/user.info?handles=${handle}`);
    const data = await response.json();
    
    if (data.status === 'OK' && data.result.length > 0) {
      const user = data.result[0];
      const currentRating = user.rating || 0;
      const maxRating = user.maxRating || 0;
      const currentRankInfo = getRankAndColor(currentRating);
      const maxRankInfo = getRankAndColor(maxRating);

      // Ensure HTTPS and handle both titlePhoto and avatar
      let profilePicture = user.titlePhoto || user.avatar || '';
      if (profilePicture) {
        profilePicture = profilePicture.replace(/^http:/, 'https:');
      }

      return {
        profilePicture,
        rating: {
          current: currentRating,
          maxRating: maxRating,
          currentRank: currentRankInfo.rank,
          maxRank: maxRankInfo.rank,
          currentColor: currentRankInfo.color,
          maxColor: maxRankInfo.color
        }
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching user info:', error);
    return null;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const handle = searchParams.get('handle');

  if (!handle) {
    return new Response(JSON.stringify({ error: 'Handle is required' }), {
      status: 400,
    });
  }

  try {
    // Fetch user rating and profile info
    const ratingInfo = await getUserInfo(handle);
    
    // Fetch fresh data
    const [userInfo, submissions] = await Promise.all([
      fetchUserInfo(handle),
      fetchUserSubmissions(handle)
    ]);

    // Process stats
    const stats = await processUserStats(userInfo, submissions);

    // Combine all data
    const combinedStats = {
      ...stats,
      handle, // Explicitly include handle
      profilePicture: ratingInfo?.profilePicture || null,
      rating: ratingInfo?.rating || {
        current: 0,
        maxRating: 0,
        currentRank: 'Unrated',
        maxRank: 'Unrated',
        currentColor: 'text-gray-500',
        maxColor: 'text-gray-500'
      }
    };

    return new Response(JSON.stringify(combinedStats));
  } catch (error) {
    console.error('Error fetching stats:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch stats' }), {
      status: 500,
    });
  }
}