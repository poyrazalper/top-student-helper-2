import React from 'react';

export interface TopicInfo {
  name: string;
  description: string;
  icon: (props: { className?: string }) => React.JSX.Element;
  subTopics: { name: string }[];
}

export interface TopicCategory {
  categoryName: 'English' | 'Math';
  icon: (props: { className?: string }) => React.JSX.Element;
  topics: TopicInfo[];
}

export interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  topic: string;
  subTopic?: string;
  category?: 'Math' | 'English';
  passage?: string;
}

export interface IncorrectQuestion {
  question: Question;
  userAnswer: string;
  timestamp: number;
  source: 'Mock Test' | 'Question Bank' | 'Flashcard';
}

export interface UserProfile {
  level: number;
  xp: number;
  xpToNextLevel: number;
  avatarId?: number;
  dreamScore?: number;
  completedTasks?: string[];
}

export interface TestResult {
  testType: 'Quick' | 'Full Simulation' | 'Retake';
  totalScore: number;
  englishScore: number;
  mathScore: number;
  answers: {
    question: Question;
    isCorrect: boolean;
    userAnswer: string | null;
  }[];
  duration: number; // in seconds
  timestamp: number;
}

export interface Flashcard {
  word: string;
  definition: string;
  sentence: string;
  options: string[]; // for the quiz part of the card
}

export interface FlashcardResult {
    score: number;
    total: number;
    timestamp: number;
}

export interface StructuredLesson {
  introduction: string;
  keyConcepts: {
    title: string;
    content: string;
  }[];
  workedExample: {
    problem: string;
    solution: string;
  };
  commonMistakes: {
    mistake: string;
    correction: string;
  }[];
  conceptCheckQuestion: Question;
}

export interface Task {
    id: string;
    description: string;
    xp: number;
    isCompleted: (profile: UserProfile, testHistory: TestResult[], flashcardHistory: FlashcardResult[]) => boolean;
}


export type Page = 'topics' | 'question-bank' | 'mock-test' | 'results' | 'error-log' | 'flashcards' | 'profile' | 'sub-topics' | 'lesson' | 'placement-quiz' | 'statistics' | 'settings';