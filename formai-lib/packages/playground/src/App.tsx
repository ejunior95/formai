import { useAIForm } from '@formai/react';
import type { FormAIOptions } from '@formai/core';
import { IMaskInput } from 'react-imask';
import './App.css';

const PROXY_URL = "https://formai-iota.vercel.app/api/generate";

type MaskPatterns = FormAIOptions['maskPatterns'];

/**
 * Componente de teste para o hook useAIForm
 * Agora ele recebe o "prompt" como uma propriedade
 */
function FieldTester({ 
  prompt, 
  patterns
}: { 
  prompt: string, 
  patterns?: MaskPatterns
}) {
  const {
    value,
    setValue,
    error,
    validate,
    loading,
    config
  } = useAIForm(prompt, { 
    maskPatterns: patterns
  });

  if (loading) {
    return <h2>🤖 A gerar campo "{prompt}"...</h2>;
  }

  if (!config) {
    return <h2>Erro: {error || "Não foi possível carregar a configuração."}</h2>;
  }

  return (
    <div className="field-container">
      <label htmlFor={prompt}>{prompt}</label>

      {/* SE A IA PEDIR MÁSCARA, USA O COMPONENTE DE MÁSCARA */}
      {config.type === 'mask-text' && config.mask ? (
        <IMaskInput
          id={prompt}
          mask={config.mask}
          placeholder={config.placeholder || ''}
          value={value}
          // O 'onAccept' é o 'onChange' do IMaskInput
          onAccept={(val: string) => setValue(val)}
          onBlur={validate}
          className={error ? 'input-error' : ''}
        />
      ) : (
        /* CASO CONTRÁRIO, USA UM INPUT NORMAL */
        <input
          id={prompt}
          type="text"
          placeholder={config.placeholder || ''}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={validate}
          className={error ? 'input-error' : ''}
        />
      )}

      {error && <p className="error-message">{error}</p>}
      <pre>
        <strong>Configuração da IA:</strong>
        {JSON.stringify(config, null, 2)}
      </pre>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <div>
        <h1>Teste do 🤖 formAI</h1>
        <FieldTester 
          prompt="Um campo para CEP brasileiro" 
          patterns={{ digit: '0', letter: 'a' }}
        />
      </div>
    </div>
  );
}

export default App;