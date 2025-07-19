# Golf Course Management System - Development Setup Script (Windows)

Write-Host "🏌️ Setting up Golf Course Management System..." -ForegroundColor Green

# Check if Docker is installed
try {
    docker --version | Out-Null
} catch {
    Write-Host "❌ Docker is not installed. Please install Docker Desktop first." -ForegroundColor Red
    exit 1
}

# Check if Docker Compose is available
try {
    docker-compose --version | Out-Null
} catch {
    Write-Host "❌ Docker Compose is not installed. Please install Docker Compose first." -ForegroundColor Red
    exit 1
}

# Create environment files if they don't exist
if (-not (Test-Path "./backend/.env")) {
    Write-Host "📝 Creating backend environment file..." -ForegroundColor Yellow
    Copy-Item "./backend/.env.example" "./backend/.env"
    Write-Host "⚠️  Please edit backend/.env with your actual configuration values" -ForegroundColor Yellow
}

if (-not (Test-Path "./frontend/.env.local")) {
    Write-Host "📝 Creating frontend environment file..." -ForegroundColor Yellow
    Copy-Item "./frontend/.env.example" "./frontend/.env.local"
    Write-Host "⚠️  Please edit frontend/.env.local with your actual configuration values" -ForegroundColor Yellow
}

# Start Docker services
Write-Host "🐳 Starting Docker services..." -ForegroundColor Blue
docker-compose up -d

# Wait for PostgreSQL to be ready
Write-Host "⏳ Waiting for PostgreSQL to be ready..." -ForegroundColor Blue
Start-Sleep -Seconds 10

# Run database migrations
Write-Host "🗄️  Running database migrations..." -ForegroundColor Blue
Set-Location backend
go run ./cmd/migrate/main.go

# Seed database with sample data
Write-Host "🌱 Seeding database with sample data..." -ForegroundColor Blue
go run ./cmd/seed/main.go

Set-Location ..

Write-Host "✅ Development environment is ready!" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Access your application:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "   Backend:  http://localhost:8080" -ForegroundColor White
Write-Host "   PgAdmin:  http://localhost:5050 (admin@admin.com / admin)" -ForegroundColor White
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Configure Google OAuth in frontend/.env.local" -ForegroundColor White
Write-Host "   2. Update database credentials in backend/.env" -ForegroundColor White
Write-Host "   3. Visit http://localhost:3000 to see your application!" -ForegroundColor White
Write-Host ""
Write-Host "🏌️ Happy coding!" -ForegroundColor Green
