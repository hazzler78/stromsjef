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