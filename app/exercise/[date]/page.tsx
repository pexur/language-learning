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
          <SimpleTranslationTable
            title={`Translate from ${user.nativeLanguage} to ${user.targetLanguage}`}
            exercises={exercises.words}
            exerciseState={exerciseState}
            onAnswerChange={handleAnswerChange}
            onCheckAnswer={checkAnswer}
            leftLanguage={user.nativeLanguage}
            rightLanguage={user.targetLanguage}
          />

          {/* Section 2: Target to Native */}
          <SimpleTranslationTable
            title={`Translate from ${user.targetLanguage} to ${user.nativeLanguage}`}
            exercises={exercises.wordsReverse}
            exerciseState={exerciseState}
            onAnswerChange={handleAnswerChange}
            onCheckAnswer={checkAnswer}
            leftLanguage={user.targetLanguage}
            rightLanguage={user.nativeLanguage}
          />

          {/* Section 3: Sentence Translation */}
          {exercises.sentences && exercises.sentences.length > 0 && (
            <SentenceTranslationSection
              title={`Translate sentences from ${user.nativeLanguage} to ${user.targetLanguage}`}
              exercises={exercises.sentences}
              exerciseState={exerciseState}
              onAnswerChange={handleAnswerChange}
              onCheckAnswer={checkAnswer}
              targetLanguage={user.targetLanguage}
            />
          )}
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

interface SimpleTranslationTableProps {
  title: string;
  exercises: Exercise[];
  exerciseState: ExerciseState;
  onAnswerChange: (exerciseId: string, answer: string) => void;
  onCheckAnswer: (exerciseId: string, correctAnswer: string) => void;
  leftLanguage: string;
  rightLanguage: string;
}

