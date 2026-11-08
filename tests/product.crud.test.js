// Bước 11: Test CRUD THẬT với MongoDB (chạy trên máy ảo GitHub hoặc container nammongodb)
// Dùng database riêng "productdb_test" để không ảnh hưởng dữ liệu thật
const { test, before, after } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const app = require('../app'); // app.js tự nạp .env (nếu có)
const Product = require('../models/product');

const MONGO_URI_TEST =
  (process.env.URL_MONGO || 'mongodb://127.0.0.1:27017/') +
  (process.env.DATABASE_NAME_TEST || 'productdb_test');

let server;
let baseUrl;

// Hàm gọi API, trả về { status, body }
async function api(method, path, body, rawBody) {
  const res = await fetch(baseUrl + path, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: rawBody !== undefined ? rawBody : body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = text; }
  return { status: res.status, body: data };
}

before(async () => {
  console.log('Test database:', MONGO_URI_TEST);
  await mongoose.connect(MONGO_URI_TEST, { serverSelectionTimeoutMS: 5000 });
  await Product.deleteMany({}); // làm sạch dữ liệu test cũ
  await Product.init();         // đảm bảo index unique của pid đã được tạo
  server = app.listen(0);
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await mongoose.connection.dropDatabase(); // xóa database test
  await mongoose.disconnect();
  server.close();
});

const sample = { pid: 'T001', pname: 'Test product', price: 100000, quantity: 10 };

test('POST: tạo sản phẩm -> 201', async () => {
  const res = await api('POST', '/api/products', sample);
  assert.strictEqual(res.status, 201);
  assert.strictEqual(res.body.pid, 'T001');
});

test('GET: đọc sản phẩm -> 200', async () => {
  const res = await api('GET', '/api/products/T001');
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.pname, sample.pname);
});

test('PUT: cập nhật giá -> 200', async () => {
  const res = await api('PUT', '/api/products/T001', {
    price: 90000
  });
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.price, 90000);
});

test('DELETE: xóa sản phẩm -> 200', async () => {
  const res = await api('DELETE', '/api/products/T001');
  assert.strictEqual(res.status, 200);
});

