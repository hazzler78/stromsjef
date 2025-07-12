import React from 'react';

export default function OmOss() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-6">Om oss</h1>
      <section className="mb-8">
        <p className="text-lg mb-4">
          <strong>Velkommen til Strømsjef.no – din guide til bedre strømavtaler.</strong>
        </p>
        <p className="mb-4">
          Vi i Strømsjef brenner for én ting: å gjøre strømavtaler enklere, billigere og mer oversiktlige for både privatpersoner og bedrifter i Norge.
        </p>
        <p className="mb-4">
          Hos oss kan du finne billige strømavtaler fra våre samarbeidspartnere, få full oversikt over pris, vilkår og bindingstid – og bytte strømleverandør helt enkelt og kostnadsfritt.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Hva vi tilbyr</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Finn billig strømavtale:</strong> Vi viser deg nøye utvalgte strømavtaler fra pålitelige leverandører. Med vår tjeneste kan du enkelt finne den avtaletypen som passer deg best – enten du foretrekker spotpris eller fastpris.
          </li>
          <li>
            <strong>Fastpris- og spotprisavtaler:</strong> Finn billig strømavtale med ulike fastprisavtaler (med ulike bindingstider) eller spotprisavtaler som følger markedet. Vi gir deg tydelig informasjon om priser, påslag og eventuelle avgifter.
          </li>
          <li>
            <strong>Skreddersydde løsninger for bedrifter:</strong> Vi tilbyr også rådgivning og spesialtilpassede strømavtaler for bedrifter som ønsker bedre kontroll og lavere strømkostnader.
          </li>
          <li>
            <strong>Verktøy for å regne ut besparelser:</strong> Bruk vår fastpriskalkulator for å se hvor mye du kan spare på å bytte strømavtale.
          </li>
          <li>
            <strong>Enkel og trygg bytteprosess:</strong> Vi tar oss av hele byttet for deg – inkludert oppsigelse av eksisterende avtale. Prosessen er helt digital, rask og gratis for deg som kunde.
          </li>
          <li>
            <strong>Transparens og rådgivning:</strong> Vi informerer alltid åpent om vilkår, påslag, bindingstider og avgifter, slik at du kan ta et velinformert valg.
          </li>
          <li>
            <strong>Nyhetsbrev og oppdateringer:</strong> Meld deg på vårt nyhetsbrev for å få de beste tilbudene først og holde deg oppdatert om markedet.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Hvorfor velge Strømsjef?</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Enkel og brukervennlig tjeneste</li>
          <li>Konkurransedyktige avtaler fra utvalgte leverandører</li>
          <li>Ingen skjulte kostnader eller overraskelser</li>
          <li>Rask og gratis bytte</li>
        </ul>
        <p className="mt-4">Vi er her for å hjelpe deg å spare penger på strøm – uten stress.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Hvem står bak?</h2>
        <p className="mb-2">Strømsjef.no eies og drives av <strong>Normann Salg</strong> (Org.nr. 927 985 780). Vi samarbeider med flere strømleverandører for å forhandle frem gode priser til kundene våre.</p>
        <p className="mb-2">Vi tar personvern på alvor og følger GDPR. Du kan lese mer om hvordan vi behandler personopplysninger i vår <a href="/personvern" className="underline text-blue-600">personvernerklæring</a>.</p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Vårt mål</h2>
        <p>
          Vi ønsker å skape et mer transparent, kundevennlig og rettferdig strømmarked i Norge. Hos oss skal det være enkelt å ta kontroll over strømutgiftene sine og velge en avtale som passer dine behov.
        </p>
      </section>
    </div>
  );
} 