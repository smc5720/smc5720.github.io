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
$TmpDir  = Join-Path $ProjectRoot "tmp"

if (-not (Test-Path $LogDir)) { New-Item -ItemType Directory -Path $LogDir | Out-Null }
if (-not (Test-Path $TmpDir)) { New-Item -ItemType Directory -Path $TmpDir | Out-Null }

function Log {
    param([string]$Message, [string]$Level = "INFO")
    $ts   = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $line = "[$ts][$Level] $Message"
    [System.IO.File]::AppendAllText($LogFile, $line + [System.Environment]::NewLine, [System.Text.Encoding]::UTF8)
    Write-Host $line
}

# Generate MDX via claude -p.
# Primary path: claude outputs raw MDX to stdout → PowerShell writes the file.
# Fallback: if claude used the Write tool directly and succeeded, detect the new file.
function Invoke-ClaudeGenerate {
    param([string]$TempFile)

    # Snapshot existing posts so we can detect files claude may create via Write tool
    $postDir = Join-Path $ProjectRoot "content/posts"
    $before  = Get-ChildItem $postDir -Filter "*.mdx" | Select-Object -ExpandProperty Name

    # Read article data in PowerShell — claude needs no file-read permission
    $articleData = [System.IO.File]::ReadAllText($TempFile, [System.Text.Encoding]::UTF8)

    $prompt = @"
You are running in a non-interactive automation pipeline. You have NO tools available.
Do NOT call Write, Edit, Read, or Bash. Your only output channel is stdout.

Generate a complete MDX blog post following docs/news-post-template.md EXACTLY.

CRITICAL: Your ENTIRE response must be raw MDX. Start with ---. No preamble. No code fences. No explanations.

== FRONTMATTER ==
Output ALL of the following fields (all string values must be quoted):

title: "..."               # Korean translation of article title
description: "..."         # 1-2 sentence Korean summary of the article
date: "YYYY-MM-DD"        # use the "published" date from article data
category: "news"
tags: [...]                # copy tag_list as a YAML array; use [] if none
cover: "..."               # cover_image URL; OMIT this field entirely if no image available
coverAlt: "..."            # English original title; include ONLY when cover is present
source_id: "..."           # exact value from the "source_id  :" line
source_url: "..."          # URL from the "url        :" line
source_title: "..."        # English original title
source_author: "..."       # author name (Dev.to) or news outlet name (kr-news)
source_published: "YYYY-MM-DD"  # date from the "published  :" line
slug: "..."                # kebab-case English slug for the filename

== BODY FOR Dev.to POSTS (article data contains "--- body_markdown ---") ==

<LinkCard url="SOURCE_URL" author="AUTHOR_NAME" date="PUBLISHED_DATE" />

## 개요

(Intro paragraphs in Korean — 1-3 paragraphs from the article opening)

## 본문

(Main content in Korean, preserving original heading hierarchy as ### subheadings)
(Insert Pexels images only at natural section boundaries — after a subheading or between sections)
(Image format:  ![설명](URL)
                *Photo by [작가명](작가URL) on [Pexels](출처URL)* )

---

*이 글은 위 출처의 내용을 바탕으로 작성된 초안입니다. 원문의 의견과 정보를 그대로 전달하며, 별도의 견해를 포함하지 않습니다.*

== BODY FOR kr-news POSTS (article data contains "--- 본문 ---") ==

> **원문:** [ARTICLE_TITLE](SOURCE_URL) — OUTLET_NAME

## 개요

(Opening paragraph in Korean — 1-2 sentences introducing the article topic)

## 본문

(Full article content in Korean, preserving paragraph structure)
(Insert Pexels images only at natural section boundaries)
(Image format:  ![설명](URL)
                *Photo by [작가명](작가URL) on [Pexels](출처URL)* )

---

*이 글은 위 출처의 내용을 바탕으로 작성된 초안입니다. 원문의 의견과 정보를 그대로 전달하며, 별도의 견해를 포함하지 않습니다.*

== RULES ==
- Korean only — no personal opinions, commentary, or additions
- cover (kr-news without cover_image): use the first Pexels suggestion URL as cover; coverAlt = Pexels photo description in English
- Dev.to Liquid tags MUST be converted:
    "{% embed URL %}"             → [링크 보기 →](URL)
    "{% youtube VIDEO_ID %}"      → [YouTube 영상 보기 →](https://www.youtube.com/watch?v=VIDEO_ID)
    "{% link URL %}"              → [링크 보기 →](URL)
    "{% raw %}...{% endraw %}"    → remove entirely, or replace with a code block

=== ARTICLE DATA ===
$articleData
=== END ===
"@

    $raw = claude -p $prompt --dangerously-skip-permissions 2>&1 | Out-String
    $raw = $raw.Trim()

    # Fallback: detect files claude wrote via Write tool (e.g. when --dangerously-skip-permissions auto-approved)
    $after  = Get-ChildItem $postDir -Filter "*.mdx" | Select-Object -ExpandProperty Name
    $newByTool = @($after | Where-Object { $before -notcontains $_ })
    if ($newByTool.Count -gt 0) {
        Log "  -> $($newByTool[0]) written (claude Write tool)"
        return $true
    }

    # Strip code fences if claude wrapped the output
    if ($raw -match '(?s)^```[a-z]*\r?\n(---[\s\S]+)\r?\n```\s*$') {
        $raw = $Matches[1].Trim()
    }

    # Validate: must look like MDX frontmatter
    if (-not $raw.StartsWith('---')) {
        $preview = if ($raw.Length -gt 200) { $raw.Substring(0, 200) + '...' } else { $raw }
        Log "  -> unexpected output (no frontmatter): $preview" "WARN"
        return $false
    }

    # Extract slug for filename
    if ($raw -match '(?m)^slug:\s*[''"]?([a-z0-9][a-z0-9-]*)[''"]?\s*$') {
        $slug = $Matches[1]
        $outFile = Join-Path $postDir "$slug.mdx"
        [System.IO.File]::WriteAllText($outFile, $raw + "`n", [System.Text.Encoding]::UTF8)
        Log "  -> $slug.mdx written"
        return $true
    }

    $preview = if ($raw.Length -gt 200) { $raw.Substring(0, 200) + '...' } else { $raw }
    Log "  -> slug not found: $preview" "WARN"
    return $false
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
                $tmp = Join-Path $TmpDir "devto-$id.txt"
                [System.IO.File]::WriteAllText($tmp, $content, [System.Text.Encoding]::UTF8)
                $ok = Invoke-ClaudeGenerate -TempFile $tmp
                Remove-Item $tmp -ErrorAction SilentlyContinue
                if ($ok) { $created++ }
                Log "  -> $(if ($ok) { 'done' } else { 'skipped' }) (devto-$id)"
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

    # Count numbered article lines — ASCII-only pattern, avoids encoding issues
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
                $tmp = Join-Path $TmpDir "kr-news-$i.txt"
                [System.IO.File]::WriteAllText($tmp, $content, [System.Text.Encoding]::UTF8)
                $ok = Invoke-ClaudeGenerate -TempFile $tmp
                Remove-Item $tmp -ErrorAction SilentlyContinue
                if ($ok) { $created++ }
                Log "  -> $(if ($ok) { 'done' } else { 'skipped' }) (kr-news #$i)"
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
