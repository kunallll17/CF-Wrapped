import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

const CF_API_BASE = 'https://codeforces.com/api';

export async function GET(request: Request) {
  try {
    const headersList = headers();
    const host = headersList.get('host') || 'localhost';
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    
    // Construct full URL using host
    const fullUrl = new URL(request.url, `${protocol}://${host}`);
    const endpoint = fullUrl.searchParams.get('endpoint');
    const params = fullUrl.searchParams.get('params');

    if (!endpoint) {
      return NextResponse.json(
        { error: 'Endpoint is required' },
        { status: 400 }
      );
    }

    // Construct Codeforces API URL
    const cfUrl = new URL(`${CF_API_BASE}/${endpoint}`);
    if (params) {
      cfUrl.search = params;
    }

    console.log('Fetching from:', cfUrl.toString());

    const response = await fetch(cfUrl.toString(), {
      headers: {
        'Accept': 'application/json',
      },
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Proxy Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch data' },
      { status: 500 }
    );
  }
} 