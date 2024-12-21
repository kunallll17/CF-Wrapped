import { NextResponse } from 'next/server';
import { fetchUserInfo, fetchUserSubmissions } from '@/lib/api';
import { processUserStats } from '@/lib/stats';

export const dynamic = 'auto';
export const revalidate = 3600; // Revalidate every hour

async function getUserInfo(handle: string) {
  try {
    const response = await fetch(`https://codeforces.com/api/user.info?handles=${handle}`);
    const data = await response.json();
    
    if (data.status === 'OK' && data.result.length > 0) {
      return data.result[0].titlePhoto || data.result[0].avatar;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user info:', error);
    return null;
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const handle = searchParams.get('handle');

    if (!handle) {
      return NextResponse.json(
        { error: 'Handle is required' },
        { status: 400 }
      );
    }

    // Fetch user info including profile picture
    const profilePicture = await getUserInfo(handle);
    
    // Fetch fresh data
    const [userInfo, submissions] = await Promise.all([
      fetchUserInfo(handle),
      fetchUserSubmissions(handle)
    ]);

    // Process stats
    const stats = await processUserStats(userInfo, submissions);

    // Include profile picture in the response
    return NextResponse.json({
      ...stats, // your existing stats
      profilePicture: profilePicture || '', // Add the profile picture URL
    });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch data' },
      { status: error.status || 500 }
    );
  }
}