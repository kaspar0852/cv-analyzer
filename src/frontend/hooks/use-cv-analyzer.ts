'use client';

import { create } from 'zustand';
import { cvApiClient } from '@/lib/api-client';

import * as signalR from '@microsoft/signalr';

interface CVAnalyzerStore {
  file: File | null;
  isLoading: boolean;
  statusText: string;
  progress: number;
  error: string | null;
  result: any | null;
  hasUploaded: boolean;
  
  setError: (error: string | null) => void;
  uploadFile: (file: File) => Promise<void>;
  resetState: () => void;
}

export const useCVAnalyzer = create<CVAnalyzerStore>((set) => ({
  file: null,
  isLoading: false,
  statusText: '',
  progress: 0,
  error: null,
  result: null,
  hasUploaded: false,

  setError: (error) => set({ error }),

  uploadFile: async (file: File) => {
    set({ isLoading: true, error: null, progress: 10, statusText: 'Uploading CV...' });

    try {
      // 1. Upload
      const uploadId = await cvApiClient.uploadCV(file);
      set({ progress: 30, statusText: 'File received. Starting AI extraction...' });

      // 2. Poll for results (Long Polling with 15-minute timeout)
      let isDone = false;
      let attempts = 0;
      const maxAttempts = 300; // 15 minutes max (300 * 3s)

      while (!isDone && attempts < maxAttempts) {
        attempts++;
        const summary = await cvApiClient.checkStatus(uploadId);
        
        if (summary.status === 'Completed') {
          isDone = true;
          set({ progress: 80, statusText: 'Analysis complete! Fetching deep insights...' });
        } else if (summary.status === 'Failed') {
          throw new Error('AI Analysis failed. Please check the logs.');
        } else {
          // Update status text based on time passed to keep user engaged
          if (attempts < 10) set({ statusText: 'AI is extracting text and context...' });
          else if (attempts < 40) set({ statusText: 'Scoring against industry standards...' });
          else if (attempts < 80) set({ statusText: 'Running ATS compatibility checks...' });
          else if (attempts < 120) set({ statusText: 'Generating salary & career insights...' });
          else set({ statusText: 'Almost there! Finalizing the 7-stage report...' });
          
          await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 seconds
        }
      }

      // 3. Fetch Full Report
      const fullReport = await cvApiClient.getFullReport(uploadId);
      
      set({
        result: fullReport,
        progress: 100,
        isLoading: false,
        statusText: 'Analysis Ready!',
        hasUploaded: true,
        file,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to analyze CV',
        isLoading: false,
        statusText: '',
        progress: 0,
      });
    }
  },

  resetState: () => set({
    file: null,
    isLoading: false,
    statusText: '',
    progress: 0,
    error: null,
    result: null,
    hasUploaded: false,
  }),
}));
