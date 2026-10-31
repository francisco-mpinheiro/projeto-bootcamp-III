# Documento de Encerramento — Entrega Final (Atividade III)

**Projeto:** Stockly  
**Disciplina:** BOOTCAMP III  
**Release alvo:** [v1.0.0](https://github.com/francisco-mpinheiro/projeto-bootcamp-III/releases/tag/v1.0.0)  
*(Atualizar o link após publicar a release no GitHub.)*

> Este arquivo é a base textual do PDF a ser enviado na Sala Online.  
> Preencha os campos marcados com `[PREENCHER]` antes de exportar para PDF.

---

## 1. Link da Release Oficial

- **Repositório:** https://github.com/francisco-mpinheiro/projeto-bootcamp-III  
- **Release v1.0.0:** `[PREENCHER — colar URL da release após publicar]`  
- **Tag:** `v1.0.0`  
- **Branch base:** `main`

---

## 2. Identificação da Equipe

| Nome completo | RA |
|---|---|
| Erick Guilherme Mesquita Diniz | 22305289 |
| Cauã Leite Sousa Paniagua | 22305235 |
| Matheus Shiokawa Silva | 22305323 |
| Marlon Giovanni Coelho Paganotto | 22301592 |
| Mateus Cavalcante Rodrigues | 22303356 |
| Francisco Matheus Pinheiro de Brito da Silva | 22303388 |

---

## 3. Relatório de Execução dos Testes e Cobertura

### 3.1 Como reproduzir

```bash
# Opção A — Docker (recomendado para evidência)
docker compose up -d postgres
docker compose --profile test run --rm test

# Opção B — Local
docker compose up -d postgres
cd backend
cp .env.example .env
npm install
npx prisma db push
npm run seed
npm test
npm run test:coverage
```

### 3.2 Resultado obtido (2026-10-30)

- **Test Suites:** 3 passed / 3 total  
- **Tests:** 13 passed / 13 total (**100% de aprovação**)  
- **Coverage:** Statements **72.85%** · Branches **39.58%** · Functions **62.16%** · Lines **72.54%**  
- Relatório HTML local: `backend/coverage/index.html`  
- Relatório LCOV local: `backend/coverage/lcov.info`

### 3.3 Evidências (anexar no PDF)

Arquivos já gerados em `docs/evidencias/`:

- [`testes-aprovados.log`](./evidencias/testes-aprovados.log) — `Tests: 13 passed, 13 total`
- [`coverage-report.log`](./evidencias/coverage-report.log) — tabela + `Coverage summary`
- [`relatorio-execucao-testes.md`](./evidencias/relatorio-execucao-testes.md) — resumo formal

> Recomendação: ao montar o PDF, inclua prints desses logs (ou o conteúdo do relatório MD) como anexos visuais.

---

## 4. Link do Vídeo de Demonstração

- **URL do vídeo (3–5 min):** `[PREENCHER — YouTube / Google Drive / Loom / SharePoint]`

### Roteiro sugerido do vídeo

1. Apresentar o problema (ruptura de estoque no pequeno varejo)  
2. Mostrar a release `v1.0.0` no GitHub  
3. Subir o ambiente (`docker compose up --build -d` ou fluxo local)  
4. Demonstrar fluxo: cadastrar produto → entrada → saída → alerta LOW/CRITICAL → dashboard  
5. Executar os testes ao vivo (`npm test` ou profile `test`)  
6. Encerrar com lições aprendidas em 30–40s  

---

## 5. Resumo Executivo de Encerramento

O Stockly foi concluído como solução fullstack de controle de estoque com ponto de reposição, composta por API REST (Node.js/Express/Prisma), frontend React e PostgreSQL conteinerizado. A versão final entrega CRUD de produtos, movimentações atômicas, alertas `NORMAL`/`LOW`/`CRITICAL`, histórico, dashboard e harness de testes com 100% de aprovação (13/13).

A especificação técnica definitiva está em `docs/sdd-as-built.md`, refletindo a arquitetura, APIs e desvios reais da implementação. O ambiente pode ser reproduzido via Docker Compose (`postgres` + `api` + `web`) e o harness via perfil `test`.

---

## 6. Retrospectiva e Lições Aprendidas

### 6.1 Eficácia dos Agentes de IA no fluxo SDD

`[PREENCHER — 1 parágrafo]`  
*Sugestão:* IA acelerou boilerplate, testes e documentação; a especificação e o code review humano evitaram regressões (ex.: saldo negativo, SKU duplicado).

### 6.2 Ganho de produtividade

`[PREENCHER — bullets]`  
*Sugestão:* redução de tempo em scaffold da API, geração do harness e atualização do README/ADRs.

### 6.3 Principais dificuldades superadas

`[PREENCHER]`  
*Já documentadas na Entrega 2 e reaproveitáveis:* conflito de porta Postgres (`5433`), Prisma RC instável, validação de estoque negativo, unicidade de SKU, `node_modules` indevidamente versionado.

### 6.4 Lições de governança em equipe

`[PREENCHER]`  
*Sugestão:* feature branches + PRs obrigatórios na `main`, critérios de aceite com testes verdes, revisão em pares e higiene de secrets (`.env` fora do Git).

---

## 7. Checklist final da equipe

- [ ] `node_modules` removido do Git e push feito  
- [ ] Testes 13/13 passando + coverage gerado  
- [ ] PR `entrega-final` → `main` aprovado e mergeado  
- [ ] Tag e Release `v1.0.0` publicadas no GitHub  
- [ ] SDD As-Built revisado pela equipe  
- [ ] Vídeo publicado e link colado neste documento  
- [ ] Retrospectiva preenchida  
- [ ] PDF exportado e enviado na Sala Online  

---

*Base gerada para a Entrega Final do Bootcamp III — Stockly.*
