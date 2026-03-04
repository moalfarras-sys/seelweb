#!/bin/sh
set -e

echo "=== Seel Transport — Starting ==="

echo "Waiting for database..."
MAX_RETRIES=30
RETRIES=0
until node -e "
const net = require('net');
const s = new net.Socket();
s.setTimeout(2000);
s.connect(5432, 'db', () => { s.destroy(); process.exit(0); });
s.on('error', () => process.exit(1));
s.on('timeout', () => { s.destroy(); process.exit(1); });
" 2>/dev/null; do
  RETRIES=$((RETRIES + 1))
  if [ "$RETRIES" -ge "$MAX_RETRIES" ]; then
    echo "ERROR: Database not reachable after $MAX_RETRIES attempts"
    exit 1
  fi
  echo "  Database not ready, retrying ($RETRIES/$MAX_RETRIES)..."
  sleep 2
done
echo "Database is ready!"

echo "Running Prisma migrations..."
npx prisma migrate deploy --schema=./prisma/schema.prisma || {
  echo "Migration failed, trying db push as fallback..."
  npx prisma db push --schema=./prisma/schema.prisma --accept-data-loss
}

echo "Starting Next.js (production)..."
exec node server.js
