@echo off
echo iTea E-commerce Application Startup
echo ====================================
echo.

echo Step 1: Changing to backend directory...
cd backend
echo.

echo Step 2: Initializing database...
echo This will create tables and insert sample data
node init-db.js
echo.

echo Step 3: Starting the server...
echo The application will be available at http://localhost:3000
echo Press Ctrl+C to stop the server
echo.

node server.js 