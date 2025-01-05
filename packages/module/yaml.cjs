'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var yaml = require('yaml');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var yaml__default = /*#__PURE__*/_interopDefault(yaml);



Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () { return yaml__default.default; }
});
Object.keys(yaml).forEach(function (k) {
  if (k !== 'default' && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
    enumerable: true,
    get: function () { return yaml[k]; }
  });
});
