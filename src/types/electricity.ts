export enum PriceZone {
  ALLE = 'ALLE', // Gjelder alle soner
  NO1 = 'NO1', // Øst-Norge
  NO2 = 'NO2', // Sør-Norge
  NO3 = 'NO3', // Midt-Norge
  NO4 = 'NO4', // Nord-Norge
  NO5 = 'NO5', // Vest-Norge
}

export const PriceZoneNames: Record<PriceZone, string> = {
  [PriceZone.ALLE]: 'Alle soner',
  [PriceZone.NO1]: 'Østlandet',
  [PriceZone.NO2]: 'Sørlandet',
  [PriceZone.NO3]: 'Midt-Norge',
  [PriceZone.NO4]: 'Nord-Norge',
  [PriceZone.NO5]: 'Vestlandet',
};

export interface ElectricityPlan {
  id: string;
  supplierName: string;
  planName: string;
  pricePerKwh: number; // in øre (markup/påslag)
  monthlyFee: number; // in NOK
  bindingTime: number; // in months
  bindingTimeText?: string; // Optional text override
  terminationFee?: number; // Optional termination fee
  termsGuarantee?: string; // Optional terms guarantee text
  guaranteeDisclaimer?: string; // Optional text for after guarantee expires
  priceZone: PriceZone;
  logoUrl?: string;
  affiliateLink: string;
  featured?: boolean; // Mark as recommended/featured
} 