# Evidências de testes e cobertura

Evidências geradas em **2026-10-30** na branch `entrega-final`, com PostgreSQL Docker saudável.

## Arquivos versionados

| Arquivo | Conteúdo |
|---|---|
| [`testes-aprovados.log`](./testes-aprovados.log) | Log limpo: **13/13 passed (100%)** |
| [`coverage-report.log`](./coverage-report.log) | Tabela de coverage por arquivo + summary |
| [`relatorio-execucao-testes.md`](./relatorio-execucao-testes.md) | Relatório formal para o PDF de encerramento |

## Resultado consolidado

- **Testes:** 13 passed / 13 total (100% aprovação)
- **Coverage:** Statements 72.85% · Branches 39.58% · Functions 62.16% · Lines 72.54%
- **HTML local (não versionado):** `backend/coverage/index.html`

## Como regenerar

```bash
docker compose up -d postgres
cd backend
npm test
npm run test:coverage
```

Para o PDF da Sala Online, anexe prints destes logs ou exporte o `relatorio-execucao-testes.md`.
