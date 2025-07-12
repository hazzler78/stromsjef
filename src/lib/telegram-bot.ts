import TelegramBot from 'node-telegram-bot-api';
import { parsePriceUpdateCommand, validatePriceUpdateCommand, formatPriceUpdateResponse } from './nlp-utils';
import { updateElectricityPrices, getCurrentPrices, resetToDefaultPrices } from './price-update-service';
import { getAllClickCounts, setPlanFeatured } from './database';

// Bot token should be set in environment variables
const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
  console.warn('TELEGRAM_BOT_TOKEN not set. Bot will not function properly.');
}

// Create bot instance
export const bot = token ? new TelegramBot(token, { polling: false }) : null;

// Allowed user IDs (for security)
const ALLOWED_USERS = process.env.TELEGRAM_ALLOWED_USERS?.split(',').map(id => parseInt(id.trim())) || [];

export function isAuthorizedUser(userId: number): boolean {
  return ALLOWED_USERS.length === 0 || ALLOWED_USERS.includes(userId);
}

export async function handleTelegramMessage(message: TelegramBot.Message): Promise<string> {
  const userId = message.from?.id;
  const text = message.text;

  if (!userId) {
    return '❌ Could not identify user.';
  }

  // TEMPORARILY DISABLED: User authorization check
  // if (!isAuthorizedUser(userId)) {
  //   return '❌ You are not authorized to use this bot.';
  // }

  if (!text) {
    return '❌ Please send a text message.';
  }

  // Normalize whitespace and lowercase for robust command matching
  const normalizedText = text.toLowerCase().replace(/\s+/g, ' ').trim();

  // Handle help command
  if (normalizedText === '/help' || normalizedText === 'help') {
    return getHelpMessage();
  }

  // Handle prices command
  if (normalizedText === '/prices' || normalizedText === 'prices') {
    return await getCurrentPrices();
  }

  // Handle report command
  if (normalizedText === '/report' || normalizedText === 'report') {
    try {
      console.log('📊 /report: Starting to fetch click counts...');
      console.log('📊 /report: getAllClickCounts function exists:', typeof getAllClickCounts);
      console.log('📊 /report: getAllClickCounts is function:', typeof getAllClickCounts === 'function');
      console.log('📊 /report: About to call getAllClickCounts()...');
      
      const clickCounts = await getAllClickCounts();
      
      console.log('📊 /report: getAllClickCounts() completed successfully');
      console.log('📊 /report: Successfully fetched click counts:', clickCounts);
      console.log('📊 /report: Click counts type:', typeof clickCounts);
      console.log('📊 /report: Click counts keys:', Object.keys(clickCounts));
      
      // Only show buttons with at least 1 click
      const filtered = Object.entries(clickCounts).filter(([_, count]) => count > 0);
      console.log('📊 /report: Filtered clicks:', filtered);
      
      if (filtered.length === 0) {
        const noClicksMessage = '📊 *Klikkstatistikk:*\nIngen klikk registrert ennå.';
        console.log('📊 /report: No clicks found, returning message:', noClicksMessage);
        return noClicksMessage;
      }
      
      let report = '📊 *Klikkstatistikk:*\n\n';
      for (const [buttonId, count] of filtered) {
        const buttonName = buttonId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        report += `• ${buttonName}: ${count} klikk\n`;
      }
      
      console.log('📊 /report: Generated report message:', report);
      console.log('📊 /report: Report message length:', report.length);
      return report;
    } catch (error) {
      console.error('❌ /report: Error caught in try-catch block:', error);
      console.error('❌ /report: Error type:', typeof error);
      console.error('❌ /report: Error constructor:', error?.constructor?.name);
      console.error('❌ /report: Error message:', error instanceof Error ? error.message : String(error));
      console.error('❌ /report: Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      
      // Create detailed error message for Telegram
      let errorDetails = '❌ Kunne ikke hente klikkstatistikk.\n\n';
      errorDetails += `*Feiltype:* ${error instanceof Error ? error.constructor.name : typeof error}\n`;
      errorDetails += `*Feilmelding:* ${error instanceof Error ? error.message : String(error)}\n`;
      
      if (error instanceof Error && error.stack) {
        const stackLines = error.stack.split('\n').slice(0, 3); // First 3 lines of stack
        errorDetails += `*Stack:* \`\`\`\n${stackLines.join('\n')}\n\`\`\``;
      }
      
      console.log('📊 /report: Returning error message:', errorDetails);
      return errorDetails;
    }
  }

  // Handle price update commands
  if (normalizedText.includes('set') || normalizedText.includes('sett') || normalizedText.includes('sätt') ||
      normalizedText.includes('update') || normalizedText.includes('oppdater') || normalizedText.includes('uppdatera') ||
      normalizedText.includes('change') || normalizedText.includes('endre') || normalizedText.includes('ändra')) {
    
    return await handlePriceUpdateCommand(text);
  }

  // Try to parse as price update command anyway
  const commands = parsePriceUpdateCommand(text);
  if (commands.length > 0) {
    return await handlePriceUpdateCommand(text);
  }

  // Handle /feature <id> and /unfeature <id> (now via Vercel API)
  if (normalizedText.startsWith('/feature ')) {
    const id = text.split(' ')[1]?.trim();
    if (!id) return '❌ Du må oppgi en plan-ID. Eksempel: /feature ce-spot-no1';
    try {
      const apiBase = process.env.VERCEL_API_BASE || 'https://ditt-vercel-namn.vercel.app';
      const res = await fetch(`${apiBase}/api/plans/feature`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, featured: true })
      });
      const data = await res.json();
      if (data.success) {
        return `✅ Planen med id ${id} er nå markert som utvalgt!`;
      } else {
        return `❌ Kunne ikke markere plan med id ${id} som utvalgt. (${data.error || 'Ukjent feil'})`;
      }
    } catch (error) {
      return `❌ Feil ved oppdatering: ${error instanceof Error ? error.message : String(error)}`;
    }
  }
  if (normalizedText.startsWith('/unfeature ')) {
    const id = text.split(' ')[1]?.trim();
    if (!id) return '❌ Du må oppgi en plan-ID. Eksempel: /unfeature ce-spot-no1';
    try {
      const apiBase = process.env.VERCEL_API_BASE || 'https://ditt-vercel-namn.vercel.app';
      const res = await fetch(`${apiBase}/api/plans/feature`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, featured: false })
      });
      const data = await res.json();
      if (data.success) {
        return `✅ Planen med id ${id} er ikke lenger utvalgt.`;
      } else {
        return `❌ Kunne ikke fjerne utvalgt-status for plan med id ${id}. (${data.error || 'Ukjent feil'})`;
      }
    } catch (error) {
      return `❌ Feil ved oppdatering: ${error instanceof Error ? error.message : String(error)}`;
    }
  }

  return `❓ I didn't understand that command. Try:\n${getHelpMessage()}`;
}

