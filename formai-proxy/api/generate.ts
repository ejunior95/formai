import type { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';

const FIELD_CONFIG_SCHEMA = `
{
  "type": "'text' | 'select' | 'mask-text' | 'radio' | 'checkbox'",
  "placeholder": "string (sugestão de placeholder, se aplicável)",
  "mask": "string | null (Formato da máscara. Ex: '(99) 99999-9999'. Preencher APENAS se type='mask-text', caso contrário null)",
  "validation": {
    "required": "boolean (true se a descrição implicar obrigatoriedade)",
    "regex": "string | null (Formato de regex JavaScript, ex: '^[\\\\w-\\\\.]+@...')",
    "minLength": "number | null (inferido da descrição)",
    "maxLength": "number | null (inferido da descrição)"
  }
}
`;

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
    return response.status(200).send(jsonResponse);

  } catch (error: any) {
    console.error(error);
    return response.status(500).json({ error: 'Falha ao processar o pedido da IA' });
  }
}