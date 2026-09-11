<div align="center">

# 🚀 Stockly

### Projeto desenvolvido para a matéria **BOOTCAMP III**

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)

<img src="[LINK_DO_GIF_OU_IMAGEM]" width="280" alt="banner do projeto"/>

*[Espaço reservado para GIF/imagem de destaque do projeto]*

</div>

---

## 📑 Sumário

- [👥 Membros do Grupo](#-membros-do-grupo)
- [📌 Visão Geral do Projeto](#-visão-geral-do-projeto)
- [🛠️ Tecnologias Utilizadas](#️-tecnologias-utilizadas)
- [⚙️ Guia de Instalação e Execução](#️-guia-de-instalação-e-execução)
- [🧱 Registro de Decisões Arquiteturais (ADRs)](#-registro-de-decisões-arquiteturais-adrs)

---

## 👥 Membros do Grupo

| 👤 Nome | 🎓 RA |
|---|---|
| Erick Guilherme Mesquita Diniz | 22305289 |
| Cauã Leite Sousa Paniagua | 22405235 |
| Matheus Shiokawa Silva | 22305323 |
| Marlon Giovanni Coelho Paganotto | 22301592 |
| Mateus Cavalcante Rodrigues | 22303356 |
| Francisco Matheus Pinheiro de Brito da Silva | 22303388 |

---

## 📌 Visão Geral do Projeto

> Sistema de controle de estoque com ponto de reposição para pequeno varejo.

- **Problema resolvido:** Donos de pequenos comércios (mercadinhos, padarias, lojas de bairro) geralmente só percebem que um produto acabou quando o cliente já pediu por ele, perdendo a venda. O controle de estoque, quando existe, costuma ser manual (caderno/planilha), sem alerta antecipado de reposição.
- **Solução proposta:** Sistema de gestão de estoque que registra entradas/saídas de produtos, calcula o nível atual e dispara alertas quando o estoque atinge um ponto mínimo de reposição definido para cada item.
- **Público-alvo:** Pequenos comerciantes e varejistas que hoje controlam estoque de forma manual ou não estruturada.
- **Principais funcionalidades:**
  - [ ] Cadastro de produtos (nome, categoria, quantidade, ponto de reposição)
  - [ ] Registro de movimentações de estoque (entrada/saída)
  - [ ] Alertas de reposição quando o estoque atinge o nível mínimo
  - [ ] Histórico de movimentações por produto
  - [ ] Painel de visão geral do estoque

<div align="center">
  <img src="[LINK_DA_IMAGEM]" alt="preview do sistema" width="600"/>
</div>

---

## 🛠️ Tecnologias Utilizadas

<div align="center">

![React](https://img.shields.io/badge/frontend-React-61DAFB)
![Node.js](https://img.shields.io/badge/backend-Node.js-339933)
![Prisma](https://img.shields.io/badge/ORM-Prisma-2D3748)
![PostgreSQL](https://img.shields.io/badge/banco%20de%20dados-PostgreSQL-4169E1)
![Docker](https://img.shields.io/badge/infra-Docker-2496ED)

</div>

- **Frontend:** React
- **Backend:** Node.js
- **ORM:** Prisma
- **Banco de dados:** PostgreSQL
- **Infraestrutura/Execução:** Docker

---

## ⚙️ Guia de Instalação e Execução

### ✅ Pré-requisitos

- [ ] Node.js instalado
- [ ] Docker e Docker Compose instalados
- [ ] Acesso ao repositório do projeto

### 📥 1. Clonar o repositório

```bash
git clone [LINK_DO_REPOSITORIO]
cd [nome-da-pasta]
```

### 📦 2. Instalar dependências

```bash
# backend
cd backend
npm install

# frontend
cd ../frontend
npm install
```

### 🔐 3. Configurar variáveis de ambiente

```env
DATABASE_URL=postgresql://[usuario]:[senha]@localhost:5432/[nome_do_banco]
PORT=[ ]
```

### 🐳 4. Subir os containers com Docker

```bash
docker compose up -d
```

### 🗄️ 5. Rodar as migrations do Prisma

```bash
npx prisma migrate dev
```

### ▶️ 6. Executar o projeto

```bash
# backend
npm run dev

# frontend
npm run dev
```

### 🧪 7. Executar os testes

```bash
npm test
```

---

## 🧱 Registro de Decisões Arquiteturais (ADRs)

> Registro sintético das principais decisões técnicas e arquiteturais tomadas ao longo do desenvolvimento.

### ADR 001 — Escolha da stack tecnológica
- **Contexto:** Necessidade de definir frontend, backend, ORM, banco de dados e forma de execução do projeto.
- **Decisão:** React (frontend), Node.js (backend), Prisma (ORM), PostgreSQL (banco de dados) e Docker (execução/infraestrutura).
- **Status:** ✅ Aceita
- **Consequências:** [ ]

### ADR 002 — [Título da decisão]
- **Contexto:** [ ]
- **Decisão:** [ ]
- **Status:** [ ]
- **Consequências:** [ ]

### ADR 003 — [Título da decisão]
- **Contexto:** [ ]
- **Decisão:** [ ]
- **Status:** [ ]
- **Consequências:** [ ]

> 💡 Adicionar novos ADRs conforme novas decisões relevantes forem tomadas, mantendo a numeração sequencial.

---

<div align="center">
  Feito para a disciplina BOOTCAMP III
</div>
