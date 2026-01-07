# Next Steps After Deployment

## ✅ What You've Done:
1. ✅ Deployed app to Vercel
2. ✅ Created Prisma Postgres database
3. ✅ Pushed database schema
4. ✅ Added DATABASE_URL environment variable
5. ✅ Redeployed

## 🧪 Test Your App:

1. **Visit your deployed URL:**
   - Go to your Vercel project dashboard
   - Click on your deployment
   - Visit the `.vercel.app` URL (e.g., `philor-no-phil.vercel.app`)

2. **Test the app:**
   - Try signing up for a new account
   - Create a market
   - Check if everything works!

## 👤 Create Your First Admin User:

After you sign up through the app, make yourself an admin:

```bash
DATABASE_URL="postgres://7483943cc14e0976f32b004e634872f860e3c331312d698dd8dd8304894ebf42:sk_fqfcznqtvH9hog1qFXFd9@db.prisma.io:5432/postgres?sslmode=require" npx tsx scripts/make-admin.ts YOUR_USERNAME
```

Replace `YOUR_USERNAME` with the username you signed up with.

## 🌐 Connect Your Domain (philornophil.com):

1. **In Vercel Dashboard:**
   - Go to your project → "Settings" → "Domains"
   - Click "Add Domain"
   - Enter: `philornophil.com` and `www.philornophil.com`
   - Vercel will show you DNS records to add

2. **In NameCheap:**
   - Log into NameCheap
   - Go to "Domain List" → Manage `philornophil.com`
   - Go to "Advanced DNS"
   - Add the DNS records Vercel provides:
     - Type A: `@` → IP address (Vercel will show this)
     - Type CNAME: `www` → `cname.vercel-dns.com.` (or what Vercel shows)

3. **Wait for DNS propagation:**
   - Usually takes 1-24 hours
   - Can check status in Vercel dashboard

## 🎉 You're Done!

Once DNS propagates, your site will be live at:
- ✅ `https://philornophil.com`
- ✅ `https://www.philornophil.com`

SSL certificate is automatically provided by Vercel!

