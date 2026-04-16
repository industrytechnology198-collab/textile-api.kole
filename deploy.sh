#!/bin/bash
set -e

echo "==> Pulling latest code..."
git pull origin main

echo "==> Building Docker image..."
docker compose build app

echo "==> Starting services..."
docker compose up -d postgres

echo "==> Waiting for PostgreSQL to be ready..."
sleep 5

echo "==> Running Prisma migrations..."
docker compose run --rm app npx prisma migrate deploy

echo "==> Starting all services..."
docker compose up -d

echo "==> Cleaning up unused images..."
docker image prune -f

echo ""
echo "Deploy complete. Check logs: docker compose logs -f app"
