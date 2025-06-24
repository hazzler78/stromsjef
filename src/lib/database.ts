import { kv } from '@vercel/kv';
import { ElectricityPlan, PriceZone } from '@/types/electricity';
import { mockElectricityPlans } from '@/data/mock-plans';

const PLANS_KEY = 'electricity_plans';

// In-memory storage for local development
let inMemoryPlans: ElectricityPlan[] | null = null;

// Check if we're in development mode without KV
const isDevelopmentMode = process.env.NODE_ENV === 'development' && 
  (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN);

export async function initializeDatabase(): Promise<void> {
  try {
    if (isDevelopmentMode) {
      // Use in-memory storage for local development
      if (!inMemoryPlans) {
        inMemoryPlans = [...mockElectricityPlans];
        console.log('Database initialized with mock data (in-memory mode)');
      }
      return;
    }

    // Check if plans already exist in database
    const existingPlans = await kv.get<ElectricityPlan[]>(PLANS_KEY);
    
    if (!existingPlans || existingPlans.length === 0) {
      // Initialize with mock data
      await kv.set(PLANS_KEY, mockElectricityPlans);
      console.log('Database initialized with mock data');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
    // Fallback to in-memory storage
    if (!inMemoryPlans) {
      inMemoryPlans = [...mockElectricityPlans];
      console.log('Falling back to in-memory storage');
    }
  }
}

export async function getAllPlans(): Promise<ElectricityPlan[]> {
  try {
    if (isDevelopmentMode) {
      return inMemoryPlans || mockElectricityPlans;
    }

    const plans = await kv.get<ElectricityPlan[]>(PLANS_KEY);
    return plans || mockElectricityPlans; // Fallback to mock data
  } catch (error) {
    console.error('Error fetching plans from database:', error);
    // Fallback to in-memory storage
    if (!inMemoryPlans) {
      inMemoryPlans = [...mockElectricityPlans];
    }
    return inMemoryPlans || mockElectricityPlans;
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
    
    // Save back to storage
    if (isDevelopmentMode) {
      inMemoryPlans = [...plans];
    } else {
      await kv.set(PLANS_KEY, plans);
    }
    
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
  newPrice: number,
  planType?: string
): Promise<number> {
  try {
    const plans = await getAllPlans();
    let updatedCount = 0;
    
    // Update plans for the supplier in the specified zone
    for (let i = 0; i < plans.length; i++) {
      const plan = plans[i];
      const matchesSupplier = plan.supplierName.toLowerCase() === supplierName.toLowerCase();
      const matchesZone = plan.priceZone === priceZone;
      const matchesPlanType = !planType || plan.planName.toLowerCase().includes(planType.toLowerCase());
      
      if (matchesSupplier && matchesZone && matchesPlanType) {
        plans[i].pricePerKwh = newPrice;
        updatedCount++;
      }
    }
    
    if (updatedCount > 0) {
      // Save back to storage
      if (isDevelopmentMode) {
        inMemoryPlans = [...plans];
      } else {
        await kv.set(PLANS_KEY, plans);
      }
      const planTypeText = planType ? ` ${planType}` : '';
      console.log(`Updated ${updatedCount} plans for ${supplierName}${planTypeText} in ${priceZone} to ${newPrice} øre/kWh`);
    }
    
    return updatedCount;
  } catch (error) {
    console.error('Error updating plans for supplier:', error);
    return 0;
  }
}

export async function resetToDefaultPrices(): Promise<boolean> {
  try {
    if (isDevelopmentMode) {
      inMemoryPlans = [...mockElectricityPlans];
      console.log('Database reset to default prices (in-memory mode)');
    } else {
      await kv.set(PLANS_KEY, mockElectricityPlans);
      console.log('Database reset to default prices');
    }
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