require('dotenv').config();
console.log('Loaded token:', process.env.TELEGRAM_BOT_TOKEN);
console.log('Loaded allowed users:', process.env.TELEGRAM_ALLOWED_USERS);

const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TELEGRAM_BOT_TOKEN;
const allowedUsers = process.env.TELEGRAM_ALLOWED_USERS?.split(',').map(id => parseInt(id.trim())) || [];

if (!token) {
  console.error('TELEGRAM_BOT_TOKEN not found in environment variables');
  console.error('Make sure your .env file contains TELEGRAM_BOT_TOKEN=your_bot_token');
  process.exit(1);
}

console.log('🤖 Starting Telegram bot in polling mode...');
console.log('Bot token:', token.substring(0, 10) + '...');
console.log('Allowed users:', allowedUsers);

const bot = new TelegramBot(token, { polling: true });

// Help message function
function getHelpMessage() {
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

// Handle incoming messages
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const text = msg.text;

  console.log(`📨 Received message from ${userId}: ${text}`);

  // Check if user is authorized
  if (allowedUsers.length > 0 && !allowedUsers.includes(userId)) {
    console.log(`❌ Unauthorized user ${userId}`);
    await bot.sendMessage(chatId, '❌ You are not authorized to use this bot.');
    return;
  }

  const lowerText = text.toLowerCase().trim();

  // Handle help command
  if (lowerText === '/help' || lowerText === 'help') {
    console.log('📖 Sending help message');
    await bot.sendMessage(chatId, getHelpMessage(), { parse_mode: 'Markdown' });
    return;
  }

  // Handle current prices command
  if (lowerText.startsWith('/prices') || lowerText.startsWith('prices')) {
    console.log('💰 Fetching current prices');
    try {
      const response = await fetch('http://localhost:3000/api/telegram/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, userId }),
      });

      const data = await response.json();
      console.log('💰 Prices response:', data);
      
      if (data.success && data.response) {
        await bot.sendMessage(chatId, data.response, { parse_mode: 'Markdown' });
      } else if (data.error) {
        await bot.sendMessage(chatId, `❌ Error: ${data.error}`);
      } else {
        await bot.sendMessage(chatId, '❌ Could not fetch current prices.');
      }
    } catch (error) {
      console.error('Error fetching prices:', error);
      await bot.sendMessage(chatId, '❌ Error fetching current prices.');
    }
    return;
  }

  // Handle report command
  if (lowerText === '/report' || lowerText === 'report') {
    console.log('📊 Fetching click statistics');
    try {
      // First test the database function directly
      console.log('📊 Testing database function directly...');
      const dbResponse = await fetch('http://localhost:3000/api/telegram/test', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const dbData = await dbResponse.json();
      console.log('📊 Database test response:', dbData);
      
      if (dbData.success) {
        console.log('📊 Database function works, now testing full report...');
        
        // Now test the full report through the bot handler
        const response = await fetch('http://localhost:3000/api/telegram/test', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text, userId }),
        });

        const data = await response.json();
        console.log('📊 Full report response:', data);
        
        if (data.success && data.response) {
          await bot.sendMessage(chatId, data.response, { parse_mode: 'Markdown' });
        } else {
          await bot.sendMessage(chatId, '❌ Could not fetch click statistics.');
        }
      } else {
        console.error('📊 Database function failed:', dbData.error);
        await bot.sendMessage(chatId, `❌ Database error: ${dbData.error}`);
      }
    } catch (error) {
      console.error('Error fetching click statistics:', error);
      await bot.sendMessage(chatId, '❌ Error fetching click statistics.');
    }
    return;
  }

  // Handle price update commands
  if (lowerText.includes('set') || lowerText.includes('sett') || lowerText.includes('sätt') ||
      lowerText.includes('update') || lowerText.includes('oppdater') || lowerText.includes('uppdatera') ||
      lowerText.includes('change') || lowerText.includes('endre') || lowerText.includes('ändra')) {
    
    console.log('🔄 Processing price update command');
    try {
      const response = await fetch('http://localhost:3000/api/telegram/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, userId }),
      });

      const data = await response.json();
      
      if (data.success && data.response) {
        await bot.sendMessage(chatId, typeof data.response === 'string' ? data.response : JSON.stringify(data.response), { parse_mode: 'Markdown' });
      } else if (data.error) {
        await bot.sendMessage(chatId, `❌ Error: ${data.error}`);
      } else {
        await bot.sendMessage(chatId, '❌ Unexpected response from API');
      }
    } catch (error) {
      console.error('Error processing price update:', error);
      await bot.sendMessage(chatId, '❌ Error processing your price update. Please try again.');
    }
    return;
  }

  // If it's not a recognized command, try to parse as price update anyway
  console.log('🔍 Trying to parse as price update command');
  try {
    const response = await fetch('http://localhost:3000/api/telegram/test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, userId }),
    });

    const data = await response.json();
    
    if (data.success && data.response) {
      await bot.sendMessage(chatId, typeof data.response === 'string' ? data.response : JSON.stringify(data.response), { parse_mode: 'Markdown' });
    } else if (data.error) {
      await bot.sendMessage(chatId, `❌ Error: ${data.error}`);
    }
  } catch (error) {
    console.error('Error processing price update:', error);
    await bot.sendMessage(chatId, '❌ Error processing your price update. Please try again.');
  }
});