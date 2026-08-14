import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';

import { createApp } from './index';

const request = (app: ReturnType<typeof createApp>, path: string) =>
  new Promise<{ status: number; body: any }>((resolve, reject) => {
    const server = app.listen(0, () => {
      const address = server.address();
      if (!address || typeof address === 'string') {
        server.close();
        reject(new Error('Unable to get server address'));
        return;
      }

      const requestPath = `http://127.0.0.1:${address.port}${path}`;
      http.get(requestPath, (response) => {
        const chunks: Buffer[] = [];

        response.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
        response.on('end', () => {
          const text = Buffer.concat(chunks).toString('utf8');
          try {
            const body = text ? JSON.parse(text) : null;
            resolve({ status: response.statusCode || 0, body });
          } catch (error) {
            reject(error);
          } finally {
            server.close();
          }
        });
      }).on('error', (error) => {
        server.close();
        reject(error);
      });
    });
  });

test('GET /api/users returns a seeded list', async () => {
  const app = createApp();
  const response = await request(app, '/api/users/');

  assert.equal(response.status, 200);
  assert.equal(Array.isArray(response.body), true);
  assert.equal(response.body.length > 0, true);
});

test('GET /api/leaderboard returns leaderboard data', async () => {
  const app = createApp();
  const response = await request(app, '/api/leaderboard/');

  assert.equal(response.status, 200);
  assert.equal(Array.isArray(response.body), true);
  assert.equal(response.body.length > 0, true);
});
