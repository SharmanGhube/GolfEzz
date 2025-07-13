# GolfEzz - Golf Course Management System

A comprehensive golf course management application built with modern technologies for seamless tee time bookings, driving range sessions, and course administration.

## 🏌️ Features

### Core Features
- **Tee Time Booking System**: Real-time availability, group bookings, and automated confirmations
- **Driving Range Management**: Session tracking, ball bucket monitoring, and equipment rentals
- **Course Information Dashboard**: Live green conditions, weather updates, and course statistics
- **Membership Management**: Multiple membership tiers with exclusive benefits and discounts
- **Payment Processing**: Secure payment handling with multiple payment methods
- **User Authentication**: JWT-based authentication with role-based access control

### Advanced Features
- **Progressive Dashboard**: Real-time analytics and reporting
- **Green Speed Tracking**: Daily stimpmeter readings and course conditions
- **Equipment Rental System**: Golf cart, club, and accessory rentals
- **Automated Notifications**: Email and in-app notifications for bookings and updates
- **Multi-role Access**: Admin, Manager, Staff, Member, and Guest roles
- **Audit Logging**: Complete audit trail for all system activities

## 🛠️ Tech Stack

### Backend
- **Language**: Go 1.21
- **Framework**: Gin (HTTP router)
- **Database**: PostgreSQL 15
- **Cache**: Redis 7
- **ORM**: GORM
- **Authentication**: JWT tokens
- **Password Hashing**: bcrypt

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React & Heroicons
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Forms**: React Hook Form with Zod validation

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Reverse Proxy**: Nginx
- **Development**: Hot reload for both frontend and backend

## 📁 Project Structure

```
GolfEzz/
├── backend/                    # Go backend application
│   ├── internal/
│   │   ├── config/            # Configuration management
│   │   ├── database/          # Database connection and migrations
│   │   ├── models/            # Database models (GORM)
│   │   ├── repository/        # Data access layer
│   │   ├── service/           # Business logic layer
│   │   ├── handler/           # HTTP handlers
│   │   ├── middleware/        # Custom middleware
│   │   ├── routes/            # Route definitions
│   │   └── utils/             # Utility functions
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── go.mod
│   ├── go.sum
│   ├── main.go
│   └── .env.example
├── frontend/                   # Next.js frontend application
│   ├── app/                   # App router (Next.js 14)
│   ├── components/            # React components
│   │   ├── ui/               # Reusable UI components
│   │   └── ...               # Feature-specific components
│   ├── lib/                   # Utility libraries
│   ├── hooks/                 # Custom React hooks
│   ├── types/                 # TypeScript type definitions
│   ├── store/                 # State management
│   ├── Dockerfile
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── .env.example
├── nginx/                      # Nginx configuration
│   └── nginx.conf
├── docker-compose.yml          # Main docker compose file
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Git
- (Optional) Go 1.21+ and Node.js 18+ for local development

### 1. Clone the Repository
```bash
git clone <repository-url>
cd GolfEzz
```

### 2. Environment Configuration

#### Backend Environment
```bash
cd backend
cp .env.example .env
# Edit .env with your configurations
```

#### Frontend Environment
```bash
cd frontend
cp .env.example .env.local
# Edit .env.local with your configurations
```

### 3. Run with Docker Compose
```bash
# From the root directory
docker-compose up -d
```

This will start:
- PostgreSQL database on port 5432
- Redis cache on port 6379
- Backend API on port 8080
- Frontend application on port 3000
- Nginx reverse proxy on port 80

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **API Documentation**: http://localhost:8080/swagger (when implemented)

## 🔧 Development Setup

### Backend Development
```bash
cd backend

# Install dependencies
go mod download

# Run migrations (ensure PostgreSQL is running)
go run main.go

