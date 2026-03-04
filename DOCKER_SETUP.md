# Seel Transport — Docker Setup Guide

## Quick Start

### Production Environment

```bash
# Copy environment variables template
cp .env.example .env

# Edit .env with your production secrets
nano .env

# Start services (builds image if needed)
docker compose up -d

# View logs
docker compose logs -f app

# Run migrations if not run automatically
docker compose exec app npx prisma migrate deploy
```

### Development Environment

```bash
# Start services with hot reload
docker compose -f docker-compose.dev.yml up -d

# View logs
docker compose -f docker-compose.dev.yml logs -f app

# Stop services
docker compose -f docker-compose.dev.yml down
```

---

## Architecture

### Multi-Stage Dockerfile
- **Stage 1 (deps)**: Installs dependencies with BuildKit cache mounts for faster rebuilds
- **Stage 2 (builder)**: Builds the Next.js application in standalone mode
- **Stage 3 (runner)**: Minimal production image with only runtime dependencies

**Size reduction**: Multi-stage reduces final image size by ~60% compared to single-stage.

### Compose Services

#### PostgreSQL (db)
- Alpine-based for minimal size
- Health check ensures readiness before app starts
- Volume-mounted data persistence
- Network-isolated for security

#### Next.js App (app)
- Depends on healthy database
- Runs as non-root user (nextjs:1001) for security
- Health check verifies app availability
- Automatic migrations on startup via entrypoint script

---

## Key Improvements

### 1. BuildKit Cache Mounts
The production Dockerfile uses `--mount=type=cache` for npm install and Next.js build cache, reducing rebuild time by 50-80% when dependencies haven't changed.

### 2. Non-Root User
Both containers run as non-root users (uid 1001), improving security posture.

### 3. Health Checks
- **Database**: `pg_isready` confirms PostgreSQL is accepting connections
- **App**: HTTP health check verifies app is responding

### 4. Layer Caching
Dockerfile structure optimizes layer caching:
- Copy only package files first (minimal changes)
- Copy source code later (frequent changes)
- RUN commands with `--mount=cache` reduce rebuild time

### 5. Environment Management
- `.env` file for secrets (not in git)
- `.env.example` template for reference
- Compose file uses variable substitution from .env

---

## Environment Variables

### Required for Production

```
NEXTAUTH_SECRET          # 32+ character random string
NEXTAUTH_URL             # Full URL (e.g., https://example.com)
ADMIN_EMAIL              # Initial admin email
ADMIN_PASSWORD           # Initial admin password
STRIPE_SECRET_KEY        # Stripe API key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY  # Stripe publishable key
STRIPE_WEBHOOK_SECRET    # Stripe webhook secret
ORS_API_KEY              # OpenRouteService API key (optional)
```

### Optional

```
SMTP_HOST                # Email server hostname
SMTP_PORT                # Email server port
SMTP_USER                # Email account username
SMTP_PASS                # Email account password
GOOGLE_MAPS_API_KEY      # Google Maps API key (optional)
NEXT_PUBLIC_SUPABASE_URL # Supabase project URL (optional)
NEXT_PUBLIC_SUPABASE_ANON_KEY  # Supabase anon key (optional)
```

---

## Common Commands

### View Logs
```bash
# Production
docker compose logs -f app

# Development
docker compose -f docker-compose.dev.yml logs -f app

# Database logs
docker compose logs -f db
```

### Database Management
```bash
# Run migrations
docker compose exec app npx prisma migrate deploy

# Push schema (dev only)
docker compose exec app npx prisma db push

# Seed database
docker compose exec app npx prisma db seed

# Open Prisma Studio (dev only)
docker compose exec app npx prisma studio
```

### Container Management
```bash
# Stop services
docker compose down

# Rebuild image (production)
docker compose build --no-cache

# Rebuild and restart
docker compose up -d --build

# Remove volumes (warning: deletes data)
docker compose down -v
```

