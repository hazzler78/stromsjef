import TelegramBot from 'node-telegram-bot-api';
import { parsePriceUpdateCommand, validatePriceUpdateCommand, formatPriceUpdateResponse } from './nlp-utils';
import { updateElectricityPrices, getCurrentPrices } from './price-update-service';

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

  const lowerText = text.toLowerCase().trim();

  // Handle help command
  if (lowerText === '/help' || lowerText === 'help') {
    return getHelpMessage();
  }

  // Handle current prices command
  if (lowerText.startsWith('/prices') || lowerText.startsWith('prices')) {
    return await getCurrentPrices();
  }

  // Handle price update commands
  if (lowerText.includes('set') || lowerText.includes('sett') || lowerText.includes('sätt') ||
      lowerText.includes('update') || lowerText.includes('oppdater') || lowerText.includes('uppdatera') ||
      lowerText.includes('change') || lowerText.includes('endre') || lowerText.includes('ändra')) {
    
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
  return `🤖 *Strømsjef Price Bot*

*Commands:*
• \`/help\` - Show this help message
• \`/prices\` - Show current prices

*Price Update Format:*
• \`Set [Supplier] [PlanType] in [Zone] to [Price]\`
• \`Sett [Supplier] [PlanType] i [Zone] til [Price]\` (Norwegian)
• \`Sätt [Supplier] [PlanType] i [Zone] till [Price]\` (Swedish)

*Supported Suppliers:*
• Kilden Kraft
• Cheap Energy Norge

*Supported Plan Types:*
• \`spotpris\` / \`spot\` - Spot price plans
• \`fastpris\` / \`fast\` / \`fixed\` - Fixed price plans
• (omit for all plan types)

*Supported Price Zones:*
• NO1 (Østlandet/Øst/East)
• NO2 (Sørlandet/Sør/South)
• NO3 (Midt-Norge/Midt/Central)
• NO4 (Nord-Norge/Nord/North)
• NO5 (Vestlandet/Vest/West)

*Examples:*
• \`Set Kilden spotpris in NO1 to 0.59\` - Update only spot price
• \`Set Cheap Energy fastpris in NO2 to 0.62\` - Update only fixed price
• \`Set Kilden in NO1 to 0.59\` - Update all Kilden plans in NO1
• \`Sett Kilden Kraft spot i NO2 til 0.58\` - Norwegian
• \`Sätt Cheap Energy fast i NO3 till 0.61\` - Swedish

*Note:* Prices are in øre per kWh`;
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