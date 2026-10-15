const { z } = require('zod');
const movementService = require('../services/movementService');

const createMovementSchema = z.object({
  productId: z.number().int().positive('ID do produto deve ser um número positivo'),
  type: z.enum(['ENTRY', 'EXIT'], {
    errorMap: () => ({ message: 'Tipo deve ser "ENTRY" (Entrada) ou "EXIT" (Saída)' }),
  }),
  quantity: z.number().int().positive('Quantidade deve ser um inteiro positivo maior que zero'),
  reason: z.string().optional().nullable(),
});

async function getAll(req, res, next) {
  try {
    const { productId, type, limit } = req.query;
    const movements = await movementService.listMovements({ productId, type, limit });
    return res.json(movements);
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    const validatedData = createMovementSchema.parse({
      ...req.body,
      productId: Number(req.body.productId),
      quantity: Number(req.body.quantity),
    });

    const result = await movementService.registerMovement(validatedData);
    return res.status(201).json(result);
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        error: 'Erro de validação dos campos',
        details: error.errors ? error.errors.map((e) => ({ field: e.path.join('.'), message: e.message })) : error.message,
      });
    }
    if (error.name === 'BusinessError') {
      return res.status(error.statusCode).json({ error: error.message });
    }
    next(error);
  }
}

module.exports = {
  getAll,
  create,
};
