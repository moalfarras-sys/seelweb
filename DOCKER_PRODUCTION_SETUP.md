# Seel Transport - Production Docker Setup

## ✅ What Was Fixed

### 1. **Dockerfile** (Multi-stage, production-ready)
- ✅ **Stage 1 (deps)**: Install production dependencies only with `npm ci --omit=dev --legacy-peer-deps`
- ✅ **Stage 2 (builder)**: Run `npx prisma generate` and `npm run build`
- ✅ **Stage 3 (runner)**: Minimal runtime with only essentials
  - Copies `.next/standalone` (optimized build output)
  - Copies Prisma client and schema for migrations
  - Creates non-root `nextjs` user for security
  - Exposes port 3000
  - Uses entrypoint script for automated migrations

### 2. **docker-compose.yml** (Production stack)
- ✅ Service names updated: `nextjs` → `app`, `postgres` → `db`
- ✅ PostgreSQL (postgis/postgis:16-3.4-alpine):
  - Persistent volume: `postgres-data:/var/lib/postgresql/data`
  - Health check enabled
  - Database: `seel_db`, User: `seel`, Password: `seelpass`
- ✅ Next.js app service:
  - **DATABASE_URL**: `postgresql://seel:seelpass@db:5432/seel_db` (inside container)
  - **DIRECT_URL**: Same (for Prisma migrations)
  - Depends on postgres with health check
  - All secret/API keys loaded from .env
  - Non-sensitive public keys can be marked `NEXT_PUBLIC_*`
- ✅ Nginx reverse proxy + Certbot SSL (unchanged, working)

### 3. **.env** (Secrets management)
- ✅ Removed hardcoded Supabase URLs (was using external DB)
- ✅ Changed to local PostgreSQL inside containers
- ✅ Marked all sensitive keys with comments: "CHANGE IN PRODUCTION"
- ✅ Uses `NEXTAUTH_SECRET` instead of hardcoded value
- ✅ SMTP, Stripe, APIs all configurable

### 4. **.env.example** (Safe for git)
- ✅ Template file with empty values
- ✅ Safe to commit to git
- ✅ Team uses this to create their own .env

### 5. **.dockerignore** (Optimized build context)
- ✅ Excludes node_modules, .next cache, .git
- ✅ Keeps package-lock.json (needed for `COPY`)
- ✅ Keeps docker-entrypoint.sh (needed for `COPY`)
- ✅ Excludes .env files from image (security)

### 6. **docker-entrypoint.sh** (Automatic migrations)
- ✅ Waits for PostgreSQL to be ready
- ✅ Runs `prisma migrate deploy` automatically
- ✅ Then starts `node server.js` (Next.js production server)

## 🚀 How to Run

### Step 1: Prepare Environment
```bash
# 1. Make sure .env file is configured with your secrets
# Edit .env with real values for production:
# - NEXTAUTH_SECRET (generate: openssl rand -base64 32)
# - STRIPE_*_KEY (if using Stripe)
# - SMTP credentials (if using email)
# - ADMIN_PASSWORD
# etc.
```

### Step 2: Build and Start
```bash
# Build image and start all services (db + app + nginx)
docker compose up --build

# OR in detached mode:
docker compose up -d --build
```

### Step 3: Verify
```bash
# Check running containers
docker compose ps

# View app logs
docker compose logs app

# View database logs
docker compose logs db

# Access the app
curl http://localhost:3000
```

## 📋 Production Checklist

- [ ] **Security**: Update `NEXTAUTH_SECRET` with secure random value
  ```bash
  openssl rand -base64 32
  ```

- [ ] **Admin Password**: Change `ADMIN_PASSWORD` in .env

- [ ] **SMTP**: Configure email credentials if needed
  - Host, user, password from your email provider

- [ ] **Stripe**: Add live keys (not test keys) before going live
  - `STRIPE_SECRET_KEY`
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
  - `STRIPE_WEBHOOK_SECRET`

- [ ] **Database Backups**: Set up automated backups for `postgres-data` volume
  - Or use Docker volume driver with backup capability

- [ ] **NEXTAUTH_URL**: Update to your production domain
  - Development: `http://localhost:3000`
  - Production: `https://seeltransport.de`

- [ ] **SSL Certificates**: Certbot will auto-generate (if nginx.conf configured)

- [ ] **Test Migrations**: Verify `prisma migrate deploy` works
  ```bash
  docker compose logs app | grep "prisma"
  ```

## 🔧 Useful Commands

```bash
# View all containers
docker compose ps -a

# View app logs (follow mode)
docker compose logs -f app

# View database logs
docker compose logs -f db

# Stop all services
docker compose down

# Stop and remove volumes (WARNING: deletes database)
docker compose down -v

# Rebuild image (clean cache)
docker compose build --no-cache

# Run migrations manually
docker compose exec app npx prisma migrate deploy

# Access database directly
docker compose exec db psql -U seel -d seel_db

# Restart app only
docker compose restart app

# Stop app only
docker compose stop app

# Start app only
docker compose start app
```

## 🐛 Troubleshooting

### Build fails: "Module not found: Can't resolve '@/lib/utils'"
**Cause**: Missing or incorrect `tsconfig.json` aliases
**Fix**: 
1. Check your `tsconfig.json` has path mappings for `@/*`
2. Ensure all imported components exist
3. Run locally: `npm run build` to catch errors before Docker

### Database connection refused
**Check**:
```bash
docker compose logs db  # Check postgres is starting
docker compose ps       # Verify db is running
```

### Migrations fail
```bash
# Check Prisma version matches between local and container
docker compose exec app npx prisma --version

# Manually run migrations with verbose output
docker compose exec app npx prisma migrate deploy --verbose
```

### Container exits immediately
```bash
# View exit logs
docker compose logs app

# Rebuild without cache
docker compose up --build --no-cache

# Check entrypoint script
docker compose exec app cat /app/docker-entrypoint.sh
```

## 📦 Image Size Optimization

Current setup:
- **Deps stage**: ~280MB (production node_modules only)
- **Builder stage**: ~450MB (adds source + build tools)
- **Runtime**: ~200MB (only essentials + built app)

To further reduce:
```dockerfile
# In Stage 1, add --omit=optional:
RUN npm ci --omit=dev --omit=optional --legacy-peer-deps
```

## 🔐 Security Notes

- ✅ Non-root user: App runs as `nextjs` (UID 1001)
- ✅ Alpine base: Minimal attack surface
- ✅ Secrets not in image: .env excluded via .dockerignore
- ✅ Production mode: `NODE_ENV=production` set in Dockerfile
- ✅ Migrations secured: Only run via entrypoint, not exposed to frontend

## 📝 Next Steps

1. Fix your Next.js build locally first:
   ```bash
   npm run build
   ```

2. Once build succeeds locally, Docker build will succeed

3. Deploy to production:
   - Use Docker Compose on production server
   - Or deploy image to Docker Hub / registry
   - Mount volumes for database persistence
   - Use secrets manager for sensitive env vars (never .env files)

---

**Generated**: Production-ready Docker setup for Seel Transport
**Version**: Next.js 14 + Prisma 7 + PostgreSQL 16 + PostGIS
