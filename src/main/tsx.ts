#!/usr/bin/env node

import('./package').then(({ pkg }) => {
  import('./main').then(({ runTsx }) => runTsx(pkg()))
})
