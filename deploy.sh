#!/bin/bash

# FloodWatch India Radar - Build Verification Script

echo "🌊 FloodWatch India Radar - Build Verification"
echo "=============================================="

# Check if Node.js is installed
if command -v node &> /dev/null; then
    echo "✅ Node.js version: $(node --version)"
else
    echo "❌ Node.js not found. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if command -v npm &> /dev/null; then
    echo "✅ npm version: $(npm --version)"
else
    echo "❌ npm not found. Please install npm first."
    exit 1
fi

echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "🔨 Building project..."
npm run build

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful! Your project is ready for deployment."
    echo ""
    echo "🚀 Deploy options:"
    echo "1. Lovable: Visit https://lovable.dev/projects/423deaed-4ef6-4d90-8a7d-c785e1fb211a"
    echo "2. Manual: Upload the 'dist' folder to your hosting provider"
    echo "3. Vercel: Connect your GitHub repo to Vercel"
    echo "4. Netlify: Drag and drop 'dist' folder to Netlify"
    echo ""
    echo "📋 Next steps:"
    echo "- Set up environment variables"
    echo "- Configure Supabase database"
    echo "- Test on different devices"
    echo ""
    echo "🎉 FloodWatch India Radar is ready to save lives!"
else
    echo ""
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi
