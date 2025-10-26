'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Word, Phrase } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';

type TableView = 'words' | 'phrases';

export default function Home() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();
  const [words, setWords] = useState<Word[]>([]);
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<TableView>('words');

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Fetch data from API
  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
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
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  // Calculate maximum definitions for table display
  const maxDefinitions = Math.max(
    words.reduce((max, word) => Math.max(max, word.definitions?.length || 0), 0),
    phrases.reduce((max, phrase) => Math.max(max, 0), 0)
  );

  const addWord = async (wordText: string) => {
    if (!wordText.trim()) return;
    const tempWord: Word = {
      wordId: 'temp-' + Date.now(),
      text: wordText.trim(),
      translation: null,
      definitions: null,
      isTranslating: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setWords([tempWord, ...words]);
    try {
      const response = await api.createWord(wordText.trim());
      setWords(words.map(w => w.wordId === tempWord.wordId ? response.word : w));
    } catch (error) {
      setWords(words.filter(w => w.wordId !== tempWord.wordId));
    }
  };

  const addPhrase = async (phraseText: string) => {
    if (!phraseText.trim()) return;
    try {
      const response = await api.createPhrase(phraseText.trim());
      setPhrases([response.phrase, ...phrases]);
    } catch (error) {
      console.error('Failed to create phrase:', error);
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

  const deletePhrase = async (phraseId: string) => {
    try {
      await api.deletePhrase(phraseId);
      setPhrases(phrases.filter(p => p.phraseId !== phraseId));
    } catch (error) {
      console.error('Failed to delete phrase:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                Welcome back, {user.name}!
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Learning {user.targetLanguage}
              </p>
            </div>
            <div className="flex gap-3">
              <a
                href="/review"
                className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                📚 Review
              </a>
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
            <TableView
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
    </div>
  );
}

// Review-style Table View Component
function TableView({ activeView, words, phrases, maxDefinitions, onAddWord, onAddPhrase, onDeleteWord, onDeletePhrase }: {
  activeView: TableView;
  words: Word[];
  phrases: Phrase[];
  maxDefinitions: number;
  onAddWord: (text: string) => void;
  onAddPhrase: (text: string) => void;
  onDeleteWord: (id: string) => void;
  onDeletePhrase: (id: string) => void;
}) {
  const [newText, setNewText] = useState('');

  if (activeView === 'words') {
    return <WordsReviewTable words={words} maxDefinitions={maxDefinitions} newText={newText} setNewText={setNewText} onAddWord={onAddWord} onDeleteWord={onDeleteWord} />;
  } else {
    return <PhrasesReviewTable phrases={phrases} newText={newText} setNewText={setNewText} onAddPhrase={onAddPhrase} onDeletePhrase={onDeletePhrase} />;
  }
}

// Words Review Table Component
function WordsReviewTable({ words, maxDefinitions, newText, setNewText, onAddWord, onDeleteWord }: {
  words: Word[];
  maxDefinitions: number;
  newText: string;
  setNewText: (text: string) => void;
  onAddWord: (text: string) => void;
  onDeleteWord: (id: string) => void;
}) {
  return (
    <div className="p-6">
      {/* Add New Word */}
      <div className="mb-6 flex gap-2">
        <input
          type="text"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && onAddWord(newText) && setNewText('')}
          placeholder="Enter a new word..."
          className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-indigo-500 focus:outline-none transition-colors"
        />
        <button
          onClick={() => onAddWord(newText) && setNewText('')}
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
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Word</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Translation</th>
                {Array.from({ length: maxDefinitions }, (_, i) => (
                  <th key={i} className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Definition {i + 1}
                  </th>
                ))}
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {words.map((word, index) => (
                <tr key={word.wordId} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mr-3">
                        {index + 1}.
                      </span>
                      <span className="text-lg font-semibold text-gray-800 dark:text-white">
                        {word.text}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                      {word.translation || '—'}
                    </span>
                  </td>
                  {Array.from({ length: maxDefinitions }, (_, i) => (
                    <td key={i} className="px-6 py-4">
                      {word.definitions && word.definitions[i] ? (
                        <span className="inline-block bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs text-gray-700 dark:text-gray-300">
                          {word.definitions[i].meaning}
                        </span>
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

// Phrases Review Table Component
function PhrasesReviewTable({ phrases, newText, setNewText, onAddPhrase, onDeletePhrase }: {
  phrases: Phrase[];
  newText: string;
  setNewText: (text: string) => void;
  onAddPhrase: (text: string) => void;
  onDeletePhrase: (id: string) => void;
}) {
  return (
    <div className="p-6">
      {/* Add New Phrase */}
      <div className="mb-6 flex gap-2">
        <input
          type="text"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && onAddPhrase(newText) && setNewText('')}
          placeholder="Enter a new phrase..."
          className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-purple-500 focus:outline-none transition-colors"
        />
        <button
          onClick={() => onAddPhrase(newText) && setNewText('')}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
        >
          Add
        </button>
      </div>

      {/* Phrases Table */}
      {phrases.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">💭</div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            No phrases yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Start adding phrases to learn!
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Phrase</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Translation</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {phrases.map((phrase, index) => (
                <tr key={phrase.phraseId} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mr-3">
                        {index + 1}.
                      </span>
                      <span className="text-lg font-semibold text-gray-800 dark:text-white">
                        {phrase.text}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-purple-600 dark:text-purple-400 font-medium">
                      {phrase.translation || '—'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => onDeletePhrase(phrase.phraseId)}
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
