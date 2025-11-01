'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Word } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import WordTypeTag from './WordTypeTag';

interface WordsReviewTableProps {
  words: Word[];
  maxDefinitions: number;
  newText: string;
  setNewText: (text: string) => void;
  onAddWord: (text: string) => void;
  onDeleteWord: (id: string) => void;
}

export default function WordsReviewTable({
  words,
  maxDefinitions,
  newText,
  setNewText,
  onAddWord,
  onDeleteWord,
}: WordsReviewTableProps) {
  const router = useRouter();
  const { user } = useAuth();

  const isVerbClickable = (word: Word) => {
    return word.wordType === 'verb' && user?.targetLanguage === 'French';
  };

  const handleWordClick = (word: Word) => {
    if (isVerbClickable(word)) {
      const wordToConjugate = word.translation || word.text;
      router.push(`/conjugate/${encodeURIComponent(wordToConjugate)}`);
    }
  };

  return (
    <div className="p-6">
      {/* Add New Word */}
      <div className="mb-6 flex gap-2">
        <input
          type="text"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              const text = newText;
              setNewText('');
              onAddWord(text);
            }
          }}
          placeholder="Enter a new word..."
          className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-indigo-500 focus:outline-none transition-colors"
        />
        <button
          onClick={() => {
            const text = newText;
            setNewText('');
            onAddWord(text);
          }}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
        >
          Add
        </button>
      </div>

      {/* Words Table */}
      {words.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🌟</div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            No words yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Start adding words to build your vocabulary!
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Word
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Type
                </th>
                {Array.from({ length: maxDefinitions }, (_, i) => (
                  <th
                    key={i}
                    className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Def {i + 1}
                  </th>
                ))}
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {words.map((word, index) => (
                <tr
                  key={word.wordId}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mr-3">
                        {index + 1}.
                      </span>
                      <span
                        onClick={() => handleWordClick(word)}
                        className={`text-lg font-semibold ${
                          isVerbClickable(word)
                            ? 'text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 cursor-pointer hover:underline'
                            : 'text-gray-800 dark:text-white'
                        }`}
                        title={
                          isVerbClickable(word)
                            ? 'Click to view conjugations'
                            : ''
                        }
                      >
                        {word.translation || word.text || '—'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <WordTypeTag word={word} />
                  </td>
                  {Array.from({ length: maxDefinitions }, (_, i) => (
                    <td key={i} className="px-6 py-4">
                      {word.definitions && word.definitions[i] ? (
                        <div>
                          <span className="inline-block bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs text-gray-700 dark:text-gray-300">
                            {word.definitions[i].meaning}
                          </span>
                          {word.definitions[i].example && (
                            <div className="mt-1 text-xs italic text-gray-500 dark:text-gray-400">
                              {word.definitions[i].example}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500">—</span>
                      )}
                    </td>
                  ))}
                  <td className="px-6 py-4">
                    <button
                      onClick={() => onDeleteWord(word.wordId)}
                      className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

