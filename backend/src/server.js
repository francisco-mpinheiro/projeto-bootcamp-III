require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Stockly API rodando com sucesso na porta ${PORT}`);
  console.log(`📍 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`📦 Produtos: http://localhost:${PORT}/api/products`);
  console.log(`📊 Dashboard: http://localhost:${PORT}/api/dashboard/summary`);
});
