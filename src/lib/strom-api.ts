import { ElectricityPlan, PriceZone } from '@/types/electricity';
import { getAllPlans, initializeDatabase } from './database';

// This is the raw structure from the Forbrukerrådet API
interface ApiPricePlan {
  id: string;
  vendorName: string;
  productName: string;
  monthlyFee: number;
  spotPriceAddon: number; // This is the markup in øre/kWh
  bindingPeriod: number;
  priceZone: PriceZone;
  vendorUrl: string;
  productType: 'SPOT' | 'VARIABLE' | 'FIXED';
}

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

let tokenCache: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  const now = Date.now();
  if (tokenCache && tokenCache.expiresAt > now) {
    return tokenCache.token;
  }

  const clientId = process.env.STROM_CLIENT_ID;
  const clientSecret = process.env.STROM_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Missing Strom API credentials. Please add STROM_CLIENT_ID and STROM_CLIENT_SECRET to your .env.local file.');
  }

  const response = await fetch(`${process.env.STROM_API_URL}/auth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grantType: 'client_credentials',
      clientId,
      clientSecret,
    }),
    cache: 'no-store',
  });

  if (!response.ok) {
    console.error('Failed to get access token:', await response.text());
    throw new Error('Could not authenticate with Strom API');
  }

  const data = await response.json();
  tokenCache = {
    token: data.accessToken,
    expiresAt: now + 50 * 60 * 1000, // 50 minutes, adjust if needed
  };

  return data.accessToken;
}

export async function fetchElectricityPlans(): Promise<ElectricityPlan[]> {
  try {
    // Initialize database if needed
    await initializeDatabase();
    
    // Get plans from database (which can be updated by Telegram bot)
    const plans = await getAllPlans();
    
    console.log(`Fetched ${plans.length} plans from database`);
    return plans;
  } catch (error) {
    console.error('Error fetching plans from database:', error);
    
    // For development, just return mock data instead of trying external API
    if (process.env.NODE_ENV === 'development') {
      console.log('Development mode: returning mock data');
      const { mockElectricityPlans } = await import('@/data/mock-plans');
      return mockElectricityPlans;
    }
    
    // Fallback to external API only in production
    try {
      console.log('Falling back to external API...');
      return await fetchFromExternalAPI();
    } catch (apiError) {
      console.error('External API also failed:', apiError);
      throw new Error('Could not fetch electricity plans from database or external API');
    }
  }
}

async function fetchFromExternalAPI(): Promise<ElectricityPlan[]> {
  const token = await getAccessToken();
  const response = await fetch(`${process.env.STROM_API_URL}/products`, {
    headers: {
      'Authorization': `Bearer ${token}`
    },
    next: { revalidate: 3600 }
  });

  if (!response.ok) {
    console.error('Failed to fetch electricity plans:', await response.text());
    throw new Error('Could not fetch electricity plans');
  }

  // Adjust mapping as needed based on actual API response
  const apiPlans: ApiPricePlan[] = await response.json();
  console.log("API plans:", apiPlans);

  const plans: ElectricityPlan[] = apiPlans
    .filter(p => p.productType === 'SPOT')
    .map(plan => ({
      id: plan.id,
      supplierName: plan.vendorName,
      planName: plan.productName,
      pricePerKwh: plan.spotPriceAddon,
      monthlyFee: plan.monthlyFee,
      bindingTime: plan.bindingPeriod,
      priceZone: plan.priceZone,
      affiliateLink: plan.vendorUrl,
    }));

  return plans;
} 