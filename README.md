# Strømsjef

Strømsjef er en norsk strømavtale-sammenligningstjeneste bygget med Next.js og Tailwind CSS. Tjenesten lar brukere sammenligne og bytte strømavtaler, se priser for sin prissone, og finne de beste tilbudene fra flere leverandører.

## Funksjoner
- Sammenlign strømavtaler fra flere leverandører
- Prissone-filter (NO1–NO5) med tydelig veiledning
- Detaljerte plan-kort med logo, bindingstid, bruddgebyr, vilkårsgaranti og mer
- Affiliate-lenker for bestilling
- Nyhetsbrev med GDPR-samtykke
- Ofte stilte spørsmål (FAQ)
- Juridiske og bedrifts-sider
- Mobilvennlig design
- Mock-data fallback (API-integrasjon med Forbrukerrådet kommer)

## Kom i gang

Installer avhengigheter:
```bash
npm install
```

Start utviklingsserveren:
```bash
npm run dev
```

Åpne [http://localhost:3000](http://localhost:3000) i nettleseren for å se resultatet.

## Miljøvariabler
Legg til en `.env.local`-fil for API-nøkler hvis du skal bruke live-data fra Forbrukerrådet (ikke nødvendig for mock-data).

## Bidra
Pull requests og forslag er velkomne! Se etter TODOs og åpne issues for forbedringer.

## Lisens
MIT

---

Dette prosjektet bruker [Next.js](https://nextjs.org) og [Tailwind CSS](https://tailwindcss.com/).

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
