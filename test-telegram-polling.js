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

// Bot configuration with better error handling
const botOptions = {
  polling: {
    interval: 300, // Poll every 300ms
    autoStart: false, // Don't start polling immediately
    params: {
      timeout: 10 // 10 second timeout
    }
  },
  request: {
    timeout: 30000 // 30 second timeout for requests
  }
};

const bot = new TelegramBot(token, botOptions);

// Connection state management
let isConnected = false;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 10;
const RECONNECT_DELAY = 5000; // 5 seconds

// Start polling with error handling
function startPolling() {
  console.log('🔄 Starting polling...');
  bot.startPolling(botOptions.polling)
    .then(() => {
      console.log('✅ Polling started successfully');
      isConnected = true;
      reconnectAttempts = 0;
    })
    .catch((error) => {
      console.error('❌ Failed to start polling:', error.message);
      handlePollingError(error);
    });
}

// Handle polling errors
function handlePollingError(error) {
  console.error('🔴 Polling error:', error.message);
  isConnected = false;
  
  if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
    reconnectAttempts++;
    console.log(`🔄 Attempting to reconnect (${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS}) in ${RECONNECT_DELAY/1000} seconds...`);
    
    setTimeout(() => {
      console.log('🔄 Reconnecting...');
      startPolling();
    }, RECONNECT_DELAY);
  } else {
    console.error('❌ Max reconnection attempts reached. Stopping bot.');
    process.exit(1);
  }
}

// Handle polling errors
bot.on('polling_error', (error) => {
  console.error('🔴 Polling error:', error.message);
  handlePollingError(error);
});

// Handle webhook errors
bot.on('webhook_error', (error) => {
  console.error('🔴 Webhook error:', error.message);
});

// Handle connection errors
bot.on('error', (error) => {
  console.error('🔴 Bot error:', error.message);
  handlePollingError(error);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('🛑 Received SIGINT, shutting down gracefully...');
  bot.stopPolling();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('🛑 Received SIGTERM, shutting down gracefully...');
  bot.stopPolling();
  process.exit(0);
});

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

// Retry function for API calls
async function retryApiCall(apiCall, maxRetries = 3, delay = 1000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      console.error(`API call attempt ${attempt} failed:`, error.message);
      if (attempt === maxRetries) {
        throw error;
      }
      console.log(`Retrying in ${delay/1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2; // Exponential backoff
    }
  }
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
    try {
      await bot.sendMessage(chatId, '❌ You are not authorized to use this bot.');
    } catch (error) {
      console.error('Error sending unauthorized message:', error.message);
    }
    return;
  }

  const lowerText = text.toLowerCase().trim();

  // Handle help command
  if (lowerText === '/help' || lowerText === 'help') {
    console.log('📖 Sending help message');
    try {
      await bot.sendMessage(chatId, getHelpMessage(), { parse_mode: 'Markdown' });
    } catch (error) {
      console.error('Error sending help message:', error.message);
    }
    return;
  }

  // Handle current prices command
  if (lowerText.startsWith('/prices') || lowerText.startsWith('prices')) {
    console.log('💰 Fetching current prices');
    try {
      const response = await retryApiCall(async () => {
        return await fetch('http://localhost:3000/api/telegram/test', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text, userId }),
        });
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
      await bot.sendMessage(chatId, '❌ Error fetching current prices. Please try again later.');
    }
    return;
  }

  // Handle report command
  if (lowerText === '/report' || lowerText === 'report') {
    console.log('📊 Fetching click statistics');
    try {
      // First test the database function directly
      console.log('📊 Testing database function directly...');
      const dbResponse = await retryApiCall(async () => {
        return await fetch('http://localhost:3000/api/telegram/test', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
      });

      const dbData = await dbResponse.json();
      console.log('📊 Database test response:', dbData);
      
      if (dbData.success) {
        console.log('📊 Database function works, now testing full report...');
        
        // Now test the full report through the bot handler
        const response = await retryApiCall(async () => {
          return await fetch('http://localhost:3000/api/telegram/test', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text, userId }),
          });
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
      await bot.sendMessage(chatId, '❌ Error fetching click statistics. Please try again later.');
    }
    return;
  }

  // Handle price update commands
  if (lowerText.includes('set') || lowerText.includes('sett') || lowerText.includes('sätt') ||
      lowerText.includes('update') || lowerText.includes('oppdater') || lowerText.includes('uppdatera') ||
      lowerText.includes('change') || lowerText.includes('endre') || lowerText.includes('ändra')) {
    
    console.log('🔄 Processing price update command');
    try {
      const response = await retryApiCall(async () => {
        return await fetch('http://localhost:3000/api/telegram/test', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text, userId }),
        });
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
      await bot.sendMessage(chatId, '❌ Error processing your price update. Please try again later.');
    }
    return;
  }

  // If it's not a recognized command, try to parse as price update anyway
  console.log('🔍 Trying to parse as price update command');
  try {
    const response = await retryApiCall(async () => {
      return await fetch('http://localhost:3000/api/telegram/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, userId }),
      });
    });

    const data = await response.json();
    
    if (data.success && data.response) {
      await bot.sendMessage(chatId, typeof data.response === 'string' ? data.response : JSON.stringify(data.response), { parse_mode: 'Markdown' });
    } else if (data.error) {
      await bot.sendMessage(chatId, `❌ Error: ${data.error}`);
    }
  } catch (error) {
    console.error('Error processing price update:', error);
    await bot.sendMessage(chatId, '❌ Error processing your price update. Please try again later.');
  }
});

// Start the bot
console.log('🚀 Initializing bot...');
startPolling();