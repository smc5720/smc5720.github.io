#!/usr/bin/env pwsh
<#
.SYNOPSIS
Daily news automation: Dev.to + Google News Korea -> MDX -> git push

Usage:
  pwsh -File scripts\daily-news.ps1          # manual run
  pwsh -File scripts\register-task.ps1       # register scheduled task (once)
#>

$ErrorActionPreference = "Stop"

# UTF-8 for console and file I/O (required when running as a scheduled task)
[Console]::InputEncoding  = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$ProjectRoot = Split-Path -Parent $PSScriptRoot
$LogDir  = Join-Path $ProjectRoot "logs"
$LogFile = Join-Path $LogDir "daily-news.log"

if (-not (Test-Path $LogDir)) { New-Item -ItemType Directory -Path $LogDir | Out-Null }

function Log {
    param([string]$Message, [string]$Level = "INFO")
    $ts   = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $line = "[$ts][$Level] $Message"
    [System.IO.File]::AppendAllText($LogFile, $line + [System.Environment]::NewLine, [System.Text.Encoding]::UTF8)
    Write-Host $line
}

function Invoke-ClaudeWrite {
    param([string]$TempFile)
    $prompt = @"
Read the article content from the file at: $TempFile
Following docs/news-post-template.md rules exactly, create a new MDX file in content/posts/.
- Use the source_id shown in the file (exact value, do not change)
- Korean translation only; no personal opinions or commentary
- Place source block at the very top of the body
- cover field is mandatory in frontmatter
- If cover_image is absent, use the first Pexels suggestion URL from the file as cover
- Derive a descriptive kebab-case slug from the Korean title
"@
    claude -p $prompt --dangerously-skip-permissions 2>&1 | Out-Null
}

Set-Location $ProjectRoot
Log "=== daily news automation start ==="

$created = 0

# ── Dev.to ────────────────────────────────────────────────────
Log "Dev.to: fetching list..."
try {
    $devtoList = (node scripts/fetch-news.mjs 2>&1) | Out-String
    $ids = [regex]::Matches($devtoList, '\[ID:\s*(\d+)\]') |
           ForEach-Object { $_.Groups[1].Value } |
           Select-Object -First 5

    if ($ids.Count -eq 0) {
        Log "Dev.to: no new articles"
    } else {
        Log "Dev.to: $($ids.Count) articles to process"
        foreach ($id in $ids) {
            Log "  Dev.to id=$id processing..."
            try {
                $content = (node scripts/fetch-news.mjs --id $id 2>&1) | Out-String
                $tmp = Join-Path $env:TEMP "devto-$id.txt"
                [System.IO.File]::WriteAllText($tmp, $content, [System.Text.Encoding]::UTF8)
                Invoke-ClaudeWrite -TempFile $tmp
                Remove-Item $tmp -ErrorAction SilentlyContinue
                $created++
                Log "  -> done (devto-$id)"
            } catch {
                Log "  -> failed (devto-$id): $_" "ERROR"
            }
        }
    }
} catch {
    Log "Dev.to list fetch failed: $_" "ERROR"
}

# ── Google News Korea ─────────────────────────────────────────
Log "KR news: fetching list..."
try {
    $krList = (node scripts/fetch-kr-news.mjs 2>&1) | Out-String

    # Count numbered article lines (e.g. " 1. Title") — ASCII-only pattern, avoids encoding issues
    $total      = ([regex]::Matches($krList, '(?m)^\s+\d+\.')).Count
    $fetchCount = [Math]::Min($total, 5)

    if ($fetchCount -eq 0) {
        Log "KR news: no new articles"
    } else {
        Log "KR news: $fetchCount articles to process"
        for ($i = 1; $i -le $fetchCount; $i++) {
            Log "  KR news #$i processing..."
            try {
                $content = (node scripts/fetch-kr-news.mjs --fetch $i 2>&1) | Out-String
                $tmp = Join-Path $env:TEMP "kr-news-$i.txt"
                [System.IO.File]::WriteAllText($tmp, $content, [System.Text.Encoding]::UTF8)
                Invoke-ClaudeWrite -TempFile $tmp
                Remove-Item $tmp -ErrorAction SilentlyContinue
                $created++
                Log "  -> done (kr-news #$i)"
            } catch {
                Log "  -> failed (kr-news #$i): $_" "ERROR"
            }
        }
    }
} catch {
    Log "KR news list fetch failed: $_" "ERROR"
}

# ── Git ───────────────────────────────────────────────────────
if ($created -gt 0) {
    Log "$created articles written. committing..."
    try {
        git add content/posts/
        $staged = git diff --cached --name-only
        if ($staged) {
            $date = Get-Date -Format "yyyy-MM-dd"
            git commit -m "content: 뉴스 포스트 자동 추가 ($date)"
            git push origin main
            Log "push complete"
        } else {
            Log "nothing staged to commit"
        }
    } catch {
        Log "git error: $_" "ERROR"
    }
} else {
    Log "no new files, skipping commit"
}

Log "=== done ($created articles) ==="
