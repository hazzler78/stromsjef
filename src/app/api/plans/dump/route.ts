import { NextResponse } from 'next/server';
import { getAllPlans, getAllClickCounts } from '@/lib/database';

export async function GET() {
  try {
    const [plans, clickStats] = await Promise.all([
      getAllPlans(),
      getAllClickCounts()
    ]);

    return NextResponse.json({
      success: true,
      plans,
      clickStats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in dump endpoint:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 