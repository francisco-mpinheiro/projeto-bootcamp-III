const prisma = require('../database/prisma');
const { calculateStockStatus } = require('./productService');

class BusinessError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'BusinessError';
  }
}

async function registerMovement(data) {
  const { productId, type, quantity, reason } = data;
  const numProductId = Number(productId);
  const numQuantity = Number(quantity);

  if (isNaN(numProductId)) {
    throw new BusinessError('ID de produto inválido', 400);
  }

  if (isNaN(numQuantity) || numQuantity <= 0) {
    throw new BusinessError('A quantidade da movimentação deve ser um número positivo maior que zero', 400);
  }

  const validTypes = ['ENTRY', 'EXIT'];
  const normalizedType = type ? type.toUpperCase() : '';
  if (!validTypes.includes(normalizedType)) {
    throw new BusinessError('Tipo de movimentação inválido. Use "ENTRY" ou "EXIT"', 400);
  }

  // Execução atômica via Prisma Transaction
  return await prisma.$transaction(async (tx) => {
    const product = await tx.product.findUnique({
      where: { id: numProductId },
    });

    if (!product) {
      throw new BusinessError('Produto não encontrado', 404);
    }

    let newStock = product.currentStock;

    if (normalizedType === 'ENTRY') {
      newStock += numQuantity;
    } else if (normalizedType === 'EXIT') {
      if (product.currentStock < numQuantity) {
        throw new BusinessError(
          `Saldo insuficiente em estoque. Estoque atual: ${product.currentStock}, tentativa de saída: ${numQuantity}`,
          400
        );
      }
      newStock -= numQuantity;
    }

    // Atualiza o estoque do produto
    const updatedProduct = await tx.product.update({
      where: { id: numProductId },
      data: { currentStock: newStock },
    });

    // Registra a movimentação no histórico
    const movement = await tx.movement.create({
      data: {
        productId: numProductId,
        type: normalizedType,
        quantity: numQuantity,
        reason: reason || null,
      },
    });

    const status = calculateStockStatus(newStock, updatedProduct.minStock);

    return {
      movement,
      product: {
        ...updatedProduct,
        status,
        isLowStock: newStock <= updatedProduct.minStock,
      },
      alertTriggered: newStock <= updatedProduct.minStock,
    };
  });
}

async function listMovements(options = {}) {
  const { productId, type, limit = 50 } = options;

  const where = {};
  if (productId) {
    where.productId = Number(productId);
  }
  if (type) {
    where.type = type.toUpperCase();
  }

  return prisma.movement.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: Number(limit),
    include: {
      product: {
        select: {
          id: true,
          name: true,
          unit: true,
          category: true,
          minStock: true,
        },
      },
    },
  });
}

module.exports = {
  BusinessError,
  registerMovement,
  listMovements,
};
