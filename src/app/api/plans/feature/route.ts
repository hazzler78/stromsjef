import { NextRequest, NextResponse } from 'next/server';
import { setPlanFeatured } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const { id, featured } = await request.json();
    if (!id || typeof featured !== 'boolean') {
      return NextResponse.json({ success: false, error: 'Missing id or featured' }, { status: 400 });
    }
    const ok = await setPlanFeatured(id, featured);
    if (ok) {
      return NextResponse.json({ success: true, id, featured });
    } else {
      return NextResponse.json({ success: false, error: 'Plan not found' }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
} 