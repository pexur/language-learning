'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { Word } from '@/types';

export default function ReviewPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      loadWords();
    }
  }, [user]);

  const loadWords = async () => {
    try {
      const response = await api.getWords();
      setWords(response.words || []);
    } catch (error) {
      console.error('Failed to load words:', error);
      // If backend is not available, show empty state instead of redirecting
      if (error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
        console.warn('Backend not available - showing empty state');
        setWords([]);
      } else {
        // If it's an auth error, let the auth context handle it
        throw error;
      }
    } finally {
      setLoading(false);
    }
  };

  if (isLoading || loading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your words...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2 flex items-center justify-center gap-3">
            <span className="text-5xl">📚</span>
            Word Review
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Review all your learned words with concise definitions
          </p>
        </div>

        {/* Review Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          {words.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🌟</div>
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                No words to review yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Start adding words to build your vocabulary!
              </p>
              <a
                href="/"
                className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105"
              >
                Add Words
              </a>
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
                      Translation
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Definition
                    </th>
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
                      <td className="px-6 py-4">
                        <WordTypeTag word={word} />
                      </td>
                      <td className="px-6 py-4">
                        <ConciseDefinition word={word} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <a
            href="/"
            className="inline-flex items-center px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105"
          >
            ← Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}

// Component to display word type with decoration
function WordTypeTag({ word }: { word: Word }) {
  const getWordType = (word: Word) => {
    if (!word.definitions || word.definitions.length === 0) {
      return { type: 'unknown', color: 'bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-300' };
    }

    const firstDef = word.definitions[0];
    const meaning = firstDef.meaning.toLowerCase();
    
    // Simple word type detection based on definition patterns
    if (meaning.includes('noun') || meaning.includes('thing') || meaning.includes('person') || meaning.includes('place')) {
      return { type: 'noun', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' };
    }
    if (meaning.includes('verb') || meaning.includes('action') || meaning.includes('to ')) {
      return { type: 'verb', color: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' };
    }
    if (meaning.includes('adjective') || meaning.includes('describes')) {
      return { type: 'adjective', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' };
    }
    if (meaning.includes('adverb') || meaning.includes('how')) {
      return { type: 'adverb', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300' };
    }
    
    return { type: 'other', color: 'bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-300' };
  };

  const { type, color } = getWordType(word);

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {type}
    </span>
  );
}

// Component to display concise definition
function ConciseDefinition({ word }: { word: Word }) {
  if (!word.definitions || word.definitions.length === 0) {
    return <span className="text-gray-400 dark:text-gray-500">No definition available</span>;
  }

  // Get the most concise definition (shortest one)
  const conciseDef = word.definitions.reduce((shortest, current) => 
    current.meaning.length < shortest.meaning.length ? current : shortest
  );

  // Extract just the core meaning, removing extra words
  let definition = conciseDef.meaning;
  
  // Remove common prefixes/suffixes to make it more concise
  definition = definition
    .replace(/^(a|an|the)\s+/i, '') // Remove articles
    .replace(/\s+(noun|verb|adjective|adverb).*$/i, '') // Remove word type indicators
    .replace(/\s*\(.*?\)/g, '') // Remove parenthetical info
    .replace(/\s*[;:].*$/g, '') // Remove everything after semicolon/colon
    .trim();

  return (
    <span className="text-sm text-gray-700 dark:text-gray-300">
      {definition}
    </span>
  );
}
