import type { Metadata } from "next";
import TrackedButton from '@/components/TrackedButton';
import PlanComparisonClient from '@/components/PlanComparisonClient';
import ContactForm from '@/components/ContactForm';
import { fetchElectricityPlans } from '@/lib/strom-api';
import { mockElectricityPlans } from '@/data/mock-plans';
import { ElectricityPlan } from '@/types/electricity';
import Image from 'next/image';

export const metadata: Metadata = {
  title: "STOPP Å KASTE PENGER BORT! | Billigere strøm enn spotpris | Strømsjef.no",
  description: "Betaler du fortsatt for mye for strømmen? Nå kan du sikre deg en av Norges råeste kampanjer: Billigere enn spotpris – hele -1,7 øre påslag per kWh i ett helt år, 0 kr i månedsavgift, og ingen bindingstid.",
  openGraph: {
    title: "STOPP Å KASTE PENGER BORT! | Billigere strøm enn spotpris",
    description: "Betaler du fortsatt for mye for strømmen? Nå kan du sikre deg en av Norges råeste kampanjer: Billigere enn spotpris – hele -1,7 øre påslag per kWh i ett helt år, 0 kr i månedsavgift, og ingen bindingstid.",
    url: "https://stromsjef.no/landing",
    type: "website",
    siteName: "Strømsjef.no",
    images: [
      {
        url: "https://stromsjef.no/logo-lightning.png",
        width: 1200,
        height: 630,
        alt: "Strømsjef logo"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "STOPP Å KASTE PENGER BORT! | Billigere strøm enn spotpris",
    description: "Betaler du fortsatt for mye for strømmen? Nå kan du sikre deg en av Norges råeste kampanjer: Billigere enn spotpris – hele -1,7 øre påslag per kWh i ett helt år, 0 kr i månedsavgift, og ingen bindingstid.",
    images: [
      "https://stromsjef.no/logo-lightning.png"
    ]
  }
};

// Force dynamic rendering to get fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export default async function LandingPage() {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-orange-500 to-red-600 opacity-90"></div>
        <div className="relative z-10 container mx-auto px-4 py-16 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight animate-slide-up">
              STOPP Å KASTE PENGER BORT!
            </h1>
            <p className="text-xl md:text-2xl text-white mb-8 font-medium animate-slide-up-delay-1">
              Betaler du fortsatt for mye for strømmen? Nå kan du sikre deg en av Norges råeste kampanjer:
            </p>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 mb-8 animate-slide-up-delay-2">
              <div className="text-2xl md:text-3xl font-bold text-white mb-4">
                Billigere enn spotpris – hele -1,7 øre påslag per kWh i ett helt år,
              </div>
              <div className="text-xl md:text-2xl text-white font-semibold">
                0 kr i månedsavgift, og ingen bindingstid.
              </div>
            </div>
            
            {/* Savings Indicator */}
            <div className="bg-yellow-400 text-black font-bold text-lg px-6 py-3 rounded-lg mb-8 inline-block animate-pulse-slow">
              Spar penger på strømmen
            </div>
            
            <div className="bg-red-600/20 backdrop-blur-sm rounded-2xl p-6 inline-block animate-slide-up-delay-3">
              <TrackedButton
                buttonId="hero-cta"
                href="https://cheapenergy.no/privat/cheap-spot/?utm_source=stromsjef.no&utm_medium=affiliate"
                className="btn-cta btn-cta-primary btn-cta-xl hover-glow"
              >
                JA TAKK – bestill nå
              </TrackedButton>
            </div>
          </div>
        </div>
      </section>

      {/* Main Offer Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
              En av Norges beste strømavtaler – akkurat nå
            </h2>
            <p className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed">
              De fleste betaler mer enn de trenger. Høye månedsavgifter og påslag på strømmen spiser av lommeboka uten at man tenker over det. Men denne kampanjen kutter alt unødvendig:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 mb-12 animate-stagger">
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 text-left hover-lift">
                <div className="text-2xl mb-4">✅ -1,7 øre per kWh i påslag i ett helt år</div>
                <p className="text-gray-700">Altså billigere enn spotpris</p>
              </div>
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 text-left hover-lift">
                <div className="text-2xl mb-4">✅ 0 kr i månedsavgift</div>
                <p className="text-gray-700">Du betaler kun for strømmen du bruker</p>
              </div>
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 text-left hover-lift">
                <div className="text-2xl mb-4">✅ Ingen bindingstid</div>
                <p className="text-gray-700">Full frihet til å bytte når som helst</p>
              </div>
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 text-left hover-lift">
                <div className="text-2xl mb-4">✅ Ingen skjulte gebyrer</div>
                <p className="text-gray-700">Full oversikt, ingen overraskelser</p>
              </div>
            </div>
            
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-8">
              <div className="text-2xl font-bold text-blue-800 mb-2">✅ Rask og enkel bestilling</div>
              <p className="text-blue-700">Det tar under 2 minutter</p>
            </div>

            <TrackedButton
              buttonId="main-offer-cta"
              href="https://cheapenergy.no/privat/cheap-spot/?utm_source=stromsjef.no&utm_medium=affiliate"
              className="btn-cta btn-cta-primary btn-cta-large"
            >
              Se hvor mye du kan spare
            </TrackedButton>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-12 bg-blue-50">
        <div className="container mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold text-center text-blue-800 mb-4">Få personlig hjelp – vi finner den beste strømavtalen for deg!</h2>
          <p className="text-center text-blue-900 mb-8">Legg igjen navn og nummer, så ringer vi deg for en gratis og uforpliktende prat. Vi hjelper deg å spare penger – enkelt og trygt!</p>
          <ContactForm />
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8">
              Trygt, enkelt – og helt gratis å bytte
            </h2>
            <p className="text-lg md:text-xl text-gray-700 mb-8 text-center leading-relaxed">
              Vi viser deg strømavtaler som gir deg mer for pengene. Alt skjer digitalt – og byttet tar kun noen få minutter:
            </p>

            {/* Testimonial */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-8 mb-8">
              <div className="flex items-start gap-4">
                <div className="text-4xl">💬</div>
                <div>
                  <blockquote className="text-lg md:text-xl text-gray-800 italic mb-4">
                    "Betaler du fortsatt månedsavgift og dyre påslag? Det er som å leie DVD i 2025."
                  </blockquote>
                  <cite className="text-gray-600 font-semibold">— Mathias Nilsson</cite>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8 animate-stagger">
              <div className="text-center hover-lift">
                <div className="text-3xl mb-2 animate-bounce-gentle">📉</div>
                <div className="text-lg font-semibold text-gray-800">Flere tusen har allerede spart penger</div>
                <p className="text-gray-600">med kampanjer vi har delt</p>
              </div>
              <div className="text-center hover-lift">
                <div className="text-3xl mb-2 animate-bounce-gentle">⏱</div>
                <div className="text-lg font-semibold text-gray-800">Ingen skjemaer å printe</div>
                <p className="text-gray-600">ingen kontakt med gamle leverandører</p>
              </div>
              <div className="text-center hover-lift">
                <div className="text-3xl mb-2 animate-bounce-gentle">💡</div>
                <div className="text-lg font-semibold text-gray-800">Bare bedre strømavtaler</div>
                <p className="text-gray-600">raskt og enkelt</p>
              </div>
            </div>

            {/* Security Badges */}
            <div className="flex flex-wrap justify-center items-center gap-6 mb-8">
              <div className="bg-white px-4 py-2 rounded-lg border flex items-center gap-2">
                <span className="text-green-500 text-xl">🔒</span>
                <span className="text-sm font-semibold">SSL Sikker</span>
              </div>
              <div className="bg-white px-4 py-2 rounded-lg border flex items-center gap-2">
                <span className="text-blue-500 text-xl">✅</span>
                <span className="text-sm font-semibold">GDPR Kompatibel</span>
              </div>
              <div className="bg-white px-4 py-2 rounded-lg border flex items-center gap-2">
                <span className="text-purple-500 text-xl">🏆</span>
                <span className="text-sm font-semibold">Trusted Partner</span>
              </div>
            </div>

            <div className="text-center">
              <TrackedButton
                buttonId="trust-cta"
                href="https://cheapenergy.no/privat/cheap-spot/?utm_source=stromsjef.no&utm_medium=affiliate"
                className="btn-cta btn-cta-secondary btn-cta-large"
              >
                Start her – det er gratis og uforpliktende
              </TrackedButton>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
              Ofte stilte spørsmål
            </h2>
            
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3">Hvordan fungerer byttet av strømleverandør?</h3>
                <p className="text-gray-700">Byttet skjer automatisk når du bestiller. Din gamle avtale sies opp og den nye starter. Ingen avbrudd i strømforsyningen.</p>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3">Er det noen bindingstid?</h3>
                <p className="text-gray-700">Nei, ingen bindingstid. Du kan bytte leverandør når som helst uten gebyrer.</p>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3">Hvor mye kan jeg spare?</h3>
                <p className="text-gray-700">Med -1,7 øre påslag per kWh og 0 kr månedsavgift kan du spare flere tusen kroner i året, avhengig av forbruket ditt.</p>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3">Er det skjulte gebyrer?</h3>
                <p className="text-gray-700">Nei, alle priser er transparente. Du betaler kun for strømmen du bruker, ingen skjulte kostnader.</p>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3">Hvor lang tid tar bestillingen?</h3>
                <p className="text-gray-700">Bestillingen tar under 2 minutter. Alt skjer digitalt og er enkelt å gjennomføre.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Klar for lavere strømregninger?
            </h2>
            <p className="text-lg md:text-xl mb-6 leading-relaxed">
              Det tar bare noen minutter å bytte – men kan spare deg for tusenvis av kroner.
              Du får strømmen billigere enn spotpris, ingen månedsavgift og ingen bindingstid.
            </p>
            <p className="text-xl font-semibold mb-8">
              Kort sagt: ingen tull, bare smart strømvalg.
            </p>
            
            <TrackedButton
              buttonId="final-cta"
              href="https://cheapenergy.no/privat/cheap-spot/?utm_source=stromsjef.no&utm_medium=affiliate"
              className="btn-cta btn-cta-primary btn-cta-xl"
            >
              Bytt til billigere strøm nå – og behold pengene i lomma di!
            </TrackedButton>
          </div>
        </div>
      </section>

      {/* Plan Comparison Section - Real Integration */}
      <section id="sammenligning">
        <PlanComparisonClient initialPlans={plans} />
      </section>

      {/* Contact Support Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Trenger du hjelp?
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              Vi er her for å hjelpe deg med å finne den beste strømavtalen. 
              Kontakt oss hvis du har spørsmål.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:kontakt@stromsjef.no"
                className="btn-cta btn-cta-primary"
              >
                Send e-post
              </a>
              <a 
                href="tel:+4712345678"
                className="btn-cta btn-cta-primary"
              >
                Ring oss
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}