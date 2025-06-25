'use client';

import Link from 'next/link';
import { PriceZone, PriceZoneNames } from '@/types/electricity';
import { useState } from 'react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [zone, setZone] = useState<PriceZone | ''>('');
  const [consent, setConsent] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!consent) {
      setMessage({ type: 'error', text: 'Du må godta personvernvilkårene.' });
      return;
    }

    if (!marketingConsent) {
      setMessage({ type: 'error', text: 'Du må samtykke til å motta markedsføring på e-post for å melde deg på nyhetsbrevet.' });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, zone, marketingConsent }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: data.message });
        setEmail('');
        setZone('');
        setConsent(false);
        setMarketingConsent(false);
      } else {
        setMessage({ type: 'error', text: data.error || 'En feil oppstod ved påmelding' });
      }
    } catch (error) {
      console.error('Newsletter signup error:', error);
      setMessage({ type: 'error', text: 'En feil oppstod ved påmelding' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-gray-800 text-white p-8 mt-12">
      <div className="container mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center md:text-left">
        <div>
          <h3 className="text-lg font-bold mb-2">Nyhetsbrev</h3>
          <p className="text-sm text-gray-400 mb-4">Få de beste tilbudene og nyhetene rett i innboksen.</p>
          
          {message && (
            <div className={`p-3 rounded-md mb-4 text-sm ${
              message.type === 'success' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {message.text}
            </div>
          )}
          
          <form onSubmit={handleNewsletterSubmit}>
            <input 
              type="email" 
              placeholder="Din e-postadresse" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full p-2 rounded-md text-gray-900 mb-2"
              required
              disabled={isSubmitting}
            />
            <select
              value={zone}
              onChange={e => setZone(e.target.value as PriceZone)}
              className="w-full p-2 rounded-md text-gray-900 mb-2"
              required
              disabled={isSubmitting}
            >
              <option value="" disabled>Velg din prissone</option>
              {Object.values(PriceZone).map(z => (
                <option key={z} value={z}>{z} ({PriceZoneNames[z]})</option>
              ))}
              <option value="Bedrift">Bedrift (for bedrifter)</option>
            </select>
            <div className="flex items-center text-left mb-4">
              <input 
                type="checkbox" 
                id="consent" 
                checked={consent}
                onChange={e => setConsent(e.target.checked)}
                className="mr-2"
                disabled={isSubmitting}
              />
              <label htmlFor="consent" className="text-xs text-gray-400">
                Jeg godtar <Link href="/terms-of-service" className="underline">Brukervilkår</Link>/<Link href="/privacy-policy" className="underline">Personvern</Link>.
              </label>
            </div>
            <div className="flex items-center text-left mb-4">
              <input
                type="checkbox"
                id="marketingConsent"
                checked={marketingConsent}
                onChange={e => setMarketingConsent(e.target.checked)}
                className="mr-2"
                disabled={isSubmitting}
                required
              />
              <label htmlFor="marketingConsent" className="text-xs text-gray-400">
                Ja, jeg samtykker til å motta markedsføring på e-post *
              </label>
            </div>
            <button 
              type="submit" 
              className={`w-full py-2 rounded-md transition-colors ${
                isSubmitting 
                  ? 'bg-gray-500 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Meld på...' : 'Meld meg på'}
            </button>
            <p className="text-xs text-gray-500 mt-2 text-center">
              * Påkrevd for å motta nyhetsbrev
            </p>
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
            <li><Link href="/terms-of-service" className="hover:underline">Brukervilkår</Link></li>
            <li><Link href="/privacy-policy" className="hover:underline">Personvern</Link></li>
            <li><Link href="/business" className="hover:underline">For bedrifter</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-2">Kontakt</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="mailto:post@stromsjef.no" className="hover:underline text-gray-300">
                post@stromsjef.no
              </a>
            </li>
            <li className="text-gray-400">
              Normann Salg
            </li>
            <li className="text-gray-400">
              Org.nr.: 927 985 780
            </li>
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