# 🚀 Development Startup Scripts

This project includes convenient scripts to start both the frontend and backend services simultaneously.

## 📋 Available Scripts

### 🐧 **Linux/macOS (Bash)**
```bash
# Make executable (first time only)
chmod +x start-dev.sh

# Start both services
./start-dev.sh

# Or use npm script
npm run start:full
```

### 🪟 **Windows (Batch)**
```cmd
# Start both services
start-dev.bat

# Or use npm script
npm run start:full:win
```

### 📦 **NPM Scripts (Cross-platform)**
```bash
# Start only backend
npm run start:backend

# Stop only backend
npm run stop:backend

# Start both services (Linux/macOS)
npm run start:full

# Start both services (Windows)
npm run start:full:win
```

## 🔧 **What the Scripts Do**

### **Backend Service:**
- ✅ Checks if Docker is running
- ✅ Creates `.env` from template if missing
- ✅ Starts backend container with `docker-compose up -d`
- ✅ Waits for backend to be healthy
- ✅ Shows backend logs if startup fails

### **Frontend Service:**
- ✅ Starts Vite dev server with `npm run dev`
- ✅ Waits for frontend to be accessible
- ✅ Runs in background process

### **Smart Features:**
- 🚨 **Error handling** - Exits on any failure
- 🧹 **Cleanup** - Stops all services on Ctrl+C
- 🔍 **Health checks** - Waits for services to be ready
- 🎨 **Colored output** - Easy to read status messages
- 📝 **Auto-config** - Creates `.env` from template

## 🌐 **Service URLs**

Once started, your services will be available at:

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## 🛑 **Stopping Services**

### **Option 1: Script Cleanup (Recommended)**
- Press `Ctrl+C` in the script terminal
- All services will be stopped automatically

### **Option 2: Manual Stop**
```bash
# Stop backend
npm run stop:backend

# Stop frontend
# Close the frontend terminal window
```

### **Option 3: Docker Commands**
```bash
# Stop all containers
docker-compose down

# Stop and remove containers
docker-compose down --remove-orphans
```

## ⚠️ **Prerequisites**

1. **Docker Desktop** running
2. **Node.js** and **npm** installed
3. **API keys** configured in `backend/.env`

## 🔑 **First Time Setup**

1. **Copy environment template:**
   ```bash
   cp backend/env.example backend/.env
   ```

2. **Edit `.env` file:**
   ```bash
   # Add your API keys
   GEMINI_API_KEY=your_actual_key_here
   OPENAI_API_KEY=your_actual_key_here
   ```

3. **Install dependencies:**
   ```bash
   npm install
   cd backend && pip install -r requirements.txt
   ```

## 🚨 **Troubleshooting**

### **Backend Won't Start:**
- Check if Docker is running
- Verify `.env` file exists and has valid API keys
- Check backend logs: `docker-compose logs backend`

### **Frontend Won't Start:**
- Verify Node.js is installed
- Check if port 5173 is available
- Run `npm install` to ensure dependencies are installed

### **Port Conflicts:**
- Backend uses port 8000
- Frontend uses port 5173
- Change ports in `vite.config.ts` and `docker-compose.yml` if needed

## 📚 **Additional Commands**

```bash
# View backend logs
cd backend && docker-compose logs -f backend

# Restart backend only
cd backend && docker-compose restart backend

# Check service status
cd backend && docker-compose ps

# Rebuild backend
cd backend && docker-compose up --build -d
```

---

**💡 Pro Tip:** Use `npm run start:full` for the most convenient development experience!
