#!/usr/bin/env bash
# One-off: temporarily remove the `packageManager` pin so pnpm 11 actually
# stays at v11 (instead of self-downgrading to the pinned version) and
# verify install + tests still work.
set -uo pipefail
cd /mnt/d/Github/Karin-test-build

NODE_BIN="$HOME/node-versions/v22.22.2/bin"
[ -x "$NODE_BIN/node" ] || NODE_BIN="$(dirname "$(which node)")"
export PATH="$HOME/node-versions/_pnpm-cache/22/node_modules/.bin:$NODE_BIN:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"

cp package.json package.json.bak
node -e "
  const fs = require('fs');
  const pkg = JSON.parse(fs.readFileSync('package.json','utf8'));
  delete pkg.packageManager;
  fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
"

echo "pnpm version (no packageManager pin): $(pnpm --version)"
pnpm test 2>&1 | tail -10
RC=$?

mv package.json.bak package.json
exit $RC
