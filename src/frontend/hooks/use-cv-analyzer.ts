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
  loadAnalysis: (uploadId: string) => Promise<void>;
  resetState: () => void;
  updateInterviewPrep: (prepJson: string) => void;
}

let connection: signalR.HubConnection | null = null;

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
      setupAnalysisSignalR(uploadId);
      set({ progress: 30, statusText: 'File received. Starting AI extraction...' });

      // 2. Poll for results (Long Polling with 15-minute timeout)
      let isDone = false;
      let attempts = 0;
      const maxAttempts = 300; // 15 minutes max (300 * 3s)

      while (!isDone && attempts < maxAttempts) {
        attempts++;
        const summary = await cvApiClient.checkStatus(uploadId);
        
        if (summary.status === 'Completed' || summary.status === 'FullyCompleted') {
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

  loadAnalysis: async (uploadId: string) => {
    set({ isLoading: true, error: null, progress: 50, statusText: 'Fetching your analysis...' });
    try {
      const fullReport = await cvApiClient.getFullReport(uploadId);
      set({
        result: fullReport,
        progress: 100,
        isLoading: false,
        statusText: 'Analysis Loaded!',
        hasUploaded: true,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to load analysis',
        isLoading: false,
        statusText: '',
        progress: 0,
      });
    }
  },

  resetState: () => {
    if (connection) {
      connection.stop();
      connection = null;
    }
    
    set({
      file: null,
      isLoading: false,
      statusText: '',
      progress: 0,
      error: null,
      result: null,
      hasUploaded: false,
    });
  },

  updateInterviewPrep: (prepJson: string) => {
    set((state) => {
      if (!state.result) return state;

      // Parse the JSON (AI might have sent it as a string)
      let parsedData = prepJson;
      try {
        if (typeof prepJson === 'string') {
          parsedData = JSON.parse(prepJson);
        }
      } catch (e) {
        console.error("Failed to parse Interview Prep JSON:", e);
      }

      // Merge into the results object
      return {
        result: {
          ...state.result,
          results: {
            ...state.result.results,
            interview_prep: parsedData
          }
        }
      };
    });
  },
}));

// Helper to setup SignalR for real-time background updates (Phase 2)
export const setupAnalysisSignalR = (uploadId: string) => {
  const { updateInterviewPrep } = useCVAnalyzer.getState();
  
  if (connection) connection.stop();

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  connection = new signalR.HubConnectionBuilder()
    .withUrl(`${apiUrl}/api/results/hub`)
    .withAutomaticReconnect()
    .build();

  connection.on("InterviewPrepReady", (prepJson: string) => {
    console.log("🚀 Real-time Update: Interview Prep is Ready!");
    updateInterviewPrep(prepJson);
  });

  connection.start()
    .then(() => {
      connection?.invoke("SubscribeToAnalysis", uploadId);
    })
    .catch(err => console.error("SignalR Connection Error: ", err));
};
