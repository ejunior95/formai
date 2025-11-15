import { useAIForm } from '@formai/react';
import { IMaskInput } from 'react-imask';
import './App.css';

const PROXY_URL = "https://formai-iota.vercel.app/api/generate";

/**
 * Componente de teste para o hook useAIForm
 * Agora ele recebe o "prompt" como uma propriedade
 */
function FieldTester({ prompt }: { prompt: string }) {
  const {
    value,
    setValue,
    error,
    validate,
    loading,
    config
  } = useAIForm(prompt); // Usamos o prompt passado por props

  // Mostra loading
  if (loading) {
    return <h2>🤖 A gerar campo "{prompt}"...</h2>;
  }

  // Mostra erro
  if (!config) {
    return <h2>Erro: {error || "Não foi possível carregar a configuração."}</h2>;
  }

  // 2. Renderização Condicional
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

// Componente App principal
function App() {
  return (
    <div className="App">
      <div>
        <h1>Teste do 🤖 formAI</h1>
        {/* Vamos testar os dois casos! */}
        <FieldTester prompt="Um campo obrigatório de celular no padrão Brasileiro" />
      </div>
    </div>
  );
}

export default App;