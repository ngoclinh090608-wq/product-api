const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const morgan = require('morgan');
const productRoutes = require('./routes/productRoutes');

// Load .env file
dotenv.config();

const app = express();

// Get port from .env or fallback to 3000
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.URL_MONGO + process.env.DATABASE_NAME;

console.log('MongoDB URI:', MONGO_URI);

// Middleware: parse JSON body
app.use(morgan('dev', { skip: (req) => req.url === '/health' }));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Product API is running 🚀');
});

// Health check (API + MongoDB) - used in Step 9
app.get('/health', (req, res) => {
  const dbOk = mongoose.connection.readyState === 1;
  res.status(dbOk ? 200 : 503).json({ status: dbOk ? 'ok' : 'error', database: dbOk ? 'connected' : 'disconnected' });
});

app.use('/api/products', productRoutes);

// 404 - route not found
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.originalUrl} not found.` });
});

// Error handler middleware
app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ message: 'Validation failed.', errors });
  }
  if (err.code === 11000) {
    return res.status(409).json({ message: `Product pid '${err.keyValue.pid}' already exists.` });
  }
  if (err.name === 'CastError') {
    return res.status(400).json({ message: `Invalid value for field '${err.path}'.` });
  }
  console.error(err);
  res.status(500).json({ message: 'Internal server error.' });
});

// 🆕 MongoDB connection check -> start server
// Chỉ chạy khi gọi trực tiếp "node app.js" (không chạy khi file test require app)
if (require.main === module) {
  mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log('✅ MongoDB connected successfully');
      app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
      });
    })
    .catch((err) => {
      console.error('❌ MongoDB connection failed:', err.message);
      process.exit(1);
    });
}

// 🆕 Export app để file test sử dụng
module.exports = app;