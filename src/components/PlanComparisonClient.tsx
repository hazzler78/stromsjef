'use client';

import { useState } from 'react';
import { ElectricityPlan, PriceZone, PriceZoneNames } from '@/types/electricity';
import PlanCard from '@/components/PlanCard';

interface PlanComparisonClientProps {
  initialPlans: ElectricityPlan[];
}

export default function PlanComparisonClient({ initialPlans }: PlanComparisonClientProps) {
  const [selectedZone, setSelectedZone] = useState<PriceZone | 'all'>('all');

  console.log("Initial plans:", initialPlans);
  console.log("Selected zone:", selectedZone);

  const filteredPlans = initialPlans.filter(plan => 
    selectedZone === 'all' || plan.priceZone === selectedZone
  );

  console.log("Filtered plans:", filteredPlans);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center mb-2">Finn den beste strømavtalen for deg</h1>
        <p className="text-lg text-gray-600 text-center">Sammenlign og spar penger på strømregningen.</p>
      </div>

      <div className="mb-6 flex flex-col items-center">
        <p className="mb-2 text-base font-semibold text-blue-700">Velg din prissone for å se riktige priser i ditt område!</p>
        <select 
          value={selectedZone} 
          onChange={(e) => setSelectedZone(e.target.value as PriceZone | 'all')}
          className="p-2 border rounded-md"
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
              <PlanCard key={plan.id} plan={plan} />
            ))
        ) : (
            <p className="text-center col-span-full">Fant ingen avtaler for valgt sone.</p>
        )}
      </div>
    </div>
  );
} 