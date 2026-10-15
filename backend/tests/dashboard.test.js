const request = require('supertest');
const app = require('../src/app');
const prisma = require('../src/database/prisma');

afterAll(async () => {
  await prisma.$disconnect();
});

describe('📊 Testes do Dashboard e Métricas', () => {
  it('GET /api/dashboard/summary - Deve retornar resumo consolidado com métricas de estoque e alertas', async () => {
    const res = await request(app).get('/api/dashboard/summary');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('metrics');
    expect(res.body).toHaveProperty('alertProducts');
    expect(res.body).toHaveProperty('recentMovements');

    const { metrics } = res.body;
    expect(metrics).toHaveProperty('totalProducts');
    expect(metrics).toHaveProperty('totalStockUnits');
    expect(metrics).toHaveProperty('lowStockCount');
    expect(metrics).toHaveProperty('outOfStockCount');
    expect(metrics.totalProducts).toBeGreaterThanOrEqual(1);
  });
});
