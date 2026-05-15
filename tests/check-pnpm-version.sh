#!/usr/bin/env bash
set -u
cd /tmp
echo "Outside project, pnpm 11 binary:"
~/node-versions/_pnpm-cache/22/node_modules/.bin/pnpm --version
echo
echo "Inside project (with packageManager pin), pnpm 11 binary:"
cd /mnt/d/Github/Karin-test-build
~/node-versions/_pnpm-cache/22/node_modules/.bin/pnpm --version
