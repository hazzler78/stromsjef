'use client';

import { useState, useEffect } from 'react';
import { ElectricityPlan, PriceZone, PriceZoneNames } from '@/types/electricity';
import PlanCard from '@/components/PlanCard';

interface PlanComparisonClientProps {
  initialPlans: ElectricityPlan[];
}

type PlanType = 'all' | 'spotpris' | 'fastpris';

export default function PlanComparisonClient({ initialPlans }: PlanComparisonClientProps) {
  const [selectedZone, setSelectedZone] = useState<PriceZone | 'all'>('all');
  const [selectedPlanType, setSelectedPlanType] = useState<PlanType>('all');
  const [plans, setPlans] = useState<ElectricityPlan[]>(initialPlans);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [refreshError, setRefreshError] = useState<string | null>(null);
  const [refreshCount, setRefreshCount] = useState(0);

  console.log("Current plans:", plans);
  console.log("Selected zone:", selectedZone);
  console.log("Selected plan type:", selectedPlanType);
  console.log("Refresh count:", refreshCount);

  // Filter plans based on selected zone and plan type
  const filteredPlans = plans.filter(plan => {
    const zoneMatch = selectedZone === 'all' || plan.priceZone === selectedZone;
    const planTypeMatch = selectedPlanType === 'all' || 
      (selectedPlanType === 'spotpris' && plan.planName.toLowerCase().includes('spot')) ||
      (selectedPlanType === 'fastpris' && plan.planName.toLowerCase().includes('fast'));
    return zoneMatch && planTypeMatch;
  });

  // Get recommended plans (top 4 cheapest plans)
  const getRecommendedPlans = (allPlans: ElectricityPlan[]) => {
    return allPlans
      .sort((a, b) => a.pricePerKwh - b.pricePerKwh)
      .slice(0, 4);
  };

  // Get all other plans (excluding recommended ones)
  const getAllOtherPlans = (allPlans: ElectricityPlan[]) => {
    const recommendedIds = getRecommendedPlans(allPlans).map(p => p.id);
    return allPlans.filter(plan => !recommendedIds.includes(plan.id));
  };

  const recommendedPlans = getRecommendedPlans(filteredPlans);
  const allOtherPlans = getAllOtherPlans(filteredPlans);

  console.log("Filtered plans:", filteredPlans);
  console.log("Recommended plans:", recommendedPlans);
  console.log("All other plans:", allOtherPlans);

  const refreshPlans = async (isAutoRefresh = false) => {
    if (isRefreshing) {
      console.log('Refresh already in progress, skipping...');
      return;
    }
    
    console.log(`🔄 Refreshing plans (auto: ${isAutoRefresh})`);
    setIsRefreshing(true);
    setRefreshError(null);
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch('/api/plans', {
        signal: controller.signal,
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        }
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        console.log('API response:', data);
        
        if (data.success && data.plans) {
          const oldPrices = plans.map((p: ElectricityPlan) => `${p.supplierName} ${p.planName} ${p.priceZone}: ${p.pricePerKwh}`);
          const newPrices = data.plans.map((p: ElectricityPlan) => `${p.supplierName} ${p.planName} ${p.priceZone}: ${p.pricePerKwh}`);
          
          console.log('Old prices:', oldPrices);
          console.log('New prices:', newPrices);
          
          setPlans(data.plans);
          setLastUpdated(new Date());
          setRefreshCount(prev => prev + 1);
          console.log('✅ Plans refreshed successfully');
        } else {
          throw new Error('Invalid response format');
        }
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ Error refreshing plans:', error);
      
      if (!isAutoRefresh) {
        // Only show error for manual refresh, not auto-refresh
        setRefreshError(`Failed to refresh: ${errorMessage}`);
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  // Auto-refresh every 30 seconds
  useEffect(() => {
    console.log('🕐 Setting up auto-refresh timer');
    const interval = setInterval(() => {
      console.log('🕐 Auto-refresh triggered');
      refreshPlans(true); // Pass true to indicate auto-refresh
    }, 30000); // 30 seconds

    return () => {
      console.log('🕐 Clearing auto-refresh timer');
      clearInterval(interval);
    };
  }, []);

  // Force refresh on component mount
  useEffect(() => {
    console.log('🚀 Component mounted, forcing initial refresh');
    refreshPlans(true);
  }, []);

  return (
    <div className="bg-gray-50 py-12 -mx-4 px-4">
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-2">Finn den beste strømavtalen for deg</h1>
          <p className="text-lg text-gray-600 text-center">Sammenlign og spar penger på strømregningen.</p>
        </div>

        {/* Status and Controls */}
        <div className="mb-8 flex flex-col items-center">
          <div className="flex items-center gap-4 mb-4">
            <p className="text-base font-semibold text-blue-700">Velg din prissone for å se riktige priser i ditt område!</p>
          </div>
          
          {refreshError && (
            <div className="text-red-600 text-sm mb-2 bg-red-50 p-2 rounded">
              {refreshError}
            </div>
          )}
          
          <p className="text-sm text-gray-500 mb-4">
            Sist oppdatert: {lastUpdated.toLocaleTimeString('nb-NO')} (auto-oppdatering hvert 30. sekund, {refreshCount} oppdateringer)
          </p>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl">
            <select 
              value={selectedZone} 
              onChange={(e) => setSelectedZone(e.target.value as PriceZone | 'all')}
              className="p-3 border rounded-lg bg-white shadow-sm flex-1"
            >
              <option value="all">Alle prissoner</option>
              {Object.values(PriceZone).map(zone => (
                <option key={zone} value={zone}>{zone} ({PriceZoneNames[zone]})</option>
              ))}
            </select>
            
            <select 
              value={selectedPlanType} 
              onChange={(e) => setSelectedPlanType(e.target.value as PlanType)}
              className="p-3 border rounded-lg bg-white shadow-sm flex-1"
            >
              <option value="all">Alle avtaler</option>
              <option value="spotpris">Spotpris</option>
              <option value="fastpris">Fastpris</option>
            </select>
          </div>
        </div>

        {/* Recommended Plans Section */}
        {recommendedPlans.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">⭐ Utvalgte avtaler</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendedPlans.map(plan => (
                <PlanCard key={`recommended-${plan.id}-${plan.pricePerKwh}-${refreshCount}`} plan={plan} />
              ))}
            </div>
          </div>
        )}

        {/* All Other Plans Section */}
        {allOtherPlans.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-center">Alle avtaler</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allOtherPlans.map(plan => (
                <PlanCard key={`all-${plan.id}-${plan.pricePerKwh}-${refreshCount}`} plan={plan} />
              ))}
            </div>
          </div>
        )}

        {/* No Plans Found */}
        {filteredPlans.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">Fant ingen avtaler for valgte filter.</p>
            <p className="text-sm text-gray-500 mt-2">Prøv å endre prissone eller avtalestype.</p>
          </div>
        )}
      </div>
    </div>
  );
} 