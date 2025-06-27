$botToken = "8168918078:AAFAeO4dZezQW6PrqNeseDfG3T6Dt8NzCd8"
$response = Invoke-RestMethod -Uri "https://api.telegram.org/bot$botToken/getWebhookInfo"
Write-Host "Webhook Info:"
$response | ConvertTo-Json -Depth 10 