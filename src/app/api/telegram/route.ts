import { NextRequest, NextResponse } from 'next/server';
import { handleTelegramMessage, sendTelegramMessage, bot } from '@/lib/telegram-bot';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Handle Telegram webhook update
    if (body.message) {
      const message = body.message;
      const chatId = message.chat.id;
      
      // Process the message
      const response = await handleTelegramMessage(message);
      
      // Send response back to user
      await sendTelegramMessage(chatId, response);
      
      return NextResponse.json({ success: true });
    }
    
    // Handle callback queries (for inline keyboards if needed)
    if (body.callback_query) {
      const callbackQuery = body.callback_query;
      const chatId = callbackQuery.message.chat.id;
      
      // For now, just acknowledge the callback
      if (bot) {
        await bot.answerCallbackQuery(callbackQuery.id);
      }
      
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json({ success: true, message: 'No message or callback query found' });
    
  } catch (error) {
    console.error('Error handling Telegram webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
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