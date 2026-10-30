# SDD As-Built — Stockly v1.0.0

**Disciplina:** BOOTCAMP III  
**Documento:** Especificação Técnica Definitiva (As-Built)  
**Versão do produto:** 1.0.0  
**Repositório:** https://github.com/francisco-mpinheiro/projeto-bootcamp-III  

Este documento descreve a solução **exatamente como foi entregue**, incluindo arquitetura, contratos de API, modelo de dados, componentes e desvios em relação à especificação inicial.

---

## 1. Visão do produto (estado final)

O **Stockly** é um sistema de gestão de estoque com ponto de reposição para pequeno varejo. Permite cadastrar produtos, registrar entradas/saídas de forma atômica, calcular o status de estoque e alertar quando o saldo atinge ou fica abaixo do mínimo configurado.

### Funcionalidades entregues

| Funcionalidade | Status |
|---|---|
| CRUD de produtos com SKU único e ponto de reposição (`minStock`) | Entregue |
| Movimentações atômicas `ENTRY` / `EXIT` | Entregue |
| Status tripartite `NORMAL` / `LOW` / `CRITICAL` | Entregue |
| Alertas de reposição (API + banner na UI) | Entregue |
| Histórico de movimentações | Entregue |
| Dashboard com KPIs | Entregue |
| Test harness Jest + Supertest (13 testes) | Entregue |
| Empacotamento Docker Compose (Postgres + API + Web) | Entregue |

---

## 2. Arquitetura As-Built

```mermaid
graph TD
    User([Operador]) -->|HTTP :3000| Web[Frontend React + Vite / Nginx]
    Web -->|/api proxy| API[Backend Express :3001]
    API -->|Zod| Controllers[Controllers]
    Controllers --> Services[Services]
    Services -->|Prisma ORM| DB[(PostgreSQL 16)]
```

### Camadas

| Camada | Local | Responsabilidade |
|---|---|---|
| Apresentação | `frontend/src` | Dashboard, listagem, modais de produto/movimentação, toasts e banner de alerta |
| API HTTP | `backend/src/routes` + `controllers` | Rotas REST, validação Zod, mapeamento de erros |
| Domínio | `backend/src/services` | Regras de estoque, status, transações e métricas |
| Persistência | Prisma + PostgreSQL | Modelos `Product` e `Movement` |

### Stack entregue

- **Frontend:** React 19, Vite 8, TypeScript, Lucide Icons, Nginx (produção)
- **Backend:** Node.js 20, Express 5, Zod, Prisma 6.4.1
- **Banco:** PostgreSQL 16 (Docker)
- **Testes:** Jest 30 + Supertest 7
- **Infra:** Docker Compose (serviços `postgres`, `api`, `web`, perfil `test`)

---

## 3. Modelo de dados As-Built

### `Product` (`products`)

| Campo | Tipo | Regras |
|---|---|---|
| `id` | Int (PK, autoincrement) | — |
| `name` | String | Obrigatório (≥ 2 caracteres na API) |
| `category` | String | Obrigatório (≥ 2 caracteres na API) |
| `sku` | String? | Opcional, **único** (`@unique`) |
| `unit` | String | Default `"un"` |
| `currentStock` | Int | Default `0`, ≥ 0 |
| `minStock` | Int | Default `5`, ≥ 0 (ponto de reposição) |
| `price` | Float? | Default `0.0`, ≥ 0 |
| `createdAt` / `updatedAt` | DateTime | Gerenciados pelo Prisma |

### `Movement` (`movements`)

| Campo | Tipo | Regras |
|---|---|---|
| `id` | Int (PK) | — |
| `productId` | Int (FK → Product) | Cascade on delete |
| `type` | String | `"ENTRY"` ou `"EXIT"` |
| `quantity` | Int | > 0 |
| `reason` | String? | Opcional |
| `createdAt` | DateTime | Default `now()` |

### Status de estoque (calculado em runtime)

Não é coluna persistida. Calculado em `productService.calculateStockStatus`:

| Status | Regra |
|---|---|
| `CRITICAL` | `currentStock <= 0` |
| `LOW` | `0 < currentStock <= minStock` |
| `NORMAL` | `currentStock > minStock` |

Campos derivados nas respostas: `status`, `isLowStock` (`currentStock <= minStock`).

---

## 4. Contratos de API As-Built

Base URL local: `http://localhost:3001`  
Via frontend Docker/Nginx: rotas sob `/api/*` (proxy para a API).

### Health

| Método | Rota | Resposta |
|---|---|---|
| `GET` | `/api/health` | `{ status, service, timestamp }` |

### Produtos

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/products` | Lista produtos. Query: `search`, `category`, `status` |
| `GET` | `/api/products/alerts` | Produtos com `isLowStock === true` |
| `GET` | `/api/products/:id` | Detalhe + até 20 movimentações recentes |
| `POST` | `/api/products` | Cria produto (`201`) |
| `PUT` | `/api/products/:id` | Atualiza produto |
| `DELETE` | `/api/products/:id` | Remove produto (`204`) |

**Body de criação (exemplo):**

```json
{
  "name": "Arroz 5kg",
  "category": "Mercearia",
  "sku": "ARR-5KG",
  "unit": "pct",
  "currentStock": 20,
  "minStock": 5,
  "price": 24.9
}
```

**Erros relevantes:** `400` validação Zod / SKU duplicado (`P2002`); `404` produto inexistente.

### Movimentações

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/movements` | Lista. Query: `productId`, `type`, `limit` (default 50) |
| `POST` | `/api/movements` | Registra movimentação atômica (`201`) |

