'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var log4js = require('log4js');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var log4js__default = /*#__PURE__*/_interopDefault(log4js);



Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () { return log4js__default.default; }
});
Object.keys(log4js).forEach(function (k) {
  if (k !== 'default' && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
    enumerable: true,
    get: function () { return log4js[k]; }
  });
});
