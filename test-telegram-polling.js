require('dotenv').config();
console.log('Loaded token:', process.env.TELEGRAM_BOT_TOKEN);
console.log('Loaded allowed users:', process.env.TELEGRAM_ALLOWED_USERS);

const TelegramBot = require('node-telegram-bot-api');
const dns = require('dns').promises;
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

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
let consecutiveNetworkErrors = 0;
const MAX_RECONNECT_ATTEMPTS = 10;
const MAX_CONSECUTIVE_NETWORK_ERRORS = 5;
const RECONNECT_DELAY = 5000; // 5 seconds
const LONG_RECONNECT_DELAY = 30000; // 30 seconds for network issues

// Network diagnostics
async function checkNetworkConnectivity() {
  console.log('🌐 Checking network connectivity...');
  
  try {
    // Test DNS resolution
    console.log('🔍 Testing DNS resolution for api.telegram.org...');
    await dns.lookup('api.telegram.org');
    console.log('✅ DNS resolution successful');
    
    // Test basic internet connectivity
    console.log('🌍 Testing internet connectivity...');
    await dns.lookup('8.8.8.8');
    console.log('✅ Internet connectivity confirmed');
    
    return true;
  } catch (error) {
    console.error('❌ Network connectivity check failed:', error.message);
    return false;
  }
}

// Test Telegram API directly
async function testTelegramAPI() {
  console.log('📡 Testing Telegram API connectivity...');
  
  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/getMe`, {
      method: 'GET',
      timeout: 10000
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Telegram API is accessible');
      return true;
    } else {
      console.error('❌ Telegram API returned error:', response.status, response.statusText);
      return false;
    }
  } catch (error) {
    console.error('❌ Telegram API test failed:', error.message);
    return false;
  }
}

// Start polling with error handling
async function startPolling() {
  console.log('🔄 Starting polling...');
  
  // Check network connectivity first
  const networkOk = await checkNetworkConnectivity();
  if (!networkOk) {
    console.log('⚠️ Network issues detected, will retry with longer delay...');
    consecutiveNetworkErrors++;
    
    if (consecutiveNetworkErrors >= MAX_CONSECUTIVE_NETWORK_ERRORS) {
      console.log('🛑 Too many consecutive network errors. Pausing for extended period...');
      setTimeout(() => {
        consecutiveNetworkErrors = 0;
        startPolling();
      }, 60000); // Wait 1 minute
      return;
    }
  } else {
    consecutiveNetworkErrors = 0;
  }
  
  // Test Telegram API
  const apiOk = await testTelegramAPI();
  if (!apiOk) {
    console.log('⚠️ Telegram API not accessible, will retry...');
    setTimeout(() => startPolling(), RECONNECT_DELAY);
    return;
  }
  
  bot.startPolling(botOptions.polling)
    .then(() => {
      console.log('✅ Polling started successfully');
      isConnected = true;
      reconnectAttempts = 0;
      consecutiveNetworkErrors = 0;
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
  
  // Check if it's a network-related error
  const isNetworkError = error.message.includes('ENOTFOUND') || 
                        error.message.includes('ECONNRESET') || 
                        error.message.includes('ETIMEDOUT') ||
                        error.message.includes('ENETUNREACH');
  
  if (isNetworkError) {
    consecutiveNetworkErrors++;
    console.log(`🌐 Network error detected (${consecutiveNetworkErrors}/${MAX_CONSECUTIVE_NETWORK_ERRORS})`);
    
    if (consecutiveNetworkErrors >= MAX_CONSECUTIVE_NETWORK_ERRORS) {
      console.log('🛑 Too many network errors. Pausing for 1 minute before retry...');
      setTimeout(() => {
        consecutiveNetworkErrors = 0;
        reconnectAttempts = 0;
        startPolling();
      }, 60000); // Wait 1 minute
      return;
    }
  }
  
  if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
    reconnectAttempts++;
    const delay = isNetworkError ? LONG_RECONNECT_DELAY : RECONNECT_DELAY;
    console.log(`🔄 Attempting to reconnect (${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS}) in ${delay/1000} seconds...`);
    
    setTimeout(() => {
      console.log('🔄 Reconnecting...');
      startPolling();
    }, delay);
  } else {
    console.error('❌ Max reconnection attempts reached. Stopping bot.');
    console.log('💡 Try checking your internet connection and restart the bot.');
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
    '• /prices - Vis gjeldende strømpriser (inkluderer plan-ID)\n' +
    '• /report - Vis antall klikk på knapper\n' +
    '• /reset - Tilbakestill alle priser til standardprisene\n' +
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
    '• /reset - Tilbakestill alle priser til standardprisene\n' +
    '\n*Merk:* Priser er i øre per kWh. Negative priser støttes.\n' +
    '\n*Filterlogikk:*\n' +
    '• Hvis både bindingstid og dato er oppgitt, må begge matche for at en avtale skal oppdateres.\n' +
    '• Hvis kun én er oppgitt, brukes kun den som filter.'
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

  // Handle reset command
  if (lowerText === '/reset' || lowerText === 'reset') {
    console.log('🔄 Processing reset command');
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
        await bot.sendMessage(chatId, data.response, { parse_mode: 'Markdown' });
      } else if (data.error) {
        await bot.sendMessage(chatId, `❌ Error: ${data.error}`);
      } else {
        await bot.sendMessage(chatId, '❌ Could not reset prices to default values.');
      }
    } catch (error) {
      console.error('Error processing reset command:', error);
      await bot.sendMessage(chatId, '❌ Error resetting prices to default values. Please try again later.');
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