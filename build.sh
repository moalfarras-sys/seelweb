#!/bin/bash
# build.sh - Helper script for building and managing Docker images

set -e

IMAGE_NAME="${1:-seel-app}"
TAG="${2:-latest}"
BUILD_ARGS="${@:3}"

echo "🔨 Building Docker image: $IMAGE_NAME:$TAG"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Build with progress output
docker buildx build \
    -f Dockerfile \
    -t "$IMAGE_NAME:$TAG" \
    -t "$IMAGE_NAME:latest" \
    --progress=plain \
    $BUILD_ARGS \
    .

echo ""
echo "✅ Build complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Image info:"
docker images "$IMAGE_NAME:$TAG" --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"
echo ""
echo "To run:"
echo "  docker compose up -d"
echo ""
echo "To inspect:"
echo "  docker image inspect $IMAGE_NAME:$TAG"
