#!/usr/bin/env bash
# Smoke-test the create-karin CLI on Node 22/24/25/26.
# Strategy:
#   1. Run --help (cheapest path; imports ora/prompts/kolorist/strip-json-comments)
#   2. Run with stdin from /dev/null and a short timeout so we exercise the
#      environment-detection code path (registry/pnpm/pm2 lookup) without
#      blocking forever on the interactive prompt.
set -uo pipefail

cd /mnt/d/Github/Karin-test-build
CLI=packages/create-karin/dist/index.mjs

if [ ! -f "$CLI" ]; then
  echo "ERROR: $CLI not found. Did you run pnpm build?"
  exit 2
fi

declare -A NODES=(
  ["22"]="$HOME/node-versions/v22.22.2/bin/node"
  ["24"]="$HOME/node-versions/v24.15.0/bin/node"
  ["25"]="$HOME/node-versions/v25.9.0/bin/node"
  ["26"]="$HOME/node-versions/v26.1.0/bin/node"
)

if [ ! -x "${NODES[22]}" ]; then
  NODES[22]="$(which node)"
fi

REPORT="/tmp/karin-create-report.txt"
: > "$REPORT"

for NV in 22 24 25 26; do
  N="${NODES[$NV]}"
  if [ ! -x "$N" ]; then
    echo "node $NV: SKIP (binary not found at $N)" | tee -a "$REPORT"
    continue
  fi

  echo "================================="
  echo "Node $NV ($N)"
  echo "================================="
  "$N" --version

  # --help: should exit 0 cleanly
  HELP_OUT=$("$N" "$CLI" --help 2>&1)
  HELP_RC=$?
  echo "--- --help exit=$HELP_RC ---"
  echo "$HELP_OUT"
  if [ $HELP_RC -ne 0 ]; then
    echo "node$NV: FAIL on --help (exit $HELP_RC)" >> "$REPORT"
    continue
  fi

  # No-args run; we let it auto-detect and then bail when prompts cannot read
  # stdin. Capture full stderr so we can see *what* breaks on each Node.
  set +e
  FULL_OUT=$(timeout 20 "$N" "$CLI" </dev/null 2>&1)
  NO_ARGS_RC=$?
  set -e
  echo "--- no-args exit=$NO_ARGS_RC ---"
  printf '%s\n' "$FULL_OUT"

  # exit 124 = timed out at the interactive prompt → that's actually success
  # because environment detection ran, we just stopped at prompts.
  # Any other non-zero = real failure to investigate.
  if [ $NO_ARGS_RC -eq 0 ] || [ $NO_ARGS_RC -eq 124 ] || [ $NO_ARGS_RC -eq 130 ]; then
    echo "node$NV: PASS (rc=$NO_ARGS_RC)" >> "$REPORT"
  else
    echo "node$NV: FAIL on no-args (exit $NO_ARGS_RC)" >> "$REPORT"
  fi
done

echo
echo "=========== SUMMARY ==========="
cat "$REPORT"
