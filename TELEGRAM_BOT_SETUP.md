# Telegram Bot Setup Guide

## Overview
This Telegram bot allows you to update electricity prices using natural language commands in English, Norwegian, and Swedish. The bot uses Vercel KV (Redis) for persistent storage.

## Setup Instructions

### 1. Create a Telegram Bot
1. Message [@BotFather](https://t.me/botfather) on Telegram
2. Send `/newbot` command
3. Follow the instructions to create your bot
4. Save the bot token you receive

### 2. Get Your User ID
1. Message [@userinfobot](https://t.me/userinfobot) on Telegram
2. It will reply with your user ID (a number like `123456789`)

### 3. Set Up Vercel KV Database (Required for Production)
1. Install Vercel CLI: `npm i -g vercel`
2. Login to Vercel: `vercel login`
3. Create KV database: `vercel kv create`
4. Link to your project: `vercel link`
5. Pull environment variables: `vercel env pull .env.local`

### 4. Configure Environment Variables
Create a `.env.local` file in your project root with:

```env
# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
TELEGRAM_ALLOWED_USERS=123456789,987654321

# Vercel KV Database (will be auto-populated by vercel env pull)
KV_URL=your_kv_url_here
KV_REST_API_URL=your_kv_rest_api_url_here
KV_REST_API_TOKEN=your_kv_rest_api_token_here
KV_REST_API_READ_ONLY_TOKEN=your_kv_read_only_token_here
```

### 5. Deploy to Vercel
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy: `vercel --prod`

### 6. Set Up Webhook
After deployment, set the webhook URL:
```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
     -H "Content-Type: application/json" \
     -d '{"url": "https://yourdomain.vercel.app/api/telegram"}'
```

### 7. Test the Bot
1. Start your development server: `npm run dev`
2. Test the bot functionality using the test endpoint:
```bash
curl -X POST http://localhost:3001/api/telegram/test \
     -H "Content-Type: application/json" \
     -d '{"message": "Set Kilden in NO1 to 0.59"}'
```
3. Or visit: `http://localhost:3001/bot-test`

## Usage Examples

### English
- `Set Kilden in NO1 to 0.59`
- `Update Cheap Energy in NO2 to 0.62`
- `Set Kilden in NO1 to 0.59 and Cheap to 0.62`

### Norwegian
- `Sett Kilden i NO1 til 0.59`
- `Oppdater Cheap Energy i NO2 til 0.62`
- `Sett Kilden Kraft i NO3 til 0.58`

### Swedish
- `Sätt Kilden i NO1 till 0.59`
- `Uppdatera Cheap Energy i NO2 till 0.62`
- `Sätt Kilden Kraft i NO3 till 0.58`

### Commands
- `/help` - Show help message
- `/prices` - Show current prices

## Supported Suppliers
- Kilden Kraft
- Cheap Energy Norge

## Supported Price Zones
- NO1 (Østlandet/Øst/East)
- NO2 (Sørlandet/Sør/South)
- NO3 (Midt-Norge/Midt/Central)
- NO4 (Nord-Norge/Nord/North)
- NO5 (Vestlandet/Vest/West)

## Database Features
- **Persistent Storage**: Prices are stored in Vercel KV (Redis)
- **Automatic Initialization**: Database is initialized with mock data on first use
- **Real-time Updates**: Changes made via Telegram bot are immediately reflected on the website
- **Fallback Support**: Falls back to external API if database is unavailable

## Security Features
- User authorization via `TELEGRAM_ALLOWED_USERS`
- Input validation for all commands
- Error handling and logging
- Secure webhook handling

## API Endpoints
- `POST /api/telegram` - Webhook endpoint for Telegram
- `GET /api/telegram` - Health check
- `POST /api/telegram/test` - Test endpoint for development
- `GET /api/telegram/test` - Test endpoint info
- `GET /api/plans` - Get current plans from database

## Troubleshooting
1. **Bot not responding**: Check if `TELEGRAM_BOT_TOKEN` is set correctly
2. **Unauthorized user**: Add your user ID to `TELEGRAM_ALLOWED_USERS`
3. **Webhook not working**: Ensure your server has HTTPS and the webhook URL is correct
4. **Price updates not working**: Check the console logs for validation errors
5. **Database errors**: Ensure Vercel KV is properly configured and environment variables are set
6. **Prices not persisting**: Check if Vercel KV is connected and working

## Development vs Production
- **Development**: Uses local environment variables and can work without KV
- **Production**: Requires Vercel KV for persistent storage
- **Testing**: Use `/bot-test` page or `/api/telegram/test` endpoint 