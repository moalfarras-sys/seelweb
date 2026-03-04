@echo off
REM build.bat - Helper script for building Docker images on Windows

setlocal enabledelayedexpansion

set IMAGE_NAME=%1
if "!IMAGE_NAME!"=="" set IMAGE_NAME=seel-app

set TAG=%2
if "!TAG!"=="" set TAG=latest

echo 🔨 Building Docker image: %IMAGE_NAME%:%TAG%
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

docker buildx build ^
    -f Dockerfile ^
    -t %IMAGE_NAME%:%TAG% ^
    -t %IMAGE_NAME%:latest ^
    --progress=plain ^
    --load ^
    .

if errorlevel 1 (
    echo ❌ Build failed!
    exit /b 1
)

echo.
echo ✅ Build complete!
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo Image info:
docker images %IMAGE_NAME%:%TAG% --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"
echo.
echo To run:
echo   docker compose up -d
echo.
echo To inspect:
echo   docker image inspect %IMAGE_NAME%:%TAG%
