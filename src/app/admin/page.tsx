'use client';

import { useState, useEffect } from 'react';

export default function AdminPage() {
  // Passordsskydd
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Produktdata
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Click statistics
  const [clickStats, setClickStats] = useState<Record<string, number>>({});
  const [statsLoading, setStatsLoading] = useState(true);
  
  // Invoice statistics
  const [invoiceStats, setInvoiceStats] = useState<any>(null);
  const [invoiceStatsLoading, setInvoiceStatsLoading] = useState(true);

  // Legg til state for redigering
  const [editId, setEditId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // State for ny produkt
  const [newProduct, setNewProduct] = useState({
    planName: '',
    supplierName: '',
    pricePerKwh: '',
    monthlyFee: '',
    priceZone: '',
    featured: false,
    sortOrder: '',
    logoUrl: '',
    affiliateLink: '',
    terminationFee: '',
    bindingTime: '',
    bindingTimeText: '',
    finePrint: '',
  });
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoginError("");
    
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setAuthenticated(true);
        setPassword("");
      } else {
        setLoginError(data.error || "Feil passord. Prøv igjen.");
      }
    } catch (error) {
      setLoginError("Kunne ikke koble til server. Prøv igjen.");
    }
  }

  // Håndter endring i inputfelt
  function handleEditChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;
    setEditValues({
      ...editValues,
      [name]: type === 'checkbox' ? checked : value,
    });
  }

  // Start redigering
  function startEdit(plan: any) {
    setEditId(plan.id);
    setEditValues({
      planName: plan.planName,
      supplierName: plan.supplierName,
      pricePerKwh: plan.pricePerKwh,
      monthlyFee: plan.monthlyFee || '',
      priceZone: plan.priceZone,
      featured: !!plan.featured,
      sortOrder: plan.sortOrder || '',
      logoUrl: plan.logoUrl || '',
      affiliateLink: plan.affiliateLink || '',
      terminationFee: plan.terminationFee || '',
      bindingTime: plan.bindingTime || '',
      bindingTimeText: plan.bindingTimeText || '',
      finePrint: plan.finePrint || '',
    });
    setSaveError(null);
  }

  // Avbryt redigering
  function cancelEdit() {
    setEditId(null);
    setEditValues({});
    setSaveError(null);
  }

  // Lagre endringer
  async function saveEdit(plan: any) {
    setSaving(true);
    setSaveError(null);
    try {
      const res = await fetch('/api/plans', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...plan, ...editValues, id: plan.id, pricePerKwh: Number(editValues.pricePerKwh), monthlyFee: Number(editValues.monthlyFee), featured: !!editValues.featured, sortOrder: editValues.sortOrder ? Number(editValues.sortOrder) : undefined, logoUrl: editValues.logoUrl, affiliateLink: editValues.affiliateLink, terminationFee: editValues.terminationFee ? Number(editValues.terminationFee) : undefined, bindingTime: editValues.bindingTime ? Number(editValues.bindingTime) : undefined, bindingTimeText: editValues.bindingTimeText || undefined, finePrint: editValues.finePrint || undefined }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Kunne ikke lagre endringer');
      // Oppdater listen
      setPlans(plans => plans.map(p => p.id === plan.id ? { ...p, ...editValues, pricePerKwh: Number(editValues.pricePerKwh), monthlyFee: Number(editValues.monthlyFee), featured: !!editValues.featured, sortOrder: editValues.sortOrder ? Number(editValues.sortOrder) : undefined, logoUrl: editValues.logoUrl, affiliateLink: editValues.affiliateLink, terminationFee: editValues.terminationFee ? Number(editValues.terminationFee) : undefined, bindingTime: editValues.bindingTime ? Number(editValues.bindingTime) : undefined, bindingTimeText: editValues.bindingTimeText || undefined, finePrint: editValues.finePrint || undefined } : p));
      setEditId(null);
      setEditValues({});
    } catch (err: any) {
      setSaveError(err.message || 'Noe gikk galt ved lagring');
    } finally {
      setSaving(false);
    }
  }

  function handleNewProductChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: type === 'checkbox' ? checked : value,
    });
  }

  async function addProduct(e: React.FormEvent) {
    e.preventDefault();
    setAdding(true);
    setAddError(null);
    try {
      const id = (window.crypto && window.crypto.randomUUID) ? window.crypto.randomUUID() : Math.random().toString(36).slice(2);
      const planToAdd = { ...newProduct, id, pricePerKwh: Number(newProduct.pricePerKwh), monthlyFee: Number(newProduct.monthlyFee), featured: !!newProduct.featured, sortOrder: newProduct.sortOrder ? Number(newProduct.sortOrder) : undefined, terminationFee: newProduct.terminationFee ? Number(newProduct.terminationFee) : undefined, bindingTime: newProduct.bindingTime ? Number(newProduct.bindingTime) : undefined, bindingTimeText: newProduct.bindingTimeText || undefined, finePrint: newProduct.finePrint || undefined };
      const res = await fetch('/api/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(planToAdd),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Kunne ikke legge til produkt');
      setPlans(plans => [...plans, data.plan]);
      setNewProduct({ planName: '', supplierName: '', pricePerKwh: '', monthlyFee: '', priceZone: '', featured: false, sortOrder: '', logoUrl: '', affiliateLink: '', terminationFee: '', bindingTime: '', bindingTimeText: '', finePrint: '' });
    } catch (err: any) {
      setAddError(err.message || 'Noe gikk galt ved lagring');
    } finally {
      setAdding(false);
    }
  }

  async function deleteProduct(plan: any) {
    if (!window.confirm('Er du sikker på at du vil slette dette produktet?')) return;
    try {
      const res = await fetch('/api/plans', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: plan.id }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Kunne ikke slette produkt');
      setPlans(plans => plans.filter(p => p.id !== plan.id));
    } catch (err: any) {
      alert(err.message || 'Noe gikk galt ved sletting');
    }
  }

  useEffect(() => {
    if (!authenticated) return;
    setLoading(true);
    setError(null);
    
    // Fetch plans, click stats, and invoice stats
    Promise.all([
      fetch('/api/plans').then(res => {
        if (!res.ok) throw new Error('Kunne ikke hente produkter');
        return res.json();
      }),
      fetch('/api/plans/dump').then(res => res.json()),
      fetch('/api/admin/invoice-stats').then(res => res.json())
    ])
      .then(([plansData, statsData, invoiceData]) => {
        setPlans(plansData.plans || []);
        setClickStats(statsData.clickStats || {});
        setInvoiceStats(invoiceData.success ? invoiceData.stats : null);
      })
      .catch(err => setError(err.message || 'Noe gikk galt'))
      .finally(() => {
        setLoading(false);
        setStatsLoading(false);
        setInvoiceStatsLoading(false);
      });
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
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Admin: Produkter</h1>
        <div className="flex gap-2">
          <a
            href="/admin/price-updates"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Automatisk prisuppdatering
          </a>
        </div>
      </div>
      
      {/* Invoice Statistics */}
      <div className="mb-8 bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">AI Kalkulator - Fakturaopplastinger</h2>
        {invoiceStatsLoading ? (
          <div className="text-gray-500">Laster faktura-statistikk...</div>
        ) : !invoiceStats ? (
          <div className="text-gray-500">Ingen faktura-data tilgjengelig ennå.</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded border-l-4 border-blue-500">
                <div className="text-sm text-blue-600 font-medium">Totalt opplastinger</div>
                <div className="text-3xl font-bold text-blue-700">{invoiceStats.totalUploads}</div>
              </div>
              <div className="bg-green-50 p-4 rounded border-l-4 border-green-500">
                <div className="text-sm text-green-600 font-medium">Siste 30 dager</div>
                <div className="text-3xl font-bold text-green-700">{invoiceStats.uploadsLast30Days}</div>
              </div>
              <div className="bg-purple-50 p-4 rounded border-l-4 border-purple-500">
                <div className="text-sm text-purple-600 font-medium">Unike brukere</div>
                <div className="text-3xl font-bold text-purple-700">{invoiceStats.uniqueUsers}</div>
              </div>
              <div className="bg-orange-50 p-4 rounded border-l-4 border-orange-500">
                <div className="text-sm text-orange-600 font-medium">Med samtykke</div>
                <div className="text-3xl font-bold text-orange-700">{invoiceStats.uploadsWithConsent}</div>
              </div>
            </div>
            
            {/* Daily stats for last 7 days */}
            {Object.keys(invoiceStats.dailyStats).length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Daglig aktivitet (siste 7 dager)</h3>
                <div className="grid grid-cols-7 gap-2">
                  {Object.entries(invoiceStats.dailyStats).map(([date, count]) => (
                    <div key={date} className="bg-gray-50 p-3 rounded text-center">
                      <div className="text-xs text-gray-600">{new Date(date).toLocaleDateString('nb-NO', { day: '2-digit', month: '2-digit' })}</div>
                      <div className="text-lg font-bold text-gray-800">{String(count)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mt-4 text-xs text-gray-500">
              Sist oppdatert: {new Date(invoiceStats.lastUpdated).toLocaleString('nb-NO')}
            </div>
          </>
        )}
      </div>

      {/* Click Statistics */}
      <div className="mb-8 bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Click Statistics</h2>
        {statsLoading ? (
          <div className="text-gray-500">Loading click statistics...</div>
        ) : Object.keys(clickStats).length === 0 ? (
          <div className="text-gray-500">No click data available yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(clickStats).map(([buttonId, count]) => (
              <div key={buttonId} className="bg-gray-50 p-3 rounded">
                <div className="font-mono text-sm text-gray-600">{buttonId}</div>
                <div className="text-2xl font-bold text-blue-600">{count}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Legg til produkt-formulær */}
      <div className="mb-8 bg-white p-6 rounded shadow">
        <h3 className="text-lg font-semibold mb-4">Legg til nytt produkt</h3>
        <form onSubmit={addProduct} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input name="planName" value={newProduct.planName} onChange={handleNewProductChange} placeholder="Navn" className="border rounded px-3 py-2" required />
          <input name="supplierName" value={newProduct.supplierName} onChange={handleNewProductChange} placeholder="Leverandør" className="border rounded px-3 py-2" required />
          <input name="pricePerKwh" type="number" value={newProduct.pricePerKwh} onChange={handleNewProductChange} placeholder="Pris (øre/kWh)" className="border rounded px-3 py-2" required />
          <input name="monthlyFee" type="number" value={newProduct.monthlyFee} onChange={handleNewProductChange} placeholder="Månedsgebyr (kr)" className="border rounded px-3 py-2" required />
          <input name="priceZone" value={newProduct.priceZone} onChange={handleNewProductChange} placeholder="Prissone" className="border rounded px-3 py-2" required />
          <input name="logoUrl" value={newProduct.logoUrl} onChange={handleNewProductChange} placeholder="Logo URL" className="border rounded px-3 py-2" />
          <input name="affiliateLink" value={newProduct.affiliateLink} onChange={handleNewProductChange} placeholder="Affiliate link" className="border rounded px-3 py-2" />
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input name="featured" type="checkbox" checked={!!newProduct.featured} onChange={handleNewProductChange} />
              <span className="text-sm">Mest populær</span>
            </label>
            <button type="submit" disabled={adding} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm">
              {adding ? 'Legger til...' : 'Legg til'}
            </button>
          </div>
        </form>
        {addError && <div className="text-red-600 text-sm mt-2">{addError}</div>}
      </div>

      {loading ? (
        <div className="p-8 text-center text-gray-500">Laster produkter...</div>
      ) : error ? (
        <div className="p-8 text-center text-red-500">{error}</div>
      ) : (
        <div className="bg-white border rounded shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Navn</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Leverandør</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Pris (øre/kWh)</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Månedsgebyr</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-900">Populær</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-900">Åtgärder</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {plans.map(plan => (
                <tr key={plan.id} className="hover:bg-gray-50">
                  {editId === plan.id ? (
                    <>
                      <td className="px-4 py-3">
                        <input name="planName" value={editValues.planName} onChange={handleEditChange} className="border rounded px-2 py-1 w-full text-sm" />
                      </td>
                      <td className="px-4 py-3">
                        <input name="supplierName" value={editValues.supplierName} onChange={handleEditChange} className="border rounded px-2 py-1 w-full text-sm" />
                      </td>
                      <td className="px-4 py-3">
                        <input name="pricePerKwh" type="number" value={editValues.pricePerKwh} onChange={handleEditChange} className="border rounded px-2 py-1 w-full text-sm" />
                      </td>
                      <td className="px-4 py-3">
                        <input name="monthlyFee" type="number" value={editValues.monthlyFee} onChange={handleEditChange} className="border rounded px-2 py-1 w-full text-sm" />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <input name="featured" type="checkbox" checked={!!editValues.featured} onChange={handleEditChange} />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex gap-2 justify-center">
                          <button onClick={() => saveEdit(plan)} disabled={saving} className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">Lagre</button>
                          <button onClick={cancelEdit} disabled={saving} className="bg-gray-300 text-gray-800 px-3 py-1 rounded text-sm hover:bg-gray-400">Avbryt</button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{plan.planName}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {plan.priceZone} • {plan.bindingTime ? `${plan.bindingTime} mnd` : 'Ingen binding'}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-900">{plan.supplierName}</td>
                      <td className="px-4 py-3 text-gray-900">{plan.pricePerKwh}</td>
                      <td className="px-4 py-3 text-gray-900">{plan.monthlyFee}</td>
                      <td className="px-4 py-3 text-center">
                        {plan.featured ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            ✓ Populær
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex gap-2 justify-center">
                          <button onClick={() => startEdit(plan)} className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">Rediger</button>
                          <button onClick={() => deleteProduct(plan)} className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">Ta bort</button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {saveError && <div className="text-red-600 text-sm mt-2">{saveError}</div>}
    </div>
  );
} 