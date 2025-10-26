import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

const bedrockClient = new BedrockRuntimeClient({ region: process.env.AWS_REGION || 'us-east-1' });

const MODEL_ID = process.env.BEDROCK_MODEL_ID || 'us.anthropic.claude-3-7-sonnet-20250219-v1:0';

/**
 * Invoke Claude 3.7 Sonnet via AWS Bedrock
 * @param {string} prompt - The prompt to send to Claude
 * @param {number} maxTokens - Maximum tokens in response
 * @returns {Promise<string>} - Claude's response
 */
export async function invokeClaude(prompt, maxTokens = 4000) {
  const payload = {
    anthropic_version: 'bedrock-2023-05-31',
    max_tokens: maxTokens,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  };

  const command = new InvokeModelCommand({
    modelId: MODEL_ID,
    contentType: 'application/json',
    accept: 'application/json',
    body: JSON.stringify(payload),
  });

  try {
    const response = await bedrockClient.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    return responseBody.content[0].text;
  } catch (error) {
    console.error('Bedrock invocation error:', error);
    throw new Error('Failed to invoke Claude model');
  }
}

/**
 * Translate a word with definitions and examples
 * @param {string} word - The word to translate
 * @param {string} targetLanguage - Target language (e.g., 'Spanish', 'French')
 * @returns {Promise<Object>} - Translation result with definitions
 */
export async function translateWord(word, targetLanguage) {
  const prompt = `You are a professional translator and language teacher. Translate the English word "${word}" to ${targetLanguage}.

Provide the response in the following JSON format:
{
  "translation": "the translated word",
  "definitions": [
    {
      "id": "1",
      "meaning": "definition of the word in English",
      "example": "a natural example sentence using the word"
    },
    {
      "id": "2",
      "meaning": "another definition if applicable",
      "example": "another example sentence"
    }
  ]
}

Provide 2-3 definitions if the word has multiple meanings. Make examples natural and practical for language learners.

IMPORTANT: Return ONLY the JSON object, no additional text or explanation.`;

  const response = await invokeClaude(prompt, 2000);

  try {
    // Extract JSON from response (in case Claude adds extra text)
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(response);
  } catch (error) {
    console.error('Failed to parse Claude response:', error);
    throw new Error('Invalid response format from translation service');
  }
}

/**
 * Translate a phrase
 * @param {string} phrase - The phrase to translate
 * @param {string} targetLanguage - Target language
 * @returns {Promise<Object>} - Translation result
 */
export async function translatePhrase(phrase, targetLanguage) {
  const prompt = `You are a professional translator. Translate the following English phrase to ${targetLanguage}:

"${phrase}"

Provide the response in the following JSON format:
{
  "translation": "the translated phrase",
  "context": "brief note about when/how to use this phrase (optional)"
}

IMPORTANT: Return ONLY the JSON object, no additional text.`;

  const response = await invokeClaude(prompt, 1000);

  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(response);
  } catch (error) {
    console.error('Failed to parse Claude response:', error);
    throw new Error('Invalid response format from translation service');
  }
}
