const PrivacyPolicyPage = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Personvernerklæring</h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-gray-600 mb-8">
          Sist oppdatert: {new Date().toLocaleDateString('nb-NO')}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Innledning</h2>
          <p className="mb-4">
            Strømsjef.no ("vi", "oss", "vår") respekterer ditt personvern og er forpliktet til å beskytte dine personopplysninger. 
            Denne personvernerklæringen forklarer hvordan vi samler inn, bruker og beskytter dine personopplysninger når du bruker våre tjenester.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Hvilke personopplysninger samler vi inn?</h2>
          <p className="mb-4">Vi samler inn følgende typer personopplysninger:</p>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li><strong>Kontaktinformasjon:</strong> Navn, e-postadresse og telefonnummer når du registrerer deg for våre tjenester</li>
            <li><strong>Bruksdata:</strong> Informasjon om hvordan du bruker våre tjenester, inkludert søkekriterier og sammenligninger</li>
            <li><strong>Teknisk informasjon:</strong> IP-adresse, nettlesertype, operativsystem og andre tekniske detaljer</li>
            <li><strong>Kommunikasjon:</strong> E-poster og meldinger du sender til oss</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Hvordan bruker vi dine personopplysninger?</h2>
          <p className="mb-4">Vi bruker dine personopplysninger til følgende formål:</p>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>Å tilby og forbedre våre strømsammenligningstjenester</li>
            <li>Å sende deg relevante tilbud og informasjon om strømavtaler</li>
            <li>Å svare på dine henvendelser og gi kundestøtte</li>
            <li>Å analysere bruksmønstre for å forbedre våre tjenester</li>
            <li>Å oppfylle juridiske forpliktelser</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Deling av personopplysninger</h2>
          <p className="mb-4">
            Vi deler ikke dine personopplysninger med tredjeparter, unntatt i følgende tilfeller:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>Når du eksplisitt samtykker til deling</li>
            <li>Med strømleverandører når du velger å bytte leverandør gjennom våre tjenester</li>
            <li>Når det kreves av lov eller rettslig myndighet</li>
            <li>Med tjenesteleverandører som hjelper oss med å drive våre tjenester (f.eks. hosting, analyse)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Cookies og sporingsverktøy</h2>
          <p className="mb-4">
            Vi bruker cookies og lignende teknologier for å:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>Huske dine preferanser og innstillinger</li>
            <li>Analysere nettstedets bruk og ytelse</li>
            <li>Forbedre brukeropplevelsen</li>
            <li>Vise relevante annonser</li>
          </ul>
          <p className="mb-4">
            Du kan kontrollere cookie-innstillingene i nettleseren din. Merk at noen funksjoner kan ikke fungere optimalt 
            hvis du deaktiverer cookies.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Sikkerhet</h2>
          <p className="mb-4">
            Vi implementerer passende tekniske og organisatoriske tiltak for å beskytte dine personopplysninger mot 
            uautorisert tilgang, endring, avsløring eller ødeleggelse. Dette inkluderer:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>Kryptering av data under overføring og lagring</li>
            <li>Regelmessig sikkerhetsoppdateringer</li>
            <li>Tilgangskontroll og autentisering</li>
            <li>Regelmessig backup av data</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Dine rettigheter</h2>
          <p className="mb-4">Du har følgende rettigheter når det gjelder dine personopplysninger:</p>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li><strong>Rett til innsyn:</strong> Du kan be om informasjon om hvilke personopplysninger vi har om deg</li>
            <li><strong>Rett til retting:</strong> Du kan be om at feilaktige eller ufullstendige opplysninger rettes</li>
            <li><strong>Rett til sletting:</strong> Du kan be om at dine personopplysninger slettes</li>
            <li><strong>Rett til begrensning:</strong> Du kan be om at behandlingen av dine opplysninger begrenses</li>
            <li><strong>Rett til dataportabilitet:</strong> Du kan be om å motta dine opplysninger i et strukturt format</li>
            <li><strong>Rett til innsigelse:</strong> Du kan protestere mot behandling av dine personopplysninger</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Lagring av personopplysninger</h2>
          <p className="mb-4">
            Vi lagrer dine personopplysninger så lenge det er nødvendig for å oppfylle formålene beskrevet i denne 
            personvernerklæringen, eller så lenge det kreves av lov. Når vi ikke lenger trenger opplysningene, 
            sletter vi dem på en sikker måte.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Endringer i personvernerklæringen</h2>
          <p className="mb-4">
            Vi kan oppdatere denne personvernerklæringen fra tid til annen. Vi vil varsle deg om vesentlige endringer 
            via e-post eller ved å legge ut en melding på nettstedet vårt. Vi oppfordrer deg til å lese denne 
            personvernerklæringen regelmessig.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">10. Kontaktinformasjon</h2>
          <p className="mb-4">
            Hvis du har spørsmål om denne personvernerklæringen eller hvordan vi behandler dine personopplysninger, 
            kan du kontakte oss på:
          </p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="mb-2"><strong>E-post:</strong> personvern@stromsjef.no</p>
            <p className="mb-2"><strong>Adresse:</strong> [Bedriftsadresse]</p>
            <p><strong>Telefon:</strong> [Telefonnummer]</p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">11. Klager</h2>
          <p className="mb-4">
            Hvis du mener at vi ikke behandler dine personopplysninger i samsvar med denne personvernerklæringen 
            eller gjeldende personvernlovgivning, kan du klage til Datatilsynet. Du finner mer informasjon på 
            <a href="https://www.datatilsynet.no" className="text-blue-600 hover:underline ml-1">
              www.datatilsynet.no
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage; 