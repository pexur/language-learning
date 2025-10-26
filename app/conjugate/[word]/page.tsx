'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';

interface ConjugationTense {
  je: string;
  tu: string;
  'il/elle/on': string;
  nous: string;
  vous: string;
  'ils/elles': string;
}

interface ConjugationData {
  infinitive: string;
  present: ConjugationTense;
  imperfect: ConjugationTense;
  future: ConjugationTense;
  conditional: ConjugationTense;
  presentSubjunctive: ConjugationTense;
}

export default function ConjugationPage() {
  const router = useRouter();
  const params = useParams();
  const { user, loading: authLoading } = useAuth();
  const [conjugationData, setConjugationData] = useState<ConjugationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const word = decodeURIComponent(params.word as string);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    // Only load conjugations if user is learning French
    if (user && user.targetLanguage === 'French') {
      fetchConjugation();
    }
  }, [user, authLoading, word]);

  const fetchConjugation = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.conjugate(word);
      setConjugationData(data);
    } catch (err) {
      console.error('Failed to fetch conjugation:', err);
      setError('Failed to load conjugations');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading conjugations...</p>
        </div>
      </div>
    );
  }

  if (user && user.targetLanguage !== 'French') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded">
            <p className="font-bold">Conjugation feature is only available for French learners</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded">
            <p>{error}</p>
          </div>
          <button
            onClick={() => router.push('/')}
            className="mt-4 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const renderConjugationTable = (tenseName: string, tenseData: ConjugationTense | undefined) => {
    if (!tenseData) return null;

    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">{tenseName}</h2>
        <div className="space-y-3">
          {Object.entries(tenseData).map(([person, conjugation]) => (
            <div
              key={person}
              className="flex items-center justify-between py-3 px-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
            >
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300 w-32">
                {person}
              </span>
              <span className="text-lg font-semibold text-gray-800 dark:text-white">
                {conjugation}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/')}
            className="mb-4 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-2"
          >
            ← Back to Words
          </button>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            Conjugation: <span className="text-indigo-600 dark:text-indigo-400">{word}</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Complete conjugation table for this French verb
          </p>
        </div>

        {/* Conjugation Tables */}
        {conjugationData && (
          <div>
            {renderConjugationTable('Present Tense (Présent)', conjugationData.present)}
            {renderConjugationTable('Imperfect Tense (Imparfait)', conjugationData.imperfect)}
            {renderConjugationTable('Future Tense (Futur Simple)', conjugationData.future)}
            {renderConjugationTable('Conditional Tense (Conditionnel)', conjugationData.conditional)}
            {renderConjugationTable('Present Subjunctive (Subjonctif Présent)', conjugationData.presentSubjunctive)}
          </div>
        )}
      </div>
    </div>
  );
}

