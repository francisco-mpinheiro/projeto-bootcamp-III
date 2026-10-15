const prisma = require('../database/prisma');

function calculateStockStatus(currentStock, minStock) {
  if (currentStock <= 0) {
    return 'CRITICAL'; // Sem estoque
  }
  if (currentStock <= minStock) {
    return 'LOW'; // Em alerta de reposição
  }
  return 'NORMAL'; // Estoque adequado
}

function enrichProductWithStatus(product) {
  return {
    ...product,
    status: calculateStockStatus(product.currentStock, product.minStock),
    isLowStock: product.currentStock <= product.minStock,
  };
}

async function createProduct(data) {
  const product = await prisma.product.create({
    data: {
      name: data.name,
      category: data.category,
      sku: data.sku || null,
      unit: data.unit || 'un',
      currentStock: data.currentStock !== undefined ? Number(data.currentStock) : 0,
      minStock: data.minStock !== undefined ? Number(data.minStock) : 5,
      price: data.price !== undefined ? Number(data.price) : 0.0,
    },
  });

  return enrichProductWithStatus(product);
}

async function listProducts(options = {}) {
  const { search, category, status } = options;

  const where = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { category: { contains: search, mode: 'insensitive' } },
      { sku: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (category) {
    where.category = { equals: category, mode: 'insensitive' };
  }

  const products = await prisma.product.findMany({
    where,
    orderBy: { name: 'asc' },
    include: {
      _count: {
        select: { movements: true },
      },
    },
  });

  const enriched = products.map(enrichProductWithStatus);

  if (status) {
    return enriched.filter((p) => p.status === status.toUpperCase());
  }

  return enriched;
}

async function getProductById(id) {
  const numericId = Number(id);
  if (isNaN(numericId)) {
    return null;
  }

  const product = await prisma.product.findUnique({
    where: { id: numericId },
    include: {
      movements: {
        orderBy: { createdAt: 'desc' },
        take: 20,
      },
    },
  });

  if (!product) return null;
  return enrichProductWithStatus(product);
}

async function updateProduct(id, data) {
  const numericId = Number(id);
  const updated = await prisma.product.update({
    where: { id: numericId },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.category && { category: data.category }),
      ...(data.sku !== undefined && { sku: data.sku || null }),
      ...(data.unit && { unit: data.unit }),
      ...(data.minStock !== undefined && { minStock: Number(data.minStock) }),
      ...(data.price !== undefined && { price: Number(data.price) }),
      ...(data.currentStock !== undefined && { currentStock: Number(data.currentStock) }),
    },
  });

  return enrichProductWithStatus(updated);
}

async function deleteProduct(id) {
  const numericId = Number(id);
  return prisma.product.delete({
    where: { id: numericId },
  });
}

async function getLowStockProducts() {
  const products = await prisma.product.findMany({
    orderBy: { currentStock: 'asc' },
  });

  return products
    .map(enrichProductWithStatus)
    .filter((p) => p.isLowStock);
}

module.exports = {
  calculateStockStatus,
  enrichProductWithStatus,
  createProduct,
  listProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getLowStockProducts,
};
