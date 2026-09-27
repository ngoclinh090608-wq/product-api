// Test đơn giản cho CI (Bước 10) - KHÔNG cần MongoDB
// Dùng test runner có sẵn của Node.js (node:test), không cần cài thêm thư viện
const { test, before, after } = require('node:test');
const assert = require('node:assert');
const app = require('../app');

let server;
let baseUrl;

before(() => {
  server = app.listen(0); // cổng 0 = hệ điều hành tự chọn cổng trống
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(() => {
  server.close();
});

test('GET / trả về 200 và thông báo API đang chạy', async () => {
  const res = await fetch(`${baseUrl}/`);
  assert.strictEqual(res.status, 200);
  assert.match(await res.text(), /Product API is running/);
});

test('GET /health trả về 503 khi chưa kết nối MongoDB', async () => {
  const res = await fetch(`${baseUrl}/health`);
  const body = await res.json();
  assert.strictEqual(res.status, 503);
  assert.strictEqual(body.database, 'disconnected');
});

test('Route không tồn tại trả về 404', async () => {
  const res = await fetch(`${baseUrl}/khong-ton-tai`);
  assert.strictEqual(res.status, 404);
});