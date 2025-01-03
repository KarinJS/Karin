import express from 'express';
import { createServer } from 'node:http';
/** express 服务 */
export const app = express();
/** http 服务 */
export const server = createServer(app);
