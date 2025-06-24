'use client';

import { useState, useEffect } from 'react';
import { ElectricityPlan, PriceZone, PriceZoneNames } from '@/types/electricity';
import PlanCard from '@/components/PlanCard';

interface PlanComparisonClientProps {
  initialPlans: ElectricityPlan[];
}

export default function PlanComparisonClient({ initialPlans }: PlanComparisonClientProps) {
  const [selectedZone, setSelectedZone] = useState<PriceZone | 'all'>('all');
  const [plans, setPlans] = useState<ElectricityPlan[]>(initialPlans);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [refreshError, setRefreshError] = useState<string | null>(null);
  const [refreshCount, setRefreshCount] = useState(0);

  console.log("Current plans:", plans);
  console.log("Selected zone:", selectedZone);
  console.log("Refresh count:", refreshCount);

  const filteredPlans = plans.filter(plan => 
    selectedZone === 'all' || plan.priceZone === selectedZone
  );

  console.log("Filtered plans:", filteredPlans);

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
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center mb-2">Finn den beste strømavtalen for deg</h1>
        <p className="text-lg text-gray-600 text-center">Sammenlign og spar penger på strømregningen.</p>
      </div>

      <div className="mb-6 flex flex-col items-center">
        <div className="flex items-center gap-4 mb-2">
          <p className="text-base font-semibold text-blue-700">Velg din prissone for å se riktige priser i ditt område!</p>
          <button
            onClick={() => refreshPlans(false)}
            disabled={isRefreshing}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isRefreshing ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Oppdaterer...
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Oppdater priser
              </>
            )}
          </button>
        </div>
        
        {refreshError && (
          <div className="text-red-600 text-sm mb-2 bg-red-50 p-2 rounded">
            {refreshError}
          </div>
        )}
        
        <p className="text-sm text-gray-500">
          Sist oppdatert: {lastUpdated.toLocaleTimeString('nb-NO')} (auto-oppdatering hvert 30. sekund, {refreshCount} oppdateringer)
        </p>
        <select 
          value={selectedZone} 
          onChange={(e) => setSelectedZone(e.target.value as PriceZone | 'all')}
          className="p-2 border rounded-md mt-2"
        >
          <option value="all">Alle prissoner</option>
          {Object.values(PriceZone).map(zone => (
            <option key={zone} value={zone}>{zone} ({PriceZoneNames[zone]})</option>
          ))}
        </select>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlans.length > 0 ? (
            filteredPlans.map(plan => (
              <PlanCard key={`${plan.id}-${plan.pricePerKwh}-${refreshCount}`} plan={plan} />
            ))
        ) : (
            <p className="text-center col-span-full">Fant ingen avtaler for valgt sone.</p>
        )}
      </div>
    </div>
  );
} 