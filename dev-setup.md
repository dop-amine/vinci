# 🚀 Vinci Development Setup

## Quick Start

### 1. Start the Database
```bash
# Start PostgreSQL with Docker
docker compose up -d

# Check database is running
docker compose ps
```

### 2. Environment Configuration
Create a `.env` file in the project root:

```env
# Database Configuration
DATABASE_URI=postgresql://vinci_user:vinci_password@localhost:5433/vinci_dev

# Payload CMS Configuration
PAYLOAD_SECRET=your-super-secret-key-here-minimum-32-characters-long

# Application URLs
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Development Settings
NODE_ENV=development
```

### 3. Start the Application
```bash
# Install dependencies (if not done already)
npm install

# Start the development server
npm run dev
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
- **API Docs**: http://localhost:3000/api/docs

## Database Management

### View Database Logs
```bash
docker compose logs postgres
```

### Connect to Database (optional)
```bash
# Using psql command line
docker compose exec postgres psql -U vinci_user -d vinci_dev

# Or connect from host
psql -h localhost -p 5433 -U vinci_user -d vinci_dev
```

### Stop Database
```bash
# Stop database (keeps data)
docker compose stop

# Stop and remove containers (keeps data)
docker compose down

# Remove everything including data volumes (⚠️ destroys data)
docker compose down -v
```

## Useful Development Commands

```bash
# Generate TypeScript types
npm run generate:types

# Build for production
npm run build

# Start production server
npm run start

# Lint code
npm run lint

# Run tests
npm run test
```

## First Time Setup

1. Start the database: `docker compose up -d`
2. Create your `.env` file with the configuration above
3. Install dependencies: `npm install`
4. Start development: `npm run dev`
5. Create your first admin user at: http://localhost:3000/admin

## Benefits of This Setup

✅ **Fast Development**: No Docker overhead for the app
✅ **Easy Debugging**: Full Node.js debugging capabilities
✅ **Hot Reloading**: Instant file change detection
✅ **Simple Database**: Isolated PostgreSQL in Docker
✅ **Cross-Platform**: Works on Mac, Windows, Linux
✅ **Production Ready**: Same code builds for Docker deployment