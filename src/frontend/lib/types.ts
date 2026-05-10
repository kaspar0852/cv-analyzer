export interface CVAnalysisResult {
  score: number;
  feedback: FeedbackItem[];
  recommendations: string[];
  keywords: string[];
  atsTips: ATSTip[];
  strengths: string[];
  weaknesses: string[];
}

export interface FeedbackItem {
  category: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

export interface ATSTip {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

export interface UploadState {
  file: File | null;
  isLoading: boolean;
  progress: number;
  error: string | null;
  result: CVAnalysisResult | null;
  hasUploaded: boolean;
}

export interface ApiResponse {
  success: boolean;
  data?: CVAnalysisResult;
  error?: string;
}
