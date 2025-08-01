#!/bin/bash

echo "🚀 Setting up Task Manager Application..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Backend setup
echo "📦 Setting up backend..."
cd backend

# Install dependencies
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file for backend..."
    cat > .env << EOF
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
PORT=5000
EOF
    echo "✅ Backend .env file created"
else
    echo "✅ Backend .env file already exists"
fi

# Generate Prisma client and push schema
echo "🗄️ Setting up database..."
npm run db:generate
npm run db:push

cd ..

# Frontend setup
echo "📦 Setting up frontend..."
cd frontend

# Install dependencies
npm install

# Create .env.local file if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file for frontend..."
    cat > .env.local << EOF
NEXT_PUBLIC_API_URL="http://localhost:5000/api"
EOF
    echo "✅ Frontend .env.local file created"
else
    echo "✅ Frontend .env.local file already exists"
fi

cd ..

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Start the backend server:"
echo "   cd backend && npm run dev"
echo ""
echo "2. Start the frontend server:"
echo "   cd frontend && npm run dev"
echo ""
echo "3. Access the application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:5000"
echo "   Prisma Studio: http://localhost:5555 (run 'npm run db:studio' in backend)"
echo ""
echo "📚 For more information, check the README.md file" 