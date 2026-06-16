#!/usr/bin/env pwsh
<#
.SYNOPSIS
Windows 작업 스케줄러에 daily-polish 태스크를 등록합니다.

사용법 (관리자 권한 PowerShell):
  pwsh -File scripts\register-polish-task.ps1

태스크 확인:
  Get-ScheduledTask -TaskName "DailyPolish"

태스크 수동 실행:
  Start-ScheduledTask -TaskName "DailyPolish"

태스크 제거:
  Unregister-ScheduledTask -TaskName "DailyPolish" -Confirm:$false
#>

$TaskName   = "DailyPolish"
$ScriptPath = Join-Path $PSScriptRoot "daily-polish.ps1"
$WorkDir    = Split-Path -Parent $PSScriptRoot

if (-not (Test-Path $ScriptPath)) {
    Write-Error "스크립트를 찾을 수 없음: $ScriptPath"
    exit 1
}

$shell = if (Get-Command pwsh -ErrorAction SilentlyContinue) { "pwsh.exe" } else { "powershell.exe" }
Write-Host "Shell: $shell"

$action = New-ScheduledTaskAction `
    -Execute $shell `
    -Argument "-NonInteractive -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$ScriptPath`"" `
    -WorkingDirectory $WorkDir

# 매일 10:00 KST 실행
$trigger = New-ScheduledTaskTrigger -Daily -At "10:00"

$settings = New-ScheduledTaskSettingsSet `
    -ExecutionTimeLimit (New-TimeSpan -Hours 2) `
    -StartWhenAvailable `
    -WakeToRun:$false `
    -MultipleInstances IgnoreNew

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
    -Description "매일 오전 10시 최근 포스트 문체 교정 + 태그 없는 포스트 태그 추가" | Out-Null

Write-Host ""
Write-Host "태스크 등록 완료!"
Write-Host "  이름    : $TaskName"
Write-Host "  실행    : 매일 10:00 KST"
Write-Host "  스크립트: $ScriptPath"
Write-Host ""
Write-Host "지금 바로 테스트하려면:"
Write-Host "  Start-ScheduledTask -TaskName '$TaskName'"
