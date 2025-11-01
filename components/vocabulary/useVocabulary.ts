import { useState, useCallback } from 'react';
import { Word, Phrase } from '@/types';
import { api } from '@/lib/api';

export function useVocabulary() {
  const [words, setWords] = useState<Word[]>([]);
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [wordsResponse, phrasesResponse] = await Promise.all([
        api.getWords(),
        api.getPhrases(),
      ]);
      setWords(wordsResponse.words || []);
      setPhrases(phrasesResponse.phrases || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const addWord = async (wordText: string) => {
    if (!wordText.trim()) return;
    
    // Split input to show loading state for each word
    const wordsArray = wordText.trim().split(/\s+/).filter(w => w.length > 0);
    
    // Create temp word(s) for loading state
    const tempWords: Word[] = wordsArray.map((text, index) => ({
      wordId: `temp-${Date.now()}-${index}`,
      text: text,
      translation: undefined,
      definitions: undefined,
      isTranslating: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }));
    
    setWords([...tempWords, ...words]);
    
    try {
      const response = await api.createWord(wordText.trim());
      
      // Backend always returns words as an array (even for single word)
      const createdWords = response.words || [];
      
      // Replace temp words with actual words
      setWords((prevWords) => {
        let newWords = [...prevWords];
        
        // Remove temp words
        tempWords.forEach(tempWord => {
          const tempIndex = newWords.findIndex(w => w.wordId === tempWord.wordId);
          if (tempIndex !== -1) {
            newWords.splice(tempIndex, 1);
          }
        });
        
        // Add created words at the beginning
        newWords = [...createdWords, ...newWords];
        
        return newWords;
      });
    } catch (error) {
      console.error('Failed to create word(s):', error);
      // Remove temp words on error
      setWords((prevWords) =>
        prevWords.filter((w) => !tempWords.some(temp => temp.wordId === w.wordId))
      );
    }
  };

  const addPhrase = async (phraseText: string) => {
    if (!phraseText.trim()) return;
    try {
      const response = await api.createPhrase(phraseText.trim());
      setPhrases((prevPhrases) => [response.phrase, ...prevPhrases]);
    } catch (error) {
      console.error('Failed to create phrase:', error);
    }
  };

  const deleteWord = async (wordId: string) => {
    try {
      await api.deleteWord(wordId);
      setWords((prevWords) => prevWords.filter((w) => w.wordId !== wordId));
    } catch (error) {
      console.error('Failed to delete word:', error);
    }
  };

  const deletePhrase = async (phraseId: string) => {
    try {
      await api.deletePhrase(phraseId);
      setPhrases((prevPhrases) =>
        prevPhrases.filter((p) => p.phraseId !== phraseId)
      );
    } catch (error) {
      console.error('Failed to delete phrase:', error);
    }
  };

  return {
    words,
    phrases,
    loading,
    fetchData,
    addWord,
    addPhrase,
    deleteWord,
    deletePhrase,
  };
}