async function handlePriceUpdateCommand(text: string): Promise<string> {
  const commands = parsePriceUpdateCommand(text);
  
  if (commands.length === 0) {
    return formatPriceUpdateResponse(commands);
  }

  // Validate all commands
  const validationErrors: string[] = [];
  for (const command of commands) {
    const validation = validatePriceUpdateCommand(command);
    if (!validation.valid) {
      validationErrors.push(`${command.supplier} ${command.priceZone}: ${validation.error}`);
    }
  }

  if (validationErrors.length > 0) {
    return `❌ Validation errors:\n${validationErrors.join('\n')}`;
  }

  // Update prices
  const result = await updateElectricityPrices(commands);
  
  if (result.success) {
    return result.message;
  } else {
    return `❌ Update failed:\n${result.message}`;
  }
}

function getHelpMessage(): string {
  return (
    '🤖 *Strømsjef Price Bot*\n' +
    '\n*Kommandor:*\n' +
    '• /help - Vis denne hjelpeteksten\n' +
    '• /prices - Vis gjeldende strømpriser (inkluderer plan-ID)\n' +
    '• /report - Vis antall klikk på knapper\n' +
    '\n*Utvalgte avtaler:*\n' +
    '• /feature <id> - Marker en avtale som utvalgt (viser banner på nettsiden)\n' +
    '• /unfeature <id> - Fjern utvalgt-status fra en avtale\n' +
    '  → Du finner planens ID ved å bruke /prices (ID vises i listen)\n' +
    '  → Utvalgte avtaler får en blå "Utvalgt"-banner på kortet på nettsiden.\n' +
    '\n*Prisoppdatering:*\n' +
    '• Set [Supplier] [PlanType] [BindingTime] [BindingDate] in [Zone] to [Price]\n' +
    '• Sett [Supplier] [PlanType] [BindingTime] [BindingDate] i [Zone] til [Price] (Norsk)\n' +
    '• Sätt [Supplier] [PlanType] [BindingTime] [BindingDate] i [Zone] till [Price] (Svensk)\n' +
    '\n*Støttede leverandører:*\n' +
    '• Kilden Kraft\n' +
    '• Cheap Energy\n' +
    '\n*Støttede avtale-typer:*\n' +
    '• spotpris / spot - Spotprisavtaler\n' +
    '• fastpris / fast / fixed - Fastprisavtaler\n' +
    '• (utelat for alle typer)\n' +
    '\n*Støttede prissoner:*\n' +
    '• NO1 (Østlandet/Øst/East)\n' +
    '• NO2 (Sørlandet/Sør/South)\n' +
    '• NO3 (Midt-Norge/Midt/Central)\n' +
    '• NO4 (Nord-Norge/Nord/North)\n' +
    '• NO5 (Vestlandet/Vest/West)\n' +
    '\n*Bindingstid (valgfritt):*\n' +
    '• [BindingTime] kan være f.eks. 12m, 24m, 36m (antall måneder)\n' +
    '• [BindingDate] kan være en dato, f.eks. 01.10.2025 eller 2025-10-01\n' +
    '• Du kan bruke begge samtidig for å oppdatere kun avtaler som matcher begge deler.\n' +
    '• Hvis du kun oppgir én, oppdateres alle avtaler som matcher den.\n' +
    '\n*Eksempler:*\n' +
    '• Set Kilden spotpris in NO1 to 0.59 - Oppdater kun spotpris\n' +
    '• Set Cheap Energy fastpris in NO2 to 0.62 - Oppdater kun fastpris\n' +
    '• Set Kilden in NO1 to 0.59 - Oppdater alle Kilden-avtaler i NO1\n' +
    '• Set Cheap Energy fastpris 12m in NO1 to 69.9 - Oppdater alle 12m fastpris\n' +
    '• Set Cheap Energy fastpris 01.10.2025 in NO1 to 69.9 - Oppdater kun avtaler med binding til 01.10.2025\n' +
    '• Set Cheap Energy fastpris 12m 01.10.2025 in NO1 to 69.9 - Oppdater kun avtaler med både 12m og binding til 01.10.2025\n' +
    '• Sett Kilden Kraft spot i NO2 til 0.58 - Norsk\n' +
    '• Sätt Cheap Energy fast i NO3 till 0.61 - Svensk\n' +
    '• /report - Få oversikt over klikk på knapper\n' +
    '\n*Merk:* Priser er i øre per kWh. Negative priser støttes.\n' +
    '\n*Filterlogikk:*\n' +
    '• Hvis både bindingstid og dato er oppgitt, må begge matche for at en avtale skal oppdateres.\n' +
    '• Hvis kun én er oppgitt, brukes kun den som filter.'
  );
}

