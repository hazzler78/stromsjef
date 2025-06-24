export interface PriceUpdateCommand {
  supplier: string;
  priceZone: string;
  price: number;
  planType?: string; // 'spotpris', 'fastpris', or undefined for all
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
    
    // Check if this is a price (number)
    const priceMatch = part.match(/^(\d+(?:[.,]\d+)?)$/);
    if (priceMatch) {
      currentPrice = parseFloat(priceMatch[1].replace(',', '.'));
      
      // If we have supplier and zone, create a command
      if (currentSupplier && currentZone && currentPrice > 0) {
        commands.push({
          supplier: currentSupplier,
          priceZone: currentZone,
          price: currentPrice,
          planType: currentPlanType || undefined
        });
        
        // Reset for next command
        currentSupplier = '';
        currentZone = '';
        currentPrice = 0;
        currentPlanType = '';
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
  
  if (command.price <= 0) {
    return { valid: false, error: 'Price must be greater than 0' };
  }
  
  if (command.planType && !['spotpris', 'fastpris'].includes(command.planType)) {
    return { valid: false, error: 'Invalid plan type. Must be spotpris or fastpris' };
  }
  
  return { valid: true };
}

export function formatPriceUpdateResponse(commands: PriceUpdateCommand[]): string {
  if (commands.length === 0) {
    return '❌ Could not parse any price update commands. Please use format: "Set [Supplier] [PlanType] in [Zone] to [Price]"';
  }
  
  const responses = commands.map(cmd => {
    const planTypeText = cmd.planType ? ` ${cmd.planType}` : '';
    return `✅ ${cmd.supplier}${planTypeText} in ${cmd.priceZone}: ${cmd.price} øre/kWh`;
  });
  
  return responses.join('\n');
} 