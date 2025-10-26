export interface Definition {
  id: string;
  meaning: string;
  example: string;
}

export interface Word {
  wordId: string;
  userId?: string;
  text: string;
  translation?: string;
  wordType?: string;
  gender?: string;
  definitions?: Definition[];
  isTranslating?: boolean;
  createdAt: number;
  updatedAt?: number;
}

export interface Phrase {
  phraseId: string;
  userId?: string;
  text: string;
  translation?: string;
  isTranslating?: boolean;
  createdAt: number;
  updatedAt?: number;
}

export interface Exercise {
  id: string;
  type: 'word_to_target' | 'word_to_native' | 'sentence';
  question: string;
  correctAnswer: string;
  hint?: string;
}

export interface ExerciseSet {
  words: Exercise[]; // 10 exercises
  wordsReverse: Exercise[]; // 10 exercises
  sentences: Exercise[]; // 10 exercises with sentence structure
}

export interface ExerciseState {
  [exerciseId: string]: {
    userAnswer: string;
    isCorrect: boolean | null;
    showResult: boolean;
  };
}
