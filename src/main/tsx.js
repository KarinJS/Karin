#!/usr/bin/env node
"use strict";
import('./package').then(({ pkg }) => {
    import('./main').then(({ runTsx }) => runTsx(pkg()));
});
