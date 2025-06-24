async function testBindingTime() {
  const fetch = (await import('node-fetch')).default;
  
  console.log('🧪 Testing binding time functionality...\n');

  // Test 1: Update only 12-month fastpris plans
  console.log('1. Testing update of 12-month fastpris plans only...');
  try {
    const response = await fetch('http://localhost:3000/api/telegram/test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: 'Set Cheap Energy fastpris 12m in NO1 to 50',
        userId: 6569007750
      }),
    });
    
    const data = await response.json();
    console.log('Response:', data);
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  // Test 2: Get current plans to see the result
  console.log('\n2. Getting current plans to verify update...');
  try {
    const response = await fetch('http://localhost:3000/api/plans');
    const data = await response.json();
    
    if (data.success) {
      const cheapEnergyPlans = data.plans.filter(p => p.supplierName.includes('Cheap Energy') && p.priceZone === 'NO1');
      console.log('Cheap Energy plans in NO1:');
      cheapEnergyPlans.forEach(plan => {
        console.log(`  ${plan.planName} (${plan.bindingTime}m): ${plan.pricePerKwh} øre/kWh`);
      });
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  // Test 3: Update spotpris (0 months binding)
  console.log('\n3. Testing update of spotpris (0 months binding)...');
  try {
    const response = await fetch('http://localhost:3000/api/telegram/test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: 'Set Cheap Energy spotpris 0m in NO1 to 10',
        userId: 6569007750
      }),
    });
    
    const data = await response.json();
    console.log('Response:', data);
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  // Test 4: Get plans again to see both updates
  console.log('\n4. Getting plans again to see both updates...');
  try {
    const response = await fetch('http://localhost:3000/api/plans');
    const data = await response.json();
    
    if (data.success) {
      const cheapEnergyPlans = data.plans.filter(p => p.supplierName.includes('Cheap Energy') && p.priceZone === 'NO1');
      console.log('Cheap Energy plans in NO1 after both updates:');
      cheapEnergyPlans.forEach(plan => {
        console.log(`  ${plan.planName} (${plan.bindingTime}m): ${plan.pricePerKwh} øre/kWh`);
      });
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

testBindingTime().catch(console.error); 