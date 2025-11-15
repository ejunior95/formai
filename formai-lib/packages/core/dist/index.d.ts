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
    };
}
/**
 * Busca a configuração do campo a partir do prompt do usuário.
 * @param userPrompt O prompt do usuário descrevendo o campo
 * @param proxyUrl A URL do proxy da API (padrão: API_URL)
 * @returns A configuração do campo como um objeto FormAIConfig
 */
export declare function getFieldConfig(userPrompt: string, options?: FormAIOptions, proxyUrl?: string): Promise<FormAIConfig>;
/**
 * Valida um valor com base na configuração do FormAI.
 * @param value O valor a validar
 * @param config A configuração do campo
 * @returns Uma string de erro ou null se for válido
 */
export declare function validateValue(value: string | undefined | null, config: FormAIConfig): string | null;
