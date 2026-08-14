"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = __importDefault(require("node:test"));
const strict_1 = __importDefault(require("node:assert/strict"));
const node_http_1 = __importDefault(require("node:http"));
const index_1 = require("./index");
const request = (app, path) => new Promise((resolve, reject) => {
    const server = app.listen(0, () => {
        const address = server.address();
        if (!address || typeof address === 'string') {
            server.close();
            reject(new Error('Unable to get server address'));
            return;
        }
        const requestPath = `http://127.0.0.1:${address.port}${path}`;
        node_http_1.default.get(requestPath, (response) => {
            const chunks = [];
            response.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
            response.on('end', () => {
                const text = Buffer.concat(chunks).toString('utf8');
                try {
                    const body = text ? JSON.parse(text) : null;
                    resolve({ status: response.statusCode || 0, body });
                }
                catch (error) {
                    reject(error);
                }
                finally {
                    server.close();
                }
            });
        }).on('error', (error) => {
            server.close();
            reject(error);
        });
    });
});
(0, node_test_1.default)('GET /api/users returns a seeded list', async () => {
    const app = (0, index_1.createApp)();
    const response = await request(app, '/api/users/');
    strict_1.default.equal(response.status, 200);
    strict_1.default.equal(Array.isArray(response.body), true);
    strict_1.default.equal(response.body.length > 0, true);
});
(0, node_test_1.default)('GET /api/leaderboard returns leaderboard data', async () => {
    const app = (0, index_1.createApp)();
    const response = await request(app, '/api/leaderboard/');
    strict_1.default.equal(response.status, 200);
    strict_1.default.equal(Array.isArray(response.body), true);
    strict_1.default.equal(response.body.length > 0, true);
});
//# sourceMappingURL=index.test.js.map