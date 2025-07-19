#!/bin/bash

# Production deployment script for Golf Course Management System

echo "🏌️ Deploying Golf Course Management System..."

# Stop existing services
echo "📦 Stopping existing services..."
docker-compose -f docker-compose.prod.yml down

# Pull latest code (if using git deployment)
echo "📥 Pulling latest changes..."
git pull origin main

# Build and start services
echo "🔨 Building and starting services..."
docker-compose -f docker-compose.prod.yml up -d --build

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
sleep 30

# Run database migrations
echo "🗄️ Running database migrations..."
docker-compose -f docker-compose.prod.yml exec backend ./migrate

# Check service health
echo "🏥 Checking service health..."
docker-compose -f docker-compose.prod.yml ps

echo "✅ Deployment completed!"
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:8080"
