'use client';

import { Phrase } from '@/types';

interface PhrasesReviewTableProps {
  phrases: Phrase[];
  newText: string;
  setNewText: (text: string) => void;
  onAddPhrase: (text: string) => void;
  onDeletePhrase: (id: string) => void;
}

export default function PhrasesReviewTable({
  phrases,
  newText,
  setNewText,
  onAddPhrase,
  onDeletePhrase,
}: PhrasesReviewTableProps) {
  return (
    <div className="p-6">
      {/* Add New Phrase */}
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
              onAddPhrase(text);
            }
          }}
          placeholder="Enter a new phrase..."
          className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-purple-500 focus:outline-none transition-colors"
        />
        <button
          onClick={() => {
            const text = newText;
            setNewText('');
            onAddPhrase(text);
          }}
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
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Phrase
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Translation
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {phrases.map((phrase, index) => (
                <tr
                  key={phrase.phraseId}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
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

