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

```env
# Telegram Bot
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_WEBHOOK_URL=your_webhook_url
AUTHORIZED_USER_IDS=user_id1,user_id2

# Vercel KV (Redis)
KV_REST_API_URL=your_kv_url
KV_REST_API_TOKEN=your_kv_token
KV_REST_API_READ_ONLY_TOKEN=your_readonly_token
```

## API Endpoints

- `GET /api/plans` - Get all electricity plans
- `POST /api/telegram` - Telegram webhook handler
- `POST /api/telegram/test` - Test bot endpoint
- `POST /api/track-click` - Track button clicks

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
