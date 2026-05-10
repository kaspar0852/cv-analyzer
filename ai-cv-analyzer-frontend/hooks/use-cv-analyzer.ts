'use client';

import { create } from 'zustand';
import { UploadState, CVAnalysisResult } from '@/lib/types';
import { cvApiClient } from '@/lib/api-client';

interface CVAnalyzerStore extends UploadState {
  setFile: (file: File | null) => void;
  setError: (error: string | null) => void;
  setProgress: (progress: number) => void;
  setLoading: (loading: boolean) => void;
  setResult: (result: CVAnalysisResult | null) => void;
  uploadFile: (file: File) => Promise<void>;
  resetState: () => void;
}

const initialState: UploadState = {
  file: null,
  isLoading: false,
  progress: 0,
  error: null,
  result: null,
  hasUploaded: false,
};

export const useCVAnalyzer = create<CVAnalyzerStore>((set) => ({
  ...initialState,

  setFile: (file) => set({ file }),

  setError: (error) => set({ error }),

  setProgress: (progress) => set({ progress }),

  setLoading: (isLoading) => set({ isLoading }),

  setResult: (result) => set({ result }),

  uploadFile: async (file: File) => {
    set({ isLoading: true, error: null, progress: 0 });

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        set((state) => ({
          progress: Math.min(state.progress + 10, 90),
        }));
      }, 200);

      const result = await cvApiClient.uploadCV(file);

      clearInterval(progressInterval);
      set({
        result,
        progress: 100,
        isLoading: false,
        hasUploaded: true,
        file,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to upload CV',
        isLoading: false,
        progress: 0,
      });
    }
  },

  resetState: () => set(initialState),
}));
