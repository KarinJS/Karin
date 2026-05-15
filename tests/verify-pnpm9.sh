#!/usr/bin/env bash
# Sanity check: pnpm 9 can install this repo and run the unit tests.
# Mirrors what the CI 'node22/pnpm9' cell will do.
set -uo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

PNPM="$HOME/node-versions/_pnpm-cache/9/node_modules/.bin/pnpm"
if [ ! -x "$PNPM" ]; then
  echo "ERROR: pnpm 9 not installed at $PNPM"
  exit 2
fi

echo "Using pnpm: $($PNPM --version)"
echo "Using node: $(node --version)"

"$PNPM" install --no-frozen-lockfile 2>&1 | tail -10
RC=${PIPESTATUS[0]}
if [ $RC -ne 0 ]; then
  echo "pnpm 9 install FAILED (exit $RC)"
  exit $RC
fi

"$PNPM" test 2>&1 | tail -15
