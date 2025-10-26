#!/bin/bash
# Deploy to DEV environment (PDX - us-west-2)
# Reads secrets from AWS Systems Manager Parameter Store

set -e

cd "$(dirname "$0")/.."

REGION="us-west-2"
PREFIX="/language-learning/dev"

echo "🚀 Deploying to DEV (PDX - us-west-2)..."
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
    echo "  npm run setup-secrets:dev"
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
PARAMS="Stage=dev JwtSecret=${JWT_SECRET} GoogleAIApiKey=${GOOGLE_AI_API_KEY} FrontendUrl=${FRONTEND_URL}"

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
  --config-file samconfig-dev.toml \
  --no-confirm-changeset \
  --parameter-overrides ${PARAMS}

echo ""
echo "✅ Dev deployment complete!"
