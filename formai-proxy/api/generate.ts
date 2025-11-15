import type { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';

const FIELD_CONFIG_SCHEMA = `
{
  "type": "'text' | 'select' | 'mask-text' | 'radio' | 'checkbox'",
  "placeholder": "string (sugestão de placeholder, se aplicável)",
  "mask": "string (apenas se type='mask-text', formato da máscara, ex: '99/99/9999')",
  "validation": {
    "required": "boolean (true se a descrição implicar obrigatoriedade)",
    "regex": "string (formato de regex JavaScript, ex: '^[\\\\w-\\\\.]+@...')",
    "minLength": "number (inferido da descrição)",
    "maxLength": "number (inferido da descrição)"
  }
}
`;

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
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
      - Se a descrição pedir um formato (ex: NIF, email, telemóvel), 
        gere o 'regex' de validação apropriado.
      - Para regex, usa barras invertidas duplas (ex: '\\\\d{9}').
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