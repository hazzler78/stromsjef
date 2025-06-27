import { NextRequest, NextResponse } from 'next/server';
import { handleTelegramMessage, sendTelegramMessage, bot } from '@/lib/telegram-bot';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message } = body;
    
    if (!message) {
      return NextResponse.json({ error: 'No message found' }, { status: 400 });
    }

    const { text, from, chat } = message;
    const userId = from?.id;
    const chatId = chat?.id;

    if (!text) {
      return NextResponse.json({ error: 'No text found' }, { status: 400 });
    }

    if (!chatId) {
      console.error('❌ Telegram webhook: No chat ID found in message');
      return NextResponse.json({ error: 'No chat ID found' }, { status: 400 });
    }

    // TEMPORARILY DISABLED: User authorization check
    console.log(`📨 Telegram webhook: Received message from user ${userId} in chat ${chatId}: ${text}`);

    // Process the message
    console.log(`📨 Telegram webhook: Processing message...`);
    const response = await handleTelegramMessage(message);
    console.log(`📨 Telegram webhook: Bot response:`, response.substring(0, 100) + '...');
    
    // Send response back to user
    console.log(`📨 Telegram webhook: Sending response to chat ${chatId}`);
    const messageSent = await sendTelegramMessage(chatId, response);
    
    if (!messageSent) {
      console.error('❌ Telegram webhook: Failed to send message to user');
      return NextResponse.json({ 
        error: 'Failed to send message to user',
        response: response 
      }, { status: 500 });
    }
    
    console.log(`✅ Telegram webhook: Successfully processed message`);
    return NextResponse.json({ success: true, response });
  } catch (error) {
    console.error('❌ Telegram webhook: Error processing message:', error);
    console.error('❌ Telegram webhook: Error details:', error instanceof Error ? error.message : String(error));
    console.error('❌ Telegram webhook: Error stack:', error instanceof Error ? error.stack : 'No stack trace');
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