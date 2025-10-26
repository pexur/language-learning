#!/bin/bash
# Deploy to PROD environment (HKG - ap-east-1)
# Reads secrets from AWS Systems Manager Parameter Store

set -e

cd "$(dirname "$0")/.."

REGION="ap-east-1"
PREFIX="/language-learning/prod"

echo "🚀 Deploying to PROD (HKG - ap-east-1)..."
echo "⚠️  This will deploy to PRODUCTION!"
read -p "Continue? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled"
    exit 0
fi

echo "📦 Reading secrets from Parameter Store..."

# Function to get parameter
get_param() {
    local name=$1
    local default=${2:-""}
    aws ssm get-parameter \
        --name "$PREFIX/$name" \
        --region $REGION \
        --query 'Parameter.Value' \
        --output text 2>/dev/null || echo "$default"
}

# Get required parameters
JWT_SECRET=$(get_param "jwt-secret")
GOOGLE_AI_API_KEY=$(get_param "google-ai-api-key")
FRONTEND_URL=$(get_param "frontend-url")

# Check required parameters
if [ -z "$JWT_SECRET" ] || [ -z "$GOOGLE_AI_API_KEY" ]; then
    echo "❌ Error: Required secrets not found in Parameter Store!"
    echo ""
    echo "Run this first:"
    echo "  npm run setup-secrets:prod"
    exit 1
fi

# Get optional parameters
GOOGLE_CLIENT_ID=$(get_param "google-client-id")
GOOGLE_CLIENT_SECRET=$(get_param "google-client-secret")
WECHAT_APP_ID=$(get_param "wechat-app-id")
WECHAT_APP_SECRET=$(get_param "wechat-app-secret")

echo "✓ Secrets loaded"
echo ""

# Build parameter overrides, only including non-empty values
PARAMS="Stage=prod JwtSecret=${JWT_SECRET} GoogleAIApiKey=${GOOGLE_AI_API_KEY} FrontendUrl=${FRONTEND_URL}"

if [ -n "$GOOGLE_CLIENT_ID" ]; then
    PARAMS="${PARAMS} GoogleClientId=${GOOGLE_CLIENT_ID}"
fi

if [ -n "$GOOGLE_CLIENT_SECRET" ]; then
    PARAMS="${PARAMS} GoogleClientSecret=${GOOGLE_CLIENT_SECRET}"
fi

if [ -n "$WECHAT_APP_ID" ]; then
    PARAMS="${PARAMS} WechatAppId=${WECHAT_APP_ID}"
fi

if [ -n "$WECHAT_APP_SECRET" ]; then
    PARAMS="${PARAMS} WechatAppSecret=${WECHAT_APP_SECRET}"
fi

sam build

sam deploy \
  --config-file samconfig.toml \
  --parameter-overrides ${PARAMS}

echo ""
echo "✅ Production deployment complete!"
