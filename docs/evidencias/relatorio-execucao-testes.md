# Relatório de Execução dos Testes — Stockly v1.0.0

**Data:** 2026-10-30  
**Branch:** `entrega-final`  
**Ambiente:** PostgreSQL 16 via Docker (`stockly_postgres` healthy em `localhost:5433`) + backend Node.js local  

## Resultado da suíte

| Métrica | Valor |
|---|---|
| Test Suites | **3 passed / 3 total** |
| Tests | **13 passed / 13 total** |
| Taxa de aprovação | **100%** |
| Tempo (`npm test`) | 4.923 s |

### Composição dos testes

| Arquivo | Casos | Foco |
|---|---|---|
| `backend/tests/product.test.js` | 6 | Listagem, criação, detalhe, 404, validação, alertas |
| `backend/tests/movement.test.js` | 6 | ENTRY/EXIT, alerta, saldo insuficiente, quantidade inválida, 404 |
| `backend/tests/dashboard.test.js` | 1 | Resumo de métricas do dashboard |

## Cobertura de código (`npm run test:coverage`)

| Tipo | Cobertura |
|---|---|
| Statements | **72.85%** (153/210) |
| Branches | **39.58%** (38/96) |
| Functions | **62.16%** (23/37) |
| Lines | **72.54%** (148/204) |

### Módulos críticos

| Módulo | Stmts | Observação |
|---|---|---|
| `src/routes/*` | 100% | Todas as rotas exercitadas |
| `src/services/dashboardService.js` | 100% | KPIs cobertos |
| `src/services/movementService.js` | ~74% | Fluxo principal + bordas de saldo |
| `src/services/productService.js` | ~73% | CRUD e status de estoque |
| `src/database/prisma.js` | 100% | Cliente Prisma |

## Arquivos de evidência neste diretório

- `testes-aprovados.log` — saída do `npm test`
- `coverage-report.log` — tabela e summary do coverage
- `relatorio-execucao-testes.md` — este resumo (para anexar/exportar no PDF)

## Como reproduzir

```bash
docker compose up -d postgres
cd backend
cp .env.example .env   # se necessário
npx prisma db push
npm run seed           # opcional
npm test
npm run test:coverage
```

Ou via Docker:

```bash
docker compose up -d postgres
docker compose --profile test run --rm test
```
