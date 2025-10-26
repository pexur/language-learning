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
 * @param {string} nativeLanguage - User's native language
 * @param {string} targetLanguage - Target language (e.g., 'Spanish', 'French')
 * @returns {Promise<Object>} - Translation result with definitions
 */
export async function translateWord(word, nativeLanguage, targetLanguage) {
  const prompt = `You are a professional translator and language teacher. 

The user's native language is ${nativeLanguage} and they are learning ${targetLanguage}.

First, check if "${word}" is spelled correctly in ${targetLanguage}. If it's misspelled, provide the correct spelling. Then translate the word to English and provide definitions.

Provide the response in the following JSON format:
{
  "translation": "the translated word in ${targetLanguage} (corrected if misspelled)",
  "wordType": "noun|verb|adjective|adverb|other",
  "definitions": [
    {
      "id": "1",
      "meaning": "concise definition in English (max 3-4 words). Include the word type at the beginning: 'noun: thing', 'verb: action', 'adjective: description', etc.",
      "example": "a natural example sentence using the word in ${targetLanguage}"
    },
    {
      "id": "2",
      "meaning": "another concise definition if applicable (max 3-4 words)",
      "example": "another example sentence"
    }
  ]
}

IMPORTANT RULES:
- Keep definitions concise (3-5 words maximum) but include the word type explicitly
- Example format: "noun: a person who teaches" or "verb: to acquire knowledge"
- If the word is misspelled, correct it in the translation field
- Provide 2-3 definitions if the word has multiple meanings
- Examples should be natural sentences in ${targetLanguage}

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
 * @param {string} nativeLanguage - User's native language
 * @param {string} targetLanguage - Target language
 * @returns {Promise<Object>} - Translation result
 */
export async function translatePhrase(phrase, nativeLanguage, targetLanguage) {
  const prompt = `You are a professional translator.

The user's native language is ${nativeLanguage} and they are learning ${targetLanguage}.

Translate the phrase "${phrase}" from ${nativeLanguage} to ${targetLanguage}.

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
