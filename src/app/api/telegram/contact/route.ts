import { NextRequest, NextResponse } from 'next/server';
import { sendTelegramMessage } from '@/lib/telegram-bot';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, newsletterOptIn, source, message } = body;

    if (!name || !email || !phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get multiple chat IDs from environment variable
    const chatIdsString = process.env.TELEGRAM_CONTACT_CHAT_IDS || process.env.TELEGRAM_CONTACT_CHAT_ID;
    if (!chatIdsString) {
      return NextResponse.json({ error: 'No TELEGRAM_CONTACT_CHAT_IDS set in env' }, { status: 500 });
    }

    // Parse comma-separated chat IDs
    const chatIds = chatIdsString.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
    if (chatIds.length === 0) {
      return NextResponse.json({ error: 'No valid chat IDs found in TELEGRAM_CONTACT_CHAT_IDS' }, { status: 500 });
    }

    // Compose message
    const messageText =
      `📞 *Ny kontakthenvendelse fra nettsiden:*
` +
      `*Navn:* ${name}
` +
      `*E-post:* ${email}
` +
      `*Telefon:* ${phone}
` +
      `*Nyhetsbrev:* ${newsletterOptIn ? 'Ja' : 'Nei'}
` +
      (source ? `*Kilde:* ${source}
` : '') +
      (message ? `*Melding:*
${message}
` : '');

    // Send message to all chat IDs
    const sendPromises = chatIds.map(chatId => sendTelegramMessage(chatId, messageText));
    const results = await Promise.allSettled(sendPromises);
    
    // Check if all messages were sent successfully
    const successfulSends = results.filter(result => result.status === 'fulfilled' && result.value).length;
    const failedSends = results.length - successfulSends;
    
    if (failedSends > 0) {
      console.warn(`⚠️ Some Telegram messages failed to send: ${failedSends}/${results.length} failed`);
      // Still return success if at least one message was sent
      if (successfulSends === 0) {
        return NextResponse.json({ error: 'Failed to send Telegram messages to any recipients' }, { status: 500 });
      }
    }
    
    console.log(`✅ Successfully sent contact form message to ${successfulSends}/${results.length} recipients`);
    return NextResponse.json({ 
      success: true, 
      sentTo: successfulSends,
      totalRecipients: results.length
    });
  } catch (error) {
    console.error('❌ Error in contact form endpoint:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 