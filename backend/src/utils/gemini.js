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
 * Translate a word or multiple words with definitions and examples
 * @param {string} word - The word(s) to translate (can be multiple words separated by spaces)
 * @param {string} nativeLanguage - User's native language
 * @param {string} targetLanguage - Target language (e.g., 'Spanish', 'French')
 * @returns {Promise<Array>} - Array of translation results with definitions
 */
export async function translateWord(word, nativeLanguage, targetLanguage) {
  console.log('translateWord-pexur', word, nativeLanguage, targetLanguage);
  
  const prompt = `You are a professional translator and language teacher. 

The user's native language is ${nativeLanguage} and they are learning ${targetLanguage}.

Translate the following word(s) from ${nativeLanguage} to ${targetLanguage}: "${word}"

The input may contain a single word or multiple words separated by spaces. If there are multiple words, split them by spaces and translate each word individually. If the input is a single word, return an array with one entry.

For each word:
- If it's already in ${targetLanguage}, provide its correct spelling and meaning
- If it's misspelled, correct it in the translation field
- Translate it to ${targetLanguage}

Provide the response in the following JSON format:
{
  "words": [
    {
      "originalWord": "the word from the input (extracted from the input string)",
      "translation": "the translated word in ${targetLanguage} (must be in ${targetLanguage})",
      "wordType": "noun|verb|adjective|adverb|other",
      "gender": "m|f|neutral (only for nouns in languages with gender, otherwise omit)",
      "definitions": [
        {
          "id": "1",
          "meaning": "concise definition in ${nativeLanguage} (max 3-4 words).",
          "example": "a natural example sentence using the word in ${targetLanguage}"
        },
        {
          "id": "2",
          "meaning": "another concise definition in ${nativeLanguage} if applicable (max 3-4 words)",
          "example": "another example sentence in ${targetLanguage}"
        }
      ]
    }
  ]
}

IMPORTANT RULES:
- Process each word separately - if the input contains multiple words separated by spaces, split them and translate each one individually
- Return one entry in the "words" array for each word in the input (even if there's only one word)
- The "translation" field MUST be in ${targetLanguage} - do NOT return words in Spanish or any other language
- Keep definitions concise (3-5 words maximum) but include the word type explicitly
- Example format: "noun: a person who teaches" or "verb: to acquire knowledge"
- If a word is a noun in a language with gender (Spanish, French, Italian, etc.), include the gender field
- For Spanish: use "f" for feminine (la mesa), "m" for masculine (el libro)
- For French: use "f" for feminine (la table), "m" for masculine (le livre)
- If a word is misspelled, correct it in the translation field
- Provide 2-3 definitions if the word has multiple meanings
- Examples should be natural sentences in ${targetLanguage}
- CRITICAL: All translations must be in ${targetLanguage}, not ${nativeLanguage}, not Spanish, not any other language

IMPORTANT: Return ONLY the JSON object, no additional text or explanation.`;

  const response = await invokeGemini(prompt, 4000);

  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(response);
    
    // Always return array of word results
    return parsed.words || [];
  } catch (error) {
    console.error('Failed to parse Gemini response:', error);
    throw new Error('Invalid response format from translation service');
  }
}

/**
 * Get French verb conjugations
 * @param {string} verb - The verb to conjugate
 * @returns {Promise<Object>} - Conjugation result
 */
