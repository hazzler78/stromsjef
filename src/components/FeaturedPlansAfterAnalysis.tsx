"use client";

import { useEffect, useState } from 'react';
import PlanCard from '@/components/PlanCard';
import type { ElectricityPlan } from '@/types/electricity';

export default function FeaturedPlansAfterAnalysis() {
  const [plans, setPlans] = useState<ElectricityPlan[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await fetch('/api/plans', { cache: 'no-store' });
        const data = await res.json();
        if (res.ok && data?.plans) {
          if (isMounted) setPlans(data.plans as ElectricityPlan[]);
        } else {
          throw new Error(data?.error || 'Kunne ikke laste planer');
        }
      } catch (e) {
        if (isMounted) setError(e instanceof Error ? e.message : 'Ukjent feil');
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  if (error) {
    return null;
  }

  if (!plans) {
    return (
      <div className="text-center text-gray-500 text-sm">Laster anbefalte avtaler…</div>
    );
  }

  const featured = plans
    .filter(p => p.featured)
    .sort((a, b) => (a.sortOrder || 999) - (b.sortOrder || 999))
    .slice(0, 6);

  if (featured.length === 0) return null;

  return (
    <section className="mb-12">
      <h2 className="text-3xl font-bold mb-2 text-center">Mest populære avtaler</h2>
      <p className="text-gray-600 text-center mb-8">Velg et alternativ og bytt enkelt – vi har plukket ut gode valg.</p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featured.map(plan => (
          <PlanCard key={`featured-after-${plan.id}`} plan={plan} />
        ))}
      </div>
    </section>
  );
}


