# Strømsjef - Norwegian Electricity Plan Comparison

A Next.js application for comparing electricity plans in Norway, integrated with a Telegram bot for price updates and click tracking.

## Features

- **Electricity Plan Comparison**: Compare different electricity suppliers and plans
- **Telegram Bot Integration**: Update prices and track user interactions via Telegram
- **Real-time Price Updates**: Automatic price updates with manual override capabilities
- **Click Tracking**: Monitor user engagement with detailed statistics
- **Responsive Design**: Modern UI optimized for all devices

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Vercel KV (Upstash Redis)
- **Bot**: Telegram Bot API
- **Deployment**: Vercel
- **Performance**: Vercel Speed Insights

## Quick Start

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see `.env.example`)
4. Run development server: `npm run dev`
5. Deploy to Vercel: `vercel --prod`

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Admin Authentication (REQUIRED)
ADMIN_PASSWORD=your_secure_password_here

# Contacts API (REQUIRED for reading stored contact form submissions)
CONTACTS_API_TOKEN=your_long_random_token_here

# Telegram Bot
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_WEBHOOK_URL=your_webhook_url
AUTHORIZED_USER_IDS=user_id1,user_id2

# Vercel KV (Redis)
KV_REST_API_URL=your_kv_url
KV_REST_API_TOKEN=your_kv_token
KV_REST_API_READ_ONLY_TOKEN=your_readonly_token

# Google Tag Manager
GTM_ID=your_gtm_id_here
```

### Vercel Deployment

For production deployment on Vercel, add these environment variables in your Vercel dashboard:

1. Go to your project in Vercel
2. Navigate to Settings → Environment Variables
3. Add each variable from the list above
4. Make sure to set `ADMIN_PASSWORD` to a secure password
5. Set `CONTACTS_API_TOKEN` to a long random secret (used by the assistant to read contact submissions)

## API Endpoints

- `GET /api/plans` - Get all electricity plans
- `POST /api/telegram` - Telegram webhook handler
- `POST /api/telegram/test` - Test bot endpoint
- `POST /api/track-click` - Track button clicks
- `GET /api/contacts` - List stored contact form submissions (Bearer token; see below)
- `PATCH /api/contacts` - Update submission status (`new` or `handled`)

### Contacts API (authenticated)

Contact form posts still go to `POST /api/telegram/contact` (Telegram notification). Each submission is also stored in Vercel KV with status `new`.

All `/api/contacts` requests require:

```http
Authorization: Bearer <CONTACTS_API_TOKEN>
```

**List submissions** (newest first):

```bash
curl -s -H "Authorization: Bearer $CONTACTS_API_TOKEN" \
  "https://your-domain.vercel.app/api/contacts?limit=20"
```

Optional query params:

- `since` — ISO-8601 timestamp; only return submissions at or after this time
- `limit` — max items (default 50, max 200)

**Mark as handled:**

```bash
curl -s -X PATCH -H "Authorization: Bearer $CONTACTS_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"id":"<submission-uuid>","status":"handled"}' \
  "https://your-domain.vercel.app/api/contacts"
```

## Telegram Bot Commands

- `/start` - Initialize the bot
- `/help` - Show available commands
- `/update [supplier] [price] [zone] [type]` - Update electricity prices
- `/report clicks` - Get click statistics
- `/prices` - Show current prices

## Kontakt- och callback-skjema med Telegram-varsling

- Henvendelser fra hovedsidens kontaktskjema sendes til en fast Telegram-chat via botten.
- Sett miljøvariabelen `TELEGRAM_CONTACT_CHAT_IDS` til chat-IDene du vil motta varsler i (kommaseparert liste).
- Eksempel: `TELEGRAM_CONTACT_CHAT_IDS=123456789,987654321,555666777`
- Skjemaet støtter navn, e-post, telefon og (valgfritt) nyhetsbrev.
- Hvis noen meldinger feiler å sendes, returneres fortsatt suksess så lenge minst én melding ble sendt.
- Alle innsendinger lagres i Vercel KV og kan leses via `GET /api/contacts` med `CONTACTS_API_TOKEN`.

## Development

### Local Development
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Run Tests
```bash
npm test
```

## Deployment

The application is configured for deployment on Vercel with:
- Automatic builds from GitHub
- Vercel KV integration for data persistence
- Environment variable management
- Performance monitoring with Speed Insights

## Project Structure

```
src/
├── app/                 # Next.js app router pages
│   ├── api/            # API routes
│   ├── business/       # Business page
│   ├── faq/           # FAQ page
│   └── ...
├── components/         # React components
├── lib/               # Utility libraries
├── data/              # Mock data and types
└── types/             # TypeScript type definitions
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

---

**Note**: This project is actively maintained and deployed on Vercel with full CI/CD integration.

Test: This line was added to verify GitHub push and Vercel deployment.
