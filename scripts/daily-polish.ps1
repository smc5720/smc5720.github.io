#!/usr/bin/env pwsh
<#
.SYNOPSIS
Daily polish: humanize 10 most recent posts + add tags to untagged posts -> git push

Usage:
  pwsh -File scripts\daily-polish.ps1          # manual run
  pwsh -File scripts\register-polish-task.ps1  # register scheduled task (once)
#>

$ErrorActionPreference = "Stop"

[Console]::InputEncoding  = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$ProjectRoot = Split-Path -Parent $PSScriptRoot
$LogDir      = Join-Path $ProjectRoot "logs"
$LogFile     = Join-Path $LogDir "daily-polish.log"
$PostDir     = Join-Path $ProjectRoot "content/posts"

if (-not (Test-Path $LogDir)) { New-Item -ItemType Directory -Path $LogDir | Out-Null }

function Log {
    param([string]$Message, [string]$Level = "INFO")
    $ts   = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $line = "[$ts][$Level] $Message"
    [System.IO.File]::AppendAllText($LogFile, $line + [System.Environment]::NewLine, [System.Text.Encoding]::UTF8)
    Write-Host $line
}

Set-Location $ProjectRoot
Log "=== daily polish start ==="
$modified = 0

# ── 1. Humanize 10 most recent posts ──────────────────────────
Log "Humanizer: finding 10 most recent posts..."
$recentPosts = Get-ChildItem $PostDir -Filter "*.mdx" |
    Sort-Object LastWriteTime -Descending |
    Select-Object -First 10

Log "Humanizer: $($recentPosts.Count) posts to process"

foreach ($post in $recentPosts) {
    Log "  humanizing: $($post.Name)..."
    try {
        $filePath = $post.FullName
        $prompt = @"
You are a Korean text humanizer running in an automation pipeline.

Task: Read the file at "$filePath", detect and correct AI-generated Korean text patterns, then save the file.

CORRECTION RULES — fix these patterns:
- Overused connectives: "이러한", "따라서", "결론적으로", "이를 통해", "이에 따라" — vary or remove them
- Unnatural formal transitions between paragraphs that feel robotic
- Repetitive sentence endings (e.g. repeated "~습니다" chains where variation is natural)
- Overly symmetric list structures that sound like bullet-point summaries spoken aloud
- Stiff phrasing that no Korean speaker would naturally write

DO NOT change:
- Frontmatter (the --- delimited block at the top)
- Meaning, facts, people's names, numbers, statistics
- URLs, code blocks, MDX components (anything inside < > or ` ` or ``` ```)
- Content that already sounds natural

STEPS:
1. Use the Read tool to read "$filePath"
2. Identify and fix AI-generated patterns in the body text only
3. If no corrections are needed, do nothing (skip the Edit step)
4. If corrections are needed, use the Edit tool to save changes to "$filePath"
5. Output only: "done" or "skipped"
"@
        $out = claude -p $prompt --dangerously-skip-permissions 2>&1 | Out-String
        Log "  -> $($post.Name): $($out.Trim())"
        $modified++
    } catch {
        Log "  -> failed: $($post.Name): $_" "ERROR"
    }
}

# ── 2. Add tags to untagged posts ─────────────────────────────
Log "Tagger: finding posts without tags..."
$untagged = Get-ChildItem $PostDir -Filter "*.mdx" | Where-Object {
    $raw = [System.IO.File]::ReadAllText($_.FullName, [System.Text.Encoding]::UTF8)
    # Has frontmatter, but tags field is absent or empty
    ($raw -match '(?s)^---.*?---') -and (
        ($raw -notmatch '(?m)^tags:\s*\[.+\]') -and
        ($raw -notmatch '(?m)^tags:\s*\n\s+-\s+\S')
    )
}

if ($untagged.Count -eq 0) {
    Log "Tagger: no untagged posts"
} else {
    Log "Tagger: $($untagged.Count) posts to tag"
    foreach ($post in $untagged) {
        Log "  tagging: $($post.Name)..."
        try {
            $filePath = $post.FullName
            $prompt = @"
You are a blog post tagger running in an automation pipeline.

Task: Read the file at "$filePath" and add appropriate tags to its frontmatter.

TAG SELECTION RULES:
- Choose 2-6 lowercase English tags that best match the post's topic
- Pick from common vocabulary: "ai", "career", "webdev", "discuss", "javascript", "typescript", "react", "frontend", "backend", "devops", "css", "python", "opensource", "productivity", "tutorial", "beginners", "programming", "security", "news", "politics", "korea", "election", "sports", "entertainment", "international", "economy", "tech", "startup", "llm", "chatgpt", "openai", "google", "apple", "github", "nextjs", "node", "database"
- For Korean politics/news: use "korea", "politics", "election", "news"
- For Korean entertainment/sports: use "korea", "entertainment"/"sports", "news"
- For international news: use "international", "news", plus relevant topic tags
- For tech/dev posts: use specific tech tags

EDIT RULES:
- Find the frontmatter (between --- delimiters)
- Add tags line as: tags: ["tag1","tag2","tag3"]
- Place it after the "category:" line; if no category line, place before the closing ---
- If a tags: [] (empty) line already exists, replace it with the new tags line
- Use the Edit tool to save the change

STEPS:
1. Use the Read tool to read "$filePath"
2. Determine the best tags
3. Use the Edit tool to insert/replace the tags line
4. Output only: "done"
"@
            $out = claude -p $prompt --dangerously-skip-permissions 2>&1 | Out-String
            Log "  -> $($post.Name): $($out.Trim())"
            $modified++
        } catch {
            Log "  -> failed: $($post.Name): $_" "ERROR"
        }
    }
}

# ── 3. Git commit and push ────────────────────────────────────
if ($modified -gt 0) {
    Log "committing changes..."
    try {
        git add content/posts/
        $staged = git diff --cached --name-only
        if ($staged) {
            $date = Get-Date -Format "yyyy-MM-dd"
            git commit -m "refactor: 최근 포스트 문체 교정 및 태그 추가 ($date)"
            git push origin main
            Log "push complete"
        } else {
            Log "nothing staged to commit"
        }
    } catch {
        Log "git error: $_" "ERROR"
    }
} else {
    Log "no changes, skipping commit"
}

Log "=== done (modified: $modified) ==="
