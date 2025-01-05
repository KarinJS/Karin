'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var chokidar = require('chokidar');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var chokidar__default = /*#__PURE__*/_interopDefault(chokidar);



Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () { return chokidar__default.default; }
});
Object.keys(chokidar).forEach(function (k) {
  if (k !== 'default' && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
    enumerable: true,
    get: function () { return chokidar[k]; }
  });
});
