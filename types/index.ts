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
