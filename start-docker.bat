@echo off
echo ========================================
echo   Inventory Management Dashboard
echo   Docker Startup Script
echo ========================================
echo.

echo Checking Docker status...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker is not installed or not in PATH
    echo Please install Docker Desktop from: https://www.docker.com/products/docker-desktop/
    pause
    exit /b 1
)

echo Docker is installed. Checking if Docker Desktop is running...
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker Desktop is not running!
    echo Please start Docker Desktop and try again.
    echo.
    echo Steps to fix:
    echo 1. Open Docker Desktop
    echo 2. Wait for it to fully start (green status)
    echo 3. Run this script again
    echo.
    pause
    exit /b 1
)

echo Docker Desktop is running! Starting services...
echo.

echo Building and starting all services...
docker-compose up --build -d

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo   Services started successfully!
    echo ========================================
    echo.
    echo Your application is now running at:
    echo - Frontend: http://localhost:3000
    echo - Backend API: http://localhost:3001
    echo - Database: localhost:5432
    echo.
    echo Useful commands:
    echo - View logs: docker-compose logs -f
    echo - Stop services: docker-compose down
    echo - Restart: docker-compose restart
    echo.
    echo Press any key to view logs...
    pause >nul
    docker-compose logs -f
) else (
    echo.
    echo ERROR: Failed to start services
    echo Check the error messages above
    echo.
    echo Common solutions:
    echo 1. Make sure ports 3000, 3001, and 5432 are not in use
    echo 2. Try: docker-compose down -v
    echo 3. Then run: docker-compose up --build
    echo.
    pause
)
