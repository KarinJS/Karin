'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var redis = require('redis');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var redis__default = /*#__PURE__*/_interopDefault(redis);



Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () { return redis__default.default; }
});
Object.keys(redis).forEach(function (k) {
  if (k !== 'default' && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
    enumerable: true,
    get: function () { return redis[k]; }
  });
});
