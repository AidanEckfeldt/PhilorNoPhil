# Self-Hosting Guide - Running from Your Laptop

## Is It Possible? Yes, but...

You can run the server from your laptop and point your domain to it, but there are some challenges:

### Challenges:
1. **Dynamic IP Address**: Most home internet IPs change periodically
2. **24/7 Uptime**: Your laptop needs to stay on and connected
3. **Port Forwarding**: Need to configure your router
4. **SSL Certificate**: Need HTTPS for security
5. **Security**: Exposing your home network
6. **ISP Restrictions**: Some ISPs block port 80/443

## Option 1: Direct from Laptop (More Complex)

### What You Need:
1. **Static IP or Dynamic DNS**
   - Most home IPs are dynamic (change)
   - Options:
     - **No-IP** (free dynamic DNS): https://www.noip.com
     - **DuckDNS** (free): https://www.duckdns.org
     - **Ask ISP for static IP** (usually costs extra)

2. **Port Forwarding**
   - Configure router to forward port 80/443 to your laptop
   - Access router admin (usually 192.168.1.1)
   - Forward external port 80 → your laptop's local IP:3000

3. **Local PostgreSQL Database**
   - Install PostgreSQL on your laptop
   - Or use Docker: `docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=password postgres`

4. **SSL Certificate** (for HTTPS)
   - Use Let's Encrypt (free)
   - Or use Cloudflare (free SSL proxy)

5. **Keep Server Running**
   - Use `pm2` or similar to keep it running
   - Or just run `npm run start` in a terminal

### Setup Steps:

1. **Install PostgreSQL locally:**
   ```bash
   # macOS
   brew install postgresql
   brew services start postgresql
   
   # Or use Docker
   docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=password -e POSTGRES_DB=philornophil postgres
   ```

2. **Set up your .env:**
   ```
   DATABASE_URL="postgresql://postgres:password@localhost:5432/philornophil"
   ```

3. **Push database schema:**
   ```bash
   npx prisma db push
   ```

4. **Build and start server:**
   ```bash
   npm run build
   npm run start
   ```

5. **Set up Dynamic DNS** (if needed):
   - Sign up for No-IP or DuckDNS
   - Install their update client on your laptop
   - Get a subdomain like `philornophil.ddns.net`

6. **Configure NameCheap DNS:**
   - Point `philornophil.com` to your dynamic DNS hostname
   - Or point directly to your IP (if static)

7. **Port Forwarding:**
   - Router admin → Port Forwarding
   - External Port: 80 → Internal IP:3000
   - External Port: 443 → Internal IP:3000 (for HTTPS)

## Option 2: VPS (Recommended - Still Self-Hosted)

A VPS (Virtual Private Server) is still self-hosted but more reliable:

### Providers:
- **DigitalOcean**: $6/month (1GB RAM)
- **Linode**: $5/month
- **Vultr**: $6/month
- **Hetzner**: €4/month

### Advantages:
- ✅ Static IP address
- ✅ 99.9% uptime
- ✅ Better security
- ✅ Can turn off laptop
- ✅ Easy SSL setup
- ✅ More professional

### Setup on VPS:
1. Rent a VPS
2. SSH into it
3. Install Node.js, PostgreSQL
4. Clone your GitHub repo
5. Set up environment variables
6. Run your app
7. Point domain to VPS IP

## Option 3: Hybrid Approach

- **Database**: Run PostgreSQL locally or on a small VPS
- **App**: Deploy to Vercel (free, easy)
- **Domain**: Point to Vercel

This gives you:
- ✅ Free hosting (Vercel)
- ✅ Easy deployment
- ✅ Your own domain
- ⚠️ Database on Vercel (or you can use external DB)

## My Recommendation

**For learning/development**: Run locally, use ngrok for testing
**For production**: Use a VPS ($5-6/month) - still self-hosted but reliable
**For easiest setup**: Use Vercel (free) with your domain

## Quick Start: Local Development

If you just want to run it locally for now:

```bash
# 1. Install PostgreSQL (macOS)
brew install postgresql
brew services start postgresql

# 2. Create database
createdb philornophil

# 3. Update .env
DATABASE_URL="postgresql://$(whoami)@localhost:5432/philornophil"

# 4. Push schema
npx prisma db push

# 5. Run server
npm run dev
```

Then access at `http://localhost:3000`

## Which Do You Prefer?

1. **Local laptop** (free, but complex setup)
2. **VPS** ($5-6/month, reliable, still self-hosted)
3. **Continue with Vercel** (free, easiest)

Let me know what you'd like to do!

