# Vercel Postgres Setup Guide

## Step 1: Create Vercel Account & Project

1. Go to [vercel.com](https://vercel.com) and sign up/login (use GitHub for easiest setup)
2. Once logged in, you'll be on your dashboard

## Step 2: Create a Vercel Postgres Database

1. In your Vercel dashboard, click on **"Storage"** in the left sidebar
2. Click **"Create Database"**
3. Select **"Postgres"**
4. Choose a name for your database (e.g., "philornophil-db")
5. Select a region (choose closest to you or your users)
6. Click **"Create"**

## Step 3: Get Your Connection String

After creating the database:

1. You'll see your database in the Storage section
2. Click on your database name
3. Go to the **".env.local"** tab (or **"Settings"** tab)
4. You'll see your connection string displayed - it will look like:
   ```
   POSTGRES_URL="postgres://default:xxxxx@xxxxx.xxxxx.vercel-storage.com:5432/verceldb"
   ```
5. **Copy this connection string** - you'll need it!

## Step 4: Set Up Your Database Schema

1. Open your terminal in your project directory
2. Create/update your `.env.local` file with the connection string:
   ```bash
   echo 'DATABASE_URL="your-vercel-postgres-url-here"' > .env.local
   ```
   (Replace with your actual connection string from Step 3)

3. Push your database schema:
   ```bash
   npx prisma db push
   ```

4. This will create all your tables in Vercel Postgres!

## Step 5: Verify Tables Were Created

1. In Vercel dashboard, go back to your Postgres database
2. Click on the **"Table Editor"** or **"Data"** tab
3. You should see your tables:
   - `User`
   - `Market`
   - `Trade`
   - `_prisma_migrations`

## Step 6: Create Your First Admin User

You can do this via Prisma Studio:

```bash
npx prisma studio
```

Then:
1. Open the `User` table
2. Click "Add record"
3. Create a user with:
   - `username`: your desired username
   - `password`: (you can leave empty for now, or hash a password)
   - `balance`: 1000
   - `isAdmin`: true

**OR** create a user via signup on your app, then make them admin:
```bash
DATABASE_URL="your-connection-string" npx tsx scripts/make-admin.ts <username>
```

## Next Steps

Once your database is set up:
1. ✅ You have your `POSTGRES_URL` connection string
2. ✅ Your database schema is pushed to Vercel Postgres
3. ➡️ Ready to deploy your app to Vercel (the database will automatically be connected!)

## Important Notes

- Vercel Postgres automatically provides environment variables to your Vercel projects
- When you deploy your app to Vercel, you can link the database and it will automatically add the connection string
- The connection string variable name might be `POSTGRES_URL` instead of `DATABASE_URL` - we'll handle this in the deployment step

