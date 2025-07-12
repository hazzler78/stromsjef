'use client';
import { useState } from 'react';
import Link from 'next/link';

interface FAQItemProps {
  question: string;
  children: React.ReactNode;
}

const FAQItem = ({ question, children }: FAQItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left py-4 px-2 flex justify-between items-center focus:outline-none hover:bg-gray-50 transition-colors"
      >
        <span className="text-lg font-medium text-gray-900">{question}</span>
        <span className="text-2xl text-blue-700 font-light">{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && (
        <div className="pb-4 px-2 text-gray-600 leading-relaxed">
          {children}
        </div>
      )}
    </div>
  );
};

const FAQPage = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Ofte stilte spørsmål (FAQ)</h1>
      <div className="bg-blue-50 p-6 rounded-lg mb-8">
        <p className="text-gray-700">
          Her finner du svar på de vanligste spørsmålene om Strømsjef og strømavtaler. Finner du ikke svaret du leter etter?
          <Link href="mailto:info@stromsjef.no" className="text-blue-700 hover:underline ml-1">
            Ta kontakt med oss
          </Link> så hjelper vi deg gjerne!
        </p>
      </div>
      <div className="space-y-2">
        <FAQItem question="Hva er Strømsjef?">
          Strømsjef er en uavhengig tjeneste for å finne billige strømavtaler. Vi hjelper deg å finne den beste avtalen for deg – enkelt, gratis og uforpliktende.
        </FAQItem>
        <FAQItem question="Hvor ofte oppdateres prisene?">
          Prisene oppdateres daglig, og vi gjør vårt beste for å vise deg de nyeste og mest korrekte tallene. Husk å dobbeltsjekke hos leverandøren før du bytter.
        </FAQItem>
        <FAQItem question="Hvorfor er noen avtaler ikke tilgjengelige i mitt område?">
          Noen strømavtaler gjelder kun for bestemte geografiske områder eller prissoner. Skriv inn ditt postnummer for å se hvilke avtaler som gjelder for deg.
        </FAQItem>
        <FAQItem question="Hvordan kan jeg kontakte dere?">
          Du kan sende oss en e-post på <a href="mailto:info@stromsjef.no" className="text-blue-700 hover:underline">info@stromsjef.no</a> – vi svarer så raskt vi kan!
        </FAQItem>
        <FAQItem question="Hvordan fungerer bytte av strømleverandør?">
          Det er enkelt! Finn en avtale du liker, bestill via lenken, og den nye leverandøren ordner resten – inkludert oppsigelse av din gamle avtale. Du får ingen strømbrudd.
        </FAQItem>
        <FAQItem question="Hva er spotpris?">
          Spotpris betyr at strømprisen følger markedet og kan variere fra time til time. Du betaler det strømmen faktisk koster, pluss et påslag fra leverandøren.
        </FAQItem>
        <FAQItem question="Hva er fastpris?">
          Med fastpris låser du strømprisen for en avtalt periode, for eksempel 1 eller 3 år. Da vet du alltid hva du skal betale per kWh.
        </FAQItem>
        <FAQItem question="Hva er bindingstid?">
          Bindingstid er hvor lenge du må være kunde før du kan bytte uten gebyr. Mange avtaler har ingen bindingstid, men noen fastprisavtaler har det.
        </FAQItem>
        <FAQItem question="Hva er oppsigelsestid?">
          Oppsigelsestid er hvor lang tid det tar fra du sier opp avtalen til den faktisk avsluttes. De fleste avtaler har kort eller ingen oppsigelsestid.
        </FAQItem>
        <FAQItem question="Hva er påslag?">
          Påslag er et tillegg leverandøren tar per kWh, ofte for å dekke sine kostnader. Dette kommer i tillegg til selve strømprisen.
        </FAQItem>
        <FAQItem question="Hva er nettleie?">
          Nettleie er det du betaler til nettselskapet for å få strømmen levert hjem til deg. Dette er en egen kostnad, uavhengig av strømavtalen din.
        </FAQItem>
        <FAQItem question="Hva er angrerett?">
          Du har 14 dagers angrerett når du bestiller strømavtale på nett. Det betyr at du kan ombestemme deg uten å oppgi grunn.
        </FAQItem>
        <FAQItem question="Hva er forskjellen på strømleverandør og nettselskap?">
          Strømleverandøren selger deg strømmen, mens nettselskapet eier og drifter strømnettet. Du kan fritt velge leverandør, men ikke nettselskap.
        </FAQItem>
        <FAQItem question="Hvordan vet jeg hvilken prissone jeg tilhører?">
          Prissonen bestemmes av hvor du bor. Du kan sjekke dette på fakturaen din, eller spørre nettselskapet ditt hvis du er usikker.
        </FAQItem>
      </div>
    </div>
  );
};

export default FAQPage; 