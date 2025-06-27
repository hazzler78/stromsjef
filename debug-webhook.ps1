$botToken = "8168918078:AAFAeO4dZezQW6PrqNeseDfG3T6Dt8NzCd8"
$response = Invoke-RestMethod -Uri "https://api.telegram.org/bot$botToken/getWebhookInfo"
Write-Host "=== WEBHOOK INFO ==="
$response | ConvertTo-Json -Depth 10

Write-Host "`n=== TESTING WEBHOOK URL ==="
$webhookUrl = "https://stromsjef-cuyfjzpt3-mikaels-projects-902560d4.vercel.app/api/telegram"
try {
    $testResponse = Invoke-RestMethod -Uri $webhookUrl -Method GET
    Write-Host "GET request successful:"
    $testResponse | ConvertTo-Json -Depth 10
} catch {
    Write-Host "GET request failed: $($_.Exception.Message)"
    Write-Host "Response: $($_.Exception.Response)"
}

Write-Host "`n=== TESTING BOT TOKEN ==="
try {
    $botInfo = Invoke-RestMethod -Uri "https://api.telegram.org/bot$botToken/getMe"
    Write-Host "Bot info:"
    $botInfo | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Bot token test failed: $($_.Exception.Message)"
} 