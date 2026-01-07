# Deployment Guide for philornophil.com

This guide will help you deploy your Next.js app to production using Vercel (recommended) and connect your NameCheap domain.

## Prerequisites

1. ✅ Domain purchased: `philornophil.com` on NameCheap
2. ✅ Next.js app ready
3. ⚠️ Production PostgreSQL database needed

## Step 1: Set Up Production Database

You'll need a PostgreSQL database for production. Here are recommended options:

### Option A: Vercel Postgres (Easiest - integrates with Vercel)
1. Go to [Vercel](https://vercel.com) and sign up/login
2. Create a new project (we'll do this in Step 2)
3. In your project dashboard, go to "Storage" → "Create Database" → "Postgres"
4. Copy the connection string (you'll use this as `DATABASE_URL`)

### Option B: Supabase (Free tier available)
1. Go to [Supabase](https://supabase.com) and create an account
2. Create a new project
3. Go to Settings → Database
4. Copy the connection string (format: `postgresql://...`)

### Option C: Railway (Easy setup)
1. Go to [Railway](https://railway.app) and sign up
2. Create a new project → "Provision PostgreSQL"
3. Copy the connection string from the database service

### Option D: Neon (Serverless Postgres)
1. Go to [Neon](https://neon.tech) and sign up
2. Create a new project
3. Copy the connection string

**After setting up your database:**
```bash
# Update your production database schema
DATABASE_URL="your-production-connection-string" npx prisma db push
```

## Step 2: Deploy to Vercel

### 2.1 Push Your Code to GitHub

1. Create a new repository on GitHub (if you haven't already)
2. Push your code:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/philornophil.git
git push -u origin main
```

### 2.2 Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign up/login (use GitHub)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

5. **Add Environment Variables:**
   - Click "Environment Variables"
   - Add: `DATABASE_URL` = your production database connection string
   - Make sure it's set for "Production", "Preview", and "Development"

6. Click "Deploy"

Vercel will automatically:
- Install dependencies
- Build your app
- Deploy it
- Give you a URL like `philornophil.vercel.app`

## Step 3: Connect Your Domain (NameCheap)

### 3.1 Get DNS Records from Vercel

1. In your Vercel project dashboard, go to "Settings" → "Domains"
2. Click "Add Domain"
3. Enter: `philornophil.com` and `www.philornophil.com`
4. Vercel will show you DNS records you need to add

You'll typically see:
- **Type A**: `@` → `76.76.21.21` (or similar)
- **Type CNAME**: `www` → `cname.vercel-dns.com.` (or similar)

### 3.2 Configure DNS on NameCheap

1. Log into [NameCheap](https://www.namecheap.com)
2. Go to "Domain List" → Click "Manage" next to `philornophil.com`
3. Go to "Advanced DNS" tab
4. Add the DNS records Vercel provided:

   **For the root domain (@):**
   - Type: `A Record`
   - Host: `@`
   - Value: `76.76.21.21` (use the IP Vercel gives you)
   - TTL: Automatic

   **For www subdomain:**
   - Type: `CNAME Record`
   - Host: `www`
   - Value: `cname.vercel-dns.com.` (use what Vercel gives you)
   - TTL: Automatic

5. Remove any conflicting records (old A records, etc.)
6. Save changes

### 3.3 Wait for DNS Propagation

- DNS changes can take 24-48 hours, but usually work within 1-2 hours
- You can check status in Vercel dashboard under "Domains"
- Test with: `https://philornophil.com` and `https://www.philornophil.com`

## Step 4: SSL Certificate (Automatic)

Vercel automatically provides SSL certificates for your domain. Once DNS propagates, your site will be available at:
- ✅ `https://philornophil.com`
- ✅ `https://www.philornophil.com`

## Step 5: Post-Deployment Checklist

### Database Setup
```bash
# Run migrations on production database
DATABASE_URL="your-production-url" npx prisma db push

# Generate Prisma client
DATABASE_URL="your-production-url" npx prisma generate
```

### Create Admin User
You'll need to create an admin user in production. Options:

1. **Via Prisma Studio (local, pointing to production DB):**
```bash
DATABASE_URL="your-production-url" npx prisma studio
```

2. **Via script (if you have access):**
```bash
DATABASE_URL="your-production-url" npx tsx scripts/make-admin.ts <username>
```

### Environment Variables to Set in Vercel
- ✅ `DATABASE_URL` - Your production PostgreSQL connection string

## Troubleshooting

### Domain not working?
1. Check DNS propagation: [whatsmydns.net](https://www.whatsmydns.net)
2. Verify DNS records in NameCheap match Vercel's requirements
3. Wait up to 48 hours for full propagation

### Database connection errors?
1. Verify `DATABASE_URL` is set correctly in Vercel
2. Check if your database allows connections from Vercel's IPs
3. Some databases require IP whitelisting - check your provider's docs

### Build errors?
1. Check Vercel build logs
2. Ensure all dependencies are in `package.json`
3. Make sure Prisma generates correctly: add `postinstall` script:
```json
"scripts": {
  "postinstall": "prisma generate"
}
```

## Alternative Deployment Options

If you prefer not to use Vercel:

### Netlify
- Similar process to Vercel
- Good Next.js support
- Free tier available

### Railway
- Can host both app and database
- Simple deployment
- Good for full-stack apps

### AWS/GCP/Azure
- More complex setup
- Better for enterprise needs
- More control but more configuration

## Need Help?

- Vercel Docs: https://vercel.com/docs
- NameCheap DNS Setup: https://www.namecheap.com/support/knowledgebase/article.aspx/319/2237/
- Next.js Deployment: https://nextjs.org/docs/deployment

