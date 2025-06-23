import { fetchElectricityPlans } from '@/lib/strom-api';
import { mockElectricityPlans } from '@/data/mock-plans';
import PlanComparisonClient from '@/components/PlanComparisonClient';
import { ElectricityPlan } from '@/types/electricity';

export default async function Home() {
  let plans: ElectricityPlan[];

  try {
    plans = await fetchElectricityPlans();
    // Fallback if API returns empty array
    if (!plans || plans.length === 0) {
      console.warn("API returned no plans, falling back to mock data.");
      plans = mockElectricityPlans;
    }
  } catch (error) {
    console.error("API fetch failed, falling back to mock data.", error);
    plans = mockElectricityPlans; 
  }

  return <PlanComparisonClient initialPlans={plans} />;
}
