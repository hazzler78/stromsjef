import fetch from 'node-fetch';

async function testPriceUpdate() {
  console.log('🧪 Testing price update system...\n');
  
  // Test 1: Get current plans
  console.log('1️⃣ Getting current plans...');
  try {
    const response = await fetch('http://localhost:3000/api/plans');
    const data = await response.json();
    
    if (data.success) {
      const cheapEnergyPlans = data.plans.filter(p => p.supplierName.includes('Cheap Energy'));
      console.log(`✅ Found ${cheapEnergyPlans.length} Cheap Energy plans:`);
      cheapEnergyPlans.forEach(plan => {
        console.log(`   - ${plan.planName} ${plan.priceZone}: ${plan.pricePerKwh} øre/kWh`);
      });
    } else {
      console.log('❌ Failed to get plans:', data.error);
    }
  } catch (error) {
    console.log('❌ Error getting plans:', error.message);
  }
  
  console.log('\n2️⃣ Testing price update via Telegram API...');
  try {
    const updateResponse = await fetch('http://localhost:3000/api/telegram/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: {
          text: 'Set Cheap Energy spotpris in NO1 to 99.9',
          from: { id: 6569007750 }
        }
      })
    });
    
    const updateData = await updateResponse.json();
    console.log('✅ Price update response:', updateData);
  } catch (error) {
    console.log('❌ Error updating price:', error.message);
  }
  
  console.log('\n3️⃣ Getting plans again to verify update...');
  try {
    const response2 = await fetch('http://localhost:3000/api/plans');
    const data2 = await response2.json();
    
    if (data2.success) {
      const cheapEnergyPlans2 = data2.plans.filter(p => p.supplierName.includes('Cheap Energy'));
      console.log(`✅ Found ${cheapEnergyPlans2.length} Cheap Energy plans after update:`);
      cheapEnergyPlans2.forEach(plan => {
        console.log(`   - ${plan.planName} ${plan.priceZone}: ${plan.pricePerKwh} øre/kWh`);
      });
    } else {
      console.log('❌ Failed to get plans after update:', data2.error);
    }
  } catch (error) {
    console.log('❌ Error getting plans after update:', error.message);
  }
  
  console.log('\n4️⃣ Testing website page...');
  try {
    const pageResponse = await fetch('http://localhost:3000/');
    console.log(`✅ Website page status: ${pageResponse.status}`);
    
    if (pageResponse.ok) {
      const html = await pageResponse.text();
      const hasCheapEnergy = html.includes('Cheap Energy');
      const hasPrice = html.includes('99.9');
      console.log(`   - Contains Cheap Energy: ${hasCheapEnergy}`);
      console.log(`   - Contains updated price: ${hasPrice}`);
    }
  } catch (error) {
    console.log('❌ Error testing website:', error.message);
  }
}

testPriceUpdate().catch(console.error); 