# NextEra Event Planner Server Startup Script
Write-Host "Starting NextEra Event Planner Server..." -ForegroundColor Green
Write-Host ""
Write-Host "Server will be available at: http://localhost:3000" -ForegroundColor Yellow
Write-Host ""
Write-Host "Default Admin Login:" -ForegroundColor Cyan
Write-Host "Email: admin@nextera.com" -ForegroundColor White
Write-Host "Password: admin123" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Red
Write-Host ""

# Start the server
node simple-server.js

Write-Host ""
Write-Host "Server stopped. Press any key to exit..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")





