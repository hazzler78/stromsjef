'use client';

import Link from 'next/link';
import { PriceZone, PriceZoneNames } from '@/types/electricity';
import { useState } from 'react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [zone, setZone] = useState<PriceZone | ''>('');
  const [consent, setConsent] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      alert('Du må godta personvernvilkårene.');
      return;
    }
    // Here you would typically handle the form submission, e.g., send to an API
    alert(`Takk for din påmelding! E-post: ${email}, Sone: ${zone}`);
    setEmail('');
    setZone('');
    setConsent(false);
  };

  return (
    <footer className="bg-gray-800 text-white p-8 mt-12">
      <div className="container mx-auto grid md:grid-cols-3 gap-8 text-center md:text-left">
        <div>
          <h3 className="text-lg font-bold mb-2">Nyhetsbrev</h3>
          <p className="text-sm text-gray-400 mb-4">Få de beste tilbudene og nyhetene rett i innboksen.</p>
          <form onSubmit={handleNewsletterSubmit}>
            <input 
              type="email" 
              placeholder="Din e-postadresse" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full p-2 rounded-md text-gray-900 mb-2"
              required
            />
            <select
              value={zone}
              onChange={e => setZone(e.target.value as PriceZone)}
              className="w-full p-2 rounded-md text-gray-900 mb-2"
              required
            >
              <option value="" disabled>Velg din prissone</option>
              {Object.values(PriceZone).map(z => <option key={z} value={z}>{z} ({PriceZoneNames[z]})</option>)}
            </select>
            <div className="flex items-center text-left mb-4">
              <input 
                type="checkbox" 
                id="consent" 
                checked={consent}
                onChange={e => setConsent(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="consent" className="text-xs text-gray-400">
                Jeg godtar <Link href="/privacy-policy" className="underline">personvernvilkårene</Link>.
              </label>
            </div>
            <button type="submit" className="w-full bg-blue-600 py-2 rounded-md hover:bg-blue-700 transition-colors">
              Meld meg på
            </button>
          </form>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-2">Snarveier</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:underline">Avtaler</Link></li>
            <li><Link href="/fastpriskalkulator" className="hover:underline">Fastpriskalkulator</Link></li>
            <li><Link href="/faq" className="hover:underline">Ofte stilte spørsmål</Link></li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-lg font-bold mb-2">Juridisk</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/terms-of-service" className="hover:underline">Vilkår for bruk</Link></li>
            <li><Link href="/privacy-policy" className="hover:underline">Personvernerklæring</Link></li>
            <li><Link href="/business" className="hover:underline">For bedrifter</Link></li>
          </ul>
        </div>

      </div>
      <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
        <p>&copy; {new Date().getFullYear()} Strømsjef.no - Alle rettigheter reservert.</p>
      </div>
    </footer>
  );
};

export default Footer; 