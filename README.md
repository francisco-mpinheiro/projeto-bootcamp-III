def generate_readme():
    content = """<div align="center">
  <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3h2bzIycm52bzN5MW00bXIxZXV0cmJzNXI3ZzhxbHVxaXBzY2o1aCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/L1R1tvI9svkIWwpVYr/giphy.gif" alt="Stock Management Animation" width="300" style="border-radius: 10px; margin-bottom: 20px;"/>
  
  # 🛍️ Sistema de Controle de Estoque com Reserva Temporária
  **Disciplina:** BOOTCAMP III  
  **Abordagem:** Spec-Driven Development (SDD) com Agentes de IA
</div>

---

## 👥 Equipe do Projeto (Membros)

| Nome Completo | RA (Registro Acadêmico) | Papel / Responsabilidade |
| :--- | :--- | :--- |
| `[Inserir Nome do Aluno 1]` | `[Inserir RA 1]` | Arquitetura e Engenharia de Software |
| `[Inserir Nome do Aluno 2]` | `[Inserir RA 2]` | Configuração SDD e Prompts de IA |
| `[Inserir Nome do Aluno 3]` | `[Inserir RA 3]` | QA e Harness de Testes (TDD/BDD) |
| `[Inserir Nome do Aluno 4]` | `[Inserir RA 4]` | DevOps, Infraestrutura e DB |

---

## 📖 Visão Geral do Projeto

Este projeto resolve um problema crítico de logística reversa e retenção de vendas no varejo de moda: o gerenciamento da **Reserva Temporária e Condicional**. 

Através desta API, desenvolvida com o apoio de agentes de geração de código, peças colocadas no "carrinho virtual" ou separadas fisicamente como "condicional" para o cliente provar em casa, são bloqueadas no estoque por um tempo determinado. Caso a compra não seja efetivada ou o tempo limite expire, o sistema reverte automaticamente a reserva, devolvendo o item à vitrine disponível.

**🚀 Principais Desafios Resolvidos:**
- 🔒 **Controle de Concorrência:** Impede que dois clientes tentem reservar a mesma última peça simultaneamente (*Race Condition*).
- ⏱️ **Máquina de Estados de Estoque:** Transição automática e auditável de `DISPONIVEL` ➡️ `RESERVADO` ➡️ `VENDIDO` ou `DISPONIVEL` (por expiração).
- 🤖 **Geração Via SDD:** O motor principal de cálculo e reversão foi especificado pela equipe e gerado por agentes de Inteligência Artificial.

---

## 🛠️ Guia de Instalação e Execução

### 📋 Pré-requisitos
- [Node.js](https://nodejs.org/) (v18+) ou [Python/Java - *ajustar conforme a stack*]
- [Docker](https://www.docker.com/) e Docker Compose (para isolamento do Banco de Dados)
- [Git](https://git-scm.com/)

### 💻 Passos para Rodar Localmente

1. **Clone o repositório:**
   ```bash
   git clone [https://github.com/sua-org/bootcamp3-estoque.git](https://github.com/sua-org/bootcamp3-estoque.git)
   cd bootcamp3-estoque