# For development with hot reload
go install github.com/cosmtrek/air@latest
air
```

### Frontend Development
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Database Setup
The application will automatically:
1. Create the database schema
2. Run migrations
3. Seed initial data (default course, roles, membership types)

## 🐘 PostgreSQL Setup Guide

### Step-by-Step PostgreSQL Installation and Configuration

Since you have PostgreSQL already running on port 5432, here's how to properly configure it for GolfEzz:

#### Method 1: Using pgAdmin (Recommended - GUI Method)

1. **Find and Open pgAdmin**
   - Search for "pgAdmin" in Windows Start menu
   - If not installed, download from: https://www.pgadmin.org/download/

2. **Connect to PostgreSQL Server**
   - Open pgAdmin
   - Right-click "Servers" → "Create" → "Server"
   - Give it a name (e.g., "Local PostgreSQL")
   - In "Connection" tab:
     - Host: `localhost`
     - Port: `5432`
     - Username: `postgres`
     - Password: (enter your postgres password)

3. **Create Database**
   - Right-click "Databases" → "Create" → "Database"
   - Database name: `golfezz_db`
   - Owner: `postgres`
   - Click "Save"

4. **Create User**
   - Right-click "Login/Group Roles" → "Create" → "Login/Group Role"
   - General tab: Name: `golfezz_user`
   - Definition tab: Password: `golfezz_password`
   - Privileges tab: Check "Can login?" and "Superuser?"
   - Click "Save"

5. **Grant Permissions**
   - Right-click on `golfezz_db` → "Properties"
   - Go to "Security" tab
   - Add `golfezz_user` with all privileges

#### Method 2: Using SQL Commands (Command Line)

1. **Find PostgreSQL Installation**
   ```bash
   # Common Windows paths:
   # C:\Program Files\PostgreSQL\15\bin\
   # C:\Program Files\PostgreSQL\14\bin\
   # C:\Program Files\PostgreSQL\13\bin\
   
   # Add to PATH or use full path
   ```

2. **Connect to PostgreSQL**
   ```bash
   # Try these commands (replace XX with your version):
   "C:\Program Files\PostgreSQL\15\bin\psql.exe" -U postgres
   
   # Or if psql is in PATH:
   psql -U postgres
   
   # You'll be prompted for the postgres password
   ```

3. **Create Database and User**
   ```sql
   -- Create the database
   CREATE DATABASE golfezz_db;
   
   -- Create the user
   CREATE USER golfezz_user WITH PASSWORD 'golfezz_password';
   
   -- Grant all privileges on database
   GRANT ALL PRIVILEGES ON DATABASE golfezz_db TO golfezz_user;
   
   -- Connect to the new database
   \c golfezz_db
   
   -- Grant schema privileges
   GRANT ALL ON SCHEMA public TO golfezz_user;
   GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO golfezz_user;
   GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO golfezz_user;
   
   -- Grant future privileges (for tables created later)
   ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO golfezz_user;
   ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO golfezz_user;
   
   -- Verify the user can connect
   \du
   
   -- Exit
   \q
   ```

#### Method 3: Using Windows Services (Find Installation Info)

1. **Open Services**
   - Press `Win + R`, type `services.msc`, press Enter

2. **Find PostgreSQL Service**
   - Look for service named like "postgresql-x64-15" or similar
   - Right-click → Properties to see installation path

3. **Find psql.exe**
   - Navigate to the installation path + `\bin\`
   - Use the full path to run psql commands

#### Method 4: Alternative Approach - Use Different Database

If you can't access PostgreSQL with the above methods, you can temporarily use a different database name:

1. **Try connecting to default database**
   ```bash
   # Update your .env file to use existing database
   DB_NAME=postgres
   DB_USER=postgres
   DB_PASSWORD=your_postgres_password
   ```

2. **Let the app create tables in default database**
   - The Go application will create all tables automatically
   - You can rename or migrate later

### Verify Database Setup

#### Test 1: Check Connection
```bash
# Try to connect (replace path as needed)
"C:\Program Files\PostgreSQL\15\bin\psql.exe" -U golfezz_user -d golfezz_db -h localhost

# If successful, you should see:
# golfezz_db=>
```

#### Test 2: List Databases
```sql
-- Inside psql, list all databases
\l

-- Should show golfezz_db in the list
```

#### Test 3: Check User Permissions
```sql
-- Connect as golfezz_user
\c golfezz_db golfezz_user

-- Try creating a test table
CREATE TABLE test_table (id INT);

-- If successful, drop it
DROP TABLE test_table;
```

### Update Backend Configuration

Once PostgreSQL is set up, update your backend `.env` file:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=golfezz_user
DB_PASSWORD=golfezz_password
DB_NAME=golfezz_db
DB_SSLMODE=disable

# Redis Configuration (optional for now)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=8080
GIN_MODE=debug
```

### Test the Application

1. **Navigate to backend directory**
   ```bash
   cd d:\GolfEzz\backend
   ```

2. **Install dependencies**
   ```bash
   go mod tidy
   ```

3. **Run the application**
   ```bash
   go run main.go
   ```

4. **Expected output (success)**
   ```
   2025/07/13 02:XX:XX Connected to database successfully
   2025/07/13 02:XX:XX Database migration completed
   2025/07/13 02:XX:XX Server starting on port 8080
   [GIN-debug] Listening and serving HTTP on :8080
   ```

