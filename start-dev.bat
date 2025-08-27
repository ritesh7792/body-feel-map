@echo off
REM Body Feel Map - Development Startup Script for Windows
REM This script starts both the backend and frontend services

echo 🚀 Starting Body Feel Map Development Environment...
echo ==================================================

REM Check if .env file exists in backend
if not exist "backend\.env" (
    echo ⚠️  No .env file found in backend directory
    echo 📝 Creating .env from template...
    copy "backend\env.example" "backend\.env"
    echo ⚠️  Please edit backend\.env and add your API keys before continuing
    echo    Press Enter when ready, or Ctrl+C to cancel...
    pause
)

REM Start backend
echo 📦 Starting backend service...
cd backend
start "Backend Service" cmd /k "docker-compose up"
cd ..

REM Wait a bit for backend to start
echo ⏳ Waiting for backend to start...
timeout /t 10 /nobreak > nul

REM Start frontend
echo 🌐 Starting frontend service...
cd src
start "Frontend Service" cmd /k "npm run dev"
cd ..

echo.
echo 🎉 Development environment is starting!
echo ==================================================
echo 🌐 Frontend: http://localhost:5173
echo 📦 Backend: http://localhost:8000
echo 📚 API Docs: http://localhost:8000/docs
echo.
echo 💡 Close the command windows to stop the services
echo    Or use 'docker-compose down' in the backend directory

REM Keep the main window open
pause
