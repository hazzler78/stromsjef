$token = "8168918078:AAFAeO4dZezQW6PrqNeseDfG3T6Dt8NzCd8"

Write-Host "=== TESTING BOT HEALTH ==="
try {
    $health = Invoke-RestMethod -Uri "https://stromsjef-cuyfjzpt3-mikaels-projects-902560d4.vercel.app/api/telegram"
    Write-Host "Health check successful:"
    $health | ConvertTo-Json
} catch {
    Write-Host "Health check failed: $($_.Exception.Message)"
}

Write-Host "`n=== CHECKING WEBHOOK STATUS ==="
try {
    $webhook = Invoke-RestMethod -Uri "https://api.telegram.org/bot$token/getWebhookInfo"
    Write-Host "Webhook status:"
    $webhook | ConvertTo-Json
} catch {
    Write-Host "Webhook check failed: $($_.Exception.Message)"
} 