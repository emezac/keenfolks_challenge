#!/bin/bash

# Define cleanup procedure
cleanup() {
    echo "Stopping servers..."
    kill 0
    exit
}

# Trap exit signals to run cleanup
trap cleanup SIGINT SIGTERM

# Path variables
CHALLENGE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$CHALLENGE_DIR/backend"
FRONTEND_DIR="$CHALLENGE_DIR/frontend"

# 1. Start Backend
echo "Starting Backend (FastAPI on port 8000)..."
cd "$BACKEND_DIR"

# Check if venv exists, create if not
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate venv and install dependencies
source venv/bin/activate
pip install -r requirements.txt > /dev/null

# Run the backend in the background
uvicorn main:app --reload --port 8000 &
BACKEND_PID=$!

# 2. Start Frontend
echo "Starting Frontend (React/Vite on port 5173)..."
cd "$FRONTEND_DIR"

# Install node modules if necessary
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

# Run the frontend
npm run dev
