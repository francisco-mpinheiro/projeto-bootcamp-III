const request = require('supertest');
const app = require('../src/app');
const prisma = require('../src/database/prisma');

afterAll(async () => {
  await prisma.$disconnect();
});

describe('🔄 Testes de Movimentações de Estoque (Cenários Normais e de Borda)', () => {
  let testProduct;

  beforeAll(async () => {
    testProduct = await prisma.product.create({
      data: {
        name: 'Produto Teste Movimentação',
        category: 'Testes',
        sku: 'TEST-MOV-' + Date.now(),
        unit: 'un',
        currentStock: 10,
        minStock: 4,
        price: 15.0,
      },
    });
  });

  afterAll(async () => {
    if (testProduct) {
      await prisma.movement.deleteMany({ where: { productId: testProduct.id } });
      await prisma.product.delete({ where: { id: testProduct.id } });
    }
  });

  it('POST /api/movements - Deve registrar entrada (ENTRY) e aumentar o estoque', async () => {
    const res = await request(app).post('/api/movements').send({
      productId: testProduct.id,
      type: 'ENTRY',
      quantity: 5,
      reason: 'Compra de reposição',
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('movement');
    expect(res.body.movement.type).toBe('ENTRY');
    expect(res.body.movement.quantity).toBe(5);
    expect(res.body.product.currentStock).toBe(15);
  });

  it('POST /api/movements - Deve registrar saída (EXIT) e diminuir o estoque', async () => {
    const res = await request(app).post('/api/movements').send({
      productId: testProduct.id,
      type: 'EXIT',
      quantity: 3,
      reason: 'Venda balcão',
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.product.currentStock).toBe(12);
  });

  it('POST /api/movements - Deve disparar alerta quando a saída deixar estoque <= ponto de reposição', async () => {
    // Estoque atual é 12, minStock é 4. Uma saída de 9 deixará estoque em 3 (<= 4)
    const res = await request(app).post('/api/movements').send({
      productId: testProduct.id,
      type: 'EXIT',
      quantity: 9,
      reason: 'Venda promocional',
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.product.currentStock).toBe(3);
    expect(res.body.alertTriggered).toBe(true);
    expect(res.body.product.status).toBe('LOW');
  });

  it('POST /api/movements - Deve REJEITAR saída se saldo for insuficiente (Cenário de Borda: Estoque Negativo)', async () => {
    // Estoque atual é 3. Tentativa de retirar 10 deve falhar
    const res = await request(app).post('/api/movements').send({
      productId: testProduct.id,
      type: 'EXIT',
      quantity: 10,
      reason: 'Tentativa de retirada acima do estoque',
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/Saldo insuficiente/);
  });

  it('POST /api/movements - Deve REJEITAR quantidade menor ou igual a zero (Cenário de Borda)', async () => {
    const res = await request(app).post('/api/movements').send({
      productId: testProduct.id,
      type: 'ENTRY',
      quantity: 0,
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('POST /api/movements - Deve retornar 404 para produto inexistente (Cenário de Borda)', async () => {
    const res = await request(app).post('/api/movements').send({
      productId: 888888,
      type: 'ENTRY',
      quantity: 5,
    });

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toMatch(/não encontrado/);
  });
});
