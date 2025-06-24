const { handleTelegramMessage } = require('./src/lib/telegram-bot.ts');

// Test messages
const testMessages = [
  "Set Kilden spotpris in NO1 to 0.59",
  "Sett Cheap Energy fastpris i NO2 til 0.62",
  "Sätt Kilden spot i NO3 till 0.58",
  "/help",
  "/prices",
  "Set Kilden in NO1 to 0.59 and Cheap fastpris to 0.62"
];

async function testBot() {
  console.log("🤖 Testing Telegram Bot Locally\n");
  
  for (const message of testMessages) {
    console.log(`\n--- Testing: "${message}" ---`);
    
    try {
      // Simulate a Telegram message
      const telegramMessage = {
        from: { id: 123456789 }, // Test user ID
        text: message,
        chat: { id: 123456789 }
      };
      
      const response = await handleTelegramMessage(telegramMessage);
      console.log("Bot Response:", response);
      
    } catch (error) {
      console.error("Error:", error.message);
    }
  }
}

// Run the test
testBot().catch(console.error); 