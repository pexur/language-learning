import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Google Gemini client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

const MODEL = 'gemini-2.5-flash-lite'; // Cheapest Gemini 2.5 model, perfect for translations

/**
 * Invoke Gemini via Google AI API
 * @param {string} prompt - The prompt to send to Gemini
 * @param {number} maxTokens - Maximum tokens in response
 * @returns {Promise<string>} - Gemini's response
 */
export async function invokeGemini(prompt, maxTokens = 4000) {
  try {
    const model = genAI.getGenerativeModel({
      model: MODEL,
      generationConfig: {
        maxOutputTokens: maxTokens,
        temperature: 0.7,
      },
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('Failed to invoke Gemini model');
  }
}

/**
 * Translate a word with definitions and examples
 * @param {string} word - The word to translate
 * @param {string} targetLanguage - Target language (e.g., 'Spanish', 'French')
 * @returns {Promise<Object>} - Translation result with definitions
 */
export async function translateWord(word, targetLanguage) {
  const prompt = `You are a professional translator and language teacher. Translate the word "${word}" to ${targetLanguage}.

First, detect what language "${word}" is in. Then translate it to ${targetLanguage}.

Provide the response in the following JSON format:
{
  "translation": "the translated word in ${targetLanguage}",
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

  const response = await invokeGemini(prompt, 2000);

  try {
    // Extract JSON from response (in case Gemini adds extra text)
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(response);
  } catch (error) {
    console.error('Failed to parse Gemini response:', error);
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
  const prompt = `You are a professional translator.

First, detect what language the phrase "${phrase}" is in. Then translate it to ${targetLanguage}.

Provide the response in the following JSON format:
{
  "translation": "the translated phrase in ${targetLanguage}",
  "context": "brief note about when/how to use this phrase (optional)"
}

IMPORTANT: If the phrase is already in ${targetLanguage}, still provide a translation (it can be the same). Return ONLY the JSON object, no additional text.`;

  const response = await invokeGemini(prompt, 1000);

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
