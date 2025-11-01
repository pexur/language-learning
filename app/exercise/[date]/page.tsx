'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Exercise, ExerciseSet, ExerciseState } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import Footer from '@/components/Footer';

export default function ExerciseDatePage() {
  const router = useRouter();
  const params = useParams();
  const date = params.date as string;
  const { user, loading: authLoading } = useAuth();
  const [exercises, setExercises] = useState<ExerciseSet | null>(null);
  const [exerciseId, setExerciseId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [exerciseState, setExerciseState] = useState<ExerciseState>({});
  const [saving, setSaving] = useState(false);
  const hasLoadedExercises = useRef(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Load exercises for the specific date
  useEffect(() => {
    if (user && date && !hasLoadedExercises.current) {
      hasLoadedExercises.current = true;
      loadExercisesForDate();
    }
  }, [user, date]);

  const loadExercisesForDate = async () => {
    setLoading(true);
    try {
      const response = await api.getExercises(date);
      if (response.exercises) {
        setExercises(response.exercises);
        setExerciseId(response.exerciseId);
        
        // Restore user responses if they exist
        if (response.userResponses && Object.keys(response.userResponses).length > 0) {
          const restoredState: ExerciseState = {};
          Object.keys(response.userResponses).forEach(exerciseId => {
            const responseData = response.userResponses[exerciseId];
            restoredState[exerciseId] = {
              userAnswer: responseData.userAnswer || '',
              isCorrect: responseData.isCorrect ?? null,
              showResult: responseData.showResult || false,
            };
          });
          setExerciseState(restoredState);
        }
      } else {
        // No exercises found for this date, redirect to exercise list
        router.push('/exercise');
      }
    } catch (error) {
      console.error('Failed to load exercises:', error);
      alert('Failed to load exercises. Redirecting to exercise list.');
      router.push('/exercise');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (exerciseId: string, answer: string) => {
    const newState = {
      ...exerciseState,
      [exerciseId]: {
        ...exerciseState[exerciseId],
        userAnswer: answer,
        isCorrect: null,
      }
    };
    setExerciseState(newState);
  };

  const checkAnswer = async (exerciseId: string, correctAnswer: string) => {
    const currentAnswer = exerciseState[exerciseId]?.userAnswer || '';
    const userAnswer = currentAnswer.toLowerCase().trim();
    const isCorrect = userAnswer === correctAnswer.toLowerCase().trim();
    
    const newState = {
      ...exerciseState,
      [exerciseId]: {
        ...exerciseState[exerciseId],
        isCorrect,
        showResult: true,
      }
    };
    setExerciseState(newState);

    // Save response to database
    if (exerciseId && exerciseId.length > 0) {
      await saveResponse(exerciseId, {
        userAnswer: currentAnswer,
        isCorrect,
        showResult: true,
      });
    }
  };

  const saveResponse = async (id: string, responseData: any) => {
    if (!exerciseId) return;
    
    setSaving(true);
    try {
      await api.saveExerciseResponses(exerciseId, {
        [id]: responseData
      });
    } catch (error) {
      console.error('Failed to save response:', error);
      // Don't show error to user, just log it
    } finally {
      setSaving(false);
    }
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

  if (!exercises) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300">No exercises found for this date.</p>
          <button
            onClick={() => router.push('/exercise')}
            className="mt-4 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl"
          >
            Back to Exercise List
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div>
      <div className="container mx-auto px-4 py-8 lg:pl-8">
        <header className="mb-8">
          <button
            onClick={() => router.push('/exercise')}
            className="mb-4 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Exercise List
          </button>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Practice Exercises
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {formatDate(date)}
          </p>
        </header>

        <div className="space-y-8">
          {/* Section 1: Native to Target */}
          <ExerciseSection
            title="Translate from English to Target Language"
            subtitle="Translate these English words to your learning language"
            icon="🌍"
            exercises={exercises.words}
            exerciseState={exerciseState}
            onAnswerChange={handleAnswerChange}
            onCheckAnswer={checkAnswer}
          />

          {/* Section 2: Target to Native */}
          <ExerciseSection
            title="Translate from Target Language to English"
            subtitle="Translate these words back to English"
            icon="🔁"
            exercises={exercises.wordsReverse}
            exerciseState={exerciseState}
            onAnswerChange={handleAnswerChange}
            onCheckAnswer={checkAnswer}
          />

          {/* Section 3: Sentence Translation */}
          <SentenceTranslationSection
            title="Sentence Translation"
            subtitle="Translate these complete sentences"
            icon="💬"
            exercises={exercises.sentences}
            exerciseState={exerciseState}
            onAnswerChange={handleAnswerChange}
            onCheckAnswer={checkAnswer}
          />
        </div>

        {saving && (
          <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
            Saving responses...
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

interface ExerciseSectionProps {
  title: string;
  subtitle: string;
  icon: string;
  exercises: Exercise[];
  exerciseState: ExerciseState;
  onAnswerChange: (exerciseId: string, answer: string) => void;
  onCheckAnswer: (exerciseId: string, correctAnswer: string) => void;
}

function ExerciseSection({ title, subtitle, icon, exercises, exerciseState, onAnswerChange, onCheckAnswer }: ExerciseSectionProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
          <span className="text-3xl">{icon}</span>
          {title}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">{subtitle}</p>
      </div>
      <div className="p-6 space-y-4">
        {exercises.map((exercise, index) => {
          const state = exerciseState[exercise.id] || { userAnswer: '', isCorrect: null, showResult: false };
          return (
            <div key={exercise.id} className="border-2 border-gray-200 dark:border-gray-700 rounded-xl p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Exercise {index + 1}
                  </p>
                  <p className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                    {exercise.question}
                  </p>
                  {exercise.hint && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                      💡 {exercise.hint}
                    </p>
                  )}
                </div>
                {state.showResult && (
                  <span className={`text-2xl ${state.isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                    {state.isCorrect ? '✓' : '✗'}
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={state.userAnswer}
                  onChange={(e) => onAnswerChange(exercise.id, e.target.value)}
                  placeholder="Enter your answer..."
                  className={`flex-1 px-4 py-2 rounded-lg border-2 focus:outline-none transition-colors ${
                    state.showResult
                      ? state.isCorrect
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-500 text-green-700 dark:text-green-400'
                        : 'bg-red-50 dark:bg-red-900/20 border-red-500 text-red-700 dark:text-red-400'
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:border-indigo-500'
                  }`}
                  disabled={state.showResult}
                />
                {!state.showResult && (
                  <button
                    onClick={() => onCheckAnswer(exercise.id, exercise.correctAnswer)}
                    disabled={!state.userAnswer.trim()}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Check
                  </button>
                )}
                {state.showResult && (
                  <div className="px-4 py-2 text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Correct: {exercise.correctAnswer}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface SentenceTranslationSectionProps {
  title: string;
  subtitle: string;
  icon: string;
  exercises: Exercise[];
  exerciseState: ExerciseState;
  onAnswerChange: (exerciseId: string, answer: string) => void;
  onCheckAnswer: (exerciseId: string, correctAnswer: string) => void;
}

function SentenceTranslationSection({ title, subtitle, icon, exercises, exerciseState, onAnswerChange, onCheckAnswer }: SentenceTranslationSectionProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
          <span className="text-3xl">{icon}</span>
          {title}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">{subtitle}</p>
      </div>
      <div className="p-6 space-y-4">
        {exercises.map((exercise, index) => {
          const state = exerciseState[exercise.id] || { userAnswer: '', isCorrect: null, showResult: false };
          const correctWords = exercise.correctAnswer.split(' ');
          const userWords = state.userAnswer.trim().split(/\s+/).filter(w => w);
          
          return (
            <div key={exercise.id} className="border-2 border-gray-200 dark:border-gray-700 rounded-xl p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Exercise {index + 1}
                  </p>
                  <p className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                    {exercise.question}
                  </p>
                  {exercise.hint && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                      💡 {exercise.hint}
                    </p>
                  )}
                </div>
                {state.showResult && (
                  <span className={`text-2xl ${state.isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                    {state.isCorrect ? '✓' : '✗'}
                  </span>
                )}
              </div>
              
              {/* Individual word input boxes */}
              <div className="mb-3">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Fill in each word:
                </p>
                <div className="flex flex-wrap gap-2">
                  {correctWords.map((_, wordIndex) => {
                    const isCorrect = state.showResult && userWords[wordIndex]?.toLowerCase().trim() === correctWords[wordIndex]?.toLowerCase().trim();
                    return (
                      <input
                        key={wordIndex}
                        type="text"
                        value={userWords[wordIndex] || ''}
                        onChange={(e) => {
                          const newWords = [...userWords];
                          newWords[wordIndex] = e.target.value;
                          onAnswerChange(exercise.id, newWords.join(' '));
                        }}
                        className={`w-24 px-3 py-2 text-center rounded-lg border-2 transition-colors ${
                          state.showResult
                            ? isCorrect
                              ? 'bg-green-50 dark:bg-green-900/20 border-green-500 text-green-700 dark:text-green-400'
                              : 'bg-red-50 dark:bg-red-900/20 border-red-500 text-red-700 dark:text-red-400'
                            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:border-indigo-500'
                        }`}
                        disabled={state.showResult}
                      />
                    );
                  })}
                </div>
              </div>
              
              {state.showResult && !state.isCorrect && (
                <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                  <p className="font-semibold">Correct answer: {exercise.correctAnswer}</p>
                </div>
              )}
              
              {!state.showResult && (
                <button
                  onClick={() => onCheckAnswer(exercise.id, exercise.correctAnswer)}
                  disabled={userWords.length === 0}
                  className="mt-3 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Check Answer
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

