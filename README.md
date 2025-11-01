# 💸 FakeMRR - Trust Me Bro™

A satirical parody of startup revenue tracking platforms. Because sometimes vibes matter more than verified data.

## What is this?

FakeMRR is a humorous take on platforms like TrustMRR that encourage founders to publicly display their startup revenues. Instead of requiring verified Stripe data, FakeMRR lets anyone submit completely unverified, made-up numbers.

**This is satire.** It's commentary on:
- Revenue-flexing culture in startup communities
- The pressure to publicly "prove" success
- How easy it is to claim anything without verification
- The absurdity of some startup valuations and growth claims

## Features

- ✨ **No verification required** - Just type in any numbers you want
- 🏆 **Global leaderboard** - See who can claim the most ambitious revenue worldwide
- 📊 **Fake metrics** - MRR, total revenue, and growth rates (all unverified)
- 🎨 **Clean, modern design** - Mimics real startup landing pages
- 💾 **Real database** - Powered by Vercel Postgres
- 🤡 **Hilarious sample data** - Pre-loaded with satirical startup examples
- 🔍 **Search & filter** - Find your favorite fake startups

## Tech Stack

**Frontend:**
- Pure HTML, CSS, and JavaScript (no frameworks!)
- Inter font for that clean SaaS look
- Responsive design

**Backend:**
- Vercel Serverless Functions (Node.js)
- Vercel Postgres (PostgreSQL database)
- RESTful API

## Deployment

See **[DEPLOYMENT.md](DEPLOYMENT.md)** for complete deployment instructions to Vercel.

**Quick start:**
```bash
npm install
vercel
# Then add Postgres in Vercel dashboard and run schema.sql
```

## Sample Startups

The database comes pre-loaded with 15+ hilarious satirical startups:

🥇 **AI-Powered Blockchain NFT Metaverse Solutions** - $69.4M revenue, 10000% growth
🥈 **Uber But For Saying You're Building Uber For X** - $8.9M revenue
🥉 **GrindCoin** - $5.4M revenue

And more gems like:
- **DropshipGPT** by Tai Lopez
- **No-Code SaaS Builder For Building No-Code SaaS**
- **LinkedIn Motivational Quote Generator As A Service**
- **Sleep When You're Dead Energy Drink**
- **Crypto Bro Mentorship NFT DAO**
- **Fake Stripe Dashboard Screenshot Generator** (very meta)
- **YC Rejection Letter NFT Marketplace**
- **Cold Email Spam But We Call It Outreach**

## Running Locally

For local development with the full backend:

```bash
npm install
vercel dev
```

Open http://localhost:3000

## Browser Console Commands

Open browser console and type:

```javascript
// Reload data from server
fakeMRR.reload()

// View all startups in memory
fakeMRR.startups

// View current sort
fakeMRR.currentSort
```

## Why This Exists

This project is meant to be:
1. **Educational** - Shows how easy it is to create impressive-looking but meaningless metrics
2. **Satirical** - Pokes fun at revenue-flexing culture
3. **Humorous** - Because startup culture needs to laugh at itself sometimes

## Disclaimer

This is a parody/satire project. It's not affiliated with any real revenue tracking service. Don't use this to mislead investors or anyone else. The data on this site is intentionally fake and unverified.

If you're building a real startup, please use actual verified metrics and be honest with your stakeholders.

## License

MIT License - Feel free to use, modify, and share. Just remember it's satire!

## Contributing

Want to make it more ridiculous? PRs welcome for:
- More satirical sample startups
- Funnier copy
- Additional "metrics" to track
- Easter eggs and hidden jokes

## Credits

Inspired by the startup revenue transparency movement and the inevitable absurdity that follows any trend.

Built with irony, HTML, and a healthy skepticism of startup culture.

---

**Remember:** This is satire. Real businesses should use real, verified metrics. 📊💯
