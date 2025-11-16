# FormAI 🤖

[![NPM Version](https://img.shields.io/npm/v/@ejunior95/formai-core)](https://www.npmjs.com/package/@ejunior95/formai-core)
[![NPM Version](https://img.shields.io/npm/v/@ejunior95/formai-react)](https://www.npmjs.com/package/@ejunior95/formai-react)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Gere campos de formulário com validações e máscaras complexas (React, Vue, Angular) apenas descrevendo o que precisa em linguagem natural.**

Cansado de procurar por regex de email? Cansado de configurar máscaras de telefone? O **formAI** faz todo o trabalho chato pra você.

---

## 🚀 Vantagens de usar o FormAI

Construir formulários pode ser bem repetitivo e cansativo. Vamos usar IA para automatizar a pior parte: a configuração e validação de cada campo.

### ⛔️ Pare de fazer isso:

```jsx
// Procurar regex, lembrar da máscara, gerir o estado...
const [valor, setValor] = useState("");
const [erro, setErro] = useState(null);

// De onde veio este regex? Google? StackOverflow?
const REGEX_TELEFONE = /^\(\d{2}\)\s\d{5}-\d{4}$/;
// A minha lib de máscara usa '0' ou '9'...?
const MASCARA = "(00) 00000-0000"; 

const validar = () => {
  if (!valor) {
    setErro("Campo obrigatório.");
  } else if (!REGEX_TELEFONE.test(valor)) {
    setErro("Formato inválido.");
  }
};

return (
  <IMaskInput
    mask={MASCARA}
    value={valor}
    onChange={(e) => setValor(e.target.value)}
    onBlur={validar}
  />
)
```

### ✨ E agora faça isso:

```jsx
import { useAIForm } from '@ejunior95/formai-react';
import { IMaskInput } from 'react-imask'; // Traga os seus próprios componentes!

function MeuCampoDeTelefone() {
  const {
    value,      // O estado do campo
    setValue,   // O setter do estado
    error,      // O estado do erro
    validate,   // A função de validação
    loading,    // O estado de loading da IA
    config      // O objeto de configuração da IA
  } = useAIForm("Um campo obrigatório de celular no padrão do Brasil", {
    maskPatterns: { digit: '0' } // '0' é o que o 'react-imask' usa
  });

  if (loading) return <p>🤖 Gerando campo...</p>;

  return (
    <div>
      <label>Telefone</label>
      <IMaskInput
        mask={config.mask} // A IA fornece a máscara!
        placeholder={config.placeholder} // E o placeholder!
        value={value}
        onAccept={(val) => setValue(val)}
        onBlur={validate} // A IA fornece a lógica de validação!
      />
      {error && <p>{error}</p>}
    </div>
  );
}
```

## 📦 Instalação (para React)

O **formAI** é dividido em dois pacotes: o **motor (core)** e o **adaptador (react).** Você precisará de **AMBOS**.

```bash
npm install @ejunior95/formai-core @ejunior95/formai-react
```

### 📖 Como Usar? (React)

O `useAIForm` é um hook "headless" (sem UI). Ele não renderiza nada; apenas entrega o estado e a lógica para que você possa usar os seus próprios componentes (ShadCN, MUI, Ant Design, ou um `<input>` simples).

##### Assinatura do Hook

```jsx
useAIForm(
  prompt: string,
  options?: FormAIOptions
): UseAIFormReturn
```

* **prompt:** `A descrição em linguagem natural (ex: "Quero um campo de email", "Quero um campo de CEP de 8 dígitos obrigatório").`
* **options:** `Objeto opcional`


- **maskPatterns:** `Um objeto que diz à IA quais caracteres a sua biblioteca de máscara usa.`

    * **digit:** `O caractere para dígitos (ex: '0').`
    * **letter:** `O caractere para letras (ex: 'a').`

##### Valor de Retorno

O `hook` devolve um objeto com tudo o que precisa:

* **value:** O estado atual do valor do campo.

* **setValue:** A função setter para atualizar o valor.

* **error:** null se for válido, ou uma string com a mensagem de erro.

* **validate:** Uma função para disparar a validação (ideal para o onBlur).

* **loading:** Um boolean que fica true enquanto a IA está a gerar a configuração.

* **config:** O objeto JSON puro vindo da IA (contém mask, placeholder, regex, required, etc.).

## 🏛️ Como Funciona?

O `formAI` usa uma arquitetura de proxy simples para integrar com o agente de IA e garantir a flexibilidade.

1. O hook `useAIForm` (no seu frontend) recebe o seu prompt.

2. Ele envia o prompt para um proxy seguro na Vercel (`formai-proxy`).

3. O proxy consulta uma IA (GPT) de forma segura, instruindo-a a devolver um JSON estruturado.

4. O hook recebe esse JSON (`config`) e gere o estado (`value`, `error`) e a lógica de validação (`validate`) para si.

## 🗺️ Próximas Features

* ⚛️ **React:** ✅ Disponível! (`@ejunior95/formai-react`)
* 🅰️ **Angular:** ⏳ Em breve...
* 💚 **Vue:** ⏳ Em breve...

## ⚖️ Licença

Este projeto é open-source e está licenciado sob a [Licença MIT](LICENSE).
