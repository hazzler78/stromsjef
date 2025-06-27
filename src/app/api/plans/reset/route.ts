import { NextResponse } from 'next/server';
import { resetToDefaultPrices } from '@/lib/database';

// Force no caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST() {
  try {
    console.log('🔄 API: Resetting database to default prices...');
    
    const success = await resetToDefaultPrices();
    
    if (success) {
      console.log('✅ API: Database reset successfully');
      return NextResponse.json({
        success: true,
        message: 'Database reset to default prices successfully',
        timestamp: new Date().toISOString()
      }, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'Surrogate-Control': 'no-store',
        }
      });
    } else {
      throw new Error('Failed to reset database');
    }
  } catch (error) {
    console.error('❌ API: Error resetting database:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to reset database',
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