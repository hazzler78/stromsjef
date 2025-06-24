import { NextResponse } from 'next/server';
import { getAllPlans, initializeDatabase } from '@/lib/database';

export async function GET() {
  try {
    // Initialize database if needed
    await initializeDatabase();
    
    // Get all plans from database
    const plans = await getAllPlans();
    
    return NextResponse.json({
      success: true,
      plans,
      count: plans.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching plans:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch plans',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
} 