'use client';

import { useState } from 'react';

const SpotpriskontrollPage = () => {
  const [consumption, setConsumption] = useState('');
  const [currentPrice, setCurrentPrice] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [savings, setSavings] = useState<number | null>(null);

  const calculateSavings = (e: React.FormEvent) => {
    e.preventDefault();
    const annualConsumption = Number(consumption);
    const current = Number(currentPrice);
    const newP = Number(newPrice);

    if (annualConsumption > 0 && current > 0 && newP > 0) {
      const currentCost = (annualConsumption * current) / 100; // From øre to NOK
      const newCost = (annualConsumption * newP) / 100; // From øre to NOK
      setSavings(currentCost - newCost);
    } else {
      setSavings(null);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Spotpriskontroll</h1>
      <p className="mb-6 text-gray-600">Estimer hvor mye du kan spare ved å bytte strømavtale.</p>
      
      <form onSubmit={calculateSavings} className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="consumption" className="block text-sm font-medium text-gray-700 mb-1">Årlig strømforbruk (kWh)</label>
          <input
            type="number"
            id="consumption"
            value={consumption}
            onChange={(e) => setConsumption(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="f.eks. 16000"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="currentPrice" className="block text-sm font-medium text-gray-700 mb-1">Nåværende pris per kWh (øre)</label>
          <input
            type="number"
            id="currentPrice"
            step="0.1"
            value={currentPrice}
            onChange={(e) => setCurrentPrice(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="f.eks. 70.5"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="newPrice" className="block text-sm font-medium text-gray-700 mb-1">Ny pris per kWh (øre)</label>
          <input
            type="number"
            id="newPrice"
            step="0.1"
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="f.eks. 65.0"
            required
          />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
          Beregn besparelse
        </button>
      </form>

      {savings !== null && (
        <div className="mt-8 text-center">
          <h2 className="text-2xl font-bold">Estimert årlig besparelse:</h2>
          <p className={`text-3xl font-bold ${savings > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {savings.toFixed(2)} kr
          </p>
        </div>
      )}
    </div>
  );
};

export default SpotpriskontrollPage; 