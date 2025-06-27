// test redeploy
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    message: 'Test endpoint working',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
} 