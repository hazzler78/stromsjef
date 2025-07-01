'use client';

import React, { useState, useEffect } from 'react';
import { PriceZone, PriceZoneNames, ElectricityPlan } from '@/types/electricity';

function generateId() {
  return 'plan-' + Math.random().toString(36).substr(2, 9);
}

export default function AdminPage() {
  const [plans, setPlans] = useState<ElectricityPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refresh, setRefresh] = useState(0);
  const [editPlan, setEditPlan] = useState<ElectricityPlan | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');

  useEffect(() => {
    async function fetchPlans() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/plans');
        if (!res.ok) throw new Error('Kunde inte hämta produkter');
        const data = await res.json();
        setPlans(data.plans || []);
      } catch (err: any) {
        setError(err.message || 'Något gick fel');
      } finally {
        setLoading(false);
      }
    }
    fetchPlans();
  }, [refresh]);

  async function handleDelete(id: string) {
    if (!window.confirm('Vill du verkligen ta bort denna produkt?')) return;
    const res = await fetch('/api/plans', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (res.ok) setRefresh(r => r + 1);
    else alert('Kunde inte ta bort produkten');
  }

  function handleEdit(plan: ElectricityPlan) {
    setEditPlan(plan);
    setModalMode('edit');
    setModalOpen(true);
  }

  function handleAdd() {
    setEditPlan(null);
    setModalMode('add');
    setModalOpen(true);
  }

  return (
    <div className="max-w-5xl mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8">Admin: Produkter</h1>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 transition-colors"
        onClick={handleAdd}
      >
        + Ny produkt
      </button>
      {modalOpen && (
        <AddProductModal
          onClose={() => setModalOpen(false)}
          onProductSaved={() => { setModalOpen(false); setRefresh(r => r + 1); }}
          mode={modalMode}
          initialPlan={editPlan}
        />
      )}
      <div className="overflow-x-auto mt-6">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Laddar produkter...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">{error}</div>
        ) : (
          <table className="min-w-full bg-white border rounded shadow">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b">Namn</th>
                <th className="px-4 py-2 border-b">Leverantör</th>
                <th className="px-4 py-2 border-b">Pris (øre/kWh)</th>
                <th className="px-4 py-2 border-b">Prissone</th>
                <th className="px-4 py-2 border-b">Featured</th>
                <th className="px-4 py-2 border-b">Redigera</th>
                <th className="px-4 py-2 border-b">Ta bort</th>
              </tr>
            </thead>
            <tbody>
              {plans.map(plan => (
                <tr key={plan.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{plan.planName}</td>
                  <td className="px-4 py-2">{plan.supplierName}</td>
                  <td className="px-4 py-2">{plan.pricePerKwh}</td>
                  <td className="px-4 py-2">{PriceZoneNames[plan.priceZone]}</td>
                  <td className="px-4 py-2 text-center">{plan.featured ? '✅' : ''}</td>
                  <td className="px-4 py-2 text-center">
                    <button onClick={() => handleEdit(plan)} className="text-blue-600 hover:underline">Redigera</button>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button onClick={() => handleDelete(plan.id)} className="text-red-600 hover:underline">Ta bort</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function AddProductModal({ onClose, onProductSaved, mode, initialPlan }: {
  onClose?: () => void,
  onProductSaved: () => void,
  mode: 'add' | 'edit',
  initialPlan?: ElectricityPlan | null
}) {
  const [form, setForm] = useState({
    supplierName: initialPlan?.supplierName || '',
    planName: initialPlan?.planName || '',
    pricePerKwh: initialPlan?.pricePerKwh?.toString() || '',
    monthlyFee: initialPlan?.monthlyFee?.toString() || '',
    priceZone: initialPlan?.priceZone || 'ALLE',
    bindingTime: initialPlan?.bindingTime?.toString() || '',
    featured: initialPlan?.featured || false,
    affiliateLink: initialPlan?.affiliateLink || '',
    logoUrl: initialPlan?.logoUrl || '',
    id: initialPlan?.id || '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setForm(f => ({ ...f, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const plan = {
      ...form,
      id: mode === 'add' ? generateId() : form.id,
      pricePerKwh: parseFloat(form.pricePerKwh),
      monthlyFee: parseFloat(form.monthlyFee),
      bindingTime: parseInt(form.bindingTime, 10),
    };
    const res = await fetch('/api/plans', {
      method: mode === 'add' ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(plan),
    });
    setSaving(false);
    if (res.ok) {
      if (onClose) onClose();
      onProductSaved();
    } else {
      const data = await res.json();
      setError(data.error || 'Kunde inte spara produkten');
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg relative">
        <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700" onClick={onClose}>&times;</button>
        <h2 className="text-2xl font-bold mb-4">{mode === 'add' ? 'Ny produkt' : 'Redigera produkt'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">Leverantör</label>
            <input name="supplierName" value={form.supplierName} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block font-semibold mb-1">Produktnamn</label>
            <input name="planName" value={form.planName} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block font-semibold mb-1">Pris per kWh (øre)</label>
              <input name="pricePerKwh" value={form.pricePerKwh} onChange={handleChange} className="w-full border rounded px-3 py-2" required type="number" step="0.01" />
            </div>
            <div className="flex-1">
              <label className="block font-semibold mb-1">Månadsavgift (kr)</label>
              <input name="monthlyFee" value={form.monthlyFee} onChange={handleChange} className="w-full border rounded px-3 py-2" required type="number" step="0.01" />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block font-semibold mb-1">Prissone</label>
              <select name="priceZone" value={form.priceZone} onChange={handleChange} className="w-full border rounded px-3 py-2">
                {Object.entries(PriceZoneNames).map(([key, name]) => (
                  <option key={key} value={key}>{name}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block font-semibold mb-1">Bindingstid (månader)</label>
              <input name="bindingTime" value={form.bindingTime} onChange={handleChange} className="w-full border rounded px-3 py-2" required type="number" min="0" />
            </div>
          </div>
          <div>
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} />
              Utvalgt/Featured
            </label>
          </div>
          <div>
            <label className="block font-semibold mb-1">Länk</label>
            <input name="affiliateLink" value={form.affiliateLink} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block font-semibold mb-1">Logotyp (URL)</label>
            <input name="logoUrl" value={form.logoUrl} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" className="px-4 py-2 rounded border" onClick={onClose} disabled={saving}>Avbryt</button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 transition-colors" disabled={saving}>{saving ? (mode === 'add' ? 'Sparar...' : 'Uppdaterar...') : (mode === 'add' ? 'Spara' : 'Uppdatera')}</button>
          </div>
        </form>
      </div>
    </div>
  );
} 