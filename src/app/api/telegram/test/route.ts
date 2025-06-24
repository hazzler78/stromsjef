import { NextRequest, NextResponse } from 'next/server';
import { parsePriceUpdateCommand, validatePriceUpdateCommand } from '@/lib/nlp-utils';
import { updateElectricityPrices, getCurrentPrices } from '@/lib/price-update-service';
import { handleTelegramMessage } from '@/lib/telegram-bot';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message } = body;

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Simulate a Telegram message object
    const telegramMessage = {
      from: { id: 6569007750 }, // Use a valid allowed user ID
      text: message,
      chat: { id: 6569007750 }
    } as any; // Cast to any to avoid TypeScript issues with missing properties

    // Handle special commands first
    const lowerMessage = message.toLowerCase().trim();
    if (lowerMessage === '/report' || lowerMessage === 'report') {
      const reportResult = await handleTelegramMessage(telegramMessage);
      return NextResponse.json({
        originalMessage: message,
        reportResult,
        currentPrices: await getCurrentPrices()
      });
    }

    // Test the parsing
    const commands = parsePriceUpdateCommand(message);
    
    // Test validation
    const validationResults = commands.map(cmd => ({
      command: cmd,
      validation: validatePriceUpdateCommand(cmd)
    }));

    // Test price update (if commands are valid)
    let updateResult = null;
    const validCommands = commands.filter(cmd => validatePriceUpdateCommand(cmd).valid);
    if (validCommands.length > 0) {
      updateResult = await updateElectricityPrices(validCommands);
    }

    return NextResponse.json({
      originalMessage: message,
      parsedCommands: commands,
      validationResults,
      updateResult,
      currentPrices: await getCurrentPrices()
    });

  } catch (error) {
    console.error('Error in test endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Test endpoint for Telegram bot',
    usage: 'POST with { "message": "Set Kilden in NO1 to 0.59" }',
    currentPrices: await getCurrentPrices()
  });
} 