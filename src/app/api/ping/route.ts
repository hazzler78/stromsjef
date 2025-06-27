// ping endpoint for troubleshooting
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    message: 'Ping endpoint working',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
} 