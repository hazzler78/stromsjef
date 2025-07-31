import { NextResponse } from 'next/server';
import { getAllPlans, initializeDatabase, addPlan } from '@/lib/database';

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

export async function POST(request: Request) {
  try {
    const plan = await request.json();
    // Enkel validering (kan utvides)
    if (!plan || !plan.id || !plan.supplierName || !plan.planName || !plan.priceZone) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }
    const ok = await addPlan(plan);
    if (ok) {
      return NextResponse.json({ success: true, plan });
    } else {
      return NextResponse.json({ success: false, error: 'Failed to add plan' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing id' }, { status: 400 });
    }
    // Hent alle planer
    const plans = await getAllPlans();
    const index = plans.findIndex(p => p.id === id);
    if (index === -1) {
      return NextResponse.json({ success: false, error: 'Plan not found' }, { status: 404 });
    }
    plans.splice(index, 1);
    // Lagre tilbake
    if (process.env.NODE_ENV === 'development' && (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN)) {
      // inMemoryPlans håndteres i database.ts
      // Vi kan ikke nå inMemoryPlans her, så vi hopper over dev-mode delete
    } else {
      const { kv } = await import('@vercel/kv');
      await kv.set('electricity_plans', plans);
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const plan = await request.json();
    if (!plan || !plan.id) {
      return NextResponse.json({ success: false, error: 'Missing id' }, { status: 400 });
    }
    const plans = await getAllPlans();
    const index = plans.findIndex(p => p.id === plan.id);
    if (index === -1) {
      return NextResponse.json({ success: false, error: 'Plan not found' }, { status: 404 });
    }
    plans[index] = { ...plans[index], ...plan };
    if (process.env.NODE_ENV === 'development' && (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN)) {
      // inMemoryPlans håndteres i database.ts
    } else {
      const { kv } = await import('@vercel/kv');
      await kv.set('electricity_plans', plans);
    }
    return NextResponse.json({ success: true, plan: plans[index] });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
} 