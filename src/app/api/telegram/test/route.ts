import { NextRequest, NextResponse } from 'next/server';
import { parsePriceUpdateCommand, validatePriceUpdateCommand } from '@/lib/nlp-utils';
import { updateElectricityPrices, getCurrentPrices } from '@/lib/price-update-service';
import { handleTelegramMessage } from '@/lib/telegram-bot';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, userId } = body;

    if (!text) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 });
    }

    console.log(`Test endpoint: Processing message "${text}" from user ${userId}`);

    // Process the message with a complete User object
    const response = await handleTelegramMessage({ 
      text, 
      from: { 
        id: userId || 123456789,
        is_bot: false,
        first_name: 'Test User'
      } 
    });

    return NextResponse.json({ success: true, response });
  } catch (error) {
    console.error('Error in test endpoint:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Test endpoint for Telegram bot',
    usage: 'POST with { "message": "Set Kilden in NO1 to 0.59" }',
    currentPrices: await getCurrentPrices()
  });
} 