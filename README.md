# Body Feel Map

An interactive web application that helps users map physical sensations on their body and receive emotional analysis based on those sensations. Built with a Python FastAPI backend and TypeScript React frontend.

## 🏗️ Architecture

This project now follows a **backend/frontend separation**:

- **Backend**: Python FastAPI server with PostgreSQL database
- **Frontend**: TypeScript React application with Vite

## 🚀 Quick Start

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Set up Python environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Configure environment**
   ```bash
   cp env.example .env
   # Edit .env with your database credentials
   ```

4. **Start backend server**
   ```bash
   python start.py
   # Or: uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

   The API will be available at `http://localhost:8000`
   - API docs: `http://localhost:8000/docs`
   - Health check: `http://localhost:8000/health`

### Frontend Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:5173`

### Docker Setup (Alternative)

```bash
cd backend
docker-compose up -d
```

This will start:
- Backend API on port 8000
- PostgreSQL database on port 5432
- Redis cache on port 6379

## 🔧 Development

### Backend Development

- **Framework**: FastAPI with Python 3.11+
- **Database**: PostgreSQL with SQLAlchemy ORM
- **API Documentation**: Automatic Swagger UI generation
- **Validation**: Pydantic schemas
- **Structure**: Modular architecture with routers, services, and models

### Frontend Development

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development
- **UI Components**: shadcn/ui with Tailwind CSS
- **State Management**: React hooks
- **API Integration**: RESTful API calls to Python backend

## 📁 Project Structure

```
body-feel-map/
├── backend/                 # Python FastAPI backend
│   ├── app/
│   │   ├── core/           # Configuration & database
│   │   ├── models/         # SQLAlchemy models
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── services/       # Business logic
│   │   └── routers/        # API endpoints
│   ├── main.py             # FastAPI app entry point
│   ├── start.py            # Startup script
│   ├── requirements.txt    # Python dependencies
│   ├── Dockerfile          # Container config
│   └── docker-compose.yml  # Multi-service setup
├── src/                    # TypeScript React frontend
│   ├── components/         # React components
│   ├── services/           # API service layer
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Utility functions
├── package.json            # Frontend dependencies
└── README.md               # This file
```

## 🌐 API Endpoints

### Body Mapping
- `POST /api/v1/body-mappings/` - Create new mapping
- `GET /api/v1/body-mappings/{id}` - Get mapping by ID
- `PUT /api/v1/body-mappings/{id}` - Update mapping
- `DELETE /api/v1/body-mappings/{id}` - Delete mapping

### Emotion Analysis
- `POST /api/v1/emotions/analyze` - Analyze emotions from markings
- `GET /api/v1/emotions/patterns` - Get emotion patterns
- `GET /api/v1/emotions/sensations` - Get sensation types

## 🧠 How It Works

1. **Body Mapping**: Users click on different body regions to mark sensations
2. **Sensation Types**: Choose from 5 categories (hot, warm, cool, cold, numb)
3. **Analysis**: Backend analyzes patterns using established somatic research
4. **Results**: Emotional insights with confidence scores and descriptions

## 🔬 Scientific Basis

The emotion analysis is grounded in **established body mapping research** that correlates physical sensations with emotional states:

- **Anger**: Heat in head, chest, and arms
- **Sadness**: Coldness in limbs, reduced chest activity
- **Fear**: Hot head/chest with cold extremities
- **Love**: Warmth throughout, especially in chest
- **Anxiety**: Hot head/chest with cold hands/feet

## 🚀 Deployment

### Backend Deployment
- Use production WSGI server (Gunicorn)
- Set up PostgreSQL database
- Configure environment variables
- Enable HTTPS and proper CORS

### Frontend Deployment
- Build with `npm run build`
- Serve static files from backend or CDN
- Update API base URL for production

## 🤝 Contributing

1. Follow the established code structure
2. Add type hints and documentation
3. Write tests for new functionality
4. Update API documentation
5. Follow PEP 8 (Python) and ESLint (TypeScript) guidelines

## 📚 Documentation

- **Backend**: See `backend/README.md` for detailed backend documentation
- **API**: Interactive docs available at `/docs` when backend is running
- **Frontend**: Component documentation in `src/components/`

## 🔗 Links

- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Frontend**: http://localhost:5173
- **Project URL**: https://lovable.dev/projects/a5b090eb-9699-4e66-993a-d018955df94c
