'use client';

import { create } from 'zustand';
import { NegotiationMessage, SalaryData, CVAnalysisResult } from '@/lib/types';
import { generateSalaryData, generateInitialOffer, getMockAIResponse } from '@/lib/salary-data';

interface NegotiationStore {
  messages: NegotiationMessage[];
  salaryData: SalaryData | null;
  isLoading: boolean;
  error: string | null;
  sessionActive: boolean;
  initializeScenario: (cvResult: CVAnalysisResult) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  getValuePropositions: (cvResult: CVAnalysisResult) => string[];
  reset: () => void;
}

export const useNegotiation = create<NegotiationStore>((set, get) => ({
  messages: [],
  salaryData: null,
  isLoading: false,
  error: null,
  sessionActive: false,

  initializeScenario: async (cvResult: CVAnalysisResult) => {
    set({ isLoading: true, error: null });
    try {
      const salaryData = generateSalaryData(cvResult);
      const initialOffer = generateInitialOffer(salaryData);
      
      set({
        salaryData,
        messages: [initialOffer],
        sessionActive: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to initialize negotiation',
        isLoading: false,
      });
    }
  },

  sendMessage: async (content: string) => {
    const { messages, salaryData } = get();
    
    if (!salaryData) return;

    // Add user message
    const userMessage: NegotiationMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    set({ messages: [...messages, userMessage], isLoading: true });

    try {
      // Get AI response
      const aiResponse = await getMockAIResponse(content, salaryData);
      set((state) => ({
        messages: [...state.messages, aiResponse],
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to get AI response',
        isLoading: false,
      });
    }
  },

  getValuePropositions: (cvResult: CVAnalysisResult): string[] => {
    return [
      `Deep expertise in ${cvResult.keywords[0]} and ${cvResult.keywords[1]} with proven track record`,
      `Ability to lead system design and architecture discussions (scoring ${cvResult.score}/100 on CV assessment)`,
      `Demonstrated impact through quantifiable achievements and strong technical fundamentals`,
      `Continuous learner committed to staying at the forefront of industry trends`,
      `Strong communication skills with ability to mentor and collaborate across teams`,
    ];
  },

  reset: () => {
    set({
      messages: [],
      salaryData: null,
      isLoading: false,
      error: null,
      sessionActive: false,
    });
  },
}));
