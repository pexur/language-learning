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
    const tempWord: Word = {
      wordId: 'temp-' + Date.now(),
      text: wordText.trim(),
      translation: undefined,
      definitions: undefined,
      isTranslating: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setWords([tempWord, ...words]);
    try {
      const response = await api.createWord(wordText.trim());
      setWords((prevWords) =>
        prevWords.map((w) =>
          w.wordId === tempWord.wordId ? response.word : w
        )
      );
    } catch (error) {
      setWords((prevWords) =>
        prevWords.filter((w) => w.wordId !== tempWord.wordId)
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

