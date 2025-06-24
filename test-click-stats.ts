const { getAllClickCounts, incrementClick } = require('./src/lib/database');

async function testClickStats() {
  console.log('🧪 Testing click statistics...\n');
  
  // Test 1: Check current click counts
  console.log('1️⃣ Current click counts:');
  try {
    const clickCounts = await getAllClickCounts();
    console.log('✅ Click counts retrieved successfully');
    
    if (Object.keys(clickCounts).length === 0) {
      console.log('📊 No clicks registered yet');
    } else {
      console.log('📊 Current clicks:');
      for (const [buttonId, count] of Object.entries(clickCounts)) {
        console.log(`   • ${buttonId}: ${count} clicks`);
      }
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.log('❌ Error getting click counts:', msg);
  }
  
  // Test 2: Simulate some clicks
  console.log('\n2️⃣ Simulating clicks...');
  try {
    await incrementClick('plan-test-1');
    await incrementClick('plan-test-2');
    const clickCounts = await getAllClickCounts();
    console.log('✅ Clicks incremented and retrieved:');
    for (const [buttonId, count] of Object.entries(clickCounts)) {
      console.log(`   • ${buttonId}: ${count} clicks`);
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.log('❌ Error incrementing clicks:', msg);
  }
}

testClickStats(); 