# 🏌️ Golf Course Management System - Quick Start Guide

## Prerequisites

- **Node.js 18+**
- **Go 1.21+**
- **Docker & Docker Compose**
- **Git**
- **PostgreSQL** (if not using Docker)

## 🚀 Quick Setup (Automated)

### Windows (PowerShell)
```powershell
npm run setup
```

### Linux/Mac (Bash)
```bash
npm run setup:unix
```

## 🛠️ Manual Setup

### 1. Environment Configuration

Copy the example environment files and configure them:

```bash
# Backend configuration
cp backend/.env.example backend/.env

# Frontend configuration  
cp frontend/.env.example frontend/.env.local
```

**Important:** Edit these files with your actual configuration values!

### 2. Database Setup

Start PostgreSQL with Docker:
```bash
npm run docker:up
```

Run migrations and seed data:
```bash
npm run db:migrate
npm run db:seed
```

### 3. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
6. Add your credentials to `.env.local`

### 4. Start Development

```bash
npm run dev
```

## 📱 Application URLs

- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:8080  
- **PgAdmin:** http://localhost:5050 (admin@admin.com / admin)

## 🎯 Key Features Implemented

### ✅ **Ready to Use**
- Beautiful UI with custom golf-themed icons
- Database models and relationships
- Docker development environment  
- Authentication setup (NextAuth.js)
- Navigation and layout components
- Dashboard with golf course analytics

### 🚧 **In Progress** 
- Google OAuth integration (needs credentials)
- Backend API endpoints (partially complete)
- Real-time booking system
- Payment integration

## 🔧 Useful Commands

```bash
# Development
npm run dev                    # Start both frontend and backend
npm run frontend:dev          # Start only frontend
npm run backend:dev           # Start only backend

# Database
npm run db:migrate            # Run database migrations
npm run db:seed              # Seed sample data
npm run db:reset             # Reset database completely

# Docker
npm run docker:up            # Start Docker services
npm run docker:down          # Stop Docker services
npm run docker:logs          # View Docker logs

# Testing & Linting
npm run test                 # Run all tests
npm run lint                 # Run linting

# Cleanup
npm run clean                # Clean build artifacts
```

## 🗂️ Project Structure

```
golf-ezz/
├── frontend/              # Next.js frontend
│   ├── src/
│   │   ├── app/          # App Router pages
│   │   ├── components/   # UI components
│   │   └── lib/          # Utilities
├── backend/               # Go backend
│   ├── cmd/              # Application entry points
│   ├── internal/         # Private application code
│   └── *.go             # Go source files
├── scripts/              # Setup scripts
└── docker-compose.yml    # Development environment
```

## 🎨 Custom Components

- **Logo Component:** Beautiful golf-themed logo with variants
- **Golf Icons:** Professional icon library for golf features
- **Feature Badges:** Reusable feature highlight components
- **Loading States:** Golf ball spinner animations

## 🔒 Environment Variables

### Backend (.env)
```env
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Frontend (.env.local)
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## 🏌️ Next Steps

1. **Configure Google OAuth** (required for authentication)
2. **Complete booking system** implementation
3. **Add payment integration** (Stripe recommended)
4. **Implement real-time features** (WebSockets)
5. **Add comprehensive testing**
6. **Deploy to production**

## 🆘 Troubleshooting

### Common Issues

**Package conflict error:**
- Fixed! The Go package structure has been corrected.

**Database connection failed:**
- Ensure Docker is running: `docker ps`
- Check database credentials in `.env`

**Frontend build errors:**
- Run: `npm install` in frontend directory
- Clear Next.js cache: `rm -rf .next`

**Backend import errors:**
- Run: `go mod tidy` in backend directory

## 🎯 Production Deployment

When ready for production:

1. Update environment variables for production
2. Configure SSL certificates
3. Set up CI/CD pipeline
4. Configure monitoring and logging
5. Set up backup strategies

---

**Happy coding! 🏌️‍♂️** Your beautiful Golf Course Management System is ready for development!
