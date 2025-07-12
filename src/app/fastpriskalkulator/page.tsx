"use client";

import Link from 'next/link';
import { useState } from 'react';

const FastpriskalkulatorPage = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          zone: 'NO1', // Default zone for calculator signups
          marketingConsent: true,
          name: name, // Will be stored in MailerLite fields
          source: 'fastpriskalkulator'
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setEmail('');
        setName('');
      } else {
        console.error('Failed to subscribe');
      }
    } catch (error) {
      console.error('Error subscribing:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 -mx-4 px-4 mb-8">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Fastpriskalkulator
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Vi jobber med en ny og forbedret versjon av kalkulatoren
          </p>
        </div>
      </section>

      {/* Under Construction Section */}
      <section className="mb-12">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <div className="mb-8">
            <div className="bg-yellow-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold mb-4 text-gray-800">
              Under konstruksjon
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Vi utvikler en ny og forbedret fastpriskalkulator med spennende funksjoner
            </p>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-8">
            <h3 className="text-xl font-semibold mb-4 text-blue-800">
              Kommende funksjoner:
            </h3>
            <ul className="text-left space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Last opp strømfakturaer direkte i kalkulatoren</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>AI-drevet analyse som automatisk beregner besparelser</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Mer nøyaktige beregninger basert på faktisk forbruk</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Personlig tilpassede anbefalinger</span>
              </li>
            </ul>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-8">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              I mellomtiden kan du:
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h4 className="font-semibold mb-2">Se tilgjengelige avtaler</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Utforsk våre anbefalte strømavtaler
                </p>
                <Link 
                  href="/#sammenligning" 
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
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
                <h4 className="font-semibold mb-2">Spotpriskontroll</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Sjekk om spotpris er riktig for deg
                </p>
                <Link 
                  href="/spotpriskontroll" 
                  className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors"
                >
                  Sjekk spotpris
                </Link>
              </div>
            </div>
          </div>

          {/* Contact Form Section */}
          <div className="bg-green-50 p-6 rounded-lg border border-green-200 mb-8">
            <div className="max-w-md mx-auto">
              <h3 className="text-xl font-semibold mb-4 text-green-800">
                Få beskjed når den nye kalkulatoren er klar!
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Anmäl dig för att få uppdateringar när den nya AI-drivna fastpriskalkulatorn lanseras
              </p>
              
              {isSubmitted ? (
                <div className="bg-green-100 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center gap-3">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-green-800 font-medium">
                      Tack! Du är nu anmäld för uppdateringar
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Namn
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Ditt namn"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      E-post
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="din@email.se"
                      required
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Anmäler...' : 'Anmäl för uppdateringar'}
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Følg med på oppdateringer - den nye kalkulatoren kommer snart!
            </p>
            <Link 
              href="/" 
              className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              Tilbake til forsiden
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FastpriskalkulatorPage; 