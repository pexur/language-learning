'use client';

import { useState } from 'react';
import { Word } from '@/types';
import { api } from '@/lib/api';

interface WordsTableProps {
  words: Word[];
  setWords: React.Dispatch<React.SetStateAction<Word[]>>;
}

export default function WordsTable({ words, setWords }: WordsTableProps) {
  const [newWord, setNewWord] = useState('');

  const addWord = async () => {
    if (!newWord.trim()) return;

    // Show loading state for the new word
    const tempWord: Word = {
      wordId: 'temp-' + Date.now(),
      text: newWord.trim(),
      translation: undefined,
      definitions: undefined,
      isTranslating: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    
    const wordToAdd = newWord.trim();
    setNewWord('');
    
    // Add temp word to the list
    setWords((prevWords: Word[]) => [tempWord, ...prevWords]);

    try {
      // Create word with auto-translation
      const response = await api.createWord(wordToAdd);

      // Replace temp word with actual word
      setWords(prevWords => 
        prevWords.map(w => 
          w.wordId === tempWord.wordId ? response.word : w
        )
      );
    } catch (error) {
      console.error('Failed to create word:', error);
      // Remove temp word on error
      setWords(prevWords => 
        prevWords.filter(w => w.wordId !== tempWord.wordId)
      );
    }
  };


  const deleteWord = async (wordId: string) => {
    try {
      await api.deleteWord(wordId);
      setWords(words.filter(w => w.wordId !== wordId));
    } catch (error) {
      console.error('Failed to delete word:', error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 transition-all duration-300 hover:shadow-2xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <span className="text-3xl">📝</span>
          Words
        </h2>

        {/* Add New Word */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newWord}
            onChange={(e) => setNewWord(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addWord()}
            placeholder="Enter a new word..."
            className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-indigo-500 focus:outline-none transition-colors"
          />
          <button
            onClick={addWord}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
          >
            Add
          </button>
        </div>
      </div>

      {/* Words List */}
      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
        {words.length === 0 ? (
          <div className="text-center py-12 text-gray-400 dark:text-gray-500">
            <p className="text-4xl mb-2">🌟</p>
            <p>No words yet. Start adding words to learn!</p>
          </div>
        ) : (
          words.map((word) => (
            <div
              key={word.wordId}
              className="border-2 border-gray-100 dark:border-gray-700 rounded-xl p-4 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-200 animate-fadeIn"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
                    {word.text}
                  </h3>
                  {word.translation && (
                    <p className="text-indigo-600 dark:text-indigo-400 font-medium">
                      → {word.translation}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  {word.isTranslating && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Translating...
                    </div>
                  )}
                  <button
                    onClick={() => deleteWord(word.wordId)}
                    className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              {/* Definitions */}
              {word.definitions && word.definitions.length > 0 && (
                <div className="mt-3 space-y-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  {word.definitions.map((def, index) => (
                    <div key={def.id} className="pl-4 border-l-4 border-indigo-400">
                      <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        {index + 1}. {def.meaning}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                        Example: "{def.example}"
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