### Troubleshooting Common Issues

#### Issue 1: "psql: command not found"
**Solution**: Add PostgreSQL bin directory to PATH or use full path

#### Issue 2: "password authentication failed"
**Solutions**:
- Reset postgres password through Windows Services
- Try connecting without password (some installations allow this)
- Use pgAdmin to reset user password

#### Issue 3: "database does not exist"
**Solution**: Create database using pgAdmin or SQL commands above

#### Issue 4: "permission denied"
**Solution**: Grant proper privileges using the SQL commands above

#### Issue 5: "connection refused"
**Solutions**:
- Ensure PostgreSQL service is running in Windows Services
- Check if port 5432 is correct
- Try different host (127.0.0.1 instead of localhost)

### Alternative: Fresh PostgreSQL Installation

If you can't configure your existing PostgreSQL, you can install a fresh instance:

1. **Download PostgreSQL**
   - Go to: https://www.postgresql.org/download/windows/
   - Download version 15.x

2. **Install with custom port**
   - During installation, use port 5433 (to avoid conflict)
   - Set postgres user password

3. **Update .env file**
   ```env
   DB_PORT=5433
   ```

### Success Verification

After setup, verify everything works:

1. **Backend connects successfully**
2. **Tables are created automatically** (15+ tables)
3. **Sample data is seeded** (roles, membership types, default course)
4. **API endpoints respond** (try http://localhost:8080/api/v1/public/courses)

Once this setup is complete, your GolfEzz application will have a fully functional database ready for development and testing!

## 🗄️ Detailed Database Setup

### Option 1: Using Existing PostgreSQL (Your Situation)

Since you already have PostgreSQL running on port 5432, let's use it:

#### Step 1: Create Database and User
```bash
# Connect to PostgreSQL as superuser
psql -U postgres

# Create the database
CREATE DATABASE golfezz_db;

# Create the user with password
CREATE USER golfezz_user WITH PASSWORD 'golfezz_password';

# Grant all privileges
GRANT ALL PRIVILEGES ON DATABASE golfezz_db TO golfezz_user;

# Connect to the new database
\c golfezz_db

# Grant schema privileges
GRANT ALL ON SCHEMA public TO golfezz_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO golfezz_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO golfezz_user;

# Exit PostgreSQL
\q
```

#### Step 2: Create Backend Environment File
```bash
# Navigate to backend directory
cd backend

# Copy the example environment file
cp .env.example .env
# On Windows: copy .env.example .env
```

The `.env` file should contain:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=golfezz_user
DB_PASSWORD=golfezz_password
DB_NAME=golfezz_db
DB_SSLMODE=disable

# Redis (you can install separately or skip for now)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h
```

#### Step 3: Test Database Connection and Initialize Schema
```bash
cd backend
go run main.go
```

### Option 2: Using Docker (Alternative)

#### Step 1: Create Environment File
```bash
# Navigate to backend directory
cd backend

# Copy the example environment file
cp .env.example .env
# On Windows: copy .env.example .env
```

**Important**: The `.env` file must match the Docker credentials:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=golfezz_user
DB_PASSWORD=golfezz_password
DB_NAME=golfezz_db
DB_SSLMODE=disable
```

#### Step 2: Start PostgreSQL and Redis with Docker Compose
```bash
# From the root directory
docker-compose up -d postgres redis
```

#### Step 3: Verify containers are running
```bash
# Verify containers are running
docker-compose ps
```

#### Step 4: Check Database Connection
```bash
# Connect to PostgreSQL container
docker exec -it golfezz-postgres psql -U golfezz -d golfezz_db

# Inside PostgreSQL, check if database exists
\l

# Exit PostgreSQL
\q
```

#### Step 5: Initialize Database Schema
The Go application will automatically create tables when you first run it:
```bash
cd backend
go run main.go
```

### Option 2: Manual PostgreSQL Installation

#### Step 1: Install PostgreSQL
**Windows:**
1. Download PostgreSQL from https://www.postgresql.org/download/windows/
2. Run the installer and follow the setup wizard
3. Remember the password you set for the 'postgres' user
4. Default port is 5432

**macOS:**
```bash
# Using Homebrew
brew install postgresql@15
brew services start postgresql@15
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql-15 postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### Step 2: Create Database and User
```bash
# Switch to postgres user
sudo -u postgres psql

# Create database
CREATE DATABASE golfezz_db;

# Create user
CREATE USER golfezz WITH PASSWORD 'your_secure_password';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE golfezz_db TO golfezz;

# Grant schema privileges
\c golfezz_db
GRANT ALL ON SCHEMA public TO golfezz;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO golfezz;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO golfezz;

# Exit
\q
```

#### Step 3: Install Redis
**Windows:**
1. Download Redis from https://github.com/microsoftarchive/redis/releases
2. Extract and run redis-server.exe

**macOS:**
```bash
brew install redis
brew services start redis
```

**Linux:**
```bash
sudo apt install redis-server
sudo systemctl start redis
sudo systemctl enable redis
```

#### Step 4: Configure Backend Environment
```bash
cd backend
cp .env.example .env
```

Edit the `.env` file with your database credentials:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=golfezz
DB_PASSWORD=your_secure_password
DB_NAME=golfezz_db
DB_SSLMODE=disable

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_in_production

# Server Configuration
PORT=8080
GIN_MODE=debug
```

#### Step 5: Initialize the Database Schema
```bash
cd backend

# Install Go dependencies
go mod download

# Run the application (this will create all tables)
go run main.go
```

### Database Schema Overview

The application will automatically create the following tables:

#### Core Tables:
- **users** - User accounts and authentication
- **roles** - User roles (Admin, Manager, Staff, Member, Guest)
- **membership_types** - Membership tiers and benefits
- **golf_courses** - Golf course information
- **holes** - Individual hole details (par, handicap, etc.)

#### Booking System:
- **bookings** - Tee time reservations
- **booking_players** - Players associated with bookings

#### Range Management:
- **range_sessions** - Driving range session tracking
- **range_equipment** - Equipment rentals during sessions
- **ball_buckets** - Ball bucket usage tracking

#### Payment System:
- **payments** - Payment transactions
- **membership_payments** - Membership fee payments

#### System Tables:
- **green_conditions** - Daily green speed and course conditions
- **system_settings** - Application configuration
- **audit_logs** - Complete audit trail

### Verifying Database Setup

#### Check Table Creation
```sql
-- Connect to the database
psql -h localhost -U golfezz -d golfezz_db

-- List all tables
\dt

-- Check a specific table structure
\d users

-- Verify sample data
SELECT * FROM roles;
SELECT * FROM membership_types;
```

#### Expected Tables:
```
 Schema |        Name         | Type  | Owner
--------+---------------------+-------+--------
 public | audit_logs          | table | golfezz
 public | ball_buckets        | table | golfezz
 public | booking_players     | table | golfezz
 public | bookings            | table | golfezz
 public | golf_courses        | table | golfezz
 public | green_conditions    | table | golfezz
 public | holes               | table | golfezz
 public | membership_payments | table | golfezz
 public | membership_types    | table | golfezz
 public | payments            | table | golfezz
 public | range_equipment     | table | golfezz
 public | range_sessions      | table | golfezz
 public | roles               | table | golfezz
 public | system_settings     | table | golfezz
 public | users               | table | golfezz
```

### Database Seeding

The application automatically seeds the database with:

#### Default Roles:
```sql
INSERT INTO roles (name, description) VALUES 
('admin', 'Full system access'),
('manager', 'Course management access'),
('staff', 'Limited operational access'),
('member', 'Member portal access'),
('guest', 'Public access only');
```

#### Default Membership Types:
```sql
INSERT INTO membership_types (name, price, benefits, duration_months) VALUES 
('Basic', 100.00, 'Access to course and range', 12),
('Premium', 200.00, 'Priority booking and discounts', 12),
('VIP', 500.00, 'All benefits plus exclusive access', 12);
```

#### Sample Golf Course:
```sql
INSERT INTO golf_courses (name, address, phone, email, holes_count, par) VALUES 
('GolfEzz Championship Course', '123 Golf Lane, Golf City', '555-0123', 'info@golfezz.com', 18, 72);
```

### Database Backup and Restore

#### Create Backup:
```bash
# Using Docker
docker exec golfezz-postgres pg_dump -U golfezz golfezz_db > backup.sql

# Using local PostgreSQL
pg_dump -h localhost -U golfezz -d golfezz_db > backup.sql
```

#### Restore from Backup:
```bash
# Using Docker
docker exec -i golfezz-postgres psql -U golfezz -d golfezz_db < backup.sql

# Using local PostgreSQL
psql -h localhost -U golfezz -d golfezz_db < backup.sql
```

### Troubleshooting Database Issues

#### Common Problems and Solutions:

1. **Connection Refused:**
   ```bash
   # Check if PostgreSQL is running
   sudo systemctl status postgresql
   # or for Docker
   docker-compose ps postgres
   ```

2. **Authentication Failed:**
   - Verify username/password in `.env` file
   - Check `pg_hba.conf` for authentication method
   - Ensure user has proper permissions

3. **Database Does Not Exist:**
   ```sql
   -- Create database if it doesn't exist
   CREATE DATABASE golfezz_db;
   ```

4. **Permission Denied:**
   ```sql
   -- Grant necessary permissions
   GRANT ALL PRIVILEGES ON DATABASE golfezz_db TO golfezz;
   GRANT ALL ON SCHEMA public TO golfezz;
   ```

5. **Tables Not Created:**
   - Check Go application logs for GORM errors
   - Verify database connection in logs
   - Ensure GORM AutoMigrate is running

#### Database Performance Optimization:

```sql
-- Create indexes for better performance
CREATE INDEX idx_bookings_date ON bookings(booking_date);
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_range_sessions_user ON range_sessions(user_id);
```

### Production Database Considerations

#### Security:
- Change default passwords
- Use SSL connections (`DB_SSLMODE=require`)
- Restrict database access to application servers only
- Regular security updates

#### Monitoring:
- Set up database monitoring (pg_stat_statements)
- Monitor connection pools
- Track slow queries
- Set up alerting for database health

#### Backup Strategy:
- Automated daily backups
- Point-in-time recovery setup
- Test restore procedures regularly
- Off-site backup storage

## 🎯 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Token refresh
- `GET /api/v1/auth/profile` - Get user profile
- `POST /api/v1/auth/change-password` - Change password

### Bookings
- `POST /api/v1/bookings` - Create booking
- `GET /api/v1/bookings/my` - Get user bookings
- `GET /api/v1/bookings/{id}` - Get booking details
- `PUT /api/v1/bookings/{id}` - Update booking
- `POST /api/v1/bookings/{id}/cancel` - Cancel booking
- `GET /api/v1/bookings/available-slots` - Get available tee times

### Range Sessions
- `POST /api/v1/range/sessions` - Start range session
- `GET /api/v1/range/sessions/active` - Get active sessions
- `GET /api/v1/range/sessions/{id}` - Get session details
- `POST /api/v1/range/sessions/{id}/end` - End session
- `POST /api/v1/range/sessions/{id}/buckets` - Add ball bucket
- `POST /api/v1/range/sessions/{id}/equipment` - Add equipment

### Public Information
- `GET /api/v1/public/courses` - Get golf courses
- `GET /api/v1/public/green-conditions` - Get green conditions

## 🧪 Testing

### Backend Testing
```bash
cd backend
go test ./...
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📦 Deployment

### Production Deployment
1. Update environment variables for production
2. Configure SSL certificates in nginx
3. Set up monitoring and logging
4. Configure backup strategies for PostgreSQL

### Environment Variables

#### Required Backend Variables
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- `JWT_SECRET` (change in production!)
- `REDIS_HOST`, `REDIS_PORT`

#### Required Frontend Variables
- `NEXT_PUBLIC_API_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

### Code Style
- **Backend**: Follow Go conventions, use `gofmt`
- **Frontend**: Use Prettier and ESLint configurations
- **Commits**: Use conventional commits format

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

### Manual Setup Requirements

The following components require manual setup that cannot be automated by the agent:

#### 1. Environment Configuration
- Copy `.env.example` files and configure with your specific values
- Update JWT secrets and database passwords for production

#### 2. SSL Certificates (Production)
- Generate SSL certificates for HTTPS
- Place certificates in `nginx/ssl/` directory
- Update nginx configuration for SSL

#### 3. External Services Integration
- Configure SMTP for email notifications
- Set up payment processor (Stripe) credentials
- Configure Google Maps API for course location features

#### 4. Database Backups
- Set up automated PostgreSQL backups
- Configure backup storage (AWS S3, etc.)

#### 5. Monitoring and Logging
- Set up application monitoring (Prometheus, Grafana)
- Configure log aggregation (ELK stack)

#### 6. Load Balancing (High Traffic)
- Configure multiple backend instances
- Set up load balancer configuration

### Troubleshooting

#### Common Issues
1. **Database Connection Errors**: Ensure PostgreSQL is running and credentials are correct
2. **Frontend API Errors**: Check NEXT_PUBLIC_API_URL environment variable
3. **Docker Permission Issues**: Ensure Docker daemon is running with proper permissions
4. **Port Conflicts**: Ensure ports 3000, 8080, 5432, 6379 are available

#### Getting Help
- Check the logs: `docker-compose logs [service-name]`
- Verify environment variables are set correctly
- Ensure all services are healthy: `docker-compose ps`

---

**Built with ❤️ for the golf community**
