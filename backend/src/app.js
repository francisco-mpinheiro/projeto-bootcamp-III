const express = require('express');
const cors = require('cors');

const productRoutes = require('./routes/productRoutes');
const movementRoutes = require('./routes/movementRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'stockly-api',
    timestamp: new Date().toISOString(),
  });
});

// Main domain routes
app.use('/api/products', productRoutes);
app.use('/api/movements', movementRoutes);
app.use('/api/dashboard', dashboardRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: `Rota não encontrada: ${req.method} ${req.url}` });
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  const status = err.statusCode || 500;
  res.status(status).json({
    error: err.message || 'Erro interno do servidor',
  });
});

module.exports = app;
