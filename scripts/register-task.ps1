#!/usr/bin/env pwsh
<#
.SYNOPSIS
Windows 작업 스케줄러에 일간 뉴스 자동화 태스크를 등록합니다.

사용법 (관리자 권한 PowerShell):
  pwsh -File scripts\register-task.ps1

태스크 확인:
  Get-ScheduledTask -TaskName "DailyNewsPost"

태스크 수동 실행:
  Start-ScheduledTask -TaskName "DailyNewsPost"

태스크 제거:
  Unregister-ScheduledTask -TaskName "DailyNewsPost" -Confirm:$false
#>

$TaskName   = "DailyNewsPost"
$ScriptPath = Join-Path $PSScriptRoot "daily-news.ps1"
$WorkDir    = Split-Path -Parent $PSScriptRoot

if (-not (Test-Path $ScriptPath)) {
    Write-Error "스크립트를 찾을 수 없음: $ScriptPath"
    exit 1
}

# pwsh.exe (PS7, UTF-8 default) preferred over powershell.exe (PS5, system code page)
$shell = if (Get-Command pwsh -ErrorAction SilentlyContinue) { "pwsh.exe" } else { "powershell.exe" }
Write-Host "Shell: $shell"

$action = New-ScheduledTaskAction `
    -Execute $shell `
    -Argument "-NonInteractive -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$ScriptPath`"" `
    -WorkingDirectory $WorkDir

# 매일 09:00 KST 실행
$trigger = New-ScheduledTaskTrigger -Daily -At "09:00"

$settings = New-ScheduledTaskSettingsSet `
    -ExecutionTimeLimit (New-TimeSpan -Hours 2) `
    -StartWhenAvailable `
    -WakeToRun:$false `
    -MultipleInstances IgnoreNew

# 기존 태스크 있으면 덮어쓰기
$existing = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
if ($existing) {
    Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
    Write-Host "기존 태스크 제거됨"
}

Register-ScheduledTask `
    -TaskName $TaskName `
    -Action $action `
    -Trigger $trigger `
    -Settings $settings `
    -Description "매일 오전 9시 Dev.to + 국내 뉴스 포스트 자동 작성" | Out-Null

Write-Host ""
Write-Host "태스크 등록 완료!"
Write-Host "  이름    : $TaskName"
Write-Host "  실행    : 매일 09:00 KST"
Write-Host "  스크립트: $ScriptPath"
Write-Host ""
Write-Host "지금 바로 테스트하려면:"
Write-Host "  Start-ScheduledTask -TaskName '$TaskName'"
