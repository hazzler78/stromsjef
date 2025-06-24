const { parsePriceUpdateCommand, validatePriceUpdateCommand } = require('./src/lib/nlp-utils.ts');
const { updateElectricityPrices, getCurrentPrices } = require('./src/lib/price-update-service.ts');

// Test messages
const testMessages = [
  "Set Kilden in NO1 to 0.59",
  "Sett Cheap Energy i NO2 til 0.62",
  "Sätt Kilden i NO3 till 0.58",
  "Set Kilden in NO1 to 0.59 and Cheap to 0.62",
  "Update Cheap Energy in NO4 to 0.65",
  "Invalid message that should not parse"
];

console.log("🤖 Testing Telegram Bot Natural Language Processing\n");

testMessages.forEach((message, index) => {
  console.log(`\n--- Test ${index + 1}: "${message}" ---`);
  
  const commands = parsePriceUpdateCommand(message);
  console.log("Parsed commands:", commands);
  
  if (commands.length > 0) {
    commands.forEach(cmd => {
      const validation = validatePriceUpdateCommand(cmd);
      console.log(`Validation for ${cmd.supplier} ${cmd.priceZone}:`, validation);
    });
    
    const result = updateElectricityPrices(commands);
    console.log("Update result:", result.message);
  } else {
    console.log("❌ No commands parsed");
  }
});

console.log("\n--- Current Prices ---");
console.log(getCurrentPrices()); 