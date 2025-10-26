# Database Setup

## Neon Postgres Setup

1. **Create Neon Account**
   - Go to https://neon.tech
   - Sign up for free account
   - Create a new project

2. **Get Connection String**
   - In your Neon project dashboard, click "Connection Details"
   - Copy the connection string
   - It looks like: `postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require`

3. **Run Schema**
   ```bash
   # Install psql if you don't have it
   # On macOS: brew install postgresql

   # Connect and run schema
   psql "your-connection-string-here" -f schema.sql
   ```

4. **Verify**
   ```bash
   # Connect to your database
   psql "your-connection-string-here"

   # List tables
   \dt

   # Should see: users, words, phrases
   ```

## Environment Variables

Add to your `.env`:
```
DATABASE_URL=postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require
```

## Alternative: Use Neon SQL Editor

1. In Neon dashboard, go to "SQL Editor"
2. Paste the contents of `schema.sql`
3. Click "Run" to execute
