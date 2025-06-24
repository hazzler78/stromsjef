import { kv } from '@vercel/kv';
import { ElectricityPlan, PriceZone } from '@/types/electricity';
import { mockElectricityPlans } from '@/data/mock-plans';

const PLANS_KEY = 'electricity_plans';

export async function initializeDatabase(): Promise<void> {
  try {
    // Check if plans already exist in database
    const existingPlans = await kv.get<ElectricityPlan[]>(PLANS_KEY);
    
    if (!existingPlans || existingPlans.length === 0) {
      // Initialize with mock data
      await kv.set(PLANS_KEY, mockElectricityPlans);
      console.log('Database initialized with mock data');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

export async function getAllPlans(): Promise<ElectricityPlan[]> {
  try {
    const plans = await kv.get<ElectricityPlan[]>(PLANS_KEY);
    return plans || mockElectricityPlans; // Fallback to mock data
  } catch (error) {
    console.error('Error fetching plans from database:', error);
    return mockElectricityPlans; // Fallback to mock data
  }
}

export async function updatePlanPrice(
  supplierName: string, 
  priceZone: PriceZone, 
  planName: string, 
  newPrice: number
): Promise<boolean> {
  try {
    const plans = await getAllPlans();
    
    // Find the specific plan to update
    const planIndex = plans.findIndex(plan => 
      plan.supplierName.toLowerCase() === supplierName.toLowerCase() &&
      plan.priceZone === priceZone &&
      plan.planName === planName
    );
    
    if (planIndex === -1) {
      console.error(`Plan not found: ${supplierName} ${planName} in ${priceZone}`);
      return false;
    }
    
    // Update the price
    plans[planIndex].pricePerKwh = newPrice;
    
    // Save back to database
    await kv.set(PLANS_KEY, plans);
    
    console.log(`Updated ${supplierName} ${planName} in ${priceZone} to ${newPrice} øre/kWh`);
    return true;
  } catch (error) {
    console.error('Error updating plan price:', error);
    return false;
  }
}

export async function updateAllPlansForSupplier(
  supplierName: string, 
  priceZone: PriceZone, 
  newPrice: number
): Promise<number> {
  try {
    const plans = await getAllPlans();
    let updatedCount = 0;
    
    // Update all plans for the supplier in the specified zone
    for (let i = 0; i < plans.length; i++) {
      if (plans[i].supplierName.toLowerCase() === supplierName.toLowerCase() &&
          plans[i].priceZone === priceZone) {
        plans[i].pricePerKwh = newPrice;
        updatedCount++;
      }
    }
    
    if (updatedCount > 0) {
      // Save back to database
      await kv.set(PLANS_KEY, plans);
      console.log(`Updated ${updatedCount} plans for ${supplierName} in ${priceZone} to ${newPrice} øre/kWh`);
    }
    
    return updatedCount;
  } catch (error) {
    console.error('Error updating plans for supplier:', error);
    return 0;
  }
}

export async function resetToDefaultPrices(): Promise<boolean> {
  try {
    await kv.set(PLANS_KEY, mockElectricityPlans);
    console.log('Database reset to default prices');
    return true;
  } catch (error) {
    console.error('Error resetting database:', error);
    return false;
  }
}

export async function getPlansBySupplier(supplierName: string): Promise<ElectricityPlan[]> {
  try {
    const plans = await getAllPlans();
    return plans.filter(plan => 
      plan.supplierName.toLowerCase().includes(supplierName.toLowerCase())
    );
  } catch (error) {
    console.error('Error fetching plans by supplier:', error);
    return [];
  }
}

export async function getPlansByZone(priceZone: PriceZone): Promise<ElectricityPlan[]> {
  try {
    const plans = await getAllPlans();
    return plans.filter(plan => plan.priceZone === priceZone);
  } catch (error) {
    console.error('Error fetching plans by zone:', error);
    return [];
  }
} 