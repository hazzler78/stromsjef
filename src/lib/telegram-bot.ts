import TelegramBot from 'node-telegram-bot-api';
import { parsePriceUpdateCommand, validatePriceUpdateCommand, formatPriceUpdateResponse } from './nlp-utils';
import { updateElectricityPrices, getCurrentPrices } from './price-update-service';
import { getAllClickCounts } from './database';

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

  if (!isAuthorizedUser(userId)) {
    return '❌ You are not authorized to use this bot.';
  }

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
      const clickCounts = await getAllClickCounts();
      if (Object.keys(clickCounts).length === 0) {
        return '📊 *Klikkstatistikk:*\\nIngen klikk registrert ennå.';
      }
      
      let report = '📊 *Klikkstatistikk:*\\n\\n';
      for (const [buttonId, count] of Object.entries(clickCounts)) {
        const buttonName = buttonId.replace(/-/g, ' ').replace(/\\b\\w/g, l => l.toUpperCase());
        report += `• ${buttonName}: ${count} klikk\\n`;
      }
      return report;
    } catch (error) {
      return '❌ Kunne ikke hente klikkstatistikk.';
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
    '• /prices - Vis gjeldende strømpriser\n' +
    '• /report - Vis antall klikk på knapper\n' +
    '\n*Prisoppdatering:*\n' +
    '• Set [Supplier] [PlanType] in [Zone] to [Price]\n' +
    '• Sett [Supplier] [PlanType] i [Zone] til [Price] (Norsk)\n' +
    '• Sätt [Supplier] [PlanType] i [Zone] till [Price] (Svensk)\n' +
    '\n*Støttede leverandører:*\n' +
    '• Kilden Kraft\n' +
    '• Cheap Energy Norge\n' +
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
    '\n*Eksempler:*\n' +
    '• Set Kilden spotpris in NO1 to 0.59 - Oppdater kun spotpris\n' +
    '• Set Cheap Energy fastpris in NO2 to 0.62 - Oppdater kun fastpris\n' +
    '• Set Kilden in NO1 to 0.59 - Oppdater alle Kilden-avtaler i NO1\n' +
    '• Sett Kilden Kraft spot i NO2 til 0.58 - Norsk\n' +
    '• Sätt Cheap Energy fast i NO3 till 0.61 - Svensk\n' +
    '• /report - Få oversikt over klikk på knapper\n' +
    '\n*Merk:* Priser er i øre per kWh'
  );
}

export async function sendTelegramMessage(chatId: number, message: string): Promise<void> {
  if (!bot) {
    console.error('Bot not initialized');
    return;
  }

  try {
    await bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
  } catch (error) {
    console.error('Error sending Telegram message:', error);
  }
} 