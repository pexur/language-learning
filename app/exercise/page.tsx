'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import Footer from '@/components/Footer';

interface ExerciseEntry {
  date: string;
  exerciseId: string;
  createdAt: number;
  hasResponses: boolean;
  responseCount: number;
}

export default function ExercisePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [entries, setEntries] = useState<ExerciseEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Load exercise entries when component mounts
  useEffect(() => {
    if (user) {
      loadExerciseEntries();
    }
  }, [user]);

  const loadExerciseEntries = async () => {
    setLoading(true);
    try {
      const response = await api.getExerciseEntries();
      if (response.entries) {
        setEntries(response.entries);
      }
    } catch (error) {
      console.error('Failed to load exercise entries:', error);
      // Don't show error to user if endpoint not available yet
    } finally {
      setLoading(false);
    }
  };

  const generateExercises = async () => {
    setGenerating(true);
    try {
      // Check if user has at least 10 words before generating exercises
      const wordsResponse = await api.getWords();
      const words = wordsResponse.words || [];
      
      if (words.length < 10) {
        alert(`You need at least 10 words to generate exercises. You currently have ${words.length} word${words.length !== 1 ? 's' : ''}. Please add more words first.`);
        setGenerating(false);
        return;
      }

      await api.generateExercises();
      // Reload entries after generating
      await loadExerciseEntries();
      // Navigate to today's exercise
      const today = new Date().toISOString().split('T')[0];
      router.push(`/exercise/${today}`);
    } catch (error) {
      console.error('Failed to generate exercises:', error);
      alert('Failed to generate exercises. Please make sure you have some translated words and phrases.');
    } finally {
      setGenerating(false);
    }
  };

  const handleEntryClick = (date: string) => {
    router.push(`/exercise/${date}`);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const entryDate = new Date(date);
    entryDate.setHours(0, 0, 0, 0);
    
    if (entryDate.getTime() === today.getTime()) {
      return 'Today';
    }
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (entryDate.getTime() === yesterday.getTime()) {
      return 'Yesterday';
    }
    
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (authLoading || !user || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading exercises...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="container mx-auto px-4 py-6 md:py-8 lg:pl-8">
        <header className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
            Practice Exercises
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1">
            Click on an entry to practice exercises for that date
          </p>
        </header>

        <div className="mb-6 flex justify-end">
          <button
            onClick={generateExercises}
            disabled={generating}
            className={`w-full sm:w-auto px-6 py-3 md:px-8 md:py-4 text-base md:text-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 min-h-[48px] ${
              generating ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {generating ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Generating...
              </span>
            ) : (
              <>
                <span className="hidden sm:inline">Generate Exercises for Today</span>
                <span className="sm:hidden">Generate Today's Exercises</span>
              </>
            )}
          </button>
        </div>

        {entries.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12 text-center">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              No Exercises Yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Generate your first set of exercises to get started!
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
                Exercise History
              </h2>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {entries.map((entry) => (
                <button
                  key={entry.date}
                  onClick={() => handleEntryClick(entry.date)}
                  className="w-full p-4 md:p-6 text-left hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors active:bg-indigo-100 dark:active:bg-gray-600 min-h-[72px]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                        <h3 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-white">
                          {formatDate(entry.date)}
                        </h3>
                        {entry.hasResponses && (
                          <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs md:text-sm font-medium rounded-full w-fit">
                            {entry.responseCount} responses
                          </span>
                        )}
                      </div>
                      <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                        {new Date(entry.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <svg
                      className="w-5 h-5 md:w-6 md:h-6 text-gray-400 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

