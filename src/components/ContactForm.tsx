"use client";

import React, { useState } from 'react';

const initialState = {
  name: '',
  email: '',
  phone: '',
  newsletterOptIn: true,
};

export default function ContactForm() {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/telegram/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, source: 'forside' }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(true);
        setForm(initialState);
      } else {
        setError(data.error || 'Noe gikk galt. Prøv igjen senere.');
      }
    } catch (err) {
      setError('Noe gikk galt. Prøv igjen senere.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <h3 className="text-xl font-bold text-green-700 mb-2">Takk for din henvendelse!</h3>
        <p className="text-green-800">Vi tar kontakt så snart vi kan.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white rounded-lg shadow p-6 space-y-5">
      <h3 className="text-2xl font-bold text-gray-800 mb-2 text-center">Bli oppringt av Strømsjef</h3>
      <div>
        <label htmlFor="name" className="block text-gray-700 font-medium mb-1">Navn</label>
        <input
          type="text"
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-gray-700 font-medium mb-1">E-post</label>
        <input
          type="email"
          id="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <div>
        <label htmlFor="phone" className="block text-gray-700 font-medium mb-1">Telefon</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          required
          pattern="[0-9+ ]{8,15}"
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          id="newsletterOptIn"
          name="newsletterOptIn"
          checked={form.newsletterOptIn}
          onChange={handleChange}
          className="mr-2 accent-blue-600"
        />
        <label htmlFor="newsletterOptIn" className="text-gray-700">Meld meg på nyhetsbrev (valgfritt)</label>
      </div>
      {error && <div className="text-red-600 text-sm text-center">{error}</div>}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition-colors flex items-center justify-center"
        disabled={loading}
      >
        {loading ? (
          <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
          </svg>
        ) : null}
        Send inn
      </button>
    </form>
  );
} 