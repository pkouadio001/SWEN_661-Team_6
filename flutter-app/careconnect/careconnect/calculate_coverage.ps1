# Calculate Flutter Test Coverage
$lcovFile = "coverage\lcov.info"

if (Test-Path $lcovFile) {
    $content = Get-Content $lcovFile
    
    # Count total lines (LF)
    $totalLines = ($content | Select-String "^LF:" | ForEach-Object { 
        [int]($_ -replace "LF:", "") 
    } | Measure-Object -Sum).Sum
    
    # Count hit lines (LH)
    $hitLines = ($content | Select-String "^LH:" | ForEach-Object { 
        [int]($_ -replace "LH:", "") 
    } | Measure-Object -Sum).Sum
    
    # Calculate percentage
    $coverage = [math]::Round(($hitLines / $totalLines) * 100, 2)
    
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "Flutter Test Coverage Report" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "Total Lines: $totalLines"
    Write-Host "Hit Lines: $hitLines"
    Write-Host "Coverage: $coverage%" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Green
    
    if ($coverage -ge 60) {
        Write-Host "✅ PASSES 60% requirement!" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Below 60% requirement" -ForegroundColor Yellow
    }
} else {
    Write-Host "Coverage file not found. Run: flutter test --coverage" -ForegroundColor Red
}