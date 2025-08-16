Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Inventory Management Dashboard" -ForegroundColor Cyan
Write-Host "  Docker Startup Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Checking Docker status..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version
    Write-Host "✓ Docker is installed: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ ERROR: Docker is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Docker Desktop from: https://www.docker.com/products/docker-desktop/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "Checking if Docker Desktop is running..." -ForegroundColor Yellow
try {
    docker info | Out-Null
    Write-Host "✓ Docker Desktop is running!" -ForegroundColor Green
} catch {
    Write-Host "✗ ERROR: Docker Desktop is not running!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Steps to fix:" -ForegroundColor Yellow
    Write-Host "1. Open Docker Desktop" -ForegroundColor White
    Write-Host "2. Wait for it to fully start (green status)" -ForegroundColor White
    Write-Host "3. Run this script again" -ForegroundColor White
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "Docker Desktop is running! Starting services..." -ForegroundColor Green
Write-Host ""

Write-Host "Building and starting all services..." -ForegroundColor Yellow
try {
    docker-compose up --build -d
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  Services started successfully!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Your application is now running at:" -ForegroundColor White
    Write-Host "- Frontend: http://localhost:3000" -ForegroundColor Cyan
    Write-Host "- Backend API: http://localhost:3001" -ForegroundColor Cyan
    Write-Host "- Database: localhost:5432" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Useful commands:" -ForegroundColor White
    Write-Host "- View logs: docker-compose logs -f" -ForegroundColor Gray
    Write-Host "- Stop services: docker-compose down" -ForegroundColor Gray
    Write-Host "- Restart: docker-compose restart" -ForegroundColor Gray
    Write-Host ""
    
    $choice = Read-Host "Press Enter to view logs, or 'n' to exit"
    if ($choice -ne 'n') {
        docker-compose logs -f
    }
} catch {
    Write-Host ""
    Write-Host "✗ ERROR: Failed to start services" -ForegroundColor Red
    Write-Host "Check the error messages above" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Common solutions:" -ForegroundColor Yellow
    Write-Host "1. Make sure ports 3000, 3001, and 5432 are not in use" -ForegroundColor White
    Write-Host "2. Try: docker-compose down -v" -ForegroundColor Gray
    Write-Host "3. Then run: docker-compose up --build" -ForegroundColor Gray
    Write-Host ""
    Read-Host "Press Enter to exit"
}
