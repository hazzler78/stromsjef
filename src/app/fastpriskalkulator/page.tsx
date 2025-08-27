"use client";

import Link from 'next/link';
import InvoiceAnalyzer from '@/components/InvoiceAnalyzer';
import ContactForm from '@/components/ContactForm';

const FastpriskalkulatorPage = () => {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 -mx-4 px-4 mb-8">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            AI-drevet Fastpriskalkulator
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Last opp strømfakturaen din og få en detaljert analyse av unødvendige kostnader
          </p>
        </div>
      </section>

      {/* Main Calculator Section */}
      <section className="mb-12">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="mb-8 text-center">
            <div className="bg-blue-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold mb-4 text-gray-800">
              Analyser strømfakturaen din
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Vår AI-drevne kalkulator identifiserer automatisk unødvendige kostnader og viser deg hvor mye du kan spare
            </p>
          </div>

          {/* Features */}
          <div className="bg-blue-600 p-6 rounded-lg border border-blue-700 mb-8">
            <h3 className="text-xl font-semibold mb-4 text-white">
              Hva kan kalkulatoren gjøre:
            </h3>
            <ul className="text-left space-y-3">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-white">Identifiserer automatisk unødvendige avgifter og påslag</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-white">Beregner nøyaktig hvor mye du kan spare</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-white">Gir personlige anbefalinger for bedre avtaler</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-white">Analyserer alle typer strømfakturaer på sekunder</span>
              </li>
            </ul>
          </div>

          {/* Invoice Analyzer Component */}
          <InvoiceAnalyzer />
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="mb-12">
        <div className="bg-blue-600 p-6 rounded-lg border border-blue-700">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-white mb-4">
              Få personlig hjelp – vi finner den beste strømavtalen for deg!
            </h2>
            <p className="text-center text-blue-100 mb-8">
              Legg igjen navn og nummer, så ringer vi deg for en gratis og uforpliktende prat. Vi hjelper deg å spare penger – enkelt og trygt!
            </p>
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Additional Resources */}
      <section className="mb-12">
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Andre nyttige verktøy:
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h4 className="font-semibold mb-2 text-gray-800">Se tilgjengelige avtaler</h4>
              <p className="text-sm mb-3 text-gray-600">
                Utforsk våre anbefalte strømavtaler
              </p>
              <Link 
                href="/#sammenligning" 
                className="bg-blue-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                style={{ color: 'white' }}
              >
                Se avtaler
              </Link>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-semibold mb-2 text-gray-800">Spotpriskontroll</h4>
              <p className="text-sm mb-3 text-gray-600">
                Sjekk om spotpris er riktig for deg
              </p>
              <Link 
                href="/spotpriskontroll" 
                className="bg-green-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors"
                style={{ color: 'white' }}
              >
                Sjekk spotpris
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="text-center">
        <Link 
          href="/" 
          className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
        >
          Tilbake til forsiden
        </Link>
      </div>
    </div>
  );
};

export default FastpriskalkulatorPage; 