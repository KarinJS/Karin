#!/usr/bin/env bash
# Runs the vitest suite across Node 22/24/26 and pnpm 10/11 inside WSL.
# Used to verify the engine bump. Not invoked by CI.
set -uo pipefail

declare -A NODE_PATHS=(
  ["22"]="$(which node)"
  ["24"]="$HOME/node-versions/v24.15.0/bin/node"
  ["26"]="$HOME/node-versions/v26.1.0/bin/node"
)

declare -A NODE_DIRS=(
  ["22"]="$(dirname "$(which node)")"
  ["24"]="$HOME/node-versions/v24.15.0/bin"
  ["26"]="$HOME/node-versions/v26.1.0/bin"
)

PNPM_VERSIONS=("10.14.0" "11.1.1")

REPORT="/tmp/karin-matrix-report.txt"
: > "$REPORT"

for NV in 22 24 26; do
  for PV in "${PNPM_VERSIONS[@]}"; do
    NODE_BIN="${NODE_DIRS[$NV]}"
    if [ ! -x "$NODE_BIN/node" ]; then
      echo "SKIP node $NV (no binary at $NODE_BIN/node)" | tee -a "$REPORT"
      continue
    fi

    # Use a clean PATH so $NODE_BIN wins. Append a safe baseline for utilities.
    SAFE_PATH="$NODE_BIN:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"

    echo "==================================="
    echo "Node $NV / pnpm $PV"
    echo "==================================="

    PATH="$SAFE_PATH" node --version

    # Install the requested pnpm into this Node's tree so it's the one PATH finds.
    # --prefix avoids the global npm prefix shared across Node installs.
    PREFIX="$HOME/node-versions/_pnpm-cache/$NV"
    mkdir -p "$PREFIX"
    PATH="$SAFE_PATH" npm install --silent --prefix "$PREFIX" "pnpm@$PV" >/dev/null 2>&1
    PNPM_BIN="$PREFIX/node_modules/.bin"

    PATH="$PNPM_BIN:$SAFE_PATH" pnpm --version
    PATH="$PNPM_BIN:$SAFE_PATH" pnpm test 2>&1 | tail -6
    RC=$?
    if [ $RC -eq 0 ]; then
      echo "node$NV/pnpm$PV: PASS" >> "$REPORT"
    else
      echo "node$NV/pnpm$PV: FAIL (exit $RC)" >> "$REPORT"
    fi
  done
done

echo
echo "=========== SUMMARY ==========="
cat "$REPORT"
