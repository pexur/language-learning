'use client';

import { useState } from 'react';
import { Word, Phrase } from '@/types';
import WordsReviewTable from './WordsReviewTable';
import PhrasesReviewTable from './PhrasesReviewTable';

type TableView = 'words' | 'phrases';

interface VocabularyViewProps {
  activeView: TableView;
  words: Word[];
  phrases: Phrase[];
  maxDefinitions: number;
  onAddWord: (text: string) => void;
  onAddPhrase: (text: string) => void;
  onDeleteWord: (id: string) => void;
  onDeletePhrase: (id: string) => void;
}

export default function VocabularyView({
  activeView,
  words,
  phrases,
  maxDefinitions,
  onAddWord,
  onAddPhrase,
  onDeleteWord,
  onDeletePhrase,
}: VocabularyViewProps) {
  const [newText, setNewText] = useState('');

  if (activeView === 'words') {
    return (
      <WordsReviewTable
        words={words}
        maxDefinitions={maxDefinitions}
        newText={newText}
        setNewText={setNewText}
        onAddWord={onAddWord}
        onDeleteWord={onDeleteWord}
      />
    );
  } else {
    return (
      <PhrasesReviewTable
        phrases={phrases}
        newText={newText}
        setNewText={setNewText}
        onAddPhrase={onAddPhrase}
        onDeletePhrase={onDeletePhrase}
      />
    );
  }
}

