# SEEL Transport & Reinigung

Next.js App Router application deployed on Vercel.

## Local Development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Vercel Deployment

This repository is configured to run fully on Vercel. The app serves the public website, admin area, and all `/api/*` routes from the same Next.js project. There is no VPS, Docker, nginx, or external backend proxy in the runtime path.

Required Vercel environment variables:

```bash
DATABASE_URL
DIRECT_URL
NEXTAUTH_SECRET
NEXTAUTH_URL
NEXT_PUBLIC_APP_URL
ADMIN_EMAIL
ADMIN_PASSWORD
SMTP_HOST
SMTP_PORT
SMTP_SECURE
SMTP_USER
SMTP_PASS
STRIPE_SECRET_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_WEBHOOK_SECRET
GOOGLE_MAPS_API_KEY
ORS_API_KEY
```

Use a hosted PostgreSQL database that is reachable from Vercel, for example Vercel Postgres, Neon, Supabase, or another managed Postgres provider.

Before the first production deployment, run migrations against the production database:

```bash
npm run db:migrate
npm run db:seed
```

For Vercel CLI workflows:

```bash
vercel pull .env.local --yes
npm run build
vercel --prod
```
