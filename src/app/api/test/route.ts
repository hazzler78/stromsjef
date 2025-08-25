// test redeploy
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('🧪 Test endpoint: Basic functionality test');
    
    return NextResponse.json({
      success: true,
      message: 'Basic API functionality is working',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Test endpoint error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Test endpoint failed',
        details: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
} 