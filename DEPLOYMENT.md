# 🚀 FakeMRR Deployment Guide

Complete guide to deploy FakeMRR to Vercel with Postgres database.

## Prerequisites

- Vercel account (free tier works!)
- GitHub account (optional, but recommended)

## Deployment Steps

### Option 1: Deploy via Vercel CLI (Recommended)

#### 1. Install Vercel CLI

```bash
npm i -g vercel
```

#### 2. Login to Vercel

```bash
vercel login
```

#### 3. Deploy from the project directory

```bash
cd /path/to/FakeMRR
vercel
```

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? Choose your account
- Link to existing project? **N**
- Project name? **fakemrr** (or your preferred name)
- Directory? **./`** (just press enter)
- Override settings? **N**

#### 4. Add Vercel Postgres

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your `fakemrr` project
3. Go to the **Storage** tab
4. Click **Create Database**
5. Select **Postgres**
6. Name it (e.g., `fakemrr-db`)
7. Click **Create**

#### 5. Set up the Database Schema

1. In Vercel dashboard, go to **Storage** → Your Postgres database
2. Click the **Query** tab
3. Copy and paste the contents of `schema.sql`
4. Click **Run Query**

This will:
- Create the `startups` table
- Add indexes for performance
- Insert all the hilarious sample data

#### 6. Redeploy

```bash
vercel --prod
```

Done! Your site is now live with a real database! 🎉

---

### Option 2: Deploy via GitHub

#### 1. Push to GitHub

```bash
cd /path/to/FakeMRR
git init
git add .
git commit -m "Initial commit: FakeMRR - Trust me bro"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/fakemrr.git
git push -u origin main
```

#### 2. Import to Vercel

1. Go to https://vercel.com/new
2. Click **Import Project**
3. Select your GitHub repository
4. Click **Deploy**

#### 3. Add Vercel Postgres

Same as Option 1, steps 4-5 above.

---

## Environment Variables

Vercel automatically sets these when you add Postgres:
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`
- `POSTGRES_USER`
- `POSTGRES_HOST`
- `POSTGRES_PASSWORD`
- `POSTGRES_DATABASE`

**You don't need to manually configure these!**

---

## Local Development

### 1. Install dependencies

```bash
npm install
```

### 2. Link to Vercel project

```bash
vercel link
```

### 3. Pull environment variables

```bash
vercel env pull .env.local
```

This downloads the Postgres credentials to your local `.env.local` file.

### 4. Run dev server

```bash
vercel dev
```

Open http://localhost:3000

---

## Testing the API

### Get all startups

```bash
curl https://your-project.vercel.app/api/startups
```

### Add a startup

```bash
curl -X POST https://your-project.vercel.app/api/startups \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "Test Startup",
    "founderName": "Test Founder",
    "twitter": "@test",
    "website": "https://test.com",
    "mrr": 10000,
    "totalRevenue": 500000,
    "growthRate": 100
  }'
```

---

## Custom Domain (Optional)

1. In Vercel dashboard, go to your project
2. Go to **Settings** → **Domains**
3. Add your custom domain
4. Follow the DNS configuration instructions

---

## Troubleshooting

### Database connection errors

1. Make sure you've created the Postgres database in Vercel
2. Verify environment variables are set (check Settings → Environment Variables)
3. Redeploy: `vercel --prod`

### API not working

1. Check function logs in Vercel dashboard → Deployments → Select deployment → Functions
2. Verify `schema.sql` was run successfully
3. Test the API endpoint directly in browser: `https://your-project.vercel.app/api/startups`

### Sample data not showing

1. Go to Vercel dashboard → Storage → Your database → Query tab
2. Run: `SELECT COUNT(*) FROM startups;`
3. If result is 0, re-run the `schema.sql` file

---

## Database Management

### View all data

In Vercel Postgres Query tab:

```sql
SELECT * FROM startups ORDER BY total_revenue DESC;
```

### Clear all data

```sql
DELETE FROM startups;
```

### Reset to sample data

Just re-run the `schema.sql` file!

---

## Cost

**Free tier includes:**
- 256 MB Postgres storage
- 60 hours compute/month
- 100 GB bandwidth

This is more than enough for FakeMRR unless you go viral! 😄

---

## Need Help?

- Vercel Docs: https://vercel.com/docs
- Vercel Postgres Docs: https://vercel.com/docs/storage/vercel-postgres

---

## 🎉 You're Done!

Your satirical revenue database is now live and ready to collect fake data from around the world!

Share the URL and watch the ridiculous startups roll in. 💸
