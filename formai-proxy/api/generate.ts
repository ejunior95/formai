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

  const { userPrompt } = request.body;
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

      Regras de Máscara vs Regex:
      - Se a descrição pedir um formato que guia a digitação (ex: 'telefone', 'telemóvel', 'CEP', 'data', 'CPF', 'CNPJ'), você deve:
        1. Definir o \`type\` como \`"mask-text"\`.
        2. Preencha o campo \`mask\` com o formato de máscara (ex: \`'(99) 99999-9999'\`).
      
      - O campo \`mask\` é para a formatação do INPUT. O campo \`regex\` é para a VALIDAÇÃO final. Um campo pode ter os dois.
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