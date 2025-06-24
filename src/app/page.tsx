import { fetchElectricityPlans } from '@/lib/strom-api';
import { mockElectricityPlans } from '@/data/mock-plans';
import PlanComparisonClient from '@/components/PlanComparisonClient';
import { ElectricityPlan } from '@/types/electricity';
import Link from 'next/link';

// Force dynamic rendering to get fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export default async function Home() {
  let plans: ElectricityPlan[];

  try {
    console.log('🔄 Fetching fresh plans from database...');
    plans = await fetchElectricityPlans();
    console.log(`✅ Fetched ${plans.length} plans from database`);
    
    // Fallback if API returns empty array
    if (!plans || plans.length === 0) {
      console.warn("API returned no plans, falling back to mock data.");
      plans = mockElectricityPlans;
    }
  } catch (error) {
    console.error("API fetch failed, falling back to mock data.", error);
    plans = mockElectricityPlans; 
  }

  // Log some plan details for debugging
  const cheapEnergyPlans = plans.filter(p => p.supplierName.includes('Cheap Energy'));
  console.log('Cheap Energy plans:', cheapEnergyPlans.map(p => `${p.planName} ${p.priceZone}: ${p.pricePerKwh} øre/kWh`));

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 -mx-4 px-4 mb-8">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Sammenlign strømavtaler og spar penger
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Finn den beste strømavtalen for deg. Vi sammenligner priser fra ledende leverandører 
            og hjelper deg å bytte enkelt og gratis.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="#sammenligning" 
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Start sammenligning
            </Link>
            <Link 
              href="/spotpriskontroll" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Beregn besparelse
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mb-12">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Sammenlign priser</h3>
              <p className="text-gray-600">Se alle tilgjengelige strømavtaler på ett sted og finn den beste prisen for din situasjon.</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Spar penger</h3>
              <p className="text-gray-600">Bytt til en billigere strømavtale og spar hundrevis av kroner hvert år på strømregningen.</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Enkelt bytte</h3>
              <p className="text-gray-600">Vi ordner alt det praktiske for deg. Bytte av strømleverandør er gratis og enkelt.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Plan Comparison Section */}
      <section id="sammenligning">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Sammenlign strømavtaler</h2>
          <PlanComparisonClient initialPlans={plans} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 py-12 -mx-4 px-4 mt-12">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Klar til å spare på strømregningen?</h2>
          <p className="text-lg text-gray-600 mb-6">
            Start sammenligningen nå og finn den beste strømavtalen for deg.
          </p>
          <Link 
            href="#sammenligning" 
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Start sammenligning
          </Link>
        </div>
      </section>
    </div>
  );
}
