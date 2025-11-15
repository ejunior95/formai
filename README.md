# formAI 🤖

**Gere campos de formulário e validações complexas (React, Vue, Angular) apenas descrevendo o que precisas em linguagem natural.**

Cansado de procurar por regex de email ou de NIF? Cansado de configurar máscaras e validações manualmente? O **formAI** é um experimento (Prova de Conceito) para resolver isso.

---

## ⚠️ Status do Projeto: Prova de Conceito (MVP)

Este projeto está em desenvolvimento inicial. O objetivo atual é validar a arquitetura, especificamente a capacidade do "Agente de IA" (`formai-proxy`) de gerar JSON de validação de forma fiável a partir de linguagem natural.

---

## 🏛️ Como Funciona (Arquitetura)

O **formAI** é dividido em duas partes principais que trabalham em conjunto:

### 1. O Agente de IA (`formai-proxy`)

Como não podemos expor chaves de API da OpenAI no *frontend*, criámos um *proxy* simples.

* **O que é?** É uma API serverless (feita para Vercel) que atua como um intermediário seguro.
* **O que faz?**
    1.  Recebe um *prompt* de texto simples (ex: "um campo de telemóvel de Portugal obrigatório").
    2.  Chama a API da OpenAI (GPT) de forma segura, usando uma chave de API guardada no servidor.
    3.  Instrui a IA a devolver um objeto JSON estruturado com regras de validação, máscaras e *placeholders*.

### 2. A Biblioteca (`formai-lib`)

Esta será a biblioteca "framework-agnostic" que os programadores irão instalar via NPM.

* **O que é?** Um conjunto de pacotes NPM (ex: `@formAI/core`, `@formAI/react`).
* **O que faz?**
    1.  O utilizador (programador) usa um *Hook* (React) ou *Composable* (Vue).
    2.  A biblioteca chama o nosso Agente de IA (`formai-proxy`).
    3.  Recebe o JSON de configuração.
    4.  Aplica automaticamente as validações, máscaras e *props* ao campo de formulário nativo.

### Fluxo de Dados

`Frontend (React/Vue/Angular)` ➔ `formAI-Lib (npm)` ➔ `formAI-Proxy (Vercel)` ➔ `API da OpenAI`

---

## 📁 Estrutura do Repositório

Este é um monorepo simples (por agora, sem ferramentas complexas como Turborepo ou Lerna).

* **`/formai-proxy`**
    Contém o código da função serverless Vercel. Este é o "cérebro" de IA do projeto.

* **`/formai-lib`**
    Espaço reservado para os futuros pacotes NPM (`@formAI/core`, `@formAI/react`, etc.).

---

## 🗺️ Roadmap (Próximos Passos)

1.  [✅] **Configurar o `formai-proxy`**: Escrever o código da função serverless.
2.  [ ] **Deploy do Proxy**: Fazer o deploy do `formai-proxy` na Vercel e testar o *endpoint*.
3.  [ ] **Iniciar o `@formAI/core`**: Criar o pacote NPM principal que sabe como chamar o *proxy*.
4.  [ ] **Criar o `@formAI/react`**: Construir o primeiro *Hook* de React (`useAIForm`) que consome o `@formAI/core`.
5.  [ ] Prova de Conceito para Vue e Angular.

---

## ⚖️ Licença

Este projeto é open-source e está licenciado sob a [Licença MIT](LICENSE).
