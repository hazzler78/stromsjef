import { NextRequest, NextResponse } from 'next/server';
import { fetchAreasFromStromAPI } from '@/lib/strom-api';

export const revalidate = 0;

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 API: Starting area validation from Strom API...');
    
    // Check if this is an authorized request (optional security)
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.ADMIN_PASSWORD;
    
    if (expectedToken && (!authHeader || authHeader !== `Bearer ${expectedToken}`)) {
      console.log('❌ API: Unauthorized request attempt');
      return NextResponse.json(
        { 
          success: false, 
          error: 'Unauthorized',
          timestamp: new Date().toISOString()
        },
        { status: 401 }
      );
    }

    // Fetch areas from Strom API for validation
    console.log('🔄 API: Fetching areas from Strom API...');
    const areas = await fetchAreasFromStromAPI();
    
    console.log(`✅ API: Fetched ${areas.length} areas from Strom API`);

    return NextResponse.json({
      success: true,
      message: `Successfully validated ${areas.length} price areas from Strom API`,
      areasCount: areas.length,
      areas: areas,
      timestamp: new Date().toISOString()
    }, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store',
      }
    });

  } catch (error) {
    console.error('❌ API: Error validating areas from Strom API:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to validate areas from Strom API',
        details: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'Surrogate-Control': 'no-store',
        }
      }
    );
  }
}

// GET endpoint for testing
export async function GET() {
  try {
    console.log('🔄 API: Testing Strom API connection...');
    
    const areas = await fetchAreasFromStromAPI();
    
    return NextResponse.json({
      success: true,
      message: 'Strom API connection test completed - areas validation',
      areasCount: areas.length,
      hasAreas: areas.length > 0,
      areas: areas,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ API: Strom API test failed:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Strom API test failed',
        details: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
