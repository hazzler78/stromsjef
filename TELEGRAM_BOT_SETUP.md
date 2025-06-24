# Telegram Bot Setup Guide

## Overview
This Telegram bot allows you to update electricity prices using natural language commands in English, Norwegian, and Swedish.

## Setup Instructions

### 1. Create a Telegram Bot
1. Message [@BotFather](https://t.me/botfather) on Telegram
2. Send `/newbot` command
3. Follow the instructions to create your bot
4. Save the bot token you receive

### 2. Configure Environment Variables
Create a `.env.local` file in your project root with:

```env
# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
TELEGRAM_ALLOWED_USERS=123456789,987654321
```

Replace:
- `your_telegram_bot_token_here` with your actual bot token
- `123456789,987654321` with the Telegram user IDs of authorized users (comma-separated)

### 3. Get Your User ID
1. Message [@userinfobot](https://t.me/userinfobot) on Telegram
2. It will reply with your user ID
3. Add this ID to `TELEGRAM_ALLOWED_USERS`

### 4. Set Up Webhook (Recommended for Production)
1. Deploy your application to a server with HTTPS
2. Set the webhook URL:
```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
     -H "Content-Type: application/json" \
     -d '{"url": "https://yourdomain.com/api/telegram"}'
```

### 5. Test the Bot
1. Start your development server: `npm run dev`
2. Test the bot functionality using the test endpoint:
```bash
curl -X POST http://localhost:3000/api/telegram/test \
     -H "Content-Type: application/json" \
     -d '{"message": "Set Kilden in NO1 to 0.59"}'
```

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

## Security Features
- User authorization via `TELEGRAM_ALLOWED_USERS`
- Input validation for all commands
- Error handling and logging

## API Endpoints
- `POST /api/telegram` - Webhook endpoint for Telegram
- `GET /api/telegram` - Health check
- `POST /api/telegram/test` - Test endpoint for development
- `GET /api/telegram/test` - Test endpoint info

## Troubleshooting
1. **Bot not responding**: Check if `TELEGRAM_BOT_TOKEN` is set correctly
2. **Unauthorized user**: Add your user ID to `TELEGRAM_ALLOWED_USERS`
3. **Webhook not working**: Ensure your server has HTTPS and the webhook URL is correct
4. **Price updates not working**: Check the console logs for validation errors 