#!/bin/bash

# Development startup script for TodoList project

echo "🚀 Starting TodoList Development Environment..."

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Please start MongoDB first:"
    echo "   brew services start mongodb-community"
    echo "   or"
    echo "   mongod --config /usr/local/etc/mongod.conf"
    exit 1
fi

# Check if node_modules exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    npm install
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend && npm install && cd ..
fi

# Set environment variables
export NODE_ENV=development
export PORT=1000
export MONGODB_URI=mongodb://localhost:27017/todo

echo "✅ Environment configured"
echo "🌐 Backend will run on http://localhost:1000"
echo "🎨 Frontend will run on http://localhost:3000"
echo ""
echo "Starting backend server..."

# Start the backend server
node app.js
