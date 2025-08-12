import uvicorn
from app.core.database import create_tables
from app.models.body_mapping import Base

def main():
    """Main startup function"""
    print("Starting Body Feel Map Backend...")
    
    # Create database tables
    try:
        create_tables()
        print("Database tables created successfully")
    except Exception as e:
        print(f"Warning: Could not create database tables: {e}")
        print("Make sure your database is running and accessible")
    
    # Start the server
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )

if __name__ == "__main__":
    main()
