import { NextResponse } from 'next/server';
import { getAllPlans, initializeDatabase } from '@/lib/database';

// Force no caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    console.log('🔄 API: Initializing database...');
    // Initialize database if needed
    await initializeDatabase();
    
    console.log('🔄 API: Getting all plans...');
    // Get all plans from database
    const plans = await getAllPlans();
    
    console.log(`✅ API: Returning ${plans.length} plans`);
    
    // Log some plan details for debugging
    const cheapEnergyPlans = plans.filter(p => p.supplierName.includes('Cheap Energy'));
    console.log('API: Cheap Energy plans:', cheapEnergyPlans.map(p => `${p.planName} ${p.priceZone}: ${p.pricePerKwh} øre/kWh`));
    
    return NextResponse.json({
      success: true,
      plans,
      count: plans.length,
      timestamp: new Date().toISOString()
    }, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  } catch (error) {
    console.error('Error fetching plans:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch plans',
        timestamp: new Date().toISOString()
      },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'Surrogate-Control': 'no-store',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      }
    );
  }
} 