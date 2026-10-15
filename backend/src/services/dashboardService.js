const prisma = require('../database/prisma');
const { enrichProductWithStatus } = require('./productService');

async function getDashboardSummary() {
  const [products, recentMovements] = await Promise.all([
    prisma.product.findMany({
      orderBy: { name: 'asc' },
    }),
    prisma.movement.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            unit: true,
          },
        },
      },
    }),
  ]);

  const enrichedProducts = products.map(enrichProductWithStatus);

  const totalProducts = enrichedProducts.length;
  const outOfStockCount = enrichedProducts.filter((p) => p.status === 'CRITICAL').length;
  const lowStockCount = enrichedProducts.filter((p) => p.status === 'LOW').length;
  const normalStockCount = enrichedProducts.filter((p) => p.status === 'NORMAL').length;
  const totalStockUnits = enrichedProducts.reduce((sum, p) => sum + p.currentStock, 0);

  const alertProducts = enrichedProducts
    .filter((p) => p.isLowStock)
    .sort((a, b) => a.currentStock - b.currentStock);

  return {
    metrics: {
      totalProducts,
      totalStockUnits,
      outOfStockCount,
      lowStockCount,
      normalStockCount,
      totalAlerts: outOfStockCount + lowStockCount,
    },
    alertProducts,
    recentMovements,
  };
}

module.exports = {
  getDashboardSummary,
};
