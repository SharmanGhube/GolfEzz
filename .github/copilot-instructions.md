# VS Code workspace for Golf Course Management System

## Development Instructions

This workspace contains a comprehensive Golf Course Management System with:

- **Frontend**: Next.js 14 with TypeScript and Tailwind CSS
- **Backend**: Go with Gin framework
- **Database**: PostgreSQL with Docker

## Getting Started

### Prerequisites
- Node.js 18+
- Go 1.21+
- Docker & Docker Compose
- Git

### Setup Instructions

1. **Environment Setup**:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

2. **Install Dependencies**:
   ```bash
   # Root dependencies
   npm install
   
   # Frontend dependencies
   cd frontend && npm install
   ```

3. **Start Development Environment**:
   ```bash
   # Start all services with Docker
   npm run docker:up
   
   # OR start development servers separately
   npm run dev
   ```

4. **Database Setup**:
   ```bash
   # Run migrations
   npm run db:migrate
   
   # Seed sample data
   npm run db:seed
   ```

### Available Scripts

- `npm run dev` - Start both frontend and backend
- `npm run frontend:dev` - Start frontend only
- `npm run backend:dev` - Start backend only
- `npm run docker:up` - Start all services with Docker
- `npm run docker:down` - Stop Docker services
- `npm run db:migrate` - Run database migrations
- `npm run test` - Run all tests

### Project Structure

```
golf-ezz/
├── frontend/          # Next.js frontend
│   ├── src/
│   │   ├── app/       # App Router pages
│   │   ├── components/ # Reusable components
│   │   ├── features/  # Feature modules
│   │   ├── lib/       # Utilities
│   │   └── types/     # TypeScript definitions
├── backend/           # Go backend
│   ├── cmd/           # Application entry points
│   ├── internal/      # Private application code
│   │   ├── config/    # Configuration
│   │   ├── database/  # Database connection
│   │   ├── features/  # Feature modules
│   │   ├── middleware/ # HTTP middleware
│   │   └── models/    # Data models
└── docker-compose.yml # Development environment
```

## Features

### Implemented
- [x] Project structure and architecture
- [x] Database models and migrations
- [x] Basic authentication setup
- [x] Course management API endpoints
- [x] Professional UI components
- [x] Docker configuration
- [x] Environment configuration

### To Implement
- [ ] Complete authentication flow
- [ ] Tee time booking system
- [ ] Range management
- [ ] Payment integration
- [ ] Admin dashboard
- [ ] Member portal
- [ ] Real-time notifications
- [ ] Analytics and reporting

## API Documentation

When the backend is running, API documentation is available at:
- http://localhost:8080/docs

## Database Schema

The system includes the following main entities:
- Users (members, staff, admins)
- Courses (golf course information)
- Course Conditions (real-time conditions)
- Tee Time Bookings
- Range Bookings
- Payments
- Reviews
- Notifications
- Inventory
- Analytics

## Contributing

1. Create a feature branch
2. Make your changes
3. Add tests if applicable
4. Submit a pull request

## Architecture Notes

This project follows a modular monolith architecture that can be easily converted to microservices:

- Each feature has its own directory
- Clean separation of concerns
- Interface-based design
- Database abstraction
- Middleware-based request handling

## Security

- JWT-based authentication
- Role-based access control
- Input validation
- SQL injection prevention
- CORS protection
- Rate limiting ready
