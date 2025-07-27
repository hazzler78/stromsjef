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

  // Lägg till state för redigering
  const [editId, setEditId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // State för ny produkt
  const [newProduct, setNewProduct] = useState({
    planName: '',
    supplierName: '',
    pricePerKwh: '',
    priceZone: '',
    featured: false,
    sortOrder: '',
    logoUrl: '',
    affiliateLink: '',
    terminationFee: '',
  });
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (password === "grodan2025") {
      setAuthenticated(true);
      setLoginError("");
    } else {
      setLoginError("Feil passord. Prøv igjen.");
    }
  }

  // Hantera ändring i inputfält
  function handleEditChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;
    setEditValues({
      ...editValues,
      [name]: type === 'checkbox' ? checked : value,
    });
  }

  // Starta redigering
  function startEdit(plan: any) {
    setEditId(plan.id);
    setEditValues({
      planName: plan.planName,
      supplierName: plan.supplierName,
      pricePerKwh: plan.pricePerKwh,
      priceZone: plan.priceZone,
      featured: !!plan.featured,
      sortOrder: plan.sortOrder || '',
      logoUrl: plan.logoUrl || '',
      affiliateLink: plan.affiliateLink || '',
      terminationFee: plan.terminationFee || '',
    });
    setSaveError(null);
  }

  // Avbryt redigering
  function cancelEdit() {
    setEditId(null);
    setEditValues({});
    setSaveError(null);
  }

  // Spara ändringar
  async function saveEdit(plan: any) {
    setSaving(true);
    setSaveError(null);
    try {
      const res = await fetch('/api/plans', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...plan, ...editValues, id: plan.id, pricePerKwh: Number(editValues.pricePerKwh), featured: !!editValues.featured, sortOrder: editValues.sortOrder ? Number(editValues.sortOrder) : undefined, logoUrl: editValues.logoUrl, affiliateLink: editValues.affiliateLink, terminationFee: editValues.terminationFee ? Number(editValues.terminationFee) : undefined }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Kunde inte spara ändringar');
      // Uppdatera listan
      setPlans(plans => plans.map(p => p.id === plan.id ? { ...p, ...editValues, pricePerKwh: Number(editValues.pricePerKwh), featured: !!editValues.featured, sortOrder: editValues.sortOrder ? Number(editValues.sortOrder) : undefined, logoUrl: editValues.logoUrl, affiliateLink: editValues.affiliateLink, terminationFee: editValues.terminationFee ? Number(editValues.terminationFee) : undefined } : p));
      setEditId(null);
      setEditValues({});
    } catch (err: any) {
      setSaveError(err.message || 'Något gick fel vid sparande');
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
      const planToAdd = { ...newProduct, id, pricePerKwh: Number(newProduct.pricePerKwh), featured: !!newProduct.featured, sortOrder: newProduct.sortOrder ? Number(newProduct.sortOrder) : undefined, terminationFee: newProduct.terminationFee ? Number(newProduct.terminationFee) : undefined };
      const res = await fetch('/api/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(planToAdd),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Kunde inte legge til produkt');
      setPlans(plans => [...plans, data.plan]);
      setNewProduct({ planName: '', supplierName: '', pricePerKwh: '', priceZone: '', featured: false, sortOrder: '', logoUrl: '', affiliateLink: '', terminationFee: '' });
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
      if (!data.success) throw new Error(data.error || 'Kunde ikke slette produkt');
      setPlans(plans => plans.filter(p => p.id !== plan.id));
    } catch (err: any) {
      alert(err.message || 'Noe gikk galt ved sletting');
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
      {/* Lägg till produkt-formulär */}
      <form onSubmit={addProduct} className="mb-8 bg-white p-4 rounded shadow flex flex-wrap gap-4 items-end">
        <input name="planName" value={newProduct.planName} onChange={handleNewProductChange} placeholder="Namn" className="border rounded px-2 py-1" required />
        <input name="supplierName" value={newProduct.supplierName} onChange={handleNewProductChange} placeholder="Leverandør" className="border rounded px-2 py-1" required />
        <input name="pricePerKwh" type="number" value={newProduct.pricePerKwh} onChange={handleNewProductChange} placeholder="Pris (øre/kWh)" className="border rounded px-2 py-1" required />
        <input name="priceZone" value={newProduct.priceZone} onChange={handleNewProductChange} placeholder="Prissone" className="border rounded px-2 py-1" required />
        <input name="logoUrl" value={newProduct.logoUrl} onChange={handleNewProductChange} placeholder="Bild-URL (logoUrl)" className="border rounded px-2 py-1" />
        <input name="affiliateLink" value={newProduct.affiliateLink} onChange={handleNewProductChange} placeholder="Länk (affiliateLink)" className="border rounded px-2 py-1" />
        <input name="terminationFee" type="number" value={newProduct.terminationFee} onChange={handleNewProductChange} placeholder="Bruddgebyr (kr)" className="border rounded px-2 py-1" />
        <label className="flex items-center gap-1">
          <input name="featured" type="checkbox" checked={!!newProduct.featured} onChange={handleNewProductChange} /> Mest populär
        </label>
        <input name="sortOrder" type="number" value={newProduct.sortOrder} onChange={handleNewProductChange} placeholder="Ordning (1=främst)" className="border rounded px-2 py-1" />
        <button type="submit" disabled={adding} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Legg til</button>
        {addError && <span className="text-red-600 text-sm ml-2">{addError}</span>}
      </form>
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
              <th className="px-4 py-2 border-b">Mest populär</th>
              <th className="px-4 py-2 border-b">Ordning</th>
              <th className="px-4 py-2 border-b">Bruddgebyr</th>
              <th className="px-4 py-2 border-b">Bild-URL</th>
              <th className="px-4 py-2 border-b">Länk</th>
              <th className="px-4 py-2 border-b"></th>
            </tr>
          </thead>
          <tbody>
            {plans.map(plan => (
              <tr key={plan.id} className="border-b hover:bg-gray-50">
                {editId === plan.id ? (
                  <>
                    <td className="px-4 py-2"><input name="planName" value={editValues.planName} onChange={handleEditChange} className="border rounded px-2 py-1 w-full" /></td>
                    <td className="px-4 py-2"><input name="supplierName" value={editValues.supplierName} onChange={handleEditChange} className="border rounded px-2 py-1 w-full" /></td>
                    <td className="px-4 py-2"><input name="pricePerKwh" type="number" value={editValues.pricePerKwh} onChange={handleEditChange} className="border rounded px-2 py-1 w-full" /></td>
                    <td className="px-4 py-2"><input name="priceZone" value={editValues.priceZone} onChange={handleEditChange} className="border rounded px-2 py-1 w-full" /></td>
                    <td className="px-4 py-2 text-center"><input name="featured" type="checkbox" checked={!!editValues.featured} onChange={handleEditChange} /></td>
                    <td className="px-4 py-2"><input name="sortOrder" type="number" value={editValues.sortOrder} onChange={handleEditChange} className="border rounded px-2 py-1 w-full" placeholder="Ordning" /></td>
                    <td className="px-4 py-2"><input name="terminationFee" type="number" value={editValues.terminationFee} onChange={handleEditChange} className="border rounded px-2 py-1 w-full" placeholder="Bruddgebyr (kr)" /></td>
                    <td className="px-4 py-2"><input name="logoUrl" value={editValues.logoUrl} onChange={handleEditChange} className="border rounded px-2 py-1 w-full" placeholder="Bild-URL (logoUrl)" /></td>
                    <td className="px-4 py-2"><input name="affiliateLink" value={editValues.affiliateLink} onChange={handleEditChange} className="border rounded px-2 py-1 w-full" placeholder="Länk (affiliateLink)" /></td>
                    <td className="px-4 py-2 flex gap-2">
                      <button onClick={() => saveEdit(plan)} disabled={saving} className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">Spara</button>
                      <button onClick={cancelEdit} disabled={saving} className="bg-gray-300 text-gray-800 px-3 py-1 rounded hover:bg-gray-400">Avbryt</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-2">{plan.planName}</td>
                    <td className="px-4 py-2">{plan.supplierName}</td>
                    <td className="px-4 py-2">{plan.pricePerKwh}</td>
                    <td className="px-4 py-2">{plan.priceZone}</td>
                    <td className="px-4 py-2 text-center">{plan.featured ? '✓' : ''}</td>
                    <td className="px-4 py-2">{plan.sortOrder || '-'}</td>
                    <td className="px-4 py-2">{plan.terminationFee || '-'}</td>
                    <td className="px-4 py-2 break-all text-xs">{plan.logoUrl}</td>
                    <td className="px-4 py-2 break-all text-xs">{plan.affiliateLink}</td>
                    <td className="px-4 py-2">
                      <button onClick={() => startEdit(plan)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Redigera</button>
                      <button onClick={() => deleteProduct(plan)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 ml-2">Ta bort</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {saveError && <div className="text-red-600 text-sm mt-2">{saveError}</div>}
    </div>
  );
} 