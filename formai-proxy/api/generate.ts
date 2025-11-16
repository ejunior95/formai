import type { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';

const FIELD_CONFIG_SCHEMA = `
{
  "type": "'text' | 'select' | 'mask-text' | 'radio' | 'checkbox'",
  "placeholder": "string (sugestão de placeholder, se aplicável)",
  "mask": "string | null (Formato da máscara. Ex: '(00) 00000-0000'. Preencher APENAS se type='mask-text', caso contrário null)",
  "validation": {
    "required": "boolean (Padrão: false. SÓ 'true' se o prompt pedir explicitamente 'obrigatório' ou sinonimos)",
    "regex": "string | null (Formato de regex JavaScript, ex: '^[\\\\w-\\\\.]+@...')",
    "minLength": "number | null (Padrão: null. SÓ preencha se o prompt definir um tamanho específico)",
    "maxLength": "number | null (Padrão: null. SÓ preencha se o prompt definir um tamanho específico)"
  }
}
`;

const DEFAULT_FALLBACK_CONFIG = {
  type: "text",
  placeholder: "Input",
  mask: null,
  validation: {
    required: false,
    regex: null,
    minLength: null,
    maxLength: null
  }
};

const cache = new Map<string, string>();

/**
 * Handler principal da nossa função
 */
export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {

  // Configuração CORS básica
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') {
    response.status(200).end();
    return;
  }

  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Método não permitido' });
  }

  const { userPrompt, maskPatterns } = request.body;
  const digitPlaceholder = maskPatterns?.digit || '0'; 
  const letterPlaceholder = maskPatterns?.letter || 'a';

  if (!userPrompt) {
    return response.status(400).json({ error: 'O "userPrompt" é obrigatório no body' });
  }

  const cacheKey = JSON.stringify(request.body);

  if (cache.has(cacheKey)) {
    console.log("CACHE HIT", cacheKey);
    return response.status(200).send(cache.get(cacheKey));
  }
  
  console.log("CACHE MISS", cacheKey);

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return response.status(500).json({ error: 'Chave OPENAI_API_KEY não configurada no servidor' });
    }

    const openai = new OpenAI({ apiKey });

    const systemPrompt = `
      Você é um assistente de programação focado em formulários.
      Sua tarefa é analisar uma descrição de um campo e devolver 
      APENAS um objeto JSON válido que defina esse campo.
      
      A estrutura do JSON deve ser essa:
      ${FIELD_CONFIG_SCHEMA}
    
      Regras importantes:
      - Responda APENAS com o JSON.
      - Não inclua markdown (como \`\`\`json).
      - Para regex, usa barras invertidas duplas (ex: '\\\\d{9}').

      REGRA DE FALLBACK (A MAIS IMPORTANTE):
      - Se o prompt do utilizador não for um pedido sobre um campo de formulário (ex: "escreva um poema", "qual a capital de França?", "me ajude com CSS"), 
        você deve IGNORAR todas as outras regras e devolver EXATAMENTE este objeto JSON:
      ${JSON.stringify(DEFAULT_FALLBACK_CONFIG)}

      ---
      Regras de Validação (Obrigatório):

      1. REGRA DE OURO: Na dúvida, prefira \`false\` e \`null\`. Não adivinhe regras que o utilizador não pediu.

      2. \`required\`:
         - O valor padrão é \`false\`.
         - SÓ mude para \`true\` se o prompt usar palavras explícitas como 'obrigatório', 'mandatório', 'necessário', 'não pode ser nulo'.
         - Se o prompt for simples (ex: "campo de email"), \`required\` deve ser \`false\`.

      3. \`minLength\` / \`maxLength\`:
         - O valor padrão é \`null\`.
         - SÓ preencha se o prompt definir um tamanho (ex: "CPF de 11 dígitos", "nome com no máximo 50 caracteres").
         - Para máscaras (como CPF, CEP), é correto inferir o \`minLength\` e \`maxLength\` da própria máscara.
      ---

      Regras de Máscara:
      - IMPORTANTE: O caractere para CADA dígito numérico (0-9) é: '${digitPlaceholder}'.
      - IMPORTANTE: O caractere para CADA letra (a-z, A-Z) é: '${letterPlaceholder}'.
      
      - Exemplo 1 (Numérico): Se o pedido for "CEP" e o placeholder de dígito for '0', a máscara deve ser '${digitPlaceholder}${digitPlaceholder}${digitPlaceholder}${digitPlaceholder}${digitPlaceholder}-${digitPlaceholder}${digitPlaceholder}${digitPlaceholder}'.
      - Exemplo 2 (Alfanumérico): Se o pedido for "Placa de carro" e os placeholders forem 'a' (letra) e '0' (dígito), a máscara deve ser '${letterPlaceholder}${letterPlaceholder}${letterPlaceholder}-${digitPlaceholder}${digitPlaceholder}${digitPlaceholder}${digitPlaceholder}'.
      
      - Para campos como 'email' ou 'nome', o \`type\` deve ser \`"text"\` e o \`mask\` deve ser \`null\`.
    `;

    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.1,
    });

    const jsonResponse = chatCompletion.choices[0].message.content;

    if (jsonResponse) {
      cache.set(cacheKey, jsonResponse);
    }

    return response.status(200).send(jsonResponse);

  } catch (error: any) {
    console.error(error);
    return response.status(500).json({ error: 'Falha ao processar o pedido da IA' });
  }
}