const request = require('supertest');
const app = require('../src/app');
const prisma = require('../src/database/prisma');

afterAll(async () => {
  await prisma.$disconnect();
});

describe('📦 Testes de Produtos (Cenários Normais e de Borda)', () => {
  let createdProductId;

  it('GET /api/products - Deve listar todos os produtos enriquecidos com status de estoque', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);

    const first = res.body[0];
    expect(first).toHaveProperty('id');
    expect(first).toHaveProperty('name');
    expect(first).toHaveProperty('currentStock');
    expect(first).toHaveProperty('minStock');
    expect(first).toHaveProperty('status');
    expect(['NORMAL', 'LOW', 'CRITICAL']).toContain(first.status);
  });

  it('POST /api/products - Deve criar um novo produto com sucesso (Cenário Normal)', async () => {
    const newProduct = {
      name: 'Biscoito Recheado 140g',
      category: 'Mercearia',
      sku: 'BISCOITO-' + Date.now(),
      unit: 'pct',
      currentStock: 20,
      minStock: 5,
      price: 3.50,
    };

    const res = await request(app).post('/api/products').send(newProduct);
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe(newProduct.name);
    expect(res.body.currentStock).toBe(20);
    expect(res.body.status).toBe('NORMAL');

    createdProductId = res.body.id;
  });

  it('GET /api/products/:id - Deve buscar produto existente por ID', async () => {
    const res = await request(app).get(`/api/products/${createdProductId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(createdProductId);
  });

  it('GET /api/products/:id - Deve retornar 404 para ID inexistente (Cenário de Borda)', async () => {
    const res = await request(app).get('/api/products/999999');
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  it('POST /api/products - Deve rejeitar produto com campos inválidos (Cenário de Borda / Validação)', async () => {
    const invalidProduct = {
      name: 'A', // Nome muito curto (< 2 caracteres)
      category: '',
      currentStock: -5, // Estoque negativo
    };

    const res = await request(app).post('/api/products').send(invalidProduct);
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('GET /api/products/alerts - Deve retornar apenas itens em alerta de reposição', async () => {
    const res = await request(app).get('/api/products/alerts');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    for (const item of res.body) {
      expect(item.currentStock).toBeLessThanOrEqual(item.minStock);
      expect(['LOW', 'CRITICAL']).toContain(item.status);
    }
  });
});
