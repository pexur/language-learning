# Language Learning App

A modern, full-stack language learning application with AI-powered translations using Claude 3.7 Sonnet via AWS Bedrock.

## Features

- **AI-Powered Translations**: Translate words and phrases using Claude 3.7 Sonnet with contextual definitions and examples
- **Multi-Language Support**: Choose from 12 popular languages to learn
- **OAuth Authentication**: Sign in with Google or WeChat
- **Responsive Design**: Works seamlessly on desktop and mobile web
- **Cloud-Native**: Serverless architecture with AWS Lambda, API Gateway, and DynamoDB
- **Modern UI**: Beautiful, animated interface with dark mode support

## Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **React Context API** - State management

### Backend
- **AWS Lambda** - Serverless functions (Node.js 20.x)
- **API Gateway** - HTTP API endpoints
- **DynamoDB** - NoSQL database
- **AWS Bedrock** - Claude 3.7 Sonnet for AI translations
- **JWT** - Authentication tokens

## Project Structure

```
language-learning-app/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Main dashboard
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   └── auth/callback/     # OAuth callback handler
├── components/            # React components
│   ├── WordsTable.tsx    # Words management
│   └── PhrasesTable.tsx  # Phrases management
├── contexts/             # React contexts
│   └── AuthContext.tsx   # Authentication state
├── lib/                  # Utilities
│   ├── api.ts           # API client
│   └── languages.ts     # Language options
├── types/               # TypeScript types
└── backend/             # Serverless backend
    ├── src/
    │   ├── functions/   # Lambda handlers
    │   └── utils/       # Shared utilities
    ├── serverless.yml   # Infrastructure as Code
    └── README.md        # Backend documentation
```

## Getting Started

### Prerequisites

- Node.js 20.x or later
- AWS Account with Bedrock access
- Google OAuth credentials (optional)
- WeChat OAuth credentials (optional)

### 1. Clone and Install

```bash
git clone <your-repo>
cd language-learning-app
npm install
```

### 2. Deploy Backend

See [backend/README.md](backend/README.md) for detailed instructions.

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm run deploy
```

Note the API Gateway URL from the deployment output.

### 3. Configure Frontend

```bash
# In project root
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=https://your-api-gateway-url
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
NEXT_PUBLIC_WECHAT_APP_ID=your-wechat-app-id
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Development

### Frontend Development

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
```

### Backend Development

```bash
cd backend
npm run deploy       # Deploy to AWS
npm run remove       # Remove all AWS resources
npm run logs -- translate  # View function logs
```

## Authentication

### Email Registration

Users can register with email and select their target language during sign-up.

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create OAuth 2.0 Client ID
3. Add redirect URI: `https://your-api-gateway-url/auth/google/callback`
4. Add Client ID to `.env` files

### WeChat OAuth

1. Register at [WeChat Open Platform](https://open.weixin.qq.com/)
2. Create web application
3. Add callback URL: `https://your-api-gateway-url/auth/wechat/callback`
4. Add App ID to `.env` files

## Features Guide

### Words & Phrases

- **Add**: Type and press Enter or click Add
- **Translate**: Click translate button to get AI-powered translations
- **Delete**: Remove items you no longer need

### Translation

Words receive:
- Translation in target language
- 2-3 definitions with meanings
- Example sentences for each definition

Phrases receive:
- Contextual translation
- Usage notes

## Migration to Mobile

This app is built with React and designed to be easily migrated to React Native:

### For React Native Migration

1. **Shared Logic**: API client (`lib/api.ts`) can be reused
2. **UI Components**: Convert Tailwind classes to React Native StyleSheet
3. **Navigation**: Replace Next.js router with React Navigation
4. **Storage**: Replace localStorage with AsyncStorage

### For Native Apps (iOS/Android)

Consider using:
- **Expo** for rapid development
- **React Native CLI** for full native control
- **Capacitor** to wrap the existing web app

## Deployment

### Frontend (Vercel Recommended)

```bash
npm run build
# Deploy to Vercel, Netlify, or any hosting platform
```

### Backend

Already deployed via Serverless Framework to AWS.

## Environment Variables

### Frontend (.env.local)
- `NEXT_PUBLIC_API_URL` - Backend API endpoint
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` - Google OAuth client ID
- `NEXT_PUBLIC_WECHAT_APP_ID` - WeChat app ID

### Backend (backend/.env)
- `JWT_SECRET` - Secret for JWT tokens
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth secret
- `WECHAT_APP_ID` - WeChat app ID
- `WECHAT_APP_SECRET` - WeChat app secret
- `FRONTEND_URL` - Frontend URL for CORS

## Cost Estimates

### AWS Monthly Costs (1,000 users)

- **Lambda**: ~$2-5
- **API Gateway**: ~$3-5
- **DynamoDB**: ~$5-10
- **Bedrock (Claude 3.7 Sonnet)**: ~$10-30 (varies by usage)
- **Total**: ~$20-50/month

Free tier covers most development usage.

## Security

- JWT tokens expire after 7 days
- All endpoints use HTTPS
- DynamoDB data encrypted at rest
- IAM roles follow least privilege
- OAuth flows use secure redirects

## Troubleshooting

### "Unauthorized" errors
- Check if auth token is valid
- Verify API_URL is correct
- Ensure backend is deployed

### Translation failures
- Verify Bedrock model access is granted
- Check AWS region supports Claude 3.7 Sonnet
- Review CloudWatch logs for errors

### OAuth redirect issues
- Ensure redirect URIs match exactly in OAuth provider settings
- Check FRONTEND_URL environment variable

## Future Enhancements

- [ ] Spaced repetition flashcards
- [ ] Progress tracking and statistics
- [ ] Voice pronunciation
- [ ] Gamification and achievements
- [ ] Social features (share progress, compete)
- [ ] Offline mode
- [ ] Native mobile apps

## License

MIT

## Support

For issues or questions, please check:
- Backend logs: `cd backend && npm run logs -- <function-name>`
- CloudWatch logs in AWS Console
- GitHub Issues

---

Built with Claude 3.7 Sonnet, Next.js, and AWS Serverless
