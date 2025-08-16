# 🐳 Docker Setup Guide

This guide explains how to run your Inventory Management Dashboard using Docker.

## 📋 Prerequisites

- **Docker** (v20.10 or higher)
- **Docker Compose** (v2.0 or higher)
- **Git** (to clone the repository)

## 🚀 Quick Start

### 1. Development Environment

To run the entire project in development mode:

```bash
# Start all services
docker-compose up

# Or run in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### 2. Production Environment

To run the project in production mode:

```bash
# Set environment variables (optional)
export POSTGRES_PASSWORD=your_secure_password

# Start production services
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop production services
docker-compose -f docker-compose.prod.yml down
```

## 🏗️ Architecture

The Docker setup includes three main services:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   PostgreSQL    │    │   Backend       │    │   Frontend      │
│   Database      │    │   Server        │    │   Client        │
│   Port: 5432    │    │   Port: 3001    │    │   Port: 3000    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Docker        │
                    │   Network       │
                    └─────────────────┘
```

## 🔧 Service Details

### PostgreSQL Database
- **Image**: `postgres:15-alpine`
- **Port**: `5432`
- **Database**: `inventory_db`
- **User**: `inventory_user`
- **Password**: `inventory_password` (configurable)
- **Volume**: Persistent data storage
- **Health Check**: Database connectivity verification

### Backend Server
- **Base Image**: `node:18-alpine`
- **Port**: `3001`
- **Features**: 
  - Hot reload in development
  - Prisma ORM integration
  - TypeScript compilation
  - Health checks
- **Dependencies**: PostgreSQL database

### Frontend Client
- **Base Image**: `node:18-alpine`
- **Port**: `3000`
- **Features**:
  - Next.js development server
  - Hot reload
  - TypeScript support
  - Tailwind CSS
- **Dependencies**: Backend server

## 📁 File Structure

```
├── docker-compose.yml              # Development environment
├── docker-compose.prod.yml         # Production environment
├── server/
│   ├── Dockerfile                  # Development server image
│   ├── Dockerfile.prod            # Production server image
│   ├── .dockerignore              # Docker build exclusions
│   └── prisma/
│       └── init.sql               # Database initialization
├── client/
│   ├── Dockerfile                  # Development client image
│   ├── Dockerfile.prod            # Production client image
│   └── .dockerignore              # Docker build exclusions
└── DOCKER_SETUP.md                # This file
```

## 🛠️ Development Commands

### Starting Services
```bash
# Start all services
docker-compose up

# Start specific service
docker-compose up postgres
docker-compose up server
docker-compose up client

# Start in background
docker-compose up -d
```

### Stopping Services
```bash
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Stop specific service
docker-compose stop postgres
```

### Viewing Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f server
docker-compose logs -f client
docker-compose logs -f postgres
```

### Database Operations
```bash
# Access PostgreSQL shell
docker-compose exec postgres psql -U inventory_user -d inventory_db

# Run Prisma commands
docker-compose exec server npx prisma db push
docker-compose exec server npx prisma generate
docker-compose exec server npm run seed
```

### Rebuilding Services
```bash
# Rebuild all services
docker-compose build

# Rebuild specific service
docker-compose build server
docker-compose build client

# Force rebuild (no cache)
docker-compose build --no-cache
```

## 🔒 Security Features

- **Non-root users** in production containers
- **Health checks** for all services
- **Network isolation** between services
- **Environment variable** configuration
- **Volume mounting** for persistent data

## 📊 Monitoring & Health Checks

### Health Check Endpoints
- **PostgreSQL**: Database connectivity
- **Backend**: HTTP endpoint `/health`
- **Frontend**: HTTP endpoint `/`

### Monitoring Commands
```bash
# Check service status
docker-compose ps

# View resource usage
docker stats

# Check health status
docker-compose exec server npm run health
```

## 🚀 Production Deployment

### 1. Environment Setup
```bash
# Create production environment file
cp .env.example .env.prod

# Edit with production values
nano .env.prod
```

### 2. Build and Deploy
```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Start production services
docker-compose -f docker-compose.prod.yml up -d

# Check status
docker-compose -f docker-compose.prod.yml ps
```

### 3. SSL/HTTPS Setup
For production, consider adding:
- **Nginx reverse proxy** for SSL termination
- **Let's Encrypt** for SSL certificates
- **Load balancer** for high availability

## 🔧 Troubleshooting

### Common Issues

#### 1. Port Conflicts
```bash
# Check what's using the ports
netstat -tulpn | grep :3000
netstat -tulpn | grep :3001
netstat -tulpn | grep :5432

# Change ports in docker-compose.yml if needed
```

#### 2. Database Connection Issues
```bash
# Check database logs
docker-compose logs postgres

# Verify database is running
docker-compose exec postgres pg_isready -U inventory_user -d inventory_db
```

#### 3. Build Failures
```bash
# Clear Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache
```

#### 4. Permission Issues
```bash
# Fix file permissions
sudo chown -R $USER:$USER .

# Rebuild containers
docker-compose down
docker-compose up --build
```

### Debug Commands
```bash
# Enter running container
docker-compose exec server sh
docker-compose exec client sh
docker-compose exec postgres bash

# View container details
docker-compose exec server env
docker-compose exec server ps aux

# Check network connectivity
docker-compose exec server ping postgres
docker-compose exec client ping server
```

## 📈 Performance Optimization

### Development
- **Volume mounting** for hot reload
- **Shared node_modules** for faster builds
- **Development mode** with debugging

### Production
- **Multi-stage builds** for smaller images
- **Alpine Linux** base images
- **Non-root users** for security
- **Health checks** for reliability

## 🔄 CI/CD Integration

### GitHub Actions Example
```yaml
name: Docker Build and Deploy

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build and push Docker images
        run: |
          docker-compose -f docker-compose.prod.yml build
          # Add your deployment logic here
```

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [PostgreSQL Docker Image](https://hub.docker.com/_/postgres)
- [Node.js Docker Image](https://hub.docker.com/_/node)

## 🆘 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review Docker and service logs
3. Verify environment variables
4. Check network connectivity between services
5. Ensure all prerequisites are installed

---

**Happy Dockerizing! 🐳**
