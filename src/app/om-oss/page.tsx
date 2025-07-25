import React from 'react';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Om oss – Strømsjef.no | Hvem står bak og hvorfor finnes vi?",
  description: "Les historien bak Strømsjef.no. Vi er en uavhengig tjeneste som hjelper deg å finne ryddige strømavtaler – laget av bransjefolk med 30 års erfaring. Finn ut hvorfor vi startet, og hvordan vi kan hjelpe deg å ta kontroll over strømregningen.",
  openGraph: {
    title: "Om oss – Strømsjef.no",
    description: "Bli kjent med folkene bak Strømsjef.no og vårt mål om å gjøre strømmarkedet enklere og mer rettferdig for alle.",
    url: "https://stromsjef.no/om-oss",
    type: "article",
    siteName: "Strømsjef.no",
    images: [
      {
        url: "/logo-lightning.svg",
        width: 1200,
        height: 630,
        alt: "Strømsjef logo"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Om oss – Strømsjef.no",
    description: "Bli kjent med folkene bak Strømsjef.no og vårt mål om å gjøre strømmarkedet enklere og mer rettferdig for alle.",
    images: [
      "/logo-lightning.svg"
    ]
  },
  alternates: {
    canonical: "https://stromsjef.no/om-oss"
  }
};

export default function OmOss() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      {/* Hero-intro */}
      <div className="bg-blue-100 border-l-4 border-blue-500 p-6 mb-8 rounded flex items-center gap-3">
        <span className="text-3xl">💡</span>
        <span className="text-xl font-semibold">Strømsjef.no gjør det enkelt å finne en god strømavtale – raskt, gratis og uten krangel.</span>
      </div>
      <h1 className="text-4xl font-bold mb-6">Strømsjef.no <span className="font-normal">– Om oss</span></h1>
      <h2 className="text-2xl font-semibold mb-4">Hvem står bak Strømsjef – og hvorfor finnes vi egentlig?</h2>
      <section className="mb-8 space-y-4">
        <p>
          Strømmarkedet i Norge har blitt ryddigere de siste årene – men fortsatt betaler mange for mye uten å vite det. Dyre avtaler med påslag, gebyrer og tilleggstjenester sniker seg inn, gjerne fordi man fortsetter med den avtalen man alltid har hatt, eller takker ja til et tilbud på telefon som høres greit ut der og da.
        </p>
        <p>
          Vi startet <strong>Strømsjef.no</strong> fordi vi var lei av at folk betaler mer enn de må – ofte uten å vite det selv.
          Vi har sett hvor vanskelig det kan være å finne en god strømavtale i en jungel av tilbydere, påslag og liten skrift. Det finnes over 100 ulike strømselskaper i Norge – og mange avtaler er laget for å forvirre mer enn å opplyse.
        </p>
        <p>
          Vi som står bak Strømsjef.no har jobbet i strømmarkedet i over 30 år. Vi kjenner bransjen fra innsiden – både det som fungerer, og det som ikke gjør det. Vi har sett hvordan mange strømleverandører opererer, og hvor vanskelig det er for vanlige folk å finne frem i alle valgmulighetene.
        </p>
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-6">
          <p className="font-bold mb-2">Strømsjef.no er ikke et strømselskap.</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Du får aldri en faktura fra oss.</li>
            <li>Vi er en uavhengig tjeneste som samarbeider med flere strømleverandører for å finne gode avtaler – både åpne kampanjer og rabatter du kun får gjennom oss.</li>
            <li>Samtidig jobber vi aktivt for å hente inn nye selskaper som er villige til å tilby avtaler uten skjulte gebyrer eller unødvendige tilleggstjenester.</li>
          </ul>
        </div>
        <p>
          Målet vårt er enkelt: <strong>å hjelpe deg å ta tilbake kontrollen over strømavtalen din.</strong><br/>
          Du skal slippe å bruke timer på å lete selv. Vi viser deg kun avtaler som er verdt å vurdere – med ryddige vilkår og priser du faktisk forstår.
        </p>
        <p>
          Du trenger ikke å forstå hele strømmarkedet – det er vår jobb.<br/>
          Du trenger bare å ta én beslutning: <strong>å bli Strømsjef i ditt eget hjem.</strong>
        </p>
      </section>
    </div>
  );
} 