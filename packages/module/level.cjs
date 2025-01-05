'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var level = require('level');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var level__default = /*#__PURE__*/_interopDefault(level);



Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () { return level__default.default; }
});
Object.keys(level).forEach(function (k) {
  if (k !== 'default' && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
    enumerable: true,
    get: function () { return level[k]; }
  });
});
