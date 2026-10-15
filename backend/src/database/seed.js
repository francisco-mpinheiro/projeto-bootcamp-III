const prisma = require('./prisma');

async function seed() {
  console.log('🌱 Iniciando seed do banco de dados Stockly...');

  // Limpa registros anteriores para permitir execução idempotente
  await prisma.movement.deleteMany({});
  await prisma.product.deleteMany({});

  const sampleProducts = [
    {
      name: 'Café Torrado e Moído 500g',
      category: 'Mercearia',
      sku: '78910001001',
      unit: 'pct',
      currentStock: 18,
      minStock: 10,
      price: 18.50,
    },
    {
      name: 'Açúcar Refinado 1kg',
      category: 'Mercearia',
      sku: '78910001002',
      unit: 'pct',
      currentStock: 4, // Alerta: abaixo do minStock (8)
      minStock: 8,
      price: 4.80,
    },
    {
      name: 'Leite Integral UHT 1L',
      category: 'Laticínios',
      sku: '78910001003',
      unit: 'cx',
      currentStock: 0, // Crítico: sem estoque
      minStock: 12,
      price: 5.90,
    },
    {
      name: 'Arroz Branco Tipo 1 5kg',
      category: 'Mercearia',
      sku: '78910001004',
      unit: 'pct',
      currentStock: 25,
      minStock: 6,
      price: 29.90,
    },
    {
      name: 'Óleo de Soja 900ml',
      category: 'Mercearia',
      sku: '78910001005',
      unit: 'un',
      currentStock: 3, // Alerta: abaixo do minStock (10)
      minStock: 10,
      price: 7.20,
    },
    {
      name: 'Detergente Líquido 500ml',
      category: 'Limpeza',
      sku: '78910001006',
      unit: 'un',
      currentStock: 30,
      minStock: 10,
      price: 2.60,
    },
  ];

  for (const prodData of sampleProducts) {
    const created = await prisma.product.create({
      data: prodData,
    });

    // Cria movimentação inicial de entrada
    if (prodData.currentStock > 0) {
      await prisma.movement.create({
        data: {
          productId: created.id,
          type: 'ENTRY',
          quantity: prodData.currentStock,
          reason: 'Carga inicial de estoque',
        },
      });
    }
  }

  console.log('✅ Seed finalizado com sucesso!');
}

seed()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
