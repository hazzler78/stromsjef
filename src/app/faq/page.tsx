'use client';
import { useState } from 'react';

interface FAQItemProps {
  question: string;
  children: React.ReactNode;
}

const FAQItem = ({ question, children }: FAQItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left py-4 px-2 flex justify-between items-center focus:outline-none"
      >
        <span className="text-lg font-medium">{question}</span>
        <span>{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && (
        <div className="pb-4 px-2 text-gray-600">
          {children}
        </div>
      )}
    </div>
  );
};


const FAQPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Ofte stilte spørsmål (FAQ)</h1>
      <div className="space-y-4">
        <FAQItem question="Hva er angrerett?">
          <p>Angrerettloven gir deg rett til å angre på kjøp av varer og tjenester som er inngått ved fjernsalg (for eksempel på internett) eller utenfor fast utsalgssted. Du har 14 dagers ubetinget angrerett fra avtalen er inngått. For å benytte angreretten, må du gi beskjed til strømleverandøren innen fristen.</p>
        </FAQItem>
        <FAQItem question="Hva bør jeg vite om fakturavilkår?">
          <p>Fakturavilkår kan variere mellom leverandører. Vanlige punkter å se etter er:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li><strong>Fakturaperiode:</strong> Hvor ofte du mottar faktura (vanligvis månedlig).</li>
            <li><strong>Betalingsfrist:</strong> Normalt 14 dager.</li>
            <li><strong>Fakturatype:</strong> eFaktura og AvtaleGiro er ofte gratis, mens papirfaktura kan ha et gebyr.</li>
            <li><strong>Gebyrer:</strong> Sjekk for purregebyr ved for sen betaling.</li>
          </ul>
        </FAQItem>
        <FAQItem question="Hvordan fungerer bytteprosessen?">
          <p>Å bytte strømleverandør er enkelt og gratis. Prosessen er som følger:</p>
          <ol className="list-decimal list-inside mt-2 space-y-1">
            <li>Velg en ny strømavtale gjennom vår sammenligningstjeneste.</li>
            <li>Fyll ut bestillingsskjemaet hos den nye leverandøren via vår lenke.</li>
            <li>Din nye leverandør ordner alt det praktiske, inkludert å si opp din gamle avtale.</li>
            <li>Du vil motta en bekreftelse, og byttet skjer vanligvis innen et par uker. Du vil ikke oppleve strømbrudd under byttet.</li>
          </ol>
        </FAQItem>
      </div>
    </div>
  );
};

export default FAQPage; 