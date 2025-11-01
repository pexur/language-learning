'use client';

import { useState } from 'react';
import { Phrase } from '@/types';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface PhrasesTableProps {
  phrases: Phrase[];
  setPhrases: React.Dispatch<React.SetStateAction<Phrase[]>>;
}

export default function PhrasesTable({ phrases, setPhrases }: PhrasesTableProps) {
  const { user } = useAuth();
  const [newPhrase, setNewPhrase] = useState('');

  const addPhrase = async () => {
    if (!newPhrase.trim()) return;

    try {
      const response = await api.createPhrase(newPhrase.trim());
      setPhrases([response.phrase, ...phrases]);
      setNewPhrase('');
    } catch (error) {
      console.error('Failed to create phrase:', error);
    }
  };

  const translatePhrase = async (phraseId: string) => {
    setPhrases(phrases.map(p =>
      p.phraseId === phraseId ? { ...p, isTranslating: true } : p
    ));

    try {
      const phrase = phrases.find(p => p.phraseId === phraseId);
      if (!user?.nativeLanguage || !user?.targetLanguage) {
        throw new Error('User language preferences not available');
      }
      const data = await api.translate(phrase!.text, 'phrase', user.nativeLanguage, user.targetLanguage);

      setPhrases(phrases.map(p =>
        p.phraseId === phraseId
          ? {
              ...p,
              translation: data.translation,
              isTranslating: false
            }
          : p
      ));
    } catch (error) {
      console.error('Translation error:', error);
      setPhrases(phrases.map(p =>
        p.phraseId === phraseId ? { ...p, isTranslating: false } : p
      ));
    }
  };

  const deletePhrase = async (phraseId: string) => {
    try {
      await api.deletePhrase(phraseId);
      setPhrases(phrases.filter(p => p.phraseId !== phraseId));
    } catch (error) {
      console.error('Failed to delete phrase:', error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 transition-all duration-300 hover:shadow-2xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <span className="text-3xl">💬</span>
          Phrases
        </h2>

        {/* Add New Phrase */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newPhrase}
            onChange={(e) => setNewPhrase(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addPhrase()}
            placeholder="Enter a new phrase..."
            className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-purple-500 focus:outline-none transition-colors"
          />
          <button
            onClick={addPhrase}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
          >
            Add
          </button>
        </div>
      </div>

      {/* Phrases List */}
      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
        {phrases.length === 0 ? (
          <div className="text-center py-12 text-gray-400 dark:text-gray-500">
            <p className="text-4xl mb-2">💭</p>
            <p>No phrases yet. Start adding phrases to learn!</p>
          </div>
        ) : (
          phrases.map((phrase) => (
            <div
              key={phrase.phraseId}
              className="border-2 border-gray-100 dark:border-gray-700 rounded-xl p-4 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-200 animate-fadeIn"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
                    {phrase.text}
                  </h3>
                  {phrase.translation && (
                    <p className="text-purple-600 dark:text-purple-400 font-medium mt-2">
                      → {phrase.translation}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => translatePhrase(phrase.phraseId)}
                    disabled={phrase.isTranslating}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      phrase.isTranslating
                        ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white hover:scale-105 active:scale-95'
                    }`}
                  >
                    {phrase.isTranslating ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Translating...
                      </span>
                    ) : (
                      '🌐 Translate'
                    )}
                  </button>
                  <button
                    onClick={() => deletePhrase(phrase.phraseId)}
                    className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
