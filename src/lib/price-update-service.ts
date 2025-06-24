import { PriceUpdateCommand } from './nlp-utils';
import { PriceZone } from '@/types/electricity';
import { updateAllPlansForSupplier, getAllPlans, resetToDefaultPrices as dbResetToDefaultPrices } from './database';

export interface PriceUpdateResult {
  success: boolean;
  message: string;
  updatedPlans?: string[];
  errors?: string[];
}

export async function updateElectricityPrices(commands: PriceUpdateCommand[]): Promise<PriceUpdateResult> {
  const results: PriceUpdateResult = {
    success: true,
    message: '',
    updatedPlans: [],
    errors: []
  };

  for (const command of commands) {
    try {
      // Update all plans for the supplier in the specified zone
      const updatedCount = await updateAllPlansForSupplier(
        command.supplier,
        command.priceZone as PriceZone,
        command.price
      );

      if (updatedCount === 0) {
        results.errors?.push(`No plans found for ${command.supplier} in ${command.priceZone}`);
        results.success = false;
        continue;
      }

      results.updatedPlans?.push(`${command.supplier} in ${command.priceZone}: Updated ${updatedCount} plan(s) to ${command.price} øre/kWh`);

    } catch (error) {
      results.errors?.push(`Error updating ${command.supplier} in ${command.priceZone}: ${error}`);
      results.success = false;
    }
  }

  // Build response message
  if (results.updatedPlans && results.updatedPlans.length > 0) {
    results.message = `✅ Successfully updated ${results.updatedPlans.length} supplier(s):\n${results.updatedPlans.join('\n')}`;
  }

  if (results.errors && results.errors.length > 0) {
    results.message += `\n\n❌ Errors:\n${results.errors.join('\n')}`;
  }

  return results;
}

export async function getCurrentPrices(supplier?: string, priceZone?: string): Promise<string> {
  try {
    let filteredPlans = await getAllPlans();

    if (supplier) {
      filteredPlans = filteredPlans.filter(plan => 
        plan.supplierName.toLowerCase().includes(supplier.toLowerCase())
      );
    }

    if (priceZone) {
      filteredPlans = filteredPlans.filter(plan => 
        plan.priceZone === priceZone as PriceZone
      );
    }

    if (filteredPlans.length === 0) {
      return 'No plans found matching the criteria.';
    }

    const priceList = filteredPlans.map(plan => 
      `${plan.supplierName} ${plan.planName} in ${plan.priceZone}: ${plan.pricePerKwh} øre/kWh`
    );

    return `Current prices:\n${priceList.join('\n')}`;
  } catch (error) {
    console.error('Error getting current prices:', error);
    return 'Error fetching current prices.';
  }
}

export async function resetToDefaultPrices(): Promise<PriceUpdateResult> {
  try {
    const success = await dbResetToDefaultPrices();
    
    if (success) {
      return {
        success: true,
        message: '✅ Successfully reset all prices to default values.',
        updatedPlans: []
      };
    } else {
      return {
        success: false,
        message: '❌ Failed to reset prices to default values.',
        errors: ['Database reset failed']
      };
    }
  } catch (error) {
    return {
      success: false,
      message: '❌ Error resetting prices to default values.',
      errors: [error instanceof Error ? error.message : String(error)]
    };
  }
} 