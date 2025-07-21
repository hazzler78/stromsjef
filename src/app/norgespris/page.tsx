import Link from 'next/link';

export default function NorgesprisLanding() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <section className="mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 mb-4">Få billigere enn Norgespris med Strømsjef</h1>
        <p className="text-xl md:text-2xl text-gray-800 mb-6 font-medium">Norges nye strømordning gir fastpris på 40 øre/kWh – men de fleste betaler mye mer enn de tror. Med Strømsjef får du en avtale <span className="font-bold text-green-600">UTEN gebyrer</span> og faktisk <span className="font-bold text-green-600">-1,7 øre i påslag</span>!</p>
        <div className="flex flex-col md:flex-row gap-4 justify-center mb-6">
          <Link href="/" className="bg-blue-600 !text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-lg shadow-md">Bytt til Strømsjef nå</Link>
        </div>
        <p className="text-gray-500 text-sm">Spar penger – få markedets beste avtale på strøm!</p>
      </section>

      <section className="mb-10 bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded">
        <h2 className="text-2xl font-bold mb-2 text-yellow-800">Hva er Norgespris?</h2>
        <ul className="list-disc pl-6 text-gray-700 text-base mb-2">
          <li>Regjeringen innfører fra 1. oktober 2025 en statlig fastpris på 40 øre/kWh (eks. mva) for husholdninger.</li>
          <li>Du kan velge mellom Norgespris eller vanlig strømavtale med strømstøtte.</li>
          <li>De fleste strømleverandører legger til påslag og månedsgebyr – det gjør regningen mye høyere enn du tror!</li>
        </ul>
        <p className="text-sm text-gray-600 mt-2">Kilde: <a href="https://www.regjeringen.no/no/aktuelt/nye-grep-for-lavere-stromregninger-og-kontroll-over-kraftressursene/id3085960/" target="_blank" rel="noopener noreferrer" className="underline text-blue-700">Regjeringen.no</a></p>
      </section>

      <section className="mb-10 bg-green-50 border-l-4 border-green-400 p-6 rounded">
        <h2 className="text-2xl font-bold mb-2 text-green-800">Hvorfor velge Strømsjef?</h2>
        <ul className="list-disc pl-6 text-gray-700 text-base mb-2">
          <li><span className="font-bold">Ingen månedsgebyr</span> – du betaler kun for strømmen du bruker.</li>
          <li><span className="font-bold">-1,7 øre i påslag</span> – vi gir deg faktisk rabatt på spotprisen!</li>
          <li>Full åpenhet – ingen skjulte kostnader.</li>
          <li>Enkelt å bytte – vi hjelper deg hele veien.</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold mb-2 text-blue-700">Eksempel: Hvor mye kan du spare?</h2>
        <div className="bg-white border border-blue-100 rounded p-4 mb-2">
          <p className="text-gray-700 mb-1">Har du et forbruk på <span className="font-bold">20 000 kWh/år</span> kan du spare flere tusen kroner sammenlignet med "Norgespris" eller vanlige spotprisavtaler.</p>
          <p className="text-xs text-gray-500">* Faktisk besparelse avhenger av forbruk og markedspriser.</p>
        </div>
      </section>

      <section className="mb-10 bg-blue-50 border-l-4 border-blue-400 p-6 rounded">
        <h2 className="text-2xl font-bold mb-2 text-blue-800">Visste du at ...?</h2>
        <ul className="list-disc pl-6 text-gray-700 text-base mb-2">
          <li>Mange tror "50 øre" er hele strømprisen – men det er kun spotprisen staten støtter.</li>
          <li>Nettleie og avgifter kommer i tillegg – og varierer fra sted til sted.</li>
          <li>Strømsjef gir deg markedets laveste påslag – og ingen overraskelser på regningen.</li>
        </ul>
      </section>

      <section className="text-center mt-12">
        <Link href="/" className="bg-green-600 !text-white px-10 py-4 rounded-lg font-bold text-xl hover:bg-green-700 transition-colors shadow-lg">Spar penger – bytt i dag!</Link>
        <p className="text-gray-400 text-xs mt-6">Det tar kun 2 minutter å bytte. Ingen bindingstid.</p>
      </section>
    </div>
  );
} 