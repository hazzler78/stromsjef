import Link from 'next/link';
import TrackedButton from '@/components/TrackedButton';

const BusinessPage = () => {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 -mx-4 px-4 mb-8 pt-24 md:pt-28">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Strømavtaler for bedrifter
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Spesialtilpassede strømavtaler for bedrifter av alle størrelser. 
            Spar penger og få bedre kontroll over energikostnadene.
          </p>
          <TrackedButton
            href="https://www.vstrom.no/renspot?utm_source=stromsjef&utm_medium=cpc&utm_campaign=renspot"
            className="bg-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
            style={{ color: 'white' }}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Se tilbud (åpnes i ny fane)"
            buttonId="business-hero-se-tilbud"
          >
            Se tilbud
          </TrackedButton>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Fordeler for bedrifter</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Besparelser</h3>
            <p className="text-gray-600">
              Bedrifter kan spare betydelige beløp på strømregningen ved å velge riktig avtale. 
              Vi hjelper deg å finne den beste løsningen for din virksomhet.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Prisstabilitet</h3>
            <p className="text-gray-600">
              Fastprisavtaler gir deg forutsigbare energikostnader og bedre økonomisk planlegging. 
              Perfekt for bedrifter som ønsker å unngå prisvolatilitet.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Raskt og trygt bytte</h3>
            <p className="text-gray-600">
              Strømbytte skjer enkelt. Du velger avtale, leverandøren ordner resten – du slipper papirarbeid og bryderi.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Skreddersydde løsninger</h3>
            <p className="text-gray-600">
              Vi hjelper deg finne riktig strømavtale basert på bedriftens behov og forbruk.
            </p>
          </div>
        </div>
      </section>

      {/* Business Types Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Tilpasset for din virksomhet</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Kontorer</h3>
            <p className="text-gray-600 text-sm">
              Strømavtaler tilpasset kontorvirksomhet med moderat forbruk og behov for stabilitet.
            </p>
          </div>

          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Produksjon</h3>
            <p className="text-gray-600 text-sm">
              Avtaler for produksjonsbedrifter med høyt energiforbruk og behov for fleksibilitet.
            </p>
          </div>

          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Butikker</h3>
            <p className="text-gray-600 text-sm">
              Strømavtaler for handelsvirksomhet med variabel forbruk og behov for konkurransedyktige priser.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 py-12 -mx-4 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Klar til å spare på bedriftens strømregning?</h2>
          <p className="text-lg text-gray-600 mb-6">
            Kontakt oss for en uforpliktende samtale om strømavtaler for din virksomhet.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <TrackedButton
              href="https://www.vstrom.no/renspot?utm_source=stromsjef&utm_medium=cpc&utm_campaign=renspot"
              className="bg-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
              style={{ color: 'white' }}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Se tilbud (åpnes i ny fane)"
              buttonId="business-cta-se-tilbud"
            >
              Se tilbud
            </TrackedButton>
            <Link 
              href="mailto:post@stromsjef.no" 
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              style={{ color: '#fff' }}
            >
              Kontakt oss
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BusinessPage; 