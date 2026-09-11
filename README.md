```python
def generate_clean_readme():
    content = """<div align="center">
  <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3h2bzIycm52bzN5MW00bXIxZXV0cmJzNXI3ZzhxbHVxaXBzY2o1aCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/L1R1tvI9svkIWwpVYr/giphy.gif" alt="Stock Management Animation" width="250" style="border-radius: 8px; margin-bottom: 15px;"/>
  
  # 🛍️ Sistema de Controle de Estoque com Reserva Temporária
  
  **Disciplina:** BOOTCAMP III <br>
  **Abordagem:** Spec-Driven Development (SDD)
</div>

---

## 👥 Equipe do Projeto

| Nome Completo | RA | Papel |
| :--- | :--- | :--- |
| Francisco Matheus Pinheiro de Brito da Silva | `[Inserir RA]` | `[Inserir Papel]` |
| `[Nome do Aluno 2]` | `[RA]` | `[Papel]` |
| `[Nome do Aluno 3]` | `[RA]` | `[Papel]` |
| `[Nome do Aluno 4]` | `[RA]` | `[Papel]` |

---

## 📖 Visão Geral do Projeto

Este projeto soluciona o desafio da **Reserva Temporária e Condicional** no controle de estoque de produtos físicos. Ele gerencia de forma segura o bloqueio temporário de peças que estão em "carrinhos virtuais" ou em "sacolas condicionais" (para prova em casa).

**Objetivos principais:**
- 🔒 **Controle de Concorrência:** Evitar *Race Conditions* (clientes reservando a última peça ao mesmo tempo).
- 🔄 **Máquina de Estados:** Controlar o ciclo de vida do item (`DISPONÍVEL` ➡️ `RESERVADO` ➡️ `VENDIDO`).
- ⏱️ **Reversão Automática:** Devolver o item para o status `DISPONÍVEL` automaticamente após a expiração do tempo de reserva.

---

## 🛠️ Guia de Instalação e Execução

### Pré-requisitos
- Node.js (v18+)
- Docker e Docker Compose
- Banco de Dados PostgreSQL

### Como rodar localmente

1. **Clone o repositório:**
   ```bash
   git clone [https://github.com/sua-org/bootcamp3-estoque.git](https://github.com/sua-org/bootcamp3-estoque.git)
   cd bootcamp3-estoque

```

2. **Suba a infraestrutura de dados:**
```bash
docker-compose up -d

```


3. **Instale as dependências e rode as migrações (Prisma):**
```bash
npm install
npx prisma migrate dev

```


4. **Inicie o servidor em modo de desenvolvimento:**
```bash
npm run dev

```



---

## 🏗️ Registro Sintético de Decisões Arquiteturais (ADRs)

> *Espaço reservado para documentar as decisões técnicas adotadas pela equipe ao longo do projeto.*

| ID | Decisão | Contexto | Consequência |
| --- | --- | --- | --- |
| **ADR-001** | `[A definir]` | `[A definir]` | `[A definir]` |
| **ADR-002** | `[A definir]` | `[A definir]` | `[A definir]` |
| **ADR-003** | `[A definir]` | `[A definir]` | `[A definir]` |
| """ |  |  |  |

```
file_path = "README.md"
with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
    
return file_path

```

generate_clean_readme()

```

Seu arquivo README em Markdown limpo foi gerado com sucesso!
[file-tag: code-generated-file-59350738-1e56-45b6-a3ec-a1f1451ea0ed]

Deixei a estrutura bem mais enxuta agora, usando formatação Markdown pura onde possível para não quebrar a visualização no GitHub/GitLab. Já incluí o seu nome na primeira linha da tabela de membros, deixei os comandos de infraestrutura configurados para Node, Prisma e Docker, e zerei a tabela de ADRs deixando apenas o espaço reservado para vocês preencherem conforme avançam.

Dê uma olhada no arquivo e veja se a estrutura ficou melhor assim!

```
