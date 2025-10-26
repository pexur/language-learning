# 🚀 Deployment Guide - Option A (Fly.io + Neon + Vercel)

Complete step-by-step guide to deploy your Language Learning App using the cheapest stack.

**Total Cost: $5-10/month**

## 📋 Prerequisites

Before starting, sign up for these free accounts:
1. [Neon](https://neon.tech) - PostgreSQL database
2. [Anthropic](https://console.anthropic.com) - AI API
3. [Fly.io](https://fly.io) - Backend hosting
4. [Vercel](https://vercel.com) - Frontend hosting

---

## Part 1: Set Up Database (Neon) - 5 minutes

### Step 1.1: Create Neon Database

```bash
# 1. Go to https://neon.tech
# 2. Sign up with GitHub/Google
# 3. Click "New Project"
# 4. Name: "language-learning"
# 5. Region: Choose closest to you
# 6. Click "Create Project"
```

### Step 1.2: Get Connection String

```bash
# In Neon dashboard:
# 1. Click "Connection Details"
# 2. Copy the connection string (looks like):
#    postgresql://username:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
# 3. Save it somewhere safe
```

### Step 1.3: Run Database Schema

**Option A: Using Neon SQL Editor (Easiest)**
```bash
# 1. In Neon dashboard, click "SQL Editor"
# 2. Copy contents of backend/database/schema.sql
# 3. Paste into SQL Editor
# 4. Click "Run"
# 5. Verify tables created (should see: users, words, phrases)
```

**Option B: Using psql (if you have it installed)**
```bash
cd backend-new
psql "your-connection-string-here" -f database/schema.sql
```

✅ **Checkpoint**: You should see 3 tables created: `users`, `words`, `phrases`

---

## Part 2: Get Anthropic API Key - 2 minutes

### Step 2.1: Create API Key

```bash
# 1. Go to https://console.anthropic.com
# 2. Sign in or create account
# 3. Click "API Keys" in sidebar
# 4. Click "Create Key"
# 5. Name it: "language-learning-app"
# 6. Copy the key (starts with sk-ant-...)
# 7. Save it somewhere safe (you can't see it again!)
```

### Step 2.2: Add Credits (Optional)

```bash
# Anthropic requires a small credit balance
# Add $5-10 to start (will last months for small usage)
# Go to "Billing" → "Add Credits"
```

✅ **Checkpoint**: You have an API key saved securely

---

## Part 3: Deploy Backend to Fly.io - 10 minutes

### Step 3.1: Install Fly CLI

**macOS/Linux:**
```bash
curl -L https://fly.io/install.sh | sh
```

**Windows (PowerShell):**
```powershell
iwr https://fly.io/install.ps1 -useb | iex
```

### Step 3.2: Login to Fly.io

```bash
fly auth login
# Opens browser for authentication
```

### Step 3.3: Launch App

```bash
cd backend-new

# Launch (will create fly.toml and configure)
fly launch

# Follow prompts:
# - App name: language-learning-api (or choose your own)
# - Region: Choose closest to you
# - Database: No (we're using Neon)
# - Deploy now: No (we need to set secrets first)
```

### Step 3.4: Set Environment Variables

```bash
# Set your Neon database URL
fly secrets set DATABASE_URL="postgresql://username:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require"

# Set Anthropic API key
fly secrets set ANTHROPIC_API_KEY="sk-ant-xxxxx"

# Generate and set JWT secret
fly secrets set JWT_SECRET="$(openssl rand -base64 32)"

# Set frontend URL (we'll update this after deploying frontend)
fly secrets set FRONTEND_URL="https://language-learning.vercel.app"
# Replace with your actual Vercel URL

# Set Node environment
fly secrets set NODE_ENV="production"
```

### Step 3.5: Deploy

```bash
fly deploy

# Wait 2-3 minutes for deployment
# You'll see build logs and deployment progress
```

### Step 3.6: Verify Deployment

```bash
# Check status
fly status

# View logs
fly logs

# Test health endpoint
fly open
# Should open browser to your API
# Add /health to URL: https://language-learning-api.fly.dev/health
# Should show: {"status":"healthy"}
```

✅ **Checkpoint**: Your backend is live! Save the URL: `https://your-app-name.fly.dev`

---

## Part 4: Deploy Frontend to Vercel - 5 minutes

### Step 4.1: Install Vercel CLI (Optional)

```bash
npm install -g vercel
```

### Step 4.2: Deploy via Vercel Dashboard (Easiest)

```bash
# 1. Go to https://vercel.com
# 2. Sign up/login with GitHub
# 3. Click "Add New" → "Project"
# 4. Import your Git repository
# 5. Vercel auto-detects Next.js settings
# 6. Add environment variables:

Environment Variables:
- NEXT_PUBLIC_API_URL = https://your-app-name.fly.dev
- NEXT_PUBLIC_GOOGLE_CLIENT_ID = (optional, for OAuth)
- NEXT_PUBLIC_WECHAT_APP_ID = (optional, for OAuth)

# 7. Click "Deploy"
# 8. Wait 2-3 minutes
```

**OR via CLI:**

```bash
cd /Users/pexur/workplace/LanguageLearning/language-learning-app

# Login
vercel login

# Deploy
vercel

# Follow prompts, add env vars when asked
```

### Step 4.3: Update Backend CORS

```bash
# Now that you have your Vercel URL, update backend
cd backend-new

# Update FRONTEND_URL with your actual Vercel deployment URL
fly secrets set FRONTEND_URL="https://your-app.vercel.app"
```

### Step 4.4: Test Your App

```bash
# Open your Vercel URL
https://your-app.vercel.app

# Try:
# 1. Register a new account
# 2. Add a word
# 3. Translate it
# 4. Verify it works!
```

✅ **Checkpoint**: Your app is fully deployed and working!

---

## Part 5: Post-Deployment Setup

### Update README.md

Update the main README.md with your live URLs:

```markdown
## Live Demo

- Frontend: https://your-app.vercel.app
- Backend API: https://your-app-name.fly.dev
```

### Set Up Domain (Optional)

**For Frontend (Vercel):**
```bash
# In Vercel dashboard:
# 1. Go to project settings
# 2. Click "Domains"
# 3. Add your custom domain
# 4. Follow DNS instructions
```

**For Backend (Fly.io):**
```bash
fly certs create your-api-domain.com
# Follow instructions to add DNS records
```

---

## 📊 Cost Breakdown

### Monthly Costs (Low Traffic)

| Service | Free Tier | After Free Tier |
|---------|-----------|-----------------|
| Neon | 0.5GB storage | $19/month for 10GB |
| Fly.io | 3 VMs @ 256MB | $1.94/VM/month |
| Anthropic | Pay-as-you-go | ~$3-5/month (moderate use) |
| Vercel | 100GB bandwidth | $20/month (Pro) |
| **Total** | **~$0-5/month** | **~$10-15/month** |

### Tips to Stay in Free Tier

1. **Fly.io**: Auto-scales to zero when idle (already configured)
2. **Neon**: Use branching instead of multiple databases
3. **Anthropic**: Cache translations in database to reduce API calls
4. **Vercel**: Free tier is generous, should cover most small apps

---

## 🔧 Common Commands

### Backend (Fly.io)

```bash
# View logs
fly logs

# SSH into machine
fly ssh console

# Restart app
fly apps restart

# Scale resources (if needed)
fly scale memory 512  # Increase to 512MB

# Check status
fly status

# Deploy updates
fly deploy
```

### Frontend (Vercel)

```bash
# Redeploy
vercel --prod

# View logs
vercel logs

# List deployments
vercel ls
```

### Database (Neon)

```bash
# Connect to database
psql "your-connection-string"

# List tables
\dt

# View data
SELECT * FROM users LIMIT 5;
```

---

## 🐛 Troubleshooting

### Backend not connecting to database

```bash
# Test connection
fly ssh console
node -e "const pg = require('pg'); const pool = new pg.Pool({connectionString: process.env.DATABASE_URL}); pool.query('SELECT NOW()', (err, res) => {console.log(err, res); pool.end();})"
```

### CORS errors

```bash
# Verify FRONTEND_URL is set correctly
fly secrets list

# Should show your Vercel URL
# If not, update it:
fly secrets set FRONTEND_URL="https://your-correct-url.vercel.app"
```

### Anthropic API errors

```bash
# Check if API key is valid
fly ssh console
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{"model":"claude-3-5-sonnet-20241022","max_tokens":10,"messages":[{"role":"user","content":"Hi"}]}'
```

### Deployment fails

```bash
# View detailed logs
fly logs --app language-learning-api

# Check Dockerfile builds locally
cd backend-new
docker build -t test .
docker run -p 3000:3000 test
```

---

## 🎉 Success Checklist

- [ ] Neon database created and schema applied
- [ ] Anthropic API key obtained and working
- [ ] Backend deployed to Fly.io and accessible
- [ ] Frontend deployed to Vercel
- [ ] Environment variables configured correctly
- [ ] CORS working (frontend can call backend)
- [ ] Can register user
- [ ] Can translate words
- [ ] Can save and retrieve words/phrases

---

## 📚 Next Steps

1. **Set up monitoring**: Add error tracking (Sentry)
2. **Analytics**: Add PostHog or Plausible
3. **Backups**: Enable Neon automatic backups
4. **CI/CD**: Set up GitHub Actions for auto-deploy
5. **Custom domain**: Add your own domain
6. **Mobile app**: Migrate to React Native

---

## 🆘 Getting Help

- **Fly.io**: https://community.fly.io
- **Neon**: https://neon.tech/docs
- **Vercel**: https://vercel.com/docs
- **Anthropic**: https://docs.anthropic.com

Need help? Create an issue in your GitHub repository!
