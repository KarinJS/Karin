'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var ws = require('ws');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var ws__default = /*#__PURE__*/_interopDefault(ws);



Object.defineProperty(exports, "WebSocket", {
  enumerable: true,
  get: function () { return ws.WebSocket; }
});
Object.defineProperty(exports, "WebSocketServer", {
  enumerable: true,
  get: function () { return ws.WebSocketServer; }
});
Object.defineProperty(exports, "createWebSocketStream", {
  enumerable: true,
  get: function () { return ws.createWebSocketStream; }
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () { return ws__default.default; }
});
