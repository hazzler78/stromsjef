export interface PriceUpdateCommand {
  supplier: string;
  priceZone: string;
  price: number;
  planType?: string; // 'spotpris', 'fastpris', or undefined for all
  bindingTime?: number; // binding time in months (e.g., 12 for 12-month plans)
}

// Supplier name mappings for different languages
const SUPPLIER_MAPPINGS: Record<string, string> = {
  // English
  'kilden': 'Kilden Kraft',
  'kilden kraft': 'Kilden Kraft',
  'cheap': 'Cheap Energy Norge',
  'cheap energy': 'Cheap Energy Norge',
  'cheap energy norway': 'Cheap Energy Norge',
  'cheap energy norge': 'Cheap Energy Norge',
};

// Price zone mappings
const PRICE_ZONE_MAPPINGS: Record<string, string> = {
  // English
  'no1': 'NO1',
  'no2': 'NO2', 
  'no3': 'NO3',
  'no4': 'NO4',
  'no5': 'NO5',
  'east': 'NO1',
  'south': 'NO2',
  'central': 'NO3',
  'north': 'NO4',
  'west': 'NO5',
  
  // Norwegian
  'øst': 'NO1',
  'østlandet': 'NO1',
  'sør': 'NO2',
  'sørlandet': 'NO2',
  'midt': 'NO3',
  'midt-norge': 'NO3',
  'nord': 'NO4',
  'nord-norge': 'NO4',
  'vest': 'NO5',
  'vestlandet': 'NO5',
  
  // Swedish
  'öst': 'NO1',
  'söder': 'NO2',
  'väst': 'NO5',
};

// Plan type mappings
const PLAN_TYPE_MAPPINGS: Record<string, string> = {
  // English
  'spot': 'spotpris',
  'spot price': 'spotpris',
  'spotpris': 'spotpris',
  'fixed': 'fastpris',
  'fixed price': 'fastpris',
  'fastpris': 'fastpris',
  'fast': 'fastpris',
};

// Binding time mappings
const BINDING_TIME_MAPPINGS: Record<string, number> = {
  // English
  '12m': 12,
  '12 months': 12,
  '12 måneder': 12,
  '1 year': 12,
  '1 år': 12,
  '24m': 24,
  '24 months': 24,
  '24 måneder': 24,
  '2 years': 24,
  '2 år': 24,
  '36m': 36,
  '36 months': 36,
  '36 måneder': 36,
  '3 years': 36,
  '3 år': 36,
  '0m': 0,
  '0 months': 0,
  '0 måneder': 0,
  'no binding': 0,
  'ingen binding': 0,
};

// Keywords that indicate price setting
const PRICE_SETTING_KEYWORDS: Record<string, boolean> = {
  // English
  'set': true,
  'update': true,
  'change': true,
  'to': true,
  'at': true,
  'price': true,
  
  // Norwegian
  'sett': true,
  'oppdater': true,
  'endre': true,
  'til': true,
  'på': true,
  'pris': true,
  
  // Swedish
  'sätt': true,
  'uppdatera': true,
  'ändra': true,
  'till': true,
};

export function parsePriceUpdateCommand(text: string): PriceUpdateCommand[] {
  const commands: PriceUpdateCommand[] = [];
  const lowerText = text.toLowerCase();
  
  // Split by common separators
  const parts = lowerText.split(/[,\s]+/);
  
  let currentSupplier = '';
  let currentZone = '';
  let currentPrice = 0;
  let currentPlanType = '';
  let currentBindingTime: number | undefined = undefined;
  
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i].trim();
    
    // Check if this is a supplier name
    if (SUPPLIER_MAPPINGS[part]) {
      currentSupplier = SUPPLIER_MAPPINGS[part];
      continue;
    }
    
    // Check if this is a price zone
    if (PRICE_ZONE_MAPPINGS[part]) {
      currentZone = PRICE_ZONE_MAPPINGS[part];
      continue;
    }
    
    // Check if this is a plan type
    if (PLAN_TYPE_MAPPINGS[part]) {
      currentPlanType = PLAN_TYPE_MAPPINGS[part];
      continue;
    }
    
    // Check if this is a binding time
    if (BINDING_TIME_MAPPINGS[part]) {
      currentBindingTime = BINDING_TIME_MAPPINGS[part];
      continue;
    }
    
    // Check if this is a price (number) - now supports negative numbers
    const priceMatch = part.match(/^(-?\d+(?:[.,]\d+)?)$/);
    if (priceMatch) {
      currentPrice = parseFloat(priceMatch[1].replace(',', '.'));
      
      // If we have supplier and zone, create a command (removed price > 0 check)
      if (currentSupplier && currentZone) {
        commands.push({
          supplier: currentSupplier,
          priceZone: currentZone,
          price: currentPrice,
          planType: currentPlanType || undefined,
          bindingTime: currentBindingTime
        });
        
        // Reset for next command
        currentSupplier = '';
        currentZone = '';
        currentPrice = 0;
        currentPlanType = '';
        currentBindingTime = undefined;
      }
      continue;
    }
    
    // Skip price setting keywords
    if (PRICE_SETTING_KEYWORDS[part]) {
      continue;
    }
  }
  
  return commands;
}

export function validatePriceUpdateCommand(command: PriceUpdateCommand): { valid: boolean; error?: string } {
  if (!command.supplier) {
    return { valid: false, error: 'Supplier name is required' };
  }
  
  if (!command.priceZone) {
    return { valid: false, error: 'Price zone is required' };
  }
  
  if (!['NO1', 'NO2', 'NO3', 'NO4', 'NO5'].includes(command.priceZone)) {
    return { valid: false, error: 'Invalid price zone. Must be NO1, NO2, NO3, NO4, or NO5' };
  }
  
  // Allow negative prices (removed price > 0 check)
  if (typeof command.price !== 'number' || isNaN(command.price)) {
    return { valid: false, error: 'Price must be a valid number' };
  }
  
  if (command.planType && !['spotpris', 'fastpris'].includes(command.planType)) {
    return { valid: false, error: 'Invalid plan type. Must be spotpris or fastpris' };
  }
  
  if (command.bindingTime !== undefined && (typeof command.bindingTime !== 'number' || command.bindingTime < 0)) {
    return { valid: false, error: 'Binding time must be a non-negative number' };
  }
  
  return { valid: true };
}

export function formatPriceUpdateResponse(commands: PriceUpdateCommand[]): string {
  if (commands.length === 0) {
    return '❌ Could not parse any price update commands. Please use format: "Set [Supplier] [PlanType] [BindingTime] in [Zone] to [Price]"';
  }
  
  const responses = commands.map(cmd => {
    const planTypeText = cmd.planType ? ` ${cmd.planType}` : '';
    const bindingTimeText = cmd.bindingTime !== undefined ? ` (${cmd.bindingTime}m)` : '';
    return `✅ ${cmd.supplier}${planTypeText}${bindingTimeText} in ${cmd.priceZone}: ${cmd.price} øre/kWh`;
  });
  
  return responses.join('\n');
} 