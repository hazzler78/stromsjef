import { NextRequest, NextResponse } from 'next/server';
import { handleTelegramMessage, sendTelegramMessage, bot } from '@/lib/telegram-bot';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message } = body;
    
    if (!message) {
      return NextResponse.json({ error: 'No message found' }, { status: 400 });
    }

    const { text, from } = message;
    const userId = from?.id;

    if (!text) {
      return NextResponse.json({ error: 'No text found' }, { status: 400 });
    }

    // Check if user is authorized
    const authorizedUsers = process.env.TELEGRAM_AUTHORIZED_USERS?.split(',').map(id => parseInt(id.trim())) || [];
    
    if (!userId || !authorizedUsers.includes(userId)) {
      console.log(`Unauthorized access attempt from user ${userId}`);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log(`Received message from user ${userId}: ${text}`);

    // Process the message
    const response = await handleTelegramMessage(message);
    
    // Send response back to user
    await sendTelegramMessage(message.chat.id, response);
    
    return NextResponse.json({ success: true, response });
  } catch (error) {
    console.error('Error processing Telegram webhook:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  // Health check endpoint
  return NextResponse.json({ 
    status: 'ok', 
    bot: bot ? 'initialized' : 'not configured',
    timestamp: new Date().toISOString()
  });
} 