**Body de criação:**

```json
{
  "productId": 1,
  "type": "EXIT",
  "quantity": 5,
  "reason": "Venda balcão"
}
```

**Resposta de sucesso:**

```json
{
  "movement": { "id": 1, "productId": 1, "type": "EXIT", "quantity": 5, "reason": "...", "createdAt": "..." },
  "product": { "id": 1, "currentStock": 15, "minStock": 5, "status": "NORMAL", "isLowStock": false },
  "alertTriggered": false
}
```

**Regras de negócio:**
- Execução em `prisma.$transaction`
- `EXIT` com saldo insuficiente → `400` (`BusinessError`)
- Produto inexistente → `404`
- `alertTriggered = true` quando estoque resultante ≤ `minStock`

### Dashboard

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/dashboard/summary` | Métricas + alertas + 6 movimentações recentes |

**Formato:**

```json
{
  "metrics": {
    "totalProducts": 10,
    "totalStockUnits": 120,
    "outOfStockCount": 1,
    "lowStockCount": 2,
    "normalStockCount": 7,
    "totalAlerts": 3
  },
  "alertProducts": [],
  "recentMovements": []
}
```

---

## 5. Componentes de frontend As-Built

| Componente | Arquivo | Função |
|---|---|---|
| App | `App.tsx` | Orquestra estado, carregamento e modais |
| Header | `Header.tsx` | Cabeçalho e ações principais |
| DashboardKPIs | `DashboardKPIs.tsx` | Cartões de métricas |
| AlertBanner | `AlertBanner.tsx` | Destaque de itens em alerta |
| ProductList | `ProductList.tsx` | Listagem/filtros de produtos |
| ProductModal | `ProductModal.tsx` | Criação/edição de produto |
| MovementModal | `MovementModal.tsx` | Registro de entrada/saída |
| MovementHistoryModal | `MovementHistoryModal.tsx` | Histórico por produto |
| Toast | `Toast.tsx` | Feedback de sucesso/erro |
| API client | `services/api.ts` | Chamadas `fetch` para `/api` |

---

## 6. Infraestrutura e execução

### Serviços Docker Compose

| Serviço | Porta host | Função |
|---|---|---|
| `postgres` | `5433 → 5432` | Banco PostgreSQL 16 |
| `api` | `3001` | Backend Express |
| `web` | `3000 → 80` | Frontend estático + proxy Nginx |
| `test` (profile) | — | Executa `npm run test:coverage` |

### Comandos oficiais

```bash
# Subir aplicação completa
docker compose up --build -d

# Executar harness de testes com cobertura
docker compose --profile test run --rm test

# Desenvolvimento local (alternativa)
docker compose up -d postgres
cd backend && cp .env.example .env && npm install && npx prisma db push && npm run seed && npm run dev
cd frontend && npm install && npm run dev
```

### Variáveis de ambiente

Arquivo `backend/.env.example`:

```env
PORT=3001
DATABASE_URL="postgresql://stockly_user:stockly_password@localhost:5433/stockly_db?schema=public"
```

No Compose, a API usa o hostname interno `postgres:5432`.

---

## 7. Suíte de testes As-Built

| Arquivo | Casos | Foco |
|---|---|---|
| `tests/product.test.js` | 6 | Listagem, CRUD, validação, alertas, 404 |
| `tests/movement.test.js` | 6 | ENTRY/EXIT, alerta, saldo insuficiente, quantidade inválida, 404 |
| `tests/dashboard.test.js` | 1 | Resumo de métricas |

**Total:** 13 testes de integração (Jest + Supertest + Prisma/PostgreSQL real).

Comandos:

```bash
cd backend
npm test                 # aprovação da suíte
npm run test:coverage    # aprovação + relatório de cobertura (coverage/)
```

---

## 8. Desvios em relação à especificação inicial (As-Built vs. planejado)

| Spec inicial | Entrega As-Built | Motivo |
|---|---|---|
| Alerta binário (`em_alerta` true/false) | Status `NORMAL` / `LOW` / `CRITICAL` | Distinguir reposição de ruptura total |
| Movimentação sem retorno de alerta | Resposta com `alertTriggered` | Evitar polling extra no frontend |
| Lógica acoplada às rotas | Camada `services` isolada | Testabilidade e manutenção |
| Postgres na porta `5432` | Host `5433` | Evitar conflito com instalações locais |
| Prisma RC automático | Prisma fixado em `6.4.1` | Estabilidade da CLI |
| Compose só com banco | Compose com `postgres` + `api` + `web` + profile `test` | Reprodutibilidade da entrega final |

---

## 9. ADRs vigentes na versão final

1. **ADR 001 — Stack:** React + Node/Express + Prisma + PostgreSQL + Docker  
2. **ADR 002 — Transações atômicas** em movimentações (`prisma.$transaction`)  
3. **ADR 003 — Porta `5433` + validação Zod** na borda da API  

---

## 10. Limites conhecidos da versão 1.0.0

- Sem autenticação/autorização de usuários  
- Sem testes automatizados de frontend (cobertura focada no backend)  
- Status de estoque calculado em memória (não indexado no banco)  
- Seed e `db push` usados para ambiente acadêmico (sem pipeline de migrate de produção)

---

*Documento As-Built correspondente à release estável v1.0.0 do Stockly.*
