#!/usr/bin/env bash
# .github/labels.yml 의 라벨을 GitHub에 동기화.
#
# 요구사항:
#   - gh CLI 로그인 상태 (gh auth status)
#   - yq (또는 python + PyYAML) — 아래는 python 사용
#
# 사용:
#   ./scripts/sync-labels.sh           # create / update
#   ./scripts/sync-labels.sh --prune   # labels.yml에 없는 라벨까지 삭제 (주의)

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
LABELS_FILE="$ROOT/.github/labels.yml"

if [ ! -f "$LABELS_FILE" ]; then
  echo "라벨 파일을 찾지 못했습니다: $LABELS_FILE" >&2
  exit 1
fi

if ! command -v gh >/dev/null 2>&1; then
  echo "gh CLI가 필요합니다. https://cli.github.com/" >&2
  exit 1
fi

REPO="$(gh repo view --json nameWithOwner -q .nameWithOwner)"
echo "대상 저장소: $REPO"

PRUNE=0
if [ "${1:-}" = "--prune" ]; then
  PRUNE=1
fi

# labels.yml → "name<TAB>color<TAB>description" 한 줄씩
TMP_ROWS="$(mktemp)"
trap 'rm -f "$TMP_ROWS"' EXIT
PYTHONIOENCODING=utf-8 python - "$LABELS_FILE" > "$TMP_ROWS" <<'PY'
import sys, io, yaml
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", newline="\n")
with open(sys.argv[1], encoding="utf-8") as f:
    data = yaml.safe_load(f)
for item in data:
    name = item["name"]
    color = item.get("color", "cccccc")
    desc = item.get("description", "")
    print(f"{name}\t{color}\t{desc}")
PY
mapfile -t ROWS < "$TMP_ROWS"

if [ "${#ROWS[@]}" -eq 0 ]; then
  echo "labels.yml 파싱 결과가 비어있습니다. 파일을 확인하세요." >&2
  exit 1
fi

DEFINED=()
for row in "${ROWS[@]}"; do
  IFS=$'\t' read -r name color desc <<< "$row"
  DEFINED+=("$name")
  echo "▸ $name (#$color)"
  # MSYS_NO_PATHCONV / MSYS2_ARG_CONV_EXCL:
  #   Git Bash·MSYS2에서 "/"로 시작하는 인자를 Windows 경로로 변환한다. area:* 라벨의
  #   설명이 "/blog 목록"처럼 슬래시로 시작해서, 그대로 두면 "C:/Program Files/Git/blog 목록"
  #   으로 망가진 채 등록된다. 리눅스·macOS에서는 쓰이지 않는 변수라 무해하다.
  MSYS_NO_PATHCONV=1 MSYS2_ARG_CONV_EXCL='*' \
    gh label create "$name" --color "$color" --description "$desc" --force >/dev/null
done

if [ "$PRUNE" -eq 1 ]; then
  echo "── prune ──"
  CURRENT=$(gh label list --limit 200 --json name -q '.[].name')
  for existing in $CURRENT; do
    keep=0
    for def in "${DEFINED[@]}"; do
      if [ "$existing" = "$def" ]; then keep=1; break; fi
    done
    if [ $keep -eq 0 ]; then
      echo "✗ delete $existing"
      gh label delete "$existing" --yes
    fi
  done
fi

echo "✓ done"
