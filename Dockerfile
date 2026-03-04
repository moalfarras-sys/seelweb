# ===========================================================
# STAGE 1: Install dependencies (dev + prod) for building
# ===========================================================
FROM node:20-alpine AS deps

RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy only package files for better layer caching
COPY package.json package-lock.json ./

# Use BuildKit cache mount for faster rebuilds
RUN --mount=type=cache,target=/root/.npm \
    npm ci --legacy-peer-deps

# ===========================================================
# STAGE 2: Build the Next.js application
# ===========================================================
FROM node:20-alpine AS builder

RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy package files
COPY package.json package-lock.json ./

# Copy source code and config files
COPY prisma ./prisma
COPY src ./src
COPY public ./public
COPY next.config.mjs ./
COPY tsconfig.json ./
COPY tailwind.config.ts ./
COPY postcss.config.mjs ./
COPY .eslintrc.json ./

# Generate Prisma client
RUN npx prisma generate

# Build Next.js application
RUN --mount=type=cache,target=/root/.next/cache \
    npm run build

# ===========================================================
# STAGE 3: Production runtime (minimal image)
# ===========================================================
FROM node:20-alpine AS runner

WORKDIR /app

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Install runtime dependencies only
RUN apk add --no-cache openssl

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy public assets
COPY --from=builder /app/public ./public

# Copy Next.js standalone build
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy Prisma schema and client
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder /app/node_modules/dotenv ./node_modules/dotenv

# Copy entrypoint script
COPY --chown=nextjs:nodejs docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

# Switch to non-root user
USER nextjs

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})" || exit 1

ENTRYPOINT ["./docker-entrypoint.sh"]
