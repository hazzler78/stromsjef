import { NextRequest, NextResponse } from 'next/server';
import { incrementClick } from '@/lib/database';

export async function POST(req: NextRequest) {
  const { buttonId } = await req.json();
  if (!buttonId) return NextResponse.json({ error: 'Missing buttonId' }, { status: 400 });

  try {
    await incrementClick(buttonId);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false, error: e?.toString() });
  }
} 