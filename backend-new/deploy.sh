#!/bin/bash

# Language Learning App - Fly.io Deployment Script
# Run this after you've set up Neon database and got your API keys

set -e  # Exit on error

echo "🚀 Language Learning App - Fly.io Deployment"
echo "============================================"
echo ""

# Check if fly CLI is installed
if ! command -v fly &> /dev/null; then
    echo "❌ Fly CLI not found. Install it first:"
    echo "   curl -L https://fly.io/install.sh | sh"
    exit 1
fi

# Check if logged in
if ! fly auth whoami &> /dev/null; then
    echo "🔐 Please login to Fly.io..."
    fly auth login
fi

echo ""
echo "📝 We need some information to deploy your app"
echo ""

# Get environment variables
read -p "Enter your Neon DATABASE_URL: " DATABASE_URL
read -p "Enter your ANTHROPIC_API_KEY: " ANTHROPIC_API_KEY
read -p "Enter your FRONTEND_URL (or press Enter for default): " FRONTEND_URL

# Set defaults
FRONTEND_URL=${FRONTEND_URL:-"http://localhost:3000"}
APP_NAME=${APP_NAME:-"language-learning-api"}

echo ""
echo "🔨 Creating app on Fly.io..."

# Check if app already exists
if fly status &> /dev/null; then
    echo "✅ App already exists, skipping creation"
else
    echo "Creating new app..."
    fly launch --no-deploy --name "$APP_NAME" --region sjc || true
fi

echo ""
echo "🔐 Setting secrets..."

# Generate JWT secret
JWT_SECRET=$(openssl rand -base64 32)

# Set secrets
fly secrets set \
    DATABASE_URL="$DATABASE_URL" \
    ANTHROPIC_API_KEY="$ANTHROPIC_API_KEY" \
    JWT_SECRET="$JWT_SECRET" \
    FRONTEND_URL="$FRONTEND_URL" \
    NODE_ENV="production"

echo ""
echo "📦 Deploying application..."
fly deploy

echo ""
echo "✅ Deployment complete!"
echo ""
echo "Your API is now available at:"
fly status --json | grep hostname || echo "Run 'fly status' to see your URL"

echo ""
echo "🧪 Test your API:"
echo "   fly open /health"
echo ""
echo "📊 View logs:"
echo "   fly logs"
echo ""
echo "🎉 Next step: Deploy your frontend to Vercel!"
echo "   cd .. && vercel"
