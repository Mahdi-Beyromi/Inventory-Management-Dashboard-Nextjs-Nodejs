Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Sample Data Setup for Dashboard" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Checking if database migrations are needed..." -ForegroundColor Yellow
Write-Host ""

Write-Host "0. Generating Prisma client..." -ForegroundColor Green
npm run prisma:generate
Write-Host ""

Write-Host "1. Creating Orders table (if needed)..." -ForegroundColor Green
npm run migrate:orders
Write-Host ""

Write-Host "2. Adding status field to orders (if needed)..." -ForegroundColor Green
npm run migrate:order-status
Write-Host ""

Write-Host "3. Creating sample data..." -ForegroundColor Green
npm run sample:data
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Your database now contains:" -ForegroundColor White
Write-Host "- Sample products across categories" -ForegroundColor White
Write-Host "- 30 days of sample orders" -ForegroundColor White
Write-Host "- Realistic sales data for Dashboard" -ForegroundColor White
Write-Host ""
Write-Host "You can now test:" -ForegroundColor White
Write-Host "- Sales Report with charts" -ForegroundColor White
Write-Host "- Low Inventory Report" -ForegroundColor White
Write-Host "- Order Management features" -ForegroundColor White
Write-Host ""

Read-Host "Press Enter to continue"
