'use client';

import { Word } from '@/types';

interface WordTypeTagProps {
  word: Word;
}

export default function WordTypeTag({ word }: WordTypeTagProps) {
  const getWordType = (word: Word) => {
    // First, try to use the wordType field if available
    if (word.wordType) {
      const type = word.wordType.toLowerCase();
      let displayType = type;

      // If it's a noun and we have gender information, add it
      if (type === 'noun' && word.gender) {
        displayType =
          word.gender === 'f'
            ? 'f.n.'
            : word.gender === 'm'
              ? 'm.n.'
              : type;
      }

      switch (type) {
        case 'noun':
          return {
            type: displayType,
            color:
              'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
          };
        case 'verb':
          return {
            type: 'verb',
            color:
              'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
          };
        case 'adjective':
          return {
            type: 'adjective',
            color:
              'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
          };
        case 'adverb':
          return {
            type: 'adverb',
            color:
              'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
          };
      }
    }

    // Fallback: detect from definition meaning
    if (!word.definitions || word.definitions.length === 0) {
      return {
        type: 'unknown',
        color:
          'bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-300',
      };
    }

    const firstDef = word.definitions[0];
    const meaning = firstDef.meaning.toLowerCase();

    let displayType = 'noun';
    if (meaning.includes('noun:')) {
      // Check if it's feminine or masculine in the meaning
      if (meaning.includes('(f)') || meaning.includes('feminine')) {
        displayType = 'f.n.';
      } else if (meaning.includes('(m)') || meaning.includes('masculine')) {
        displayType = 'm.n.';
      }
      return {
        type: displayType,
        color:
          'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
      };
    }
    if (meaning.includes('verb:')) {
      return {
        type: 'verb',
        color:
          'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
      };
    }
    if (meaning.includes('adjective:')) {
      return {
        type: 'adjective',
        color:
          'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
      };
    }
    if (meaning.includes('adverb:')) {
      return {
        type: 'adverb',
        color:
          'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
      };
    }

    return {
      type: 'other',
      color: 'bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-300',
    };
  };

  const { type, color } = getWordType(word);

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}
    >
      {type}
    </span>
  );
}

