async function testPriceUpdate() {
  const fetch = (await import('node-fetch')).default;
  
  console.log('🧪 Testing price update functionality...\n');

  // 1. Get current plans
  console.log('1. Getting current plans...');
  try {
    const response = await fetch('http://localhost:3000/api/plans');
    const data = await response.json();
    
    if (data.success) {
      const cheapEnergyPlans = data.plans.filter(p => p.supplierName.includes('Cheap Energy'));
      console.log('Current Cheap Energy plans:');
      cheapEnergyPlans.forEach(plan => {
        console.log(`  ${plan.planName} ${plan.priceZone}: ${plan.pricePerKwh} øre/kWh`);
      });
    } else {
      console.log('❌ Failed to get plans:', data.error);
      return;
    }
  } catch (error) {
    console.log('❌ Error getting plans:', error.message);
    return;
  }

  // 2. Update a price
  console.log('\n2. Updating price...');
  try {
    const updateResponse = await fetch('http://localhost:3000/api/telegram/test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: 'Set Cheap Energy fastpris in NO1 to 75',
        userId: 6569007750
      }),
    });
    
    const updateData = await updateResponse.json();
    console.log('Update response:', updateData);
  } catch (error) {
    console.log('❌ Error updating price:', error.message);
    return;
  }

  // 3. Get plans again to verify update
  console.log('\n3. Getting updated plans...');
  try {
    const response2 = await fetch('http://localhost:3000/api/plans');
    const data2 = await response2.json();
    
    if (data2.success) {
      const cheapEnergyPlans2 = data2.plans.filter(p => p.supplierName.includes('Cheap Energy'));
      console.log('Updated Cheap Energy plans:');
      cheapEnergyPlans2.forEach(plan => {
        console.log(`  ${plan.planName} ${plan.priceZone}: ${plan.pricePerKwh} øre/kWh`);
      });
    } else {
      console.log('❌ Failed to get updated plans:', data2.error);
    }
  } catch (error) {
    console.log('❌ Error getting updated plans:', error.message);
  }
}

testPriceUpdate().catch(console.error); 