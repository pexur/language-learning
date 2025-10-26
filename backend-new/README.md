# Language Learning Backend - Fly.io + Neon

Express.js backend with PostgreSQL (Neon) and Anthropic API for AI translations.

## Prerequisites

1. **Neon Account** (database) - https://neon.tech
2. **Anthropic API Key** - https://console.anthropic.com
3. **Fly.io Account** - https://fly.io

## Quick Start

### 1. Set up Neon Database

```bash
# Go to https://neon.tech and create a free account
# Create a new project
# Copy your connection string

# Run the schema
cd database
psql "your-neon-connection-string" -f schema.sql
```

### 2. Get Anthropic API Key

```bash
# Go to https://console.anthropic.com
# Create an API key
# Copy it for later
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment

```bash
cp .env.example .env
# Edit .env with your credentials
```

### 5. Test Locally

```bash
npm run dev
# Server runs on http://localhost:3000
```

### 6. Deploy to Fly.io

```bash
# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Login
fly auth login

# Launch app (follow prompts)
fly launch

# Set secrets
fly secrets set DATABASE_URL="your-neon-connection-string"
fly secrets set ANTHROPIC_API_KEY="your-anthropic-key"
fly secrets set JWT_SECRET="$(openssl rand -base64 32)"
fly secrets set FRONTEND_URL="https://your-frontend.vercel.app"

# Deploy
fly deploy

# Check status
fly status

# View logs
fly logs
```

## Environment Variables

Required:
- `DATABASE_URL` - Neon PostgreSQL connection string
- `ANTHROPIC_API_KEY` - Anthropic API key for Claude
- `JWT_SECRET` - Secret for JWT tokens (min 32 chars)
- `FRONTEND_URL` - Your frontend URL for CORS

Optional:
- `NODE_ENV` - Environment (production/development)
- `PORT` - Server port (default: 3000)

## API Endpoints

### Auth
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user (requires auth)

### Words
- `GET /words` - Get all words (requires auth)
- `POST /words` - Create word (requires auth)
- `DELETE /words/:id` - Delete word (requires auth)

### Phrases
- `GET /phrases` - Get all phrases (requires auth)
- `POST /phrases` - Create phrase (requires auth)
- `DELETE /phrases/:id` - Delete phrase (requires auth)

### Translation
- `POST /translate` - Translate word/phrase (requires auth)
  - Body: `{ "text": "hello", "type": "word" }`

## Fly.io Commands

```bash
# Deploy
fly deploy

# View logs
fly logs

# Check status
fly status

# Open in browser
fly open

# SSH into machine
fly ssh console

# Scale resources
fly scale vm shared-cpu-1x --memory 512

# Restart app
fly apps restart

# Delete app
fly apps destroy language-learning-api
```

## Cost Optimization

### Free Tier Limits
- **Neon**: 0.5 GB storage, 10 GB transfer/month
- **Fly.io**: 3 VMs (256MB), 160GB transfer/month
- **Anthropic**: Pay-as-you-go (~$3/1M input tokens)

### Tips
1. Fly.io auto-scales to zero when idle (saves money)
2. Use Neon's free tier (sufficient for small apps)
3. Monitor Anthropic usage in console

## Troubleshooting

### Database connection issues
```bash
# Test connection
psql "your-database-url"

# Verify schema
\dt
```

### Deployment issues
```bash
# View detailed logs
fly logs --app language-learning-api

# Check secrets
fly secrets list
```

### API errors
```bash
# Check Anthropic API key
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01"
```

## Migration from AWS

This backend replaces:
- AWS Lambda → Express.js on Fly.io
- DynamoDB → PostgreSQL on Neon
- AWS Bedrock → Anthropic API (direct)

Benefits:
- 60% cheaper ($5-10/month vs $20-50/month)
- Simpler architecture
- Better developer experience
- Easier local development
