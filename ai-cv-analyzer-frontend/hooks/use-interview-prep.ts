'use client';

import { create } from 'zustand';
import { InterviewQuestion, CVAnalysisResult } from '@/lib/types';
import { getMockInterviewQuestions } from '@/lib/interview-data';

interface InterviewPrepStore {
  questions: InterviewQuestion[];
  currentIndex: number;
  isLoading: boolean;
  error: string | null;
  loadQuestions: (cvResult: CVAnalysisResult) => Promise<void>;
  nextQuestion: () => void;
  prevQuestion: () => void;
  getCurrentQuestion: () => InterviewQuestion | null;
  getProgress: () => { current: number; total: number };
  reset: () => void;
}

export const useInterviewPrep = create<InterviewPrepStore>((set, get) => ({
  questions: [],
  currentIndex: 0,
  isLoading: false,
  error: null,

  loadQuestions: async (cvResult: CVAnalysisResult) => {
    set({ isLoading: true, error: null });
    try {
      const questions = await getMockInterviewQuestions(cvResult);
      set({ questions, currentIndex: 0, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load questions',
        isLoading: false 
      });
    }
  },

  nextQuestion: () => {
    const { questions, currentIndex } = get();
    if (currentIndex < questions.length - 1) {
      set({ currentIndex: currentIndex + 1 });
    }
  },

  prevQuestion: () => {
    const { currentIndex } = get();
    if (currentIndex > 0) {
      set({ currentIndex: currentIndex - 1 });
    }
  },

  getCurrentQuestion: () => {
    const { questions, currentIndex } = get();
    return questions[currentIndex] || null;
  },

  getProgress: () => {
    const { questions, currentIndex } = get();
    return {
      current: currentIndex + 1,
      total: questions.length,
    };
  },

  reset: () => {
    set({ questions: [], currentIndex: 0, isLoading: false, error: null });
  },
}));
