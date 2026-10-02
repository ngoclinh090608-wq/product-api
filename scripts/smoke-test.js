// Smoke test CRUD qua HTTP cho API ĐANG CHẠY (container product-api hoặc Docker Compose)
// Cách dùng:  npm run test:smoke      (mặc định http://localhost:3000)
//             BASE_URL=http://localhost:3000 node scripts/smoke-test.js
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const pid = 'SMOKE' + Date.now();
let failed = 0;

async function step(name, method, path, body, expected) {
  const res = await fetch(BASE_URL + path, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const ok = res.status === expected;
  if (!ok) failed++;
  console.log(`${ok ? '✅' : '❌'} ${name.padEnd(28)} ${method.padEnd(6)} ${path} -> ${res.status} (expected ${expected})`);
}

(async () => {
  console.log(`Smoke test: ${BASE_URL}  (pid = ${pid})\n`);
  try {
    await step('Health check', 'GET', '/health', null, 200);
    await step('Create product', 'POST', '/api/products', { pid, pname: 'Smoke test', price: 1000, quantity: 1 }, 201);
    await step('Read all products', 'GET', '/api/products', null, 200);
    await step('Read product by pid', 'GET', `/api/products/${pid}`, null, 200);
    await step('Update product', 'PUT', `/api/products/${pid}`, { price: 2000 }, 200);
    await step('Delete product', 'DELETE', `/api/products/${pid}`, null, 200);
    await step('Read deleted product', 'GET', `/api/products/${pid}`, null, 404);
  } catch (err) {
    failed++;
    console.error('❌ Không gọi được API:', err.message);
  }
  console.log(failed ? `\n❌ ${failed} bước thất bại` : '\n✅ Tất cả bước đều đạt');
  process.exit(failed ? 1 : 0);
})();