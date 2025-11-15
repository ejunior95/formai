const API_URL = "https://formai-iota.vercel.app/api/generate";

/**
 * FormAIConfig: Define a "forma" (Interface) da resposta da API.
 */
export interface FormAIConfig {
  type: 'text' | 'select' | 'mask-text' | 'radio' | 'checkbox';
  placeholder: string | null;
  mask: string | null;
  validation: {
    required: boolean | null;
    regex: string | null;
    minLength: number | null;
    maxLength: number | null;
  };
}

export interface FormAIOptions {
  maskPatterns?: {
    digit?: string;
    letter?: string;
  }
}

/**
 * Busca a configuração do campo a partir do prompt do usuário.
 * @param userPrompt O prompt do usuário descrevendo o campo
 * @param proxyUrl A URL do proxy da API (padrão: API_URL)
 * @returns A configuração do campo como um objeto FormAIConfig
 */
export async function getFieldConfig(
  userPrompt: string,
  options?: FormAIOptions,
  proxyUrl: string = API_URL
): Promise<FormAIConfig> {
  try {
    const body = {
      userPrompt,
      maskPatterns: options?.maskPatterns
    };

    const response = await fetch(proxyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Erro na API do formAI: ${response.statusText}`);
    }

    const config: FormAIConfig = await response.json();
    return config;

  } catch (error: any) {
    console.error("Erro ao buscar configuração do formAI:", error);
    throw new Error(`Falha ao contactar o proxy do formAI: ${error.message}`);
  }
}
/**
 * Valida um valor com base na configuração do FormAI.
 * @param value O valor a validar
 * @param config A configuração do campo
 * @returns Uma string de erro ou null se for válido
 */
export function validateValue(value: string | undefined | null, config: FormAIConfig): string | null {
  const { validation } = config;
  const v = value || ""; // Trata null/undefined como string vazia

  if (validation.required && v.trim() === "") {
    return "Este campo é obrigatório.";
  }

  if (validation.minLength && v.length < validation.minLength) {
    return `Deve ter no mínimo ${validation.minLength} caracteres.`;
  }

  if (validation.maxLength && v.length > validation.maxLength) {
    return `Deve ter no máximo ${validation.maxLength} caracteres.`;
  }

  if (validation.regex && v.length > 0) {
    const re = new RegExp(validation.regex);
    if (!re.test(v)) {
      return "Formato inválido.";
    }
  }

  return null;
}