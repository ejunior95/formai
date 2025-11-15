import { useAIForm } from '@formai/react';
import './App.css';

const PROXY_URL = "https://formai-iota.vercel.app/api/generate";

/**
 * Componente de teste para o hook useAIForm
 */
function FieldTester() {
  // 1. Pedimos um campo de email à IA!
  const {
    value,
    setValue,
    error,
    validate,
    loading,
    config
  } = useAIForm("um campo de email obrigatório");
  // Nota: A função getFieldConfig no @formai/core
  // deve ser atualizada para usar o PROXY_URL.
  // Vamos verificar isso a seguir.

  // 2. Mostra um loading enquanto a IA pensa
  if (loading) {
    return <h2>🤖 A gerar campo de IA...</h2>;
  }

  // 3. Mostra um erro se a API falhar
  if (!config) {
    return <h2>Erro: {error || "Não foi possível carregar a configuração."}</h2>;
  }

  // 4. Renderiza o input!
  return (
    <div className="field-container">
      <label htmlFor="email">Email (gerado por IA)</label>
      <input
        id="email"
        type="text"
        placeholder={config.placeholder || ''}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={validate} // Valida quando o utilizador sai do campo
        className={error ? 'input-error' : ''}
      />
      {error && <p className="error-message">{error}</p>}

      <pre>
        <strong>Configuração recebida da IA:</strong>
        {JSON.stringify(config, null, 2)}
      </pre>
    </div>
  );
}

// Componente App principal
function App() {
  return (
    <div className="App">
      <h1>Teste do 🤖 formAI</h1>
      <FieldTester />
    </div>
  );
}

export default App;