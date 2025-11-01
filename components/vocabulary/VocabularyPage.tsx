'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Footer from '@/components/Footer';
import VocabularyView from './VocabularyView';
import { useVocabulary } from './useVocabulary';

type TableView = 'words' | 'phrases';

export default function VocabularyPage() {
  const { user, logout } = useAuth();
  const [activeView, setActiveView] = useState<TableView>('words');
  const {
    words,
    phrases,
    loading,
    fetchData,
    addWord,
    addPhrase,
    deleteWord,
    deletePhrase,
  } = useVocabulary();

  // Fetch data when component mounts
  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, fetchData]);

  // Calculate maximum definitions for table display
  const maxDefinitions = Math.max(
    words.reduce(
      (max, word) => Math.max(max, word.definitions?.length || 0),
      0
    ),
    phrases.reduce((max, phrase) => Math.max(max, 0), 0)
  );

  return (
    <div>
      <div className="container mx-auto px-4 py-8 lg:pl-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Learning {user?.targetLanguage}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={logout}
                className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading your data...</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          {/* Toggle Buttons */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveView('words')}
              className={`flex-1 px-6 py-4 font-semibold transition-all duration-200 ${
                activeView === 'words'
                  ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <span className="text-2xl mr-2">📝</span>
              Words ({words.length})
            </button>
            <button
              onClick={() => setActiveView('phrases')}
              className={`flex-1 px-6 py-4 font-semibold transition-all duration-200 ${
                activeView === 'phrases'
                  ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border-b-2 border-purple-600'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <span className="text-2xl mr-2">💬</span>
              Phrases ({phrases.length})
            </button>
          </div>

          {/* Content */}
          <VocabularyView
            activeView={activeView}
            words={words}
            phrases={phrases}
            maxDefinitions={maxDefinitions}
            onAddWord={addWord}
            onAddPhrase={addPhrase}
            onDeleteWord={deleteWord}
            onDeletePhrase={deletePhrase}
          />
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

