# GolfEzz - Golf Course Management System

A comprehensive, professional-grade golf course management system built with modern web technologies. This application provides a complete solution for golf course operations, member management, tee time booking, and administrative functions.

## 🏌️ Features

### Admin Features
- **Course Management**: Add, edit, and manage multiple golf courses
- **Course Details**: Configure green speed, fairways, bunkers, par, hazards
- **Member Management**: View and manage member profiles
- **Booking Management**: Oversee all tee time bookings
- **Analytics Dashboard**: Course usage statistics and insights
- **Range Management**: Monitor driving range usage and ball bucket inventory
- **Staff Management**: Manage staff accounts and permissions

### Member Features
- **Course Information**: View detailed course information and conditions
- **Tee Time Booking**: Real-time booking system with availability
- **Member Dashboard**: Personal booking history and preferences
- **Range Access**: Book driving range sessions and track ball usage
- **Course Reviews**: Rate and review courses
- **Weather Integration**: Real-time weather conditions
- **Mobile Responsive**: Full mobile experience

### Additional Features
- **Google OAuth Authentication**: Secure login with Google accounts
- **Real-time Notifications**: Instant updates for bookings and changes
- **Payment Integration**: Secure payment processing
- **Multi-course Support**: Manage multiple golf courses
- **Responsive Design**: Professional UI/UX across all devices

## 🛠️ Technology Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: Beautiful, accessible UI components
- **NextAuth.js**: Authentication with Google OAuth
- **Zustand**: State management
- **React Hook Form**: Form handling with validation
- **Framer Motion**: Smooth animations

### Backend
- **Go (Golang)**: High-performance backend
- **Gin Framework**: Fast HTTP web framework
- **PostgreSQL**: Robust relational database
- **Redis**: Caching and session management
- **JWT**: Secure authentication tokens
- **GORM**: Go ORM for database operations

### DevOps & Tools
- **Docker**: Containerization
- **Docker Compose**: Local development environment
- **Air**: Hot reload for Go development
- **ESLint & Prettier**: Code formatting and linting

## 🏗️ Architecture

This project follows a **modular monolith architecture** that can be easily converted to microservices:

```
golf-ezz/
├── frontend/                 # Next.js application
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   ├── components/      # Reusable UI components
│   │   ├── features/        # Feature-specific modules
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions
│   │   ├── store/          # State management
│   │   └── types/          # TypeScript definitions
│   └── public/             # Static assets
├── backend/                 # Go application
│   ├── cmd/                # Application entry points
│   ├── internal/           # Private application code
│   │   ├── features/       # Feature modules
│   │   ├── shared/         # Shared utilities
│   │   └── config/         # Configuration
│   ├── pkg/                # Public packages
│   ├── migrations/         # Database migrations
│   └── docs/               # API documentation
└── docker-compose.yml      # Development environment
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Go 1.21+
- Docker and Docker Compose
- Git

### 1. Clone and Setup
```bash
git clone <repository-url>
cd golf-ezz
cp .env.example .env.local
```

### 2. Configure Environment
Edit `.env.local` with your configuration:
- Google OAuth credentials
- JWT secrets
- Database settings

### 3. Start with Docker
```bash
# Start all services
npm run docker:up

# View logs
npm run docker:logs

# Stop services
npm run docker:down
```

### 4. Development Mode
```bash
# Install dependencies
npm install
cd frontend && npm install

# Start development servers
npm run dev

# Or start individually
npm run frontend:dev  # Frontend: http://localhost:3000
npm run backend:dev   # Backend: http://localhost:8080
```

### 5. Database Setup
```bash
# Run migrations
npm run db:migrate

# Seed sample data
npm run db:seed
```

## 📁 Project Structure

### Frontend Features
```
frontend/src/features/
├── auth/              # Authentication
├── admin/             # Admin dashboard
├── courses/           # Course management
├── bookings/          # Tee time booking
├── members/           # Member management
├── range/             # Driving range
├── dashboard/         # Analytics
└── shared/            # Shared components
```

### Backend Features
```
backend/internal/features/
├── auth/              # Authentication service
├── users/             # User management
├── courses/           # Course management
├── bookings/          # Booking service
├── range/             # Range management
├── payments/          # Payment processing
└── notifications/     # Notification service
```

## 🔧 API Documentation

The backend provides a RESTful API with the following main endpoints:

- `GET /api/v1/health` - Health check
- `POST /api/v1/auth/google` - Google OAuth
- `GET /api/v1/courses` - List courses
- `POST /api/v1/bookings` - Create booking
- `GET /api/v1/admin/dashboard` - Admin dashboard

Full API documentation is available at `http://localhost:8080/docs` when running the backend.

## 🎨 UI/UX Design

The application features a modern, professional design with:
- Clean, intuitive interface
- Golf-themed color palette
- Responsive design for all devices
- Accessible components following WCAG guidelines
- Smooth animations and transitions

## 🔒 Authentication

- Google OAuth integration for secure sign-in
- JWT-based session management
- Role-based access control (Admin/Member)
- Secure API endpoints with middleware protection

## 🗄️ Database Schema

The PostgreSQL database includes tables for:
- Users and authentication
- Golf courses and hole information
- Bookings and schedules
- Range sessions and inventory
- Payments and transactions
- Reviews and ratings

## 🧪 Testing

```bash
# Run all tests
npm run test

# Frontend tests
npm run frontend:test

# Backend tests
npm run backend:test
```

## 📦 Deployment

### Production Build
```bash
# Build frontend
npm run frontend:build

# Build backend
npm run backend:build
```

### Docker Production
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation in `/docs`
- Review the API documentation

## 🗺️ Roadmap

- [ ] Mobile app development
- [ ] Advanced analytics and reporting
- [ ] Integration with external booking systems
- [ ] Tournament management features
- [ ] Loyalty program implementation
- [ ] Multi-language support

---

**Built with ❤️ for the golf community**
