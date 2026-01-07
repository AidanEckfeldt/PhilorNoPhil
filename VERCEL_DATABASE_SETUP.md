# Setting Up Vercel Postgres Database

## Step 1: Create Vercel Postgres Database

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Click on **"Storage"** in the left sidebar
3. Click **"Create Database"**
4. Select **"Postgres"**
5. Fill in:
   - **Name**: `philornophil-db` (or any name you like)
   - **Region**: Choose closest to you (e.g., `Washington, D.C. (US East)`)
6. Click **"Create"**

## Step 2: Get Your Connection String

After creating the database:

1. Click on your database name in the Storage list
2. Go to the **".env.local"** tab (or look for "Connection string" section)
3. You'll see something like:
   ```
   POSTGRES_URL="postgres://default:xxxxx@xxxxx.xxxxx.vercel-storage.com:5432/verceldb"
   ```
4. **Copy this entire connection string** (including the quotes)

## Step 3: Add Environment Variable to Your Project

1. In Vercel dashboard, go to your project (click on "philor-no-phil" or your project name)
2. Click on **"Settings"** tab
3. Click on **"Environment Variables"** in the left sidebar
4. Click **"Add New"**
5. Fill in:
   - **Key**: `DATABASE_URL`
   - **Value**: Paste your connection string (the `POSTGRES_URL` value you copied)
   - **Environments**: Check all three:
     - ✅ Production
     - ✅ Preview  
     - ✅ Development
6. Click **"Save"**

## Step 4: Push Database Schema

You need to run Prisma migrations on your production database. You can do this locally:

1. In your terminal, run:
   ```bash
   DATABASE_URL="your-vercel-postgres-url" npx prisma db push
   ```
   (Replace with your actual connection string)

2. This will create all your tables in Vercel Postgres!

## Step 5: Redeploy

1. Go back to your Vercel project dashboard
2. Go to **"Deployments"** tab
3. Click the **"..."** menu on the latest deployment
4. Click **"Redeploy"**
5. Or just push a new commit to trigger auto-deploy

## Step 6: Verify It Works

1. Visit your deployed site (the `.vercel.app` URL)
2. The database errors should be gone
3. You should be able to create accounts and markets!

## Creating Your First Admin User

After the database is set up, create an admin user:

1. Sign up through your app (create an account)
2. Then run locally:
   ```bash
   DATABASE_URL="your-vercel-postgres-url" npx tsx scripts/make-admin.ts <username>
   ```

Or use Prisma Studio:
```bash
DATABASE_URL="your-vercel-postgres-url" npx prisma studio
```

Then manually set `isAdmin: true` for your user.

