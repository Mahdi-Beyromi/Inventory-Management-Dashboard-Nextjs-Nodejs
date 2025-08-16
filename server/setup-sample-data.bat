@echo off
echo.
echo ========================================
echo   Sample Data Setup for Dashboard
echo ========================================
echo.

echo Checking if database migrations are needed...
echo.

echo 0. Generating Prisma client...
call npx prisma generate
echo.

echo 1. Creating Orders table (if needed)...
call npm run migrate:orders
echo.

echo 2. Adding status field to orders (if needed)...
call npm run migrate:order-status
echo.

echo 3. Creating sample data...
call npm run sample:data
echo.

echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo Your database now contains:
echo - Sample products across categories
echo - 30 days of sample orders
echo - Realistic sales data for Dashboard
echo.
echo You can now test:
echo - Sales Report with charts
echo - Low Inventory Report
echo - Order Management features
echo.
pause
