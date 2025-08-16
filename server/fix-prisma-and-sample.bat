@echo off
echo.
echo ========================================
echo   Fixing Prisma Client & Sample Data
echo ========================================
echo.

echo Step 1: Generating Prisma Client...
call npx prisma generate
if %errorlevel% neq 0 (
    echo ❌ Failed to generate Prisma client
    pause
    exit /b 1
)
echo ✅ Prisma client generated successfully
echo.

echo Step 2: Creating sample data...
call npm run sample:data
if %errorlevel% neq 0 (
    echo ❌ Failed to create sample data
    pause
    exit /b 1
)
echo.

echo ========================================
echo   ✅ Setup Complete!
echo ========================================
echo.
echo Your database now contains sample data!
echo.
pause