function SimpleTranslationTable({
  title,
  exercises,
  exerciseState,
  onAnswerChange,
  onCheckAnswer,
  leftLanguage,
  rightLanguage,
}: SimpleTranslationTableProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          {title}
        </h2>
      </div>
      <div className="p-6">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                {leftLanguage}
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                {rightLanguage}
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 w-24">
                Result
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
            {exercises.map((exercise) => {
              const state = exerciseState[exercise.id] || {
                userAnswer: '',
                isCorrect: null,
                showResult: false,
              };

              return (
                <tr
                  key={exercise.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="px-6 py-4">
                    <span className="text-lg font-semibold text-gray-800 dark:text-white">
                      {exercise.question}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="text"
                      value={state.userAnswer}
                      onChange={(e) => onAnswerChange(exercise.id, e.target.value)}
                      placeholder="Enter translation..."
                      className={`w-full px-4 py-2 rounded-lg border-2 focus:outline-none transition-colors ${
                        state.showResult
                          ? state.isCorrect
                            ? 'bg-green-50 dark:bg-green-900/20 border-green-500 text-green-700 dark:text-green-400'
                            : 'bg-red-50 dark:bg-red-900/20 border-red-500 text-red-700 dark:text-red-400'
                          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:border-indigo-500'
                      }`}
                      disabled={state.showResult}
                    />
                    {state.showResult && !state.isCorrect && (
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Correct: {exercise.correctAnswer}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {state.showResult && (
                      <span
                        className={`text-2xl ${
                          state.isCorrect ? 'text-green-500' : 'text-red-500'
                        }`}
                      >
                        {state.isCorrect ? '✓' : '✗'}
                      </span>
                    )}
                    {!state.showResult && (
                      <button
                        onClick={() => onCheckAnswer(exercise.id, exercise.correctAnswer)}
                        disabled={!state.userAnswer.trim()}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Check
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface SentenceTranslationSectionProps {
  title: string;
  exercises: Exercise[];
  exerciseState: ExerciseState;
  onAnswerChange: (exerciseId: string, answer: string) => void;
  onCheckAnswer: (exerciseId: string, correctAnswer: string) => void;
  targetLanguage: string;
}

function SentenceTranslationSection({
  title,
  exercises,
  exerciseState,
  onAnswerChange,
  onCheckAnswer,
  targetLanguage,
}: SentenceTranslationSectionProps) {
  // Check if language is CJK (Chinese, Japanese, Korean) for wider input boxes
  const isCJK = ['Chinese', 'Japanese', 'Korean'].includes(targetLanguage);
  
  // Track composition state for each input to handle IME properly
  const compositionStatesRef = useRef<Record<string, boolean>>({});
  
  // Function to split answer into words
  const splitAnswer = (answer: string): string[] => {
    // Split by spaces for all languages
    return answer.split(/\s+/).filter(w => w.length > 0);
  };


  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          {title}
        </h2>
      </div>
      <div className="p-6 space-y-6">
        {exercises.map((exercise) => {
          const state = exerciseState[exercise.id] || {
            userAnswer: '',
            isCorrect: null,
            showResult: false,
          };

          const correctWords = splitAnswer(exercise.correctAnswer);
          const userWords = state.userAnswer ? splitAnswer(state.userAnswer) : [];
          
          // Ensure userWords array matches correctWords length
          const displayWords = correctWords.map((_, index) => userWords[index] || '');

          return (
            <div
              key={exercise.id}
              className="border-2 border-gray-200 dark:border-gray-600 rounded-lg p-6 space-y-4"
            >
              <div className="mb-4">
                <span className="text-lg font-semibold text-gray-800 dark:text-white">
                  {exercise.question}
                </span>
              </div>
              
              {isCJK ? (
                // Single full-width input box for CJK languages
                <div className="w-full">
                  <input
                    id={`sentence-${exercise.id}-full`}
                    type="text"
                    value={state.userAnswer}
                    onCompositionStart={() => {
                      compositionStatesRef.current[`sentence-${exercise.id}-full`] = true;
                    }}
                    onCompositionEnd={(e) => {
                      compositionStatesRef.current[`sentence-${exercise.id}-full`] = false;
                      onAnswerChange(exercise.id, e.currentTarget.value);
                    }}
                    onChange={(e) => {
                      onAnswerChange(exercise.id, e.target.value);
                    }}
                    placeholder="Enter translation..."
                    disabled={state.showResult}
                    className={`w-full px-4 py-3 rounded-lg border-2 text-left font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      state.showResult
                        ? state.isCorrect
                          ? 'bg-green-100 dark:bg-green-900/30 border-green-500 text-green-700 dark:text-green-400'
                          : 'bg-red-100 dark:bg-red-900/30 border-red-500 text-red-700 dark:text-red-400'
                        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white'
                    }`}
                  />
                </div>
              ) : (
                // Multiple word input boxes for non-CJK languages
                <div className="flex flex-wrap gap-2 items-center">
                  {correctWords.map((correctWord, wordIndex) => {
                    const userWord = displayWords[wordIndex] || '';
                    const isCorrect = userWord.toLowerCase().trim() === correctWord.toLowerCase().trim();
                    const isFilled = userWord.trim().length > 0;
                    const inputId = `sentence-${exercise.id}-word-${wordIndex}`;
                    
                    return (
                      <div key={wordIndex} className="flex items-center gap-2">
                        <input
                          id={inputId}
                          type="text"
                          value={userWord}
                          onChange={(e) => {
                            const newAnswers = [...displayWords];
                            newAnswers[wordIndex] = e.target.value.replace(/\s/g, '');
                            onAnswerChange(exercise.id, newAnswers.join(' '));
                            
                            // Check if word is correct and auto-advance
                            const cleanedValue = newAnswers[wordIndex];
                            if (cleanedValue.toLowerCase().trim() === correctWord.toLowerCase().trim()) {
                              const nextIndex = wordIndex + 1;
                              if (nextIndex < correctWords.length) {
                                setTimeout(() => {
                                  const nextInput = document.getElementById(`sentence-${exercise.id}-word-${nextIndex}`);
                                  nextInput?.focus();
                                }, 100);
                              }
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Tab') {
                              e.preventDefault();
                              const nextIndex = wordIndex + 1;
                              if (nextIndex < correctWords.length) {
                                setTimeout(() => {
                                  const nextInput = document.getElementById(`sentence-${exercise.id}-word-${nextIndex}`);
                                  nextInput?.focus();
                                }, 0);
                              }
                            }
                          }}
                          placeholder="word"
                          disabled={state.showResult}
                          className={`min-w-[60px] px-3 py-2 rounded-lg border-2 text-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                            state.showResult
                              ? isCorrect
                                ? 'bg-green-100 dark:bg-green-900/30 border-green-500 text-green-700 dark:text-green-400'
                                : 'bg-red-100 dark:bg-red-900/30 border-red-500 text-red-700 dark:text-red-400'
                              : isCorrect && isFilled
                              ? 'bg-green-50 dark:bg-green-900/20 border-green-400 text-green-700 dark:text-green-400'
                              : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white'
                          }`}
                        />
                        {wordIndex < correctWords.length - 1 && (
                          <span className="text-gray-400 dark:text-gray-500"> </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="flex items-center gap-4 mt-4">
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
                  <span
                    className={`text-lg font-semibold ${
                      state.isCorrect ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {state.isCorrect ? '✓ Correct!' : '✗ Incorrect'}
                  </span>
                )}
                {state.showResult && !state.isCorrect && (
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Correct answer: {exercise.correctAnswer}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
