const TermsOfServicePage = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Vilkår for bruk</h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-gray-600 mb-8">
          Sist oppdatert: {new Date().toLocaleDateString('nb-NO')}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Generelt</h2>
          <p className="mb-4">
            Disse vilkårene for bruk ("Vilkårene") regulerer bruken av Strømsjef.no ("Nettstedet") og de tjenester 
            som tilbys av Strømsjef ("vi", "oss", "vår"). Ved å bruke nettstedet vårt godtar du disse vilkårene.
          </p>
          <p className="mb-4">
            Strømsjef.no er en sammenligningstjeneste for strømavtaler som hjelper forbrukere å finne og bytte 
            til bedre strømavtaler. Vi er ikke en strømleverandør, men fungerer som en uavhengig megler.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Bruk av tjenestene</h2>
          <p className="mb-4">Du kan bruke våre tjenester for å:</p>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>Sammenligne strømavtaler fra ulike leverandører</li>
            <li>Få informasjon om strømpriser og avtaler</li>
            <li>Beregne potensielle besparelser</li>
            <li>Bytte strømleverandør gjennom våre samarbeidspartnere</li>
          </ul>
          <p className="mb-4">
            Du forplikter deg til å bruke tjenestene våre på en lovlig og etisk måte, og ikke å misbruke 
            eller forstyrre funksjonaliteten på nettstedet.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Nøyaktighet av informasjon</h2>
          <p className="mb-4">
            Vi streber etter å gi nøyaktig og oppdatert informasjon om strømavtaler og priser. Imidlertid kan vi ikke garantere:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>At all informasjon er 100% nøyaktig til enhver tid</li>
            <li>At priser ikke endres mellom oppdateringer</li>
            <li>At alle tilgjengelige avtaler er inkludert i sammenligningen</li>
            <li>At leverandørenes vilkår ikke endres</li>
          </ul>
          <p className="mb-4">
            Vi anbefaler at du alltid verifiserer informasjonen direkte med strømleverandøren før du inngår en avtale.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Bytte av strømleverandør</h2>
          <p className="mb-4">
            Når du velger å bytte strømleverandør gjennom våre tjenester:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>Du inngår avtalen direkte med strømleverandøren, ikke med oss</li>
            <li>Vi fungerer som en uavhengig megler og mottar kompensasjon fra leverandøren</li>
            <li>Bytteprosessen håndteres av den nye leverandøren</li>
            <li>Du kan vanligvis angre på avtalen innen 14 dager</li>
          </ul>
          <p className="mb-4">
            Vi er ikke ansvarlige for eventuelle problemer som oppstår i forbindelse med bytteprosessen eller 
            leverandørens tjenester.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Kompensasjon og affiliate-lenker</h2>
          <p className="mb-4">
            Vi mottar kompensasjon fra strømleverandører når du bytter leverandør gjennom våre affiliate-lenker. 
            Dette påvirker ikke prisen du betaler - du får samme vilkår som om du hadde gått direkte til leverandøren.
          </p>
          <p className="mb-4">
            Kompensasjonen hjelper oss å holde tjenestene våre gratis for deg og å fortsette å forbedre 
            sammenligningstjenesten.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Personvern</h2>
          <p className="mb-4">
            Håndtering av dine personopplysninger reguleres av vår 
            <a href="/privacy-policy" className="text-blue-600 hover:underline ml-1">
              personvernerklæring
            </a>. 
            Ved å bruke våre tjenester godtar du også vilkårene i personvernerklæringen.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Intellektuell eiendom</h2>
          <p className="mb-4">
            Alt innhold på nettstedet, inkludert tekst, bilder, logoer, design og programvare, er beskyttet av 
            opphavsrett og andre intellektuelle eiendomsrettigheter som tilhører Strømsjef eller våre lisensgivere.
          </p>
          <p className="mb-4">
            Du kan ikke kopiere, distribuere, endre eller på annen måte bruke innholdet uten vår skriftlige tillatelse.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Ansvarsfraskrivelse</h2>
          <p className="mb-4">
            Tjenestene våre tilbys "som de er" uten garantier av noen art. Vi fraskriver oss spesielt ansvar for:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>Tap av penger eller besparelser som ikke realiseres</li>
            <li>Problemer med strømleverandørenes tjenester</li>
            <li>Tekniske feil eller avbrudd i tjenestene</li>
            <li>Skade som oppstår som følge av bruk av nettstedet</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Ansvarsbegrensning</h2>
          <p className="mb-4">
            Vårt totale ansvar overfor deg er begrenset til det beløp du har betalt oss for tjenestene, 
            eller 1000 NOK, avhengig av hva som er høyest. Dette gjelder ikke i tilfeller av grov uaktsomhet 
            eller forsætlig handling.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">10. Endringer i vilkårene</h2>
          <p className="mb-4">
            Vi forbeholder oss retten til å endre disse vilkårene når som helst. Endringer vil bli publisert 
            på nettstedet med en oppdatert dato. Din fortsatte bruk av tjenestene etter endringer utgjør 
            aksept av de nye vilkårene.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">11. Oppsigelse</h2>
          <p className="mb-4">
            Du kan når som helst avslutte bruken av våre tjenester. Vi kan også avslutte eller begrense 
            din tilgang til tjenestene hvis du bryter disse vilkårene.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">12. Lovvalg og tvisteløsning</h2>
          <p className="mb-4">
            Disse vilkårene reguleres av norsk lov. Eventuelle tvister skal løses ved forhandling, og ved 
            uenighet skal tvisten avgjøres av norske domstoler med Oslo tingrett som første instans.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">13. Kontaktinformasjon</h2>
          <p className="mb-4">
            Hvis du har spørsmål om disse vilkårene, kan du kontakte oss på:
          </p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="mb-2"><strong>E-post:</strong> vilkar@stromsjef.no</p>
            <p className="mb-2"><strong>Adresse:</strong> [Bedriftsadresse]</p>
            <p><strong>Telefon:</strong> [Telefonnummer]</p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">14. Forbrukerrettigheter</h2>
          <p className="mb-4">
            Som forbruker har du rettigheter i henhold til norsk forbrukerlovgivning. Disse vilkårene 
            påvirker ikke dine lovpålagte rettigheter som forbruker.
          </p>
          <p className="mb-4">
            Hvis du er misfornøyd med våre tjenester, kan du klage til Forbrukertilsynet eller ta kontakt 
            med oss direkte.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsOfServicePage; 