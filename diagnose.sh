#!/bin/bash
# diagnose.sh - Quick Docker troubleshooting script

set -e

echo "🔍 Docker Compose Diagnostics"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if docker is running
echo "📦 Docker Status:"
if ! docker ps &> /dev/null; then
    echo "   ❌ Docker daemon is not running"
    exit 1
fi
echo "   ✅ Docker is running"
echo ""

# Check compose file exists
echo "📄 Compose Files:"
if [ -f "docker-compose.yml" ]; then
    echo "   ✅ docker-compose.yml found"
else
    echo "   ❌ docker-compose.yml not found"
fi
if [ -f "docker-compose.dev.yml" ]; then
    echo "   ✅ docker-compose.dev.yml found"
else
    echo "   ⚠️  docker-compose.dev.yml not found"
fi
echo ""

# Check environment file
echo "🔐 Environment:"
if [ -f ".env" ]; then
    echo "   ✅ .env file exists"
    REQUIRED_VARS=("NEXTAUTH_SECRET" "ADMIN_PASSWORD" "STRIPE_SECRET_KEY")
    for var in "${REQUIRED_VARS[@]}"; do
        if grep -q "$var=" .env; then
            echo "   ✅ $var is set"
        else
            echo "   ⚠️  $var is not set"
        fi
    done
else
    echo "   ❌ .env file not found"
    echo "      Run: cp .env.example .env"
fi
echo ""

# Check running services
echo "🐳 Running Services:"
if docker compose ps 2>/dev/null | grep -q seel-postgres; then
    DB_STATUS=$(docker compose ps seel-postgres --format "{{.Status}}")
    if echo "$DB_STATUS" | grep -q "healthy"; then
        echo "   ✅ Database: Running (healthy)"
    elif echo "$DB_STATUS" | grep -q "Up"; then
        echo "   ⚠️  Database: Running (checking health...)"
        sleep 2
    else
        echo "   ❌ Database: Not running"
    fi
else
    echo "   ❌ Database: Not found"
fi

if docker compose ps 2>/dev/null | grep -q seel-app; then
    APP_STATUS=$(docker compose ps seel-app --format "{{.Status}}")
    if echo "$APP_STATUS" | grep -q "healthy"; then
        echo "   ✅ App: Running (healthy)"
    elif echo "$APP_STATUS" | grep -q "Up"; then
        echo "   ⚠️  App: Running (checking health...)"
        sleep 2
    else
        echo "   ❌ App: Not running"
    fi
else
    echo "   ❌ App: Not found"
fi
echo ""

# Port checks
echo "🔌 Ports:"
if netstat -tuln 2>/dev/null | grep -q ":3000"; then
    echo "   ✅ Port 3000: In use"
else
    echo "   ⚠️  Port 3000: Not in use"
fi

if netstat -tuln 2>/dev/null | grep -q ":5432"; then
    echo "   ✅ Port 5432: In use"
else
    echo "   ⚠️  Port 5432: Not in use"
fi
echo ""

# Network check
echo "🌐 Network:"
NETWORK=$(docker network ls --filter name=seel-network --format "{{.Name}}" 2>/dev/null)
if [ -n "$NETWORK" ]; then
    echo "   ✅ Docker network 'seel-network' exists"
    CONNECTED=$(docker network inspect seel-network --format "{{len .Containers}}" 2>/dev/null)
    echo "   📍 Connected containers: $CONNECTED"
else
    echo "   ❌ Docker network 'seel-network' not found"
fi
echo ""

# Volume check
echo "💾 Volumes:"
POSTGRES_VOL=$(docker volume ls --filter name=postgres-data --format "{{.Name}}" 2>/dev/null)
if [ -n "$POSTGRES_VOL" ]; then
    echo "   ✅ PostgreSQL volume exists"
    VOL_SIZE=$(docker volume inspect postgres-data --format "{{.Labels.size}}" 2>/dev/null || echo "unknown")
    echo "      Size: $VOL_SIZE"
else
    echo "   ⚠️  PostgreSQL volume not found (data not persisted)"
fi
echo ""

# Resource usage
echo "⚙️  Resource Usage:"
if docker stats --no-stream --format "table {{.Container}}\t{{.MemUsage}}\t{{.CPUPerc}}" seel-app seel-postgres 2>/dev/null; then
    true
else
    echo "   ⚠️  Could not retrieve stats"
fi
echo ""

# Recent logs
echo "📋 Recent Logs (last 10 lines):"
echo ""
echo "   App:"
docker compose logs --tail=5 app 2>/dev/null | sed 's/^/      /' || echo "      (no logs available)"
echo ""
echo "   Database:"
docker compose logs --tail=5 db 2>/dev/null | sed 's/^/      /' || echo "      (no logs available)"
echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Diagnostics complete!"
echo ""
echo "💡 Next steps:"
echo "   • Check full logs: docker compose logs -f"
echo "   • Start services: docker compose up -d"
echo "   • Stop services: docker compose down"
echo "   • View app: http://localhost:3000"
