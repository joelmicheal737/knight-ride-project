#!/usr/bin/env python3
"""
Knight Ride Backend Server
Run this script to start the FastAPI server
"""

import subprocess
import sys
import os

def install_requirements():
    """Install required packages"""
    try:
        print("Installing required packages...")
        subprocess.check_call([
            sys.executable, "-m", "pip", "install", 
            "fastapi", "uvicorn", "python-jose[cryptography]", 
            "passlib[bcrypt]", "python-multipart", "pymongo", "pyjwt"
        ])
        print("✅ All packages installed successfully!")
    except subprocess.CalledProcessError as e:
        print(f"❌ Error installing packages: {e}")
        sys.exit(1)

def start_server():
    """Start the FastAPI server"""
    try:
        print("🚀 Starting Knight Ride API server...")
        print("📍 Server will be available at: http://localhost:8000")
        print("📚 API Documentation: http://localhost:8000/docs")
        print("🛑 Press Ctrl+C to stop the server")
        
        # Import and run the server
        import uvicorn
        from main import app
        
        uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
        
    except ImportError:
        print("❌ FastAPI not installed. Installing requirements...")
        install_requirements()
        start_server()
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        sys.exit(1)

if __name__ == "__main__":
    # Check if we're in the backend directory
    if not os.path.exists("main.py"):
        print("❌ Please run this script from the backend directory")
        print("💡 Usage: cd backend && python run.py")
        sys.exit(1)
    
    start_server()