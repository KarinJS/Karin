#!/usr/bin/env bash
# Deeper smoke test: run `create-karin -y` in a temp dir on Node 24/25/26.
# This exercises template copying, fs ops, prompts default path, registry probe,
# and the initial pnpm install — failures here are what real users would see.
# Timeout 90s; if it hangs in pnpm install we'll see partial logs anyway.
set -uo pipefail

cd /mnt/d/Github/Karin-test-build
CLI="$(pwd)/packages/create-karin/dist/index.mjs"

declare -A NODES=(
  ["24"]="$HOME/node-versions/v24.15.0/bin/node"
  ["25"]="$HOME/node-versions/v25.9.0/bin/node"
  ["26"]="$HOME/node-versions/v26.1.0/bin/node"
)

REPORT="/tmp/karin-create-deep.txt"
: > "$REPORT"

for NV in 24 25 26; do
  N="${NODES[$NV]}"
  if [ ! -x "$N" ]; then
    echo "node $NV: SKIP" | tee -a "$REPORT"
    continue
  fi

  TMPDIR=$(mktemp -d /tmp/karin-deep-XXXXXX)
  echo "================================="
  echo "Node $NV — $TMPDIR"
  echo "================================="

  cd "$TMPDIR"
  set +e
  timeout 120 "$N" "$CLI" -y 2>&1 | tail -50
  RC=${PIPESTATUS[0]}
  set -e
  echo "--- exit=$RC ---"

  # Inspect what was created
  echo "--- created files ---"
  ls -la "$TMPDIR" | head -20

  if [ $RC -eq 0 ]; then
    echo "node$NV: PASS (rc=0)" >> "$REPORT"
  elif [ $RC -eq 124 ]; then
    echo "node$NV: TIMEOUT (likely got past scaffold into pnpm install)" >> "$REPORT"
  else
    echo "node$NV: FAIL (exit $RC)" >> "$REPORT"
  fi

  cd /
  rm -rf "$TMPDIR"
done

echo
echo "=========== SUMMARY ==========="
cat "$REPORT"
