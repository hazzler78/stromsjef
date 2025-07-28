'use client';

import { useState, useEffect } from 'react';

export default function TestClickStats() {
  // Lösenordsskydd
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [clickStats, setClickStats] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

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
    fetch('/api/plans/dump')
      .then(res => res.json())
      .then(data => {
        if (data.clickStats) {
          setClickStats(data.clickStats);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching click stats:', err);
        setLoading(false);
      });
  }, [authenticated]);

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-full max-w-xs">
          <h2 className="text-xl font-bold mb-4 text-center">Click Stats Login</h2>
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
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Click Statistics Test</h1>
      
      {loading ? (
        <div className="text-center">Loading click statistics...</div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Button Click Counts</h2>
          {Object.keys(clickStats).length === 0 ? (
            <p className="text-gray-500">No click data available yet. Try clicking some buttons!</p>
          ) : (
            <div className="space-y-2">
              {Object.entries(clickStats).map(([buttonId, count]) => (
                <div key={buttonId} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="font-mono text-sm">{buttonId}</span>
                  <span className="font-bold text-blue-600">{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      <div className="mt-8 bg-blue-50 p-4 rounded">
        <h3 className="font-semibold mb-2">Test Instructions:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Go to <a href="/norgespris" className="text-blue-600 underline">/norgespris</a> and click the CTA button</li>
          <li>Go to <a href="/bedrift" className="text-blue-600 underline">/bedrift</a> and click the CTA buttons</li>
          <li>Go to the <a href="/" className="text-blue-600 underline">main page</a> and click on plan cards</li>
          <li>Refresh this page to see updated statistics</li>
        </ol>
      </div>
    </div>
  );
} 