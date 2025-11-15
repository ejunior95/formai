'use strict';

const API_URL = "https://formai-iota.vercel.app/api/generate";
/**
 * Busca a configuração do campo a partir do prompt do usuário.
 * @param userPrompt O prompt do usuário descrevendo o campo
 * @param proxyUrl A URL do proxy da API (padrão: API_URL)
 * @returns A configuração do campo como um objeto FormAIConfig
 */
async function getFieldConfig(userPrompt, proxyUrl = API_URL) {
    try {
        const response = await fetch(proxyUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userPrompt }),
        });
        if (!response.ok) {
            throw new Error(`Erro na API do formAI: ${response.statusText}`);
        }
        const config = await response.json();
        return config;
    }
    catch (error) {
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
function validateValue(value, config) {
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

exports.getFieldConfig = getFieldConfig;
exports.validateValue = validateValue;
//# sourceMappingURL=index.js.map