export async function conjugateFrenchVerb(verb) {
  const prompt = `You are a French language expert. Conjugate the French verb "${verb}".

Provide the response in the following JSON format:
{
  "infinitive": "${verb}",
  "present": {
    "je": "conjugated form",
    "tu": "conjugated form",
    "il/elle/on": "conjugated form",
    "nous": "conjugated form",
    "vous": "conjugated form",
    "ils/elles": "conjugated form"
  },
  "imperfect": {
    "je": "conjugated form",
    "tu": "conjugated form",
    "il/elle/on": "conjugated form",
    "nous": "conjugated form",
    "vous": "conjugated form",
    "ils/elles": "conjugated form"
  },
  "future": {
    "je": "conjugated form",
    "tu": "conjugated form",
    "il/elle/on": "conjugated form",
    "nous": "conjugated form",
    "vous": "conjugated form",
    "ils/elles": "conjugated form"
  },
  "conditional": {
    "je": "conjugated form",
    "tu": "conjugated form",
    "il/elle/on": "conjugated form",
    "nous": "conjugated form",
    "vous": "conjugated form",
    "ils/elles": "conjugated form"
  },
  "presentSubjunctive": {
    "je": "conjugated form",
    "tu": "conjugated form",
    "il/elle/on": "conjugated form",
    "nous": "conjugated form",
    "vous": "conjugated form",
    "ils/elles": "conjugated form"
  }
}

IMPORTANT RULES:
- Provide correct French conjugations for all tenses
- If the verb doesn't exist or is misspelled, return an error in the message field
- Return ONLY the JSON object, no additional text or explanation`;

  const response = await invokeGemini(prompt, 3000);

  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(response);
  } catch (error) {
    console.error('Failed to parse Gemini response:', error);
    throw new Error('Invalid response format from conjugation service');
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
  console.log('translatePhrase-pexur', phrase, nativeLanguage, targetLanguage);
  const prompt = `You are a professional translator.

The user's native language is ${nativeLanguage} and they are learning ${targetLanguage}.

Translate the phrase "${phrase}" from ${targetLanguage} to ${nativeLanguage}.

Provide the response in the following JSON format:
{
  "translation": "the translated phrase in ${nativeLanguage}",
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

/**
 * Generate a set of exercises from words and phrases
 * @param {Array} words - Array of words with translations
 * @param {Array} phrases - Array of phrases with translations
 * @param {string} nativeLanguage - User's native language
 * @param {string} targetLanguage - Target language being learned
 * @returns {Promise<Object>} - Exercise set with words, wordsReverse, and sentences
 */
export async function generateExerciseSet(words, phrases, nativeLanguage, targetLanguage) {
  const prompt = `You are a language learning exercise generator.

The user's native language is ${nativeLanguage} and they are learning ${targetLanguage}.

Available words:
${JSON.stringify(words.slice(0, 20).map(w => ({ word: w.text, translation: w.translation })))}

Available phrases (for sentence translation only):
${JSON.stringify(phrases.slice(0, 10).map(p => ({ phrase: p.text, translation: p.translation })))}

Generate a complete exercise set with exactly 30 exercises total (10 of each type):

1. Type 1 "word_to_target": Provide a word in ${nativeLanguage}, ask user to translate to ${targetLanguage}
2. Type 2 "word_to_native": Provide a word in ${targetLanguage}, ask user to translate to ${nativeLanguage}
3. Type 3 "sentence": Provide a sentence in ${nativeLanguage} using phrases from the available phrases, ask user to translate to ${targetLanguage}. Use the correct answer words separated by spaces.

Return ONLY a JSON object in this exact format:
{
  "words": [
    {
      "id": "w1",
      "type": "word_to_target",
      "question": "What is the ${targetLanguage} translation of 'apple'?",
      "correctAnswer": "manzana",
      "hint": "A common fruit"
    }
  ],
  "wordsReverse": [
    {
      "id": "wr1",
      "type": "word_to_native",
      "question": "What is the ${nativeLanguage} translation of 'manzana'?",
      "correctAnswer": "apple",
      "hint": "A common fruit"
    }
  ],
  "sentences": [
    {
      "id": "s1",
      "type": "sentence",
      "question": "Translate: 'How are you?' to ${targetLanguage}",
      "correctAnswer": "¿Cómo estás?",
      "hint": "Common greeting"
    }
  ]
}

RULES:
- Use exactly 10 words from the available words list for type 1
- Use exactly 10 different words in reverse for type 2
- Use available phrases for type 3, create natural sentences
- For sentences, the correctAnswer should be the translation in ${targetLanguage} with words separated by spaces
- Keep questions natural and engaging
- Include helpful hints
- Return ONLY the JSON, no additional text`;

  const response = await invokeGemini(prompt, 4000);

  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(response);
  } catch (error) {
    console.error('Failed to parse Gemini response:', error);
    throw new Error('Invalid response format from exercise generation service');
  }
}
