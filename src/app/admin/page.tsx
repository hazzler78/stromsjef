'use client';

import { useState, useEffect } from 'react';

export default function AdminPage() {
  // Lösenordsskydd
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Produktdata
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (password === "grodan2025") {
      setAuthenticated(true);
      setLoginError("");
    } else {
      setLoginError("Feil passord. Prøv igjen.");
    }
  }

  useEffect(() => {
    if (!authenticated) return;
    setLoading(true);
    setError(null);
    fetch('/api/plans')
      .then(res => {
        if (!res.ok) throw new Error('Kunde ikke hente produkter');
        return res.json();
      })
      .then(data => setPlans(data.plans || []))
      .catch(err => setError(err.message || 'Noe gikk galt'))
      .finally(() => setLoading(false));
  }, [authenticated]);

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-full max-w-xs">
          <h2 className="text-xl font-bold mb-4 text-center">Admin Login</h2>
          <input
            type="password"
            placeholder="Passord"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border rounded px-3 py-2 mb-4"
            autoFocus
          />
          {loginError && <div className="text-red-600 text-sm mb-2">{loginError}</div>}
          <button type="submit" className="bg-blue-600 text-white w-full py-2 rounded font-semibold hover:bg-blue-700 transition-colors">Logg inn</button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8">Admin: Produkter</h1>
      {loading ? (
        <div className="p-8 text-center text-gray-500">Laster produkter...</div>
      ) : error ? (
        <div className="p-8 text-center text-red-500">{error}</div>
      ) : (
        <table className="min-w-full bg-white border rounded shadow">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">Namn</th>
              <th className="px-4 py-2 border-b">Leverandør</th>
              <th className="px-4 py-2 border-b">Pris (øre/kWh)</th>
              <th className="px-4 py-2 border-b">Prissone</th>
            </tr>
          </thead>
          <tbody>
            {plans.map(plan => (
              <tr key={plan.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{plan.planName}</td>
                <td className="px-4 py-2">{plan.supplierName}</td>
                <td className="px-4 py-2">{plan.pricePerKwh}</td>
                <td className="px-4 py-2">{plan.priceZone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
} 