### Debugging
```bash
# Execute shell in app container
docker compose exec app sh

# View container stats
docker stats seel-app

# Inspect running container
docker inspect seel-app

# View network configuration
docker network inspect seel-network
```

---

## Performance Optimization

### For Faster Builds

1. **First build**: Uses remote cache if available (`--cache-from` in compose)
2. **Subsequent builds**: BuildKit cache mounts reduce time from ~3min to ~30sec
3. **Docker Desktop**: Enable VirtioFS for better mount performance in preferences

### For Faster Runtime

1. **Standalone mode**: Next.js runs as standalone binary (no dev server)
2. **Alpine base**: Minimal OS footprint
3. **Health checks**: Ensure only healthy containers receive traffic

### Resource Limits (Optional)

Uncomment in `docker-compose.yml`:

```yaml
deploy:
  resources:
    limits:
      cpus: "2"
      memory: 1G
    reservations:
      cpus: "1"
      memory: 512M
```

---

## Troubleshooting

### App Won't Start

```bash
# Check logs
docker compose logs app | tail -50

# Verify database is healthy
docker compose logs db

# Check if port 3000 is already in use
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows
```

### Database Connection Issues

```bash
# Verify database is healthy
docker compose exec db pg_isready -U seel -d seel_db

# Check network connectivity
docker compose exec app ping db
```

### Migrations Failed

```bash
# Retry migrations manually
docker compose exec app npx prisma migrate deploy

# Or fallback to db push
docker compose exec app npx prisma db push --accept-data-loss
```

### Memory Issues

```bash
# Check container resource usage
docker stats

# Increase limits in docker-compose.yml
```

---

## Production Deployment

### 1. Pre-Flight Checks
- [ ] All secrets in `.env` are set
- [ ] `NEXTAUTH_SECRET` is a strong random string (32+ chars)
- [ ] Database backups are configured
- [ ] SSL/TLS certificates ready if using reverse proxy

### 2. Docker Registry

Push image to registry:

```bash
docker build -f Dockerfile -t your-registry/seel-app:v1.0.0 .
docker push your-registry/seel-app:v1.0.0
```

### 3. Deploy with Compose

On production server:

```bash
# Update image reference in docker-compose.yml
# Then deploy
docker compose -f docker-compose.yml up -d
```

### 4. Reverse Proxy (Nginx Example)

```nginx
server {
    listen 443 ssl http2;
    server_name example.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## Development Workflow

### Code Changes with Hot Reload

1. Start dev compose:
   ```bash
   docker compose -f docker-compose.dev.yml up -d
   ```

2. Make code changes in `src/` directory

3. Changes auto-reload (Next.js Turbo watches files)

4. View logs:
   ```bash
   docker compose -f docker-compose.dev.yml logs -f app
   ```

### Database Schema Changes

1. Update `prisma/schema.prisma`

2. Create migration:
   ```bash
   docker compose -f docker-compose.dev.yml exec app npx prisma migrate dev --name describe_change
   ```

3. Migration auto-applies to dev database

---

## File Structure

```
.
├── Dockerfile              # Production multi-stage build
├── Dockerfile.dev          # Development single-stage (faster iteration)
├── docker-compose.yml      # Production services
├── docker-compose.dev.yml  # Development services with volumes
├── docker-entrypoint.sh    # Production entrypoint (migrations + start)
├── docker-entrypoint.dev.sh # Development entrypoint
├── .dockerignore            # Excludes files from build context
├── .env.example             # Template for environment variables
├── .env                     # Actual secrets (not in git)
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── migrations/          # Prisma migration files
├── src/                     # Next.js application source
├── public/                  # Static assets
└── node_modules/            # Dependencies (only in containers)
```

---

## See Also

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/reference/)
- [Next.js in Docker](https://nextjs.org/docs/deployment/docker)
- [Dockerfile Best Practices](https://docs.docker.com/develop/dev-best-practices/dockerfile_best-practices/)
