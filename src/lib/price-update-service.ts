import { mockElectricityPlans } from '@/data/mock-plans';
import { PriceUpdateCommand } from './nlp-utils';
import { PriceZone } from '@/types/electricity';

export interface PriceUpdateResult {
  success: boolean;
  message: string;
  updatedPlans?: string[];
  errors?: string[];
}

export function updateElectricityPrices(commands: PriceUpdateCommand[]): PriceUpdateResult {
  const results: PriceUpdateResult = {
    success: true,
    message: '',
    updatedPlans: [],
    errors: []
  };

  for (const command of commands) {
    try {
      // Find plans that match the supplier and price zone
      const matchingPlans = mockElectricityPlans.filter(plan => 
        plan.supplierName.toLowerCase() === command.supplier.toLowerCase() &&
        plan.priceZone === command.priceZone as PriceZone
      );

      if (matchingPlans.length === 0) {
        results.errors?.push(`No plans found for ${command.supplier} in ${command.priceZone}`);
        results.success = false;
        continue;
      }

      // Update all matching plans
      for (const plan of matchingPlans) {
        const oldPrice = plan.pricePerKwh;
        plan.pricePerKwh = command.price;
        results.updatedPlans?.push(`${plan.supplierName} ${plan.planName} in ${plan.priceZone}: ${oldPrice} → ${command.price} øre/kWh`);
      }

    } catch (error) {
      results.errors?.push(`Error updating ${command.supplier} in ${command.priceZone}: ${error}`);
      results.success = false;
    }
  }

  // Build response message
  if (results.updatedPlans && results.updatedPlans.length > 0) {
    results.message = `✅ Successfully updated ${results.updatedPlans.length} plan(s):\n${results.updatedPlans.join('\n')}`;
  }

  if (results.errors && results.errors.length > 0) {
    results.message += `\n\n❌ Errors:\n${results.errors.join('\n')}`;
  }

  return results;
}

export function getCurrentPrices(supplier?: string, priceZone?: string): string {
  let filteredPlans = mockElectricityPlans;

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
}

export function resetToDefaultPrices(): PriceUpdateResult {
  // This would typically reload from a database or reset to default values
  // For now, we'll just return a message
  return {
    success: true,
    message: 'Reset functionality would reload default prices from database.',
    updatedPlans: []
  };
} 