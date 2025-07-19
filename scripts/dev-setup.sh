#!/bin/bash

# Golf Course Management System - Development Setup Script

echo "🏌️ Setting up Golf Course Management System..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker Desktop first."
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create environment files if they don't exist
if [ ! -f "./backend/.env" ]; then
    echo "📝 Creating backend environment file..."
    cp ./backend/.env.example ./backend/.env
    echo "⚠️  Please edit backend/.env with your actual configuration values"
fi

if [ ! -f "./frontend/.env.local" ]; then
    echo "📝 Creating frontend environment file..."
    cp ./frontend/.env.example ./frontend/.env.local
    echo "⚠️  Please edit frontend/.env.local with your actual configuration values"
fi

# Start Docker services
echo "🐳 Starting Docker services..."
docker-compose up -d

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 10

# Run database migrations
echo "🗄️  Running database migrations..."
cd backend
go run ./cmd/migrate/main.go

# Seed database with sample data
echo "🌱 Seeding database with sample data..."
go run ./cmd/seed/main.go

cd ..

echo "✅ Development environment is ready!"
echo ""
echo "🚀 Access your application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:8080"
echo "   PgAdmin:  http://localhost:5050 (admin@admin.com / admin)"
echo ""
echo "📝 Next steps:"
echo "   1. Configure Google OAuth in frontend/.env.local"
echo "   2. Update database credentials in backend/.env"
echo "   3. Visit http://localhost:3000 to see your application!"
echo ""
echo "🏌️ Happy coding!"
