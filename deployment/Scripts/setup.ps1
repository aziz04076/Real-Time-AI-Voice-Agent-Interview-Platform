# PrepWise Automation Setup and Run Script
# -----------------------------------------------------------------------------
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "      PrepWise Restructured Run Script    " -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# 1. Stop any running Node.js servers to avoid file/port locks
Write-Host "[1/3] Stopping any running node instances..." -ForegroundColor Yellow
Stop-Process -Name node -ErrorAction SilentlyContinue

# 2. Install workspace dependencies
Write-Host "[2/3] Verifying and installing dependencies..." -ForegroundColor Yellow
npm install

# 3. Start the application
Write-Host "[3/3] Starting the development server on http://localhost:4000..." -ForegroundColor Green
npm run dev
