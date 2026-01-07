# Push to GitHub - Quick Commands

After creating the repository on GitHub, run these commands:

```bash
git remote add origin https://github.com/YOUR-USERNAME/philornophil.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your actual GitHub username.

## If you need to authenticate:

GitHub may ask for authentication. You can:
1. Use a Personal Access Token (recommended)
2. Or use GitHub CLI if you have it installed

## After pushing:

Once your code is on GitHub, you can:
1. Deploy to Vercel (it will automatically detect your Next.js app)
2. Connect your Vercel Postgres database
3. Add your domain philornophil.com

