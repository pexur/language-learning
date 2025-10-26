# Backend Deployment Guide

Deploy to **dev** (PDX) and **prod** (HKG) using AWS Systems Manager Parameter Store for secure secrets.

## Quick Start

```bash
# 1. Setup secrets for dev
npm run setup-secrets:dev

# 2. Deploy to dev
npm run deploy:dev

# 3. When ready, setup prod secrets and deploy
npm run setup-secrets:prod
npm run deploy:prod
```

## Overview

- **Dev**: PDX (us-west-2) - Stack: `language-learning-api-dev`
- **Prod**: HKG (ap-east-1) - Stack: `language-learning-api-prod`

Each environment has separate:
- Lambda functions
- DynamoDB tables
- API Gateway endpoints
- Secrets in Parameter Store

## Prerequisites

1. AWS CLI configured with credentials
2. AWS SAM CLI installed
3. Permissions for: CloudFormation, Lambda, DynamoDB, API Gateway, SSM

## Setup Secrets (First Time)

### Dev Environment

```bash
npm run setup-secrets:dev
```

Prompts for:
- **JWT Secret** - Generate with: `openssl rand -base64 32`
- **Google AI API Key** - Your Gemini API key
- **Frontend URL** - Default: `http://localhost:3000`
- **OAuth** (optional) - Google/WeChat credentials

Stored at: `/language-learning/dev/*` in us-west-2

### Prod Environment

```bash
npm run setup-secrets:prod
```

Prompts for same values (use **different JWT secret**!)

Stored at: `/language-learning/prod/*` in ap-east-1

## Deployment

### Deploy to Dev

```bash
npm run deploy:dev
```

- Reads secrets from Parameter Store (us-west-2)
- Deploys to PDX
- No confirmation needed

### Deploy to Prod

```bash
npm run deploy:prod
```

- Reads secrets from Parameter Store (ap-east-1)
- Deploys to HKG
- **Requires confirmation** before deploying

## View Logs

```bash
# Dev logs
npm run logs:dev

# Prod logs
npm run logs:prod
```

## Update Secrets

Re-run setup to update any secret:

```bash
npm run setup-secrets:dev
# It will ask which secrets to update
```

## View Stored Secrets

```bash
# Dev (values hidden)
aws ssm get-parameters-by-path \
  --path /language-learning/dev \
  --region us-west-2

# Prod (values hidden)
aws ssm get-parameters-by-path \
  --path /language-learning/prod \
  --region ap-east-1
```

## Delete Stacks

```bash
# Delete dev
npm run delete:dev

# Delete prod (requires confirmation)
npm run delete:prod
```

Note: This does NOT delete secrets from Parameter Store. Delete manually if needed:

```bash
# Delete dev secrets
aws ssm delete-parameters-by-path \
  --path /language-learning/dev \
  --region us-west-2

# Delete prod secrets
aws ssm delete-parameters-by-path \
  --path /language-learning/prod \
  --region ap-east-1
```

## Why Parameter Store?

✅ **Secure** - Encrypted at rest
✅ **No files** - Secrets never stored locally
✅ **Free** - Standard parameters are free
✅ **Auditable** - CloudTrail logs access
✅ **Regional** - Secrets stay in the right region

## Deployment Workflow

1. **First time**: Setup secrets with `npm run setup-secrets:dev`
2. **Deploy**: `npm run deploy:dev`
3. **Test**: Frontend can connect to dev API
4. **Prod ready**: Setup prod secrets and deploy
5. **Updates**: Just run `npm run deploy:dev` - secrets are already stored

## Troubleshooting

### "Required secrets not found"

Run setup first:
```bash
npm run setup-secrets:dev
```

### "Access Denied" on Parameter Store

Ensure your AWS credentials have `ssm:GetParameter` and `ssm:PutParameter` permissions.

### CORS errors

Update frontend URL in Parameter Store:
```bash
npm run setup-secrets:dev
# Update only the Frontend URL
```

### Different secrets between environments

Make sure to:
- Use different JWT secrets for dev vs prod
- Run setup separately for each environment
- Check the correct region for each environment

## Cost

- **Parameter Store**: Free for standard parameters
- **Lambda**: Free tier covers most development
- **DynamoDB**: Pay-per-request, ~$0 for low traffic
- **API Gateway**: First 1M requests/month free

Expected cost for low-traffic app: **~$0-5/month**
