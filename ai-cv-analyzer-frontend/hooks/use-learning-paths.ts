'use client';

import { create } from 'zustand';
import { LearningPath, CVAnalysisResult } from '@/lib/types';
import { getMockLearningPaths } from '@/lib/learning-data';

interface LearningPathsStore {
  learningPaths: LearningPath[];
  selectedSkillId: string | null;
  isLoading: boolean;
  error: string | null;
  loadPaths: (cvResult: CVAnalysisResult) => Promise<void>;
  selectSkill: (skillId: string) => void;
  markConceptLearned: (skillId: string, conceptId: string) => void;
  getProgress: (skillId: string) => number;
  getOverallProgress: () => number;
  reset: () => void;
}

export const useLearningPaths = create<LearningPathsStore>((set, get) => ({
  learningPaths: [],
  selectedSkillId: null,
  isLoading: false,
  error: null,

  loadPaths: async (cvResult: CVAnalysisResult) => {
    set({ isLoading: true, error: null });
    try {
      const paths = await getMockLearningPaths(cvResult);
      set({
        learningPaths: paths,
        selectedSkillId: paths[0]?.id || null,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load learning paths',
        isLoading: false,
      });
    }
  },

  selectSkill: (skillId: string) => {
    set({ selectedSkillId: skillId });
  },

  markConceptLearned: (skillId: string, conceptId: string) => {
    set((state) => ({
      learningPaths: state.learningPaths.map((path) =>
        path.id === skillId
          ? {
              ...path,
              concepts: path.concepts.map((concept) =>
                concept.id === conceptId ? { ...concept, learned: true } : concept
              ),
              progress: path.concepts.filter((c) => c.learned).length / path.concepts.length,
            }
          : path
      ),
    }));
  },

  getProgress: (skillId: string): number => {
    const { learningPaths } = get();
    const path = learningPaths.find((p) => p.id === skillId);
    if (!path) return 0;
    const learnedCount = path.concepts.filter((c) => c.learned).length;
    return (learnedCount / path.concepts.length) * 100;
  },

  getOverallProgress: (): number => {
    const { learningPaths } = get();
    if (learningPaths.length === 0) return 0;
    const totalProgress = learningPaths.reduce((sum, path) => sum + path.progress, 0);
    return (totalProgress / learningPaths.length) * 100;
  },

  reset: () => {
    set({
      learningPaths: [],
      selectedSkillId: null,
      isLoading: false,
      error: null,
    });
  },
}));
