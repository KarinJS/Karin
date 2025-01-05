'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var chalk = require('chalk');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var chalk__default = /*#__PURE__*/_interopDefault(chalk);



Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () { return chalk__default.default; }
});
Object.keys(chalk).forEach(function (k) {
  if (k !== 'default' && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
    enumerable: true,
    get: function () { return chalk[k]; }
  });
});
