# Strømsjef.no - Strømsammenligningstjeneste

En moderne nettside for sammenligning av strømavtaler i Norge, bygget med Next.js, React og TypeScript.

## 🚀 Funksjoner

### Hovedfunksjoner
- **Strømsammenligning**: Sammenlign priser fra ulike leverandører
- **Spotpriskontroll**: Beregn potensielle besparelser ved å bytte leverandør
- **Telegram Bot**: Oppdater priser via naturlige språkkommandoer
- **Responsivt Design**: Fungerer perfekt på alle enheter
- **Real-time Updates**: Automatisk oppdatering av priser

### Tekniske Funksjoner
- **Next.js 15** med App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Telegram Bot API** for prisoppdateringer
- **Vercel KV** (Redis) for datalagring
- **Google Tag Manager** for analytics

## 📁 Prosjektstruktur

```
hemsida_stromsjef/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API endpoints
│   │   ├── business/          # For bedrifter side
│   │   ├── faq/              # FAQ side
│   │   ├── privacy-policy/   # Personvernerklæring
│   │   ├── spotpriskontroll/ # Spotpriskontroll kalkulator
│   │   └── terms-of-service/ # Vilkår for bruk
│   ├── components/           # React komponenter
│   ├── data/                # Mock data og statiske data
│   ├── lib/                 # Utility funksjoner og services
│   └── types/               # TypeScript type definisjoner
├── public/                  # Statiske filer
└── test-telegram-polling.js # Telegram bot polling script
```

## 🛠️ Installasjon og Oppsett

### Forutsetninger
- Node.js 18+ 
- npm eller yarn
- Telegram Bot Token (valgfritt)

### 1. Klone prosjektet
```bash
git clone [repository-url]
cd hemsida_stromsjef
```

### 2. Installer avhengigheter
```bash
npm install
```

### 3. Opprett .env fil
```bash
cp .env.example .env
```

Fyll ut følgende variabler i `.env`:
```env
# Telegram Bot (valgfritt)
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_ALLOWED_USERS=your_user_id_here

# Vercel KV (for produksjon)
KV_REST_API_URL=your_kv_url_here
KV_REST_API_TOKEN=your_kv_token_here
```

### 4. Start utviklingsserver
```bash
npm run dev
```

Nettsiden er nå tilgjengelig på `http://localhost:3000`

## 🤖 Telegram Bot Oppsett

### 1. Opprett en Telegram Bot
1. Send melding til [@BotFather](https://t.me/botfather) på Telegram
2. Følg instruksjonene for å opprette en ny bot
3. Kopier bot token

### 2. Få din bruker-ID
1. Send melding til [@userinfobot](https://t.me/userinfobot)
2. Kopier din bruker-ID

### 3. Konfigurer miljøvariabler
```env
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_ALLOWED_USERS=123456789
```

### 4. Start boten
```bash
node test-telegram-polling.js
```

### 5. Test kommandoer
Send følgende meldinger til boten:
- `"Set Cheap Energy spotpris in NO1 to 15"`
- `"Update Kilden Kraft fastpris in NO2 to 12"`
- `"Sett Cheap Energy priser i NO1 til 8"`

## 📱 Sider og Funksjonalitet

### Hovedsiden (/)
- Hero seksjon med call-to-action
- Funksjoner oversikt
- Strømsammenligning
- CTA seksjon

### Spotpriskontroll (/spotpriskontroll)
- Kalkulator for besparelser
- Viser årlig, månedlig og daglig besparelse
- Tips for å spare på strøm

### For bedrifter (/business)
- Informasjon om bedriftsavtaler
- Fordeler for bedrifter
- Kontaktinformasjon

### FAQ (/faq)
- Utvidbare spørsmål og svar
- Omfattende informasjon om strømavtaler
- Kontaktmuligheter

### Juridiske sider
- **Personvernerklæring** (/privacy-policy)
- **Vilkår for bruk** (/terms-of-service)

## 🔧 API Endpoints

### GET /api/plans
Henter alle strømavtaler
```json
{
  "success": true,
  "plans": [...]
}
```

### POST /api/telegram/test
Test endpoint for Telegram bot kommandoer
```json
{
  "message": "Set Cheap Energy spotpris in NO1 to 15"
}
```

## 🎨 Styling og Design

### Fargepalett
- **Primær**: Blå (#2563eb)
- **Sekundær**: Grønn (#059669)
- **Aksent**: Lilla (#7c3aed)

### Komponenter
- Responsive design med Tailwind CSS
- Mobile-first tilnærming
- Tilgjengelighetsfokusert
- Smooth animasjoner og overganger

## 🚀 Deployment

### Vercel (Anbefalt)
1. Koble GitHub repository til Vercel
2. Konfigurer miljøvariabler i Vercel dashboard
3. Deploy automatisk ved push til main branch

### Andre plattformer
Prosjektet kan deployes på alle plattformer som støtter Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 📊 Analytics og Tracking

### Google Tag Manager
- Konfigurert for event tracking
- Konvertering tracking
- Brukeratferd analyse

### Miljøvariabler for GTM
```env
NEXT_PUBLIC_GTM_ID=GTM-N6Z4244M
```

## 🔒 Sikkerhet

### Implementerte sikkerhetstiltak
- Input validering
- XSS beskyttelse
- CSRF beskyttelse
- Rate limiting på API endpoints
- Sikker håndtering av miljøvariabler

## 🤝 Bidrag

1. Fork prosjektet
2. Opprett en feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit endringene (`git commit -m 'Add some AmazingFeature'`)
4. Push til branchen (`git push origin feature/AmazingFeature`)
5. Opprett en Pull Request

## 📄 Lisens

Dette prosjektet er lisensiert under MIT License - se [LICENSE](LICENSE) filen for detaljer.

## 📞 Kontakt

- **E-post**: info@stromsjef.no
- **Nettside**: https://stromsjef.no
- **Telegram**: @stromsjef_bot

## 🙏 Takk

Takk til alle som har bidratt til dette prosjektet og til de strømleverandørene som har samarbeidet med oss.

---

**Strømsjef.no** - Din guide til billigere strøm! ⚡
