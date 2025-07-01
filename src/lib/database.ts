import { kv } from '@vercel/kv';
import { ElectricityPlan, PriceZone } from '@/types/electricity';
import { mockElectricityPlans } from '@/data/mock-plans';

const PLANS_KEY = 'electricity_plans';

// In-memory storage for local development
let inMemoryPlans: ElectricityPlan[] | null = null;

// Check if we're in development mode without KV
const isDevelopmentMode: boolean = process.env.NODE_ENV === 'development' && 
  (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN);

// --- Click Tracking ---
const inMemoryClicks: Record<string, number> = {};

export async function initializeDatabase(): Promise<void> {
  try {
    if (isDevelopmentMode) {
      // Always use latest mock data for development
      inMemoryPlans = [...mockElectricityPlans];
      console.log('Database initialized with latest mock data (in-memory mode)');
      return;
    }

    // Only set mock data if not already initialized in production
    const existing = await kv.get(PLANS_KEY);
    if (!existing) {
      await kv.set(PLANS_KEY, mockElectricityPlans);
      console.log('Database initialized with latest mock data');
    } else {
      console.log('Database already initialized, skipping mock data overwrite');
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
      // Ensure inMemoryPlans is initialized
      if (!inMemoryPlans) {
        inMemoryPlans = [...mockElectricityPlans];
        console.log('Initialized inMemoryPlans with mock data');
      }
      console.log(`getAllPlans: Returning ${inMemoryPlans.length} plans from memory`);
      return inMemoryPlans;
    }

    const plans: ElectricityPlan[] | null = await kv.get<ElectricityPlan[]>(PLANS_KEY);
    console.log(`getAllPlans: Returning ${plans?.length || 0} plans from KV`);
    return plans || mockElectricityPlans; // Fallback to mock data
  } catch (error) {
    console.error('Error fetching plans from database:', error);
    // Fallback to in-memory storage
    if (!inMemoryPlans) {
      inMemoryPlans = [...mockElectricityPlans];
      console.log('Fallback: Initialized inMemoryPlans with mock data');
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
    const plans: ElectricityPlan[] = await getAllPlans();
    
    // Find the specific plan to update
    const planIndex: number = plans.findIndex((plan: ElectricityPlan) => 
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
  planType?: string,
  bindingTime?: number,
  bindingTimeDate?: string
): Promise<number> {
  try {
    const bindingTimeText = bindingTime !== undefined ? ` (${bindingTime}m binding)` : '';
    const bindingDateText = bindingTimeDate ? ` (binding date: ${bindingTimeDate})` : '';
    console.log(`updateAllPlansForSupplier: Updating ${supplierName} in ${priceZone} to ${newPrice} øre/kWh (planType: ${planType || 'all'}${bindingTimeText}${bindingDateText})`);
    const plans: ElectricityPlan[] = await getAllPlans();
    console.log(`updateAllPlansForSupplier: Got ${plans.length} plans from database`);
    
    let updatedCount: number = 0;
    
    // Update plans for the supplier in the specified zone
    for (let i = 0; i < plans.length; i++) {
      const plan: ElectricityPlan = plans[i];
      const matchesSupplier: boolean = plan.supplierName.toLowerCase() === supplierName.toLowerCase();
      const matchesZone: boolean = plan.priceZone === priceZone;
      const matchesPlanType: boolean = !planType || plan.planName.toLowerCase().includes(planType.toLowerCase());
      const matchesBindingTime: boolean = bindingTime === undefined || plan.bindingTime === bindingTime;
      const matchesBindingDate: boolean = bindingTimeDate === undefined || (typeof plan.bindingTimeText === 'string' && plan.bindingTimeText.includes(bindingTimeDate));
      let matchesBinding: boolean;
      if (bindingTime !== undefined && bindingTimeDate !== undefined) {
        matchesBinding = matchesBindingTime && matchesBindingDate;
      } else if (bindingTime !== undefined) {
        matchesBinding = matchesBindingTime;
      } else if (bindingTimeDate !== undefined) {
        matchesBinding = matchesBindingDate;
      } else {
        matchesBinding = true;
      }
      
      if (matchesSupplier && matchesZone && matchesPlanType && matchesBinding) {
        const oldPrice: number = plans[i].pricePerKwh;
        plans[i].pricePerKwh = newPrice;
        updatedCount++;
        console.log(`updateAllPlansForSupplier: Updated ${plan.supplierName} ${plan.planName} in ${plan.priceZone} from ${oldPrice} to ${newPrice} øre/kWh`);
      }
    }
    
    if (updatedCount > 0) {
      // Save back to storage
      if (isDevelopmentMode) {
        inMemoryPlans = [...plans];
        console.log(`updateAllPlansForSupplier: Saved ${updatedCount} updated plans to inMemoryPlans`);
      } else {
        await kv.set(PLANS_KEY, plans);
        console.log(`updateAllPlansForSupplier: Saved ${updatedCount} updated plans to KV`);
      }
      const planTypeText: string = planType ? ` ${planType}` : '';
      const bindingTimeText: string = bindingTime !== undefined ? ` (${bindingTime}m)` : '';
      const bindingDateText: string = bindingTimeDate ? ` (${bindingTimeDate})` : '';
      console.log(`Updated ${updatedCount} plans for ${supplierName}${planTypeText}${bindingTimeText}${bindingDateText} in ${priceZone} to ${newPrice} øre/kWh`);
    } else {
      console.log(`updateAllPlansForSupplier: No plans found matching criteria`);
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
    const plans: ElectricityPlan[] = await getAllPlans();
    return plans.filter((plan: ElectricityPlan) => 
      plan.supplierName.toLowerCase().includes(supplierName.toLowerCase())
    );
  } catch (error) {
    console.error('Error fetching plans by supplier:', error);
    return [];
  }
}

export async function getPlansByZone(priceZone: PriceZone): Promise<ElectricityPlan[]> {
  try {
    const plans: ElectricityPlan[] = await getAllPlans();
    return plans.filter((plan: ElectricityPlan) => plan.priceZone === priceZone);
  } catch (error) {
    console.error('Error fetching plans by zone:', error);
    return [];
  }
}

export async function incrementClick(buttonId: string): Promise<void> {
  if (isDevelopmentMode) {
    inMemoryClicks[buttonId as string] = (inMemoryClicks[buttonId as string] || 0) + 1;
    return;
  }
  const key: string = `clicks:${buttonId}`;
  const current: number = (await kv.get<number>(key)) || 0;
  await kv.set(key, current + 1);
}

export async function getAllClickCounts(): Promise<Record<string, number>> {
  try {
    console.log('🔍 getAllClickCounts: Starting...');
    console.log('🔍 getAllClickCounts: isDevelopmentMode =', isDevelopmentMode);
    
    if (isDevelopmentMode) {
      console.log('🔍 getAllClickCounts: Using in-memory clicks:', inMemoryClicks);
      return { ...inMemoryClicks };
    }
    
    console.log('🔍 getAllClickCounts: Using KV storage...');
    
    // Test KV connection first
    try {
      await kv.ping();
      console.log('🔍 getAllClickCounts: KV connection test successful');
    } catch (kvError) {
      console.error('❌ getAllClickCounts: KV connection test failed:', kvError);
      console.log('🔍 getAllClickCounts: Falling back to in-memory storage');
      return { ...inMemoryClicks };
    }
    
    // Dynamically include all plan button IDs
    const plans: ElectricityPlan[] = await getAllPlans();
    console.log('🔍 getAllClickCounts: Got plans, count:', plans.length);
    
    const planButtonIds: string[] = plans.map((plan: ElectricityPlan) => `plan-${plan.id}`);
    console.log('🔍 getAllClickCounts: Plan button IDs:', planButtonIds);
    
    const buttonIds: string[] = [
      'business-hero-se-tilbud',
      'business-cta-se-tilbud',
      ...planButtonIds,
    ];
    console.log('🔍 getAllClickCounts: All button IDs:', buttonIds);
    
    const result: Record<string, number> = {};
    for (const id of buttonIds) {
      try {
        const key: string = `clicks:${id}`;
        console.log('🔍 getAllClickCounts: Fetching key:', key);
        result[id] = (await kv.get<number>(key)) || 0;
        console.log('🔍 getAllClickCounts: Key', key, '=', result[id]);
      } catch (keyError) {
        console.error(`❌ getAllClickCounts: Error fetching key clicks:${id}:`, keyError);
        result[id] = 0; // Default to 0 if key fetch fails
      }
    }
    
    console.log('🔍 getAllClickCounts: Final result:', result);
    return result;
  } catch (error) {
    console.error('❌ getAllClickCounts: Error:', error);
    console.error('❌ getAllClickCounts: Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    // Fallback to in-memory storage
    console.log('🔍 getAllClickCounts: Falling back to in-memory storage due to error');
    return { ...inMemoryClicks };
  }
}

export async function setPlanFeatured(id: string, featured: boolean): Promise<boolean> {
  try {
    const plans: ElectricityPlan[] = await getAllPlans();
    const planIndex = plans.findIndex(plan => plan.id === id);
    if (planIndex === -1) {
      console.error(`Plan not found for setPlanFeatured: ${id}`);
      return false;
    }
    plans[planIndex].featured = featured;
    if (isDevelopmentMode) {
      inMemoryPlans = [...plans];
    } else {
      await kv.set(PLANS_KEY, plans);
    }
    console.log(`Set featured=${featured} for plan id=${id}`);
    return true;
  } catch (error) {
    console.error('Error setting plan featured:', error);
    return false;
  }
}

export async function addPlan(plan: ElectricityPlan): Promise<boolean> {
  try {
    const plans: ElectricityPlan[] = await getAllPlans();
    plans.push(plan);
    if (isDevelopmentMode) {
      inMemoryPlans = [...plans];
    } else {
      await kv.set(PLANS_KEY, plans);
    }
    console.log('addPlan: Added new plan', plan);
    return true;
  } catch (error) {
    console.error('addPlan: Error adding plan:', error);
    return false;
  }
} 