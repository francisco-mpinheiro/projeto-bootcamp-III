const { z } = require('zod');
const productService = require('../services/productService');

const createProductSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  category: z.string().min(2, 'Categoria deve ter no mínimo 2 caracteres'),
  sku: z.string().optional().nullable(),
  unit: z.string().optional().default('un'),
  currentStock: z.number().int().min(0, 'Estoque inicial não pode ser negativo').default(0),
  minStock: z.number().int().min(0, 'Ponto de reposição não pode ser negativo').default(5),
  price: z.number().min(0, 'Preço não pode ser negativo').optional().default(0.0),
});

const updateProductSchema = z.object({
  name: z.string().min(2).optional(),
  category: z.string().min(2).optional(),
  sku: z.string().optional().nullable(),
  unit: z.string().optional(),
  currentStock: z.number().int().min(0).optional(),
  minStock: z.number().int().min(0).optional(),
  price: z.number().min(0).optional(),
});

async function getAll(req, res, next) {
  try {
    const { search, category, status } = req.query;
    const products = await productService.listProducts({ search, category, status });
    return res.json(products);
  } catch (error) {
    next(error);
  }
}

async function getById(req, res, next) {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    return res.json(product);
  } catch (error) {
    next(error);
  }
}

async function getAlerts(req, res, next) {
  try {
    const lowStock = await productService.getLowStockProducts();
    return res.json(lowStock);
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    const validatedData = createProductSchema.parse(req.body);
    const product = await productService.createProduct(validatedData);
    return res.status(201).json(product);
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        error: 'Erro de validação dos campos',
        details: error.errors ? error.errors.map((e) => ({ field: e.path.join('.'), message: e.message })) : error.message,
      });
    }
    // Handle Prisma unique constraint error for SKU
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Já existe um produto cadastrado com este SKU' });
    }
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const validatedData = updateProductSchema.parse(req.body);
    const product = await productService.updateProduct(req.params.id, validatedData);
    return res.json(product);
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        error: 'Erro de validação dos campos',
        details: error.errors ? error.errors.map((e) => ({ field: e.path.join('.'), message: e.message })) : error.message,
      });
    }
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Produto não encontrado para atualização' });
    }
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    await productService.deleteProduct(req.params.id);
    return res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Produto não encontrado para exclusão' });
    }
    next(error);
  }
}

module.exports = {
  getAll,
  getById,
  getAlerts,
  create,
  update,
  remove,
};
