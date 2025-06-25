import { NextRequest, NextResponse } from 'next/server';
import { parsePriceUpdateCommand, validatePriceUpdateCommand } from '@/lib/nlp-utils';
import { updateElectricityPrices, getCurrentPrices } from '@/lib/price-update-service';
import { handleTelegramMessage } from '@/lib/telegram-bot';
import { getAllClickCounts } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, userId } = body;

    if (!text) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 });
    }

    console.log(`Test endpoint: Processing message "${text}" from user ${userId}`);

    // Process the message with a complete Message object
    const response = await handleTelegramMessage({ 
      message_id: 1,
      date: Math.floor(Date.now() / 1000),
      text, 
      from: { 
        id: userId || 123456789,
        is_bot: false,
        first_name: 'Test User'
      },
      chat: {
        id: userId || 123456789,
        type: 'private',
        first_name: 'Test User'
      }
    });

    return NextResponse.json({ success: true, response });
  } catch (error) {
    console.error('Error in test endpoint:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Test endpoint: Starting getAllClickCounts test...');
    
    const clickCounts = await getAllClickCounts();
    
    console.log('🧪 Test endpoint: Successfully fetched click counts:', clickCounts);
    
    return NextResponse.json({ 
      success: true, 
      clickCounts,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Test endpoint: Error:', error);
    console.error('❌ Test endpoint: Error details:', error instanceof Error ? error.message : String(error));
    console.error('❌ Test endpoint: Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 