# FloodWatch India Radar - Build Verification Script (Windows)

Write-Host "🌊 FloodWatch India Radar - Build Verification" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js first." -ForegroundColor Red
    Write-Host "Download from: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Host "✅ npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm not found. Please install npm first." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

Write-Host ""
Write-Host "🔨 Building project..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Build successful! Your project is ready for deployment." -ForegroundColor Green
    Write-Host ""
    Write-Host "🚀 Deploy options:" -ForegroundColor Cyan
    Write-Host "1. Lovable: Visit https://lovable.dev/projects/423deaed-4ef6-4d90-8a7d-c785e1fb211a" -ForegroundColor White
    Write-Host "2. Manual: Upload the 'dist' folder to your hosting provider" -ForegroundColor White
    Write-Host "3. Vercel: Connect your GitHub repo to Vercel" -ForegroundColor White
    Write-Host "4. Netlify: Drag and drop 'dist' folder to Netlify" -ForegroundColor White
    Write-Host ""
    Write-Host "📋 Next steps:" -ForegroundColor Cyan
    Write-Host "- Set up environment variables" -ForegroundColor White
    Write-Host "- Configure Supabase database" -ForegroundColor White
    Write-Host "- Test on different devices" -ForegroundColor White
    Write-Host ""
    Write-Host "🎉 FloodWatch India Radar is ready to save lives!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "❌ Build failed. Please check the errors above." -ForegroundColor Red
    exit 1
}
