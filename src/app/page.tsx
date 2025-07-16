import { fetchElectricityPlans } from '@/lib/strom-api';
import { mockElectricityPlans } from '@/data/mock-plans';
import PlanComparisonClient from '@/components/PlanComparisonClient';
import { ElectricityPlan } from '@/types/electricity';
import Link from 'next/link';
import Image from 'next/image';
import PlanCard from '@/components/PlanCard';
import ContactForm from '@/components/ContactForm';

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
      {/* Ny introduktionstext */}
      <section className="bg-white py-8">
        <div className="container mx-auto text-center">
          <p className="text-lg md:text-xl text-gray-700 mb-2">Ingen strømkunder ønsker å betale mer enn man må.</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-blue-700 mb-1 tracking-tight">STRØMSJEF</h1>
          <p className="text-xl md:text-2xl text-gray-800 font-medium">Strømvalg&nbsp;gjort&nbsp;enkelt</p>
        </div>
      </section>

      {/* Utvalgte strømavtaler - FLYTTAD HÖGST UPP */}
      <section className="bg-gray-50 py-10 mb-8">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.filter(plan => plan.featured).map(plan => (
              <PlanCard key={`top-featured-${plan.id}`} plan={plan} />
            ))}
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500 text-white py-16 -mx-4 px-4 mb-8">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
            Bytt strømavtale enkelt – spar penger på minutter.
          </h1>
          <p className="text-2xl mb-8 max-w-2xl mx-auto font-medium">
            Finn billig strømavtale fra utvalgte leverandører. 100% gratis.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Link 
              href="#sammenligning" 
              className="bg-blue-600 !text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Se avtaler
            </Link>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-4">
            <span className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm font-semibold border border-white/20">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              Kun gode avtaler
            </span>
            <span className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm font-semibold border border-white/20">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              Ingen skjulte gebyrer
            </span>
            <span className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm font-semibold border border-white/20">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              1000+ fornøyde kunder
            </span>
          </div>
        </div>
      </section>

      {/* Kontaktformulär - flyttad upp */}
      <section className="py-12 bg-blue-50">
        <div className="container mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold text-center text-blue-800 mb-4">Få personlig hjelp – vi finner den beste strømavtalen for deg!</h2>
          <p className="text-center text-blue-900 mb-8">Legg igjen navn og nummer, så ringer vi deg for en gratis og uforpliktende prat. Vi hjelper deg å spare penger – enkelt og trygt!</p>
          <ContactForm />
        </div>
      </section>

      {/* How it works Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Slik fungerer det
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* Step 1 */}
            <div className="text-center">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-sm">
                1
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">
                Finn billig strømavtale
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Se alle tilgjengelige strømavtaler side om side med priser og vilkår.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-sm">
                2
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">
                Velg beste tilbud
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Finn den avtalen som gir deg mest verdi for pengene dine.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-sm">
                3
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">
                Bytt gratis
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Vi hjelper deg med å bytte leverandør – helt kostnadsfritt og enkelt.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mb-12 bg-slate-50 py-10">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                {/* Heroicon: Sparkles */}
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M6.05 17.95l-1.414 1.414m12.728 0l-1.414-1.414M6.05 6.05L4.636 4.636" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 8a4 4 0 100 8 4 4 0 000-8z" /></svg>
              </div>
              <h3 className="text-lg font-bold mb-2 flex items-center justify-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                Utvalgte avtaler
              </h3>
              <p className="text-gray-600">Kun de beste og mest relevante strømavtalene.</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                {/* Heroicon: AdjustmentsHorizontal */}
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /><circle cx="8" cy="6" r="2" fill="currentColor" /><circle cx="16" cy="12" r="2" fill="currentColor" /><circle cx="8" cy="18" r="2" fill="currentColor" /></svg>
              </div>
              <h3 className="text-lg font-bold mb-2 flex items-center justify-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                Spotpris eller fastpris
              </h3>
              <p className="text-gray-600">Velg det som passer deg best – full fleksibilitet.</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                {/* Heroicon: ArrowPathRoundedSquare */}
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 6A9 9 0 116.582 9M4 9h5" /></svg>
              </div>
              <h3 className="text-lg font-bold mb-2 flex items-center justify-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                Enkelt og gratis bytte
              </h3>
              <p className="text-gray-600">Bytt leverandør på minutter – helt kostnadsfritt.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust/Partner Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">
            Vi samarbeider med pålitelige leverandører
          </h2>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-16 mb-2">
                <Image
                  src="/logos/cheap-energy.png"
                  alt="Cheap Energy"
                  fill
                  className="object-contain"
                />
              </div>
              <p className="text-sm text-gray-600 font-medium">Cheap Energy</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-16 mb-2">
                <Image
                  src="/logos/kilden-kraft.png"
                  alt="Kilden Kraft"
                  fill
                  className="object-contain"
                />
              </div>
              <p className="text-sm text-gray-600 font-medium">Kilden Kraft</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-16 mb-2">
                <Image
                  src="/logos/barum-energi.png"
                  alt="Bærum Energi"
                  fill
                  className="object-contain"
                />
              </div>
              <p className="text-sm text-gray-600 font-medium">Bærum Energi</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-16 mb-2">
                <Image
                  src="/logos/vstrom.png"
                  alt="VStrøm"
                  fill
                  className="object-contain"
                />
              </div>
              <p className="text-sm text-gray-600 font-medium">VStrøm</p>
            </div>
          </div>
        </div>
      </section>

      {/* Plan Comparison Section */}
      <section id="sammenligning">
        <PlanComparisonClient initialPlans={plans} />
      </section>

      {/* CTA Section */}
      <section className="bg-white py-12 -mx-4 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Klar til å spare på strømregningen?</h2>
          <p className="text-lg text-gray-600 mb-6">
            Se våre anbefalte avtaler og finn den beste strømavtalen for deg.
          </p>
          <Link 
            href="#sammenligning" 
            className="bg-blue-600 !text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Se avtaler
          </Link>
        </div>
      </section>
    </div>
  );
}
