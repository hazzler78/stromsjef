import React from 'react';

const mediaPosts = [
  {
    title: 'Reagerer på økt nettleie: – Kynisk',
    description: 'TV 2-artikkel der Mathias Nilsson, strøminfluenser og grunnlegger av Strømsjef, kommenterer økt nettleie og konsekvenser for forbrukere.',
    url: 'https://www.tv2.no/nyheter/innenriks/reagerer-pa-okt-nettleie-kynisk/17045778/',
    date: '2024-10-11',
  },
  {
    title: 'Influenseren som endret strømsalg-bransjen',
    description: 'Europower-profilintervju med Mathias Nilsson, mannen bak Strømsjef.',
    url: 'https://www.europower.no/forbruker/influenseren-som-endret-stromsalg-bransjen/2-1-1536646',
    date: '2023-10-25',
  },
  {
    title: 'Strømmarkedets «Robin Hood» tar oppgaven norske byråkrater og politikere skulle ha gjort for lenge siden',
    description: 'Nettavisen-artikkel om Mathias Nilsson og Strømsjef som «strømmarkedets Robin Hood».',
    url: 'https://www.nettavisen.no/norsk-debatt/strommarkedets-robin-hood-tar-oppgaven-norske-byrakrater-og-politikere-skulle-ha-gjort-for-lenge-siden/o/5-95-340860',
    date: '2021-11-18',
  },
  {
    title: 'Kristoffer har strømavtale med fastpris: –⁠ Smiler når regningen kommer',
    description: 'VG-artikkel om Kristoffer Normann og fordelene med fastprisavtale.',
    url: 'https://www.vg.no/nyheter/i/g6pOjL/kristoffer-har-stroemavtale-med-fastpris-smiler-naar-regningen-kommer',
    date: '2021-10-19',
  },
  {
    title: 'Norges første strøm-influenser: – Vi tapper Fjordkraft og Norgesenergi for millioner',
    description: 'E24-artikkel om Mathias Nilsson, «Dr. Strøm», og hvordan han hjelper nordmenn å kutte strømregningen.',
    url: 'https://e24.no/boers-og-finans/i/eK9ejg/norges-foerste-stroem-influenser-vi-tapper-fjordkraft-og-norgesenergi-for-millioner',
    date: '2021-05-30',
  },
];

export default function MediaPage() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-6 text-blue-700 text-center">Strømsjef i Media</h1>
      <p className="text-lg text-gray-700 mb-10 text-center">
        Her finner du et utvalg av artikler, intervjuer og omtaler der Strømsjef har vært i media. Siden oppdateres månedlig.
      </p>
      <div className="space-y-6">
        {mediaPosts.map((post, idx) => (
          <a
            key={idx}
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100 hover:border-blue-300 group"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div>
                <h2 className="text-xl font-semibold text-blue-700 group-hover:underline mb-1">{post.title}</h2>
                {post.description && (
                  <p className="text-gray-600 mb-1">{post.description}</p>
                )}
                {post.date && (
                  <span className="text-xs text-gray-400">Publisert: {post.date}</span>
                )}
              </div>
              {/* Plass for logo eller bilde i fremtiden */}
            </div>
          </a>
        ))}
      </div>
      <div className="mt-10 text-center">
        <a
          href="https://www.google.com/search?q=mathias+nilsson+str%C3%B8msjef"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-4 text-blue-700 hover:underline text-lg font-medium"
        >
          Se flere omtaler via Google
        </a>
      </div>
    </div>
  );
} 