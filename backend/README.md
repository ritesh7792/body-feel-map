# Body Feel Map Backend

A FastAPI-based backend service for the Body Feel Map application, providing emotion analysis based on body sensations.

## Features

- **Body Mapping API**: Store and retrieve body sensation mappings
- **Emotion Analysis**: AI-powered emotion detection based on somatic research
- **RESTful API**: Clean, documented endpoints for frontend integration
- **Database Storage**: PostgreSQL with SQLAlchemy ORM
- **Session Management**: Track user sessions and body mapping data
- **CORS Support**: Configured for frontend communication

## Tech Stack

- **Framework**: FastAPI 0.104.1
- **Python**: 3.11+
- **Database**: PostgreSQL with SQLAlchemy
- **Cache**: Redis (optional)
- **Task Queue**: Celery (optional)
- **Validation**: Pydantic
- **Authentication**: JWT (planned)

## Project Structure

```
backend/
├── app/
│   ├── core/           # Configuration and database
│   ├── models/         # SQLAlchemy models
│   ├── schemas/        # Pydantic schemas
│   ├── services/       # Business logic
│   └── routers/        # API endpoints
├── main.py             # FastAPI application entry point
├── start.py            # Startup script with database initialization
├── requirements.txt    # Python dependencies
├── Dockerfile          # Container configuration
├── docker-compose.yml  # Multi-service setup
└── env.example         # Environment variables template
```

## Quick Start

### Prerequisites

- Python 3.11+
- PostgreSQL
- Redis (optional)

### Local Development

1. **Clone and navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your database credentials
   ```

5. **Start the server**
   ```bash
   python start.py
   ```

   Or use uvicorn directly:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

### Docker Setup

1. **Start all services**
   ```bash
   docker-compose up -d
   ```

2. **View logs**
   ```bash
   docker-compose logs -f backend
   ```

3. **Stop services**
   ```bash
   docker-compose down
   ```

## API Endpoints

### Body Mapping

- `POST /api/v1/body-mappings/` - Create new body mapping
- `GET /api/v1/body-mappings/{id}` - Get mapping by ID
- `GET /api/v1/body-mappings/session/{session_id}` - Get mapping by session
- `PUT /api/v1/body-mappings/{id}` - Update mapping
- `DELETE /api/v1/body-mappings/{id}` - Delete mapping
- `POST /api/v1/body-mappings/{id}/sensations/` - Add sensation

### Emotion Analysis

- `POST /api/v1/emotions/analyze` - Analyze emotions from markings
- `GET /api/v1/emotions/body-mapping/{id}` - Analyze from saved mapping
- `GET /api/v1/emotions/session/{session_id}` - Analyze from session
- `GET /api/v1/emotions/patterns` - Get emotion patterns
- `GET /api/v1/emotions/sensations` - Get sensation types

### Health & Info

- `GET /` - API information
- `GET /health` - Health check
- `GET /docs` - Interactive API documentation (Swagger UI)

## Database Schema

### Users
- Basic user information and authentication

### Body Mappings
- Session tracking and user association

### Sensations
- Individual body region sensations with type and view

### Emotion Analysis
- Stored emotion results with confidence scores

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:password@localhost/bodyfeelmap` |
| `SECRET_KEY` | JWT signing key | `your-secret-key-here` |
| `REDIS_URL` | Redis connection string | `redis://localhost:6379` |
| `ALLOWED_ORIGINS` | CORS allowed origins | `http://localhost:3000,http://localhost:5173` |

## Development

### Adding New Endpoints

1. Create route handlers in `app/routers/`
2. Add schemas in `app/schemas/`
3. Include router in `main.py`
4. Update API documentation

### Database Migrations

```bash
# Install alembic
pip install alembic

# Initialize (first time)
alembic init alembic

# Create migration
alembic revision --autogenerate -m "Description"

# Apply migration
alembic upgrade head
```

### Testing

```bash
# Install test dependencies
pip install pytest pytest-asyncio httpx

# Run tests
pytest
```

## Deployment

### Production Considerations

- Use environment-specific configuration
- Set up proper database connections
- Configure CORS for production domains
- Enable HTTPS
- Set up monitoring and logging
- Use production-grade WSGI server (Gunicorn)

### Environment Setup

```bash
# Production environment
export DATABASE_URL="postgresql://user:pass@prod-db/bodyfeelmap"
export SECRET_KEY="your-production-secret-key"
export ALLOWED_ORIGINS="https://yourdomain.com"
```

## Contributing

1. Follow PEP 8 style guidelines
2. Add type hints to all functions
3. Include docstrings for public methods
4. Write tests for new functionality
5. Update API documentation

## License

This project is part of the Body Feel Map application.
