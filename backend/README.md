# Language Learning App - Backend

Serverless backend built with AWS SAM, Lambda, API Gateway, DynamoDB, and Google Gemini.

## Architecture

- **API Gateway**: HTTP API for RESTful endpoints
- **Lambda Functions**: Serverless compute for business logic
- **DynamoDB**: NoSQL database for users, words, and phrases
- **Google Gemini**: AI-powered translations (gemini-2.5-flash-lite)
- **IAM Roles**: Secure access control for Lambda functions

## Prerequisites

- Node.js 20.x or later
- AWS Account with Hong Kong region enabled
- AWS CLI configured with credentials
- AWS SAM CLI: `brew install aws-sam-cli`
- Docker Desktop (for local testing)

## Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Enable Hong Kong Region

Before deploying to Hong Kong (ap-east-1):

1. Go to AWS Console → Account Settings
2. Enable "Asia Pacific (Hong Kong)" region
3. Wait ~5 minutes for activation

### 3. Configure Environment Variables

The `env.json` file is already created for local testing. For deployment, you'll provide parameters during the deployment process.

## Local Development

```bash
# Build the SAM application
npm run build

# Start local API with Docker (no Java needed!)
npm run local

# API will be available at http://localhost:3000
```

Local testing uses Docker containers to run Lambda functions, so you don't need Java installed.

## Deployment

### First Time Deployment

```bash
npm run deploy
```

You'll be prompted to enter:
- **Stack name**: `language-learning-api`
- **AWS Region**: `ap-east-1` (Hong Kong)
- **Parameters**:
  - `JwtSecret`: Your JWT secret from .env
  - `GoogleAIApiKey`: Your Google AI API key from .env
  - `FrontendUrl`: `https://language-learning-app-murex.vercel.app`
  - Other OAuth parameters (can be empty if not using)

SAM will create a `samconfig.toml` file to save these settings.

### Subsequent Deployments

```bash
# Quick deploy using saved config
npm run deploy:fast
```

### Get API Endpoint

After deployment, SAM will output:
```
Outputs:
  ApiEndpoint: https://xxxxxxxx.execute-api.ap-east-1.amazonaws.com/dev
```

Update your frontend environment variables with this endpoint.

## API Endpoints

### Authentication

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login with email
- `GET /auth/me` - Get current user (requires token)
- `GET /auth/google/callback` - Google OAuth callback
- `GET /auth/wechat/callback` - WeChat OAuth callback

### Translation

- `POST /translate` - Translate word or phrase (requires token)
  ```json
  {
    "text": "hello",
    "type": "word"  // or "phrase"
  }
  ```

### Words

- `GET /words` - Get all words for user (requires token)
- `POST /words` - Create new word (requires token)
- `DELETE /words/{id}` - Delete word (requires token)

### Phrases

- `GET /phrases` - Get all phrases for user (requires token)
- `POST /phrases` - Create new phrase (requires token)
- `DELETE /phrases/{id}` - Delete phrase (requires token)

## DynamoDB Tables

### UsersTable
- **Partition Key**: `userId`
- **GSI**: `EmailIndex` (email)
- **Attributes**: userId, email, name, targetLanguage, provider, providerId, createdAt

### WordsTable
- **Partition Key**: `userId`
- **Sort Key**: `wordId`
- **GSI**: `UserCreatedAtIndex` (userId, createdAt)
- **Attributes**: userId, wordId, text, translation, definitions, createdAt

### PhrasesTable
- **Partition Key**: `userId`
- **Sort Key**: `phraseId`
- **GSI**: `UserCreatedAtIndex` (userId, createdAt)
- **Attributes**: userId, phraseId, text, translation, createdAt

### ConjugationsTable
- **Partition Key**: `verb`
- **GSI**: `CreatedAtIndex` (createdAt)
- **Attributes**: verb, conjugationData, createdAt

### ExercisesTable
- **Partition Key**: `userId`
- **Sort Key**: `exerciseId`
- **GSI**: `UserCreatedAtIndex` (userId, createdAt)
- **Attributes**: userId, exerciseId, exerciseData, createdAt

## IAM Permissions

Lambda execution role has permissions for:
- DynamoDB: Query, Scan, GetItem, PutItem, UpdateItem, DeleteItem
- Bedrock: InvokeModel (Claude 3.7 Sonnet only)

## Local Development

```bash
npm install -g serverless-offline
serverless offline
```

API will run at `http://localhost:3000`

## Monitoring

View Lambda logs:
```bash
npm run logs -- <function-name>

# Example:
npm run logs -- translate
```

## Costs

Estimated costs (US East):

- **Lambda**: ~$0.20 per million requests
- **DynamoDB**: On-demand pricing, ~$1.25 per million writes
- **API Gateway**: $1.00 per million requests
- **Bedrock (Claude 3.7 Sonnet)**:
  - Input: ~$3.00 per million tokens
  - Output: ~$15.00 per million tokens
  - Typical translation: ~200 tokens = $0.003

**Monthly estimate for 1,000 users**: $20-50

## Troubleshooting

### Bedrock Access Denied

Ensure you've requested model access in the Bedrock console.

### OAuth Redirect Issues

Verify redirect URIs match exactly in Google/WeChat console and your code.

### CORS Errors

Check `FRONTEND_URL` matches your frontend domain exactly.

## Security

- JWT tokens expire after 7 days
- All API endpoints use HTTPS
- Sensitive data encrypted at rest (DynamoDB)
- IAM roles follow least privilege principle

## Support

For issues, check CloudWatch logs or contact support.
