'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Word, Phrase } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import WordsTable from '@/components/WordsTable';
import PhrasesTable from '@/components/PhrasesTable';

export default function Home() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();
  const [words, setWords] = useState<Word[]>([]);
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <header className="mb-12">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                Welcome back, {user.name}!
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Learning {user.targetLanguage}
              </p>
            </div>
            <button
              onClick={logout}
              className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
            >
              Logout
            </button>
          </div>

          <div className="text-center">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
              Language Learning
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Track and translate words and phrases as you learn
            </p>
          </div>
        </header>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading your data...</p>
          </div>
        ) : (
          /* Main Content - Two Tables */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Words Section */}
            <WordsTable words={words} setWords={setWords} />

            {/* Phrases Section */}
            <PhrasesTable phrases={phrases} setPhrases={setPhrases} />
          </div>
        )}
      </div>
    </div>
  );
}
