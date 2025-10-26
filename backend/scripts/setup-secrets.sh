#!/bin/bash
# Setup secrets in AWS Systems Manager Parameter Store
# Much safer than storing in JSON files!

set -e

ENV=$1

if [ "$ENV" != "dev" ] && [ "$ENV" != "prod" ]; then
    echo "Usage: npm run setup-secrets:dev  OR  npm run setup-secrets:prod"
    echo ""
    echo "This stores secrets securely in AWS Parameter Store"
    exit 1
fi

# Set region based on environment
if [ "$ENV" = "dev" ]; then
    REGION="us-west-2"
    echo "🔧 Setting up DEV secrets in PDX (us-west-2)"
else
    REGION="ap-east-1"
    echo "🔧 Setting up PROD secrets in HKG (ap-east-1)"
fi

PREFIX="/language-learning/$ENV"

echo ""
echo "This will securely store your secrets in AWS Parameter Store."
echo "Prefix: $PREFIX"
echo "Region: $REGION"
echo ""

# Function to set parameter
set_parameter() {
    local name=$1
    local description=$2
    local param_type=${3:-SecureString}

    local current_value=$(aws ssm get-parameter --name "$PREFIX/$name" --region $REGION --query 'Parameter.Value' --output text 2>/dev/null || echo "")

    if [ -n "$current_value" ]; then
        echo "✓ $name already exists"
        read -p "  Update it? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            return
        fi
    fi

    if [ "$param_type" = "SecureString" ]; then
        read -sp "Enter $description: " value
        echo
    else
        read -p "Enter $description: " value
    fi

    if [ -z "$value" ]; then
        echo "  Skipped (empty)"
        return
    fi

    echo "  Storing to: $PREFIX/$name"

    aws ssm put-parameter \
        --name "$PREFIX/$name" \
        --value "${value}" \
        --type "$param_type" \
        --region "$REGION" \
        --overwrite \
        --description "$description for $ENV"

    if [ $? -eq 0 ]; then
        echo "  ✅ Stored securely"
    else
        echo "  ❌ Failed to store"
        return 1
    fi
}

echo "=== Required Secrets ==="
echo ""

set_parameter "jwt-secret" "JWT Secret (run: openssl rand -base64 32)" "SecureString"
set_parameter "google-ai-api-key" "Google AI API Key" "SecureString"

echo ""
echo "=== Configuration ==="
echo ""

if [ "$ENV" = "dev" ]; then
    FRONTEND_URL="http://localhost:3000"
else
    FRONTEND_URL="https://your-app.vercel.app"
fi

echo "Setting Frontend URL to: $FRONTEND_URL"

aws ssm put-parameter \
    --name "$PREFIX/frontend-url" \
    --value "$FRONTEND_URL" \
    --type "String" \
    --region "$REGION" \
    --overwrite \
    --description "Frontend URL for $ENV"

if [ $? -eq 0 ]; then
    echo "✅ Frontend URL stored successfully"
else
    echo "❌ Failed to store frontend URL"
    exit 1
fi

echo ""
echo "=== Optional OAuth Secrets ==="
echo ""

read -p "Configure Google OAuth? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    set_parameter "google-client-id" "Google OAuth Client ID" "String"
    set_parameter "google-client-secret" "Google OAuth Client Secret" "SecureString"
fi

read -p "Configure WeChat OAuth? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    set_parameter "wechat-app-id" "WeChat App ID" "String"
    set_parameter "wechat-app-secret" "WeChat App Secret" "SecureString"
fi

echo ""
echo "🎉 Secrets configured for $ENV!"
echo ""
echo "View your parameters:"
echo "  aws ssm get-parameters-by-path --path $PREFIX --region $REGION"
echo ""
echo "Deploy:"
echo "  npm run deploy:$ENV"
echo ""