export async function sendTelegramMessage(chatId: number, message: string): Promise<boolean> {
  if (!bot) {
    console.error('❌ sendTelegramMessage: Bot not initialized');
    return false;
  }

  try {
    console.log(`📤 sendTelegramMessage: Sending to chat ${chatId}:`, message.substring(0, 100) + '...');
    console.log(`📤 sendTelegramMessage: Message length: ${message.length} characters`);
    console.log(`📤 sendTelegramMessage: Bot token exists: ${!!process.env.TELEGRAM_BOT_TOKEN}`);
    
    const result = await bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
    console.log('✅ sendTelegramMessage: Message sent successfully, result:', result);
    return true;
  } catch (error) {
    console.error('❌ sendTelegramMessage: Failed to send Telegram message with Markdown:', error);
    console.error('❌ sendTelegramMessage: Error details:', error instanceof Error ? error.message : String(error));
    
    // Try sending without Markdown as fallback
    try {
      console.log('📤 sendTelegramMessage: Trying without Markdown...');
      const result = await bot.sendMessage(chatId, message);
      console.log('✅ sendTelegramMessage: Message sent successfully without Markdown, result:', result);
      return true;
    } catch (fallbackError) {
      console.error('❌ sendTelegramMessage: Failed to send message even without Markdown:', fallbackError);
      console.error('❌ sendTelegramMessage: Fallback error details:', fallbackError instanceof Error ? fallbackError.message : String(fallbackError));
      console.error('❌ sendTelegramMessage: Error stack:', fallbackError instanceof Error ? fallbackError.stack : 'No stack trace');
      console.error('❌ sendTelegramMessage: Chat ID:', chatId);
      console.error('❌ sendTelegramMessage: Message preview:', message.substring(0, 200));
      return false;
    }
  }
} 