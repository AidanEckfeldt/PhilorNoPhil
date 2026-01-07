# Fixing DATABASE_URL in Vercel

## The Problem:
The error says the URL must start with `postgresql://` or `postgres://`, which means Vercel isn't reading your environment variable correctly.

## Solution:

### Step 1: Check Environment Variable in Vercel

1. Go to your Vercel project dashboard
2. Click **"Settings"** → **"Environment Variables"**
3. Look for `DATABASE_URL`
4. Check:
   - ✅ Is it there?
   - ✅ Does it start with `postgres://`?
   - ✅ Is it set for all environments (Production, Preview, Development)?

### Step 2: Fix the Connection String Format

The connection string should be:
```
postgres://7483943cc14e0976f32b004e634872f860e3c331312d698dd8dd8304894ebf42:sk_fqfcznqtvH9hog1qFXFd9@db.prisma.io:5432/postgres?sslmode=require
```

**Important:** Make sure:
- No extra spaces
- No quotes around it in Vercel
- Starts with `postgres://`

### Step 3: If It's Missing or Wrong

1. If `DATABASE_URL` doesn't exist, click **"Add New"**
2. If it exists but is wrong, click the edit icon (pencil)
3. Set:
   - **Key**: `DATABASE_URL`
   - **Value**: `postgres://7483943cc14e0976f32b004e634872f860e3c331312d698dd8dd8304894ebf42:sk_fqfcznqtvH9hog1qFXFd9@db.prisma.io:5432/postgres?sslmode=require`
   - **Environments**: Check all three ✅
4. Click **"Save"**

### Step 4: Redeploy

After saving:
1. Go to **"Deployments"**
2. Click **"..."** on the latest deployment
3. Click **"Redeploy"**

**OR** just push a new commit to trigger auto-deploy.

## Alternative: Check Prisma Postgres Integration

Since you're using Prisma Postgres, Vercel might also provide a `POSTGRES_URL` or `PRISMA_DATABASE_URL`. Check if those exist and if Prisma is configured to use them.

