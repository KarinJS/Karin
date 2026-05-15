#!/usr/bin/env bash
# Reproduce the *user-facing* `pnpm create karin` flow, which downloads the
# published create-karin@latest from npm and runs it. This is the actual code
# path real users hit — different from running our local dist/index.mjs.
set -uo pipefail

declare -A NODES=(
  ["22"]="$HOME/node-versions/v22.22.2/bin/node"
  ["24"]="$HOME/node-versions/v24.15.0/bin/node"
  ["25"]="$HOME/node-versions/v25.9.0/bin/node"
  ["26"]="$HOME/node-versions/v26.1.0/bin/node"
)

if [ ! -x "${NODES[22]}" ]; then
  NODES[22]="$(which node)"
fi

REPORT="/tmp/karin-create-pub-report.txt"
: > "$REPORT"

for NV in 22 24 25 26; do
  N="${NODES[$NV]}"
  if [ ! -x "$N" ]; then
    echo "node $NV: SKIP" | tee -a "$REPORT"
    continue
  fi

  NODE_DIR="$(dirname "$N")"
  # Use the pnpm binary that lives next to *this* node (so any wrappers resolve right)
  PNPM_PREFIX="$HOME/node-versions/_pnpm-cache/$NV"
  PNPM_BIN="$PNPM_PREFIX/node_modules/.bin/pnpm"
  if [ ! -x "$PNPM_BIN" ]; then
    echo "node $NV: SKIP (no pnpm at $PNPM_BIN — run run-matrix.sh first)" | tee -a "$REPORT"
    continue
  fi

  TMPDIR="$(mktemp -d /tmp/karin-pub-test-XXXXXX)"
  echo "================================="
  echo "Node $NV ($N), pnpm: $("$N" "$PNPM_BIN" --version)"
  echo "tmp: $TMPDIR"
  echo "================================="

  cd "$TMPDIR"

  # `pnpm create karin --help` should fetch latest create-karin and run --help.
  # If anything in the bundle blows up at import time on this Node version, this is where we see it.
  set +e
  OUT=$(timeout 90 env PATH="$NODE_DIR:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin" \
        "$PNPM_BIN" create karin --help 2>&1)
  RC=$?
  set -e

  echo "--- exit=$RC ---"
  echo "$OUT"

  if [ $RC -eq 0 ]; then
    echo "node$NV: PASS" >> "$REPORT"
  else
    echo "node$NV: FAIL (exit $RC)" >> "$REPORT"
  fi

  cd /
  rm -rf "$TMPDIR"
done

echo
echo "=========== SUMMARY ==========="
cat "$REPORT"
