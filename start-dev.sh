#!/bin/bash

# Body Feel Map - Development Startup Script
# This script starts both the backend and frontend services

set -e  # Exit on any error

echo "🚀 Starting Body Feel Map Development Environment..."
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to cleanup background processes on exit
cleanup() {
    echo -e "\n${YELLOW}🛑 Shutting down services...${NC}"
    
    # Kill backend container
    if docker-compose ps | grep -q "backend"; then
        echo -e "${BLUE}📦 Stopping backend container...${NC}"
        docker-compose down
    fi
    
    # Kill frontend process
    if [ ! -z "$FRONTEND_PID" ]; then
        echo -e "${BLUE}🌐 Stopping frontend process...${NC}"
        kill $FRONTEND_PID 2>/dev/null || true
    fi
    
    echo -e "${GREEN}✅ All services stopped${NC}"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running. Please start Docker Desktop first.${NC}"
    exit 1
fi

# Check if .env file exists in backend
if [ ! -f "backend/.env" ]; then
    echo -e "${YELLOW}⚠️  No .env file found in backend directory${NC}"
    echo -e "${BLUE}📝 Creating .env from template...${NC}"
    cp backend/env.example backend/.env
    echo -e "${YELLOW}⚠️  Please edit backend/.env and add your API keys before continuing${NC}"
    echo -e "${BLUE}   Press Enter when ready, or Ctrl+C to cancel...${NC}"
    read
fi

# Start backend
echo -e "${BLUE}📦 Starting backend service...${NC}"
cd backend
docker-compose up -d
cd ..

# Wait for backend to be ready
echo -e "${BLUE}⏳ Waiting for backend to be ready...${NC}"
for i in {1..30}; do
    if curl -s http://localhost:8000/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Backend is ready!${NC}"
        break
    fi
    
    if [ $i -eq 30 ]; then
        echo -e "${RED}❌ Backend failed to start within 30 seconds${NC}"
        echo -e "${BLUE}📋 Checking backend logs...${NC}"
        cd backend
        docker-compose logs backend
        cd ..
        exit 1
    fi
    
    echo -n "."
    sleep 1
done

# Start frontend
echo -e "${BLUE}🌐 Starting frontend service...${NC}"
cd src
npm run dev &
FRONTEND_PID=$!
cd ..

# Wait for frontend to be ready
echo -e "${BLUE}⏳ Waiting for frontend to be ready...${NC}"
for i in {1..30}; do
    if curl -s http://localhost:5173 > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Frontend is ready!${NC}"
        break
    fi
    
    if [ $i -eq 30 ]; then
        echo -e "${RED}❌ Frontend failed to start within 30 seconds${NC}"
        exit 1
    fi
    
    echo -n "."
    sleep 1
done

echo ""
echo -e "${GREEN}🎉 Development environment is ready!${NC}"
echo "=================================================="
echo -e "${BLUE}🌐 Frontend:${NC} http://localhost:5173"
echo -e "${BLUE}📦 Backend:${NC} http://localhost:8000"
echo -e "${BLUE}📚 API Docs:${NC} http://localhost:8000/docs"
echo ""
echo -e "${YELLOW}💡 Press Ctrl+C to stop all services${NC}"

# Keep script running and wait for interrupt
wait $FRONTEND_PID
