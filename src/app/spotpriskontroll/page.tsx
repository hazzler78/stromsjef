'use client';

import { useState } from 'react';
import Link from 'next/link';

const FastpriskalkulatorPage = () => {
  const [consumption, setConsumption] = useState('');
  const [currentPrice, setCurrentPrice] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [savings, setSavings] = useState<number | null>(null);
  const [monthlySavings, setMonthlySavings] = useState<number | null>(null);

  const calculateSavings = (e: React.FormEvent) => {
    e.preventDefault();
    const annualConsumption = Number(consumption);
    const current = Number(currentPrice);
    const newP = Number(newPrice);

    if (annualConsumption > 0 && current > 0 && newP > 0) {
      const currentCost = (annualConsumption * current) / 100; // From øre to NOK
      const newCost = (annualConsumption * newP) / 100; // From øre to NOK
      const annualSavings = currentCost - newCost;
      const monthlySavings = annualSavings / 12;
      
      setSavings(annualSavings);
      setMonthlySavings(monthlySavings);
    } else {
      setSavings(null);
      setMonthlySavings(null);
    }
  };

  const resetForm = () => {
    setConsumption('');
    setCurrentPrice('');
    setNewPrice('');
    setSavings(null);
    setMonthlySavings(null);
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
            Beregn hvor mye du kan spare ved å bytte til en fastprisavtale. 
            Se den potensielle besparelsen basert på ditt faktiske forbruk.
          </p>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="mb-12">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Calculator Form */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Beregn besparelse</h2>
            
            <form onSubmit={calculateSavings} className="space-y-6">
    <div>
                <label htmlFor="consumption" className="block text-sm font-medium text-gray-700 mb-2">
                  Årlig strømforbruk (kWh)
                </label>
          <input
            type="number"
            id="consumption"
            value={consumption}
            onChange={(e) => setConsumption(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="f.eks. 16000"
            required
          />
                <p className="text-sm text-gray-500 mt-1">
                  Du finner dette på din siste strømregning
                </p>
        </div>

              <div>
                <label htmlFor="currentPrice" className="block text-sm font-medium text-gray-700 mb-2">
                  Nåværende pris per kWh (øre)
                </label>
          <input
            type="number"
            id="currentPrice"
            step="0.1"
            value={currentPrice}
            onChange={(e) => setCurrentPrice(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="f.eks. 70.5"
            required
          />
                <p className="text-sm text-gray-500 mt-1">
                  Inkludert alle gebyrer og påslag
                </p>
        </div>

              <div>
                <label htmlFor="newPrice" className="block text-sm font-medium text-gray-700 mb-2">
                  Ny fastpris per kWh (øre)
                </label>
          <input
            type="number"
            id="newPrice"
            step="0.1"
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="f.eks. 65.0"
            required
          />
                <p className="text-sm text-gray-500 mt-1">
                  Fra den nye fastprisavtalen du vurderer
                </p>
        </div>

              <div className="flex gap-4">
                <button 
                  type="submit" 
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
          Beregn besparelse
        </button>
                <button 
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Nullstill
                </button>
              </div>
      </form>
          </div>

          {/* Results Section */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Resultat</h2>
            
            {savings !== null ? (
              <div className="space-y-6">
                <div className="text-center p-6 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Estimert årlig besparelse</h3>
                  <p className={`text-4xl font-bold ${savings > 0 ? 'text-blue-600' : 'text-red-600'}`}>
                    {savings.toFixed(0)} kr
                  </p>
                  {savings > 0 && (
                    <p className="text-sm text-gray-600 mt-2">
                      Det er som å få {Math.round(savings / 12)} kr ekstra i måneden!
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Månedlig besparelse</h4>
                    <p className={`text-2xl font-bold ${monthlySavings! > 0 ? 'text-blue-600' : 'text-red-600'}`}>
                      {monthlySavings!.toFixed(0)} kr
                    </p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Daglig besparelse</h4>
                    <p className={`text-2xl font-bold ${(monthlySavings! / 30) > 0 ? 'text-purple-600' : 'text-red-600'}`}>
                      {(monthlySavings! / 30).toFixed(1)} kr
                    </p>
                  </div>
                </div>

                {savings > 0 && (
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <h4 className="font-semibold text-yellow-800 mb-2">💡 Tips</h4>
                    <p className="text-sm text-yellow-700">
                      Med denne besparelsen kan du f.eks. kjøpe {Math.round(savings / 50)} kopp kaffe, 
                      eller spare opp til en fin ferie på {Math.round(savings / 1000)} år!
                    </p>
                  </div>
                )}

                <div className="text-center">
                  <Link 
                    href="/#sammenligning" 
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Se tilgjengelige fastprisavtaler
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-gray-500">
                  Fyll ut skjemaet for å se hvor mye du kan spare
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Fordeler med fastprisavtaler</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Forutsigbarhet</h3>
            <p className="text-gray-600 text-sm">
              Med fastpris vet du nøyaktig hva du betaler hver måned. 
              Ingen overraskelser når strømprisene stiger.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Beskyttelse mot prisstigninger</h3>
            <p className="text-gray-600 text-sm">
              Fastpris gir deg beskyttelse mot høye strømpriser i vintermånedene. 
              Du betaler samme pris hele året.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Enkel budsjettering</h3>
            <p className="text-gray-600 text-sm">
              Fastpris gjør det enkelt å budsjettere. Du kan planlegge utgiftene 
              dine uten å bekymre deg for svingninger i strømprisene.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 py-12 -mx-4 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Klar til å få forutsigbare strømregninger?</h2>
          <p className="text-lg text-gray-600 mb-6">
            Start sammenligningen nå og finn den beste fastprisavtalen for deg.
          </p>
          <Link 
            href="/#sammenligning" 
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Start sammenligning
          </Link>
        </div>
      </section>
    </div>
  );
};

export default FastpriskalkulatorPage; 