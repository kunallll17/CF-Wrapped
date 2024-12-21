import { NextResponse } from 'next/server';
import { fetchUserInfo, fetchUserSubmissions } from '@/lib/api';
import { processUserStats } from '@/lib/stats';

export const dynamic = 'auto';
export const revalidate = 3600; // Revalidate every hour

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

    // Fetch fresh data
    const [userInfo, submissions] = await Promise.all([
      fetchUserInfo(handle),
      fetchUserSubmissions(handle)
    ]);

    // Process stats
    const stats = await processUserStats(userInfo, submissions);

    return NextResponse.json(stats);
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch data' },
      { status: error.status || 500 }
    );
  }
}