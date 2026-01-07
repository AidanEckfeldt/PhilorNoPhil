# Supabase Database Setup

## Step 1: Get Your Connection String

1. In your Supabase project dashboard, go to **Settings** (gear icon in the left sidebar)
2. Click on **Database** in the settings menu
3. Scroll down to **Connection string**
4. You'll see different connection string formats. You need the **URI** format
5. Look for the section that says "Connection string" and select the **URI** tab
6. Copy the connection string - it will look like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```
   OR
   ```
   postgresql://postgres.xxxxxxxxxxxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```

7. **Important**: Replace `[YOUR-PASSWORD]` with your actual database password (the one you set when creating the project)

## Step 2: Test the Connection Locally

1. Create a `.env.local` file in your project root (if you don't have one):
   ```bash
   touch .env.local
   ```

2. Add your connection string to `.env.local`:
   ```
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
   ```
   (Replace with your actual connection string and password)

3. Test the connection by running:
   ```bash
   npx prisma db push
   ```

   This will create all your tables in Supabase!

## Step 3: Verify Tables Were Created

1. In Supabase dashboard, go to **Table Editor** (left sidebar)
2. You should see these tables:
   - `User`
   - `Market`
   - `Trade`
   - `_prisma_migrations` (Prisma's internal table)

## Step 4: Create Your First Admin User

You can do this via Prisma Studio:

```bash
DATABASE_URL="your-connection-string" npx prisma studio
```

Then:
1. Open the `User` table
2. Click "Add record"
3. Create a user with:
   - `username`: your desired username
   - `password`: (leave empty or hash a password - you'll need to implement password hashing)
   - `balance`: 1000
   - `isAdmin`: true

**OR** use the script after you create a user:
```bash
DATABASE_URL="your-connection-string" npx tsx scripts/make-admin.ts <username>
```

## Next Steps

Once your database is set up:
1. ✅ You have your `DATABASE_URL` connection string
2. ✅ Your database schema is pushed to Supabase
3. ➡️ Ready to deploy to Vercel (see DEPLOYMENT.md Step 2)

