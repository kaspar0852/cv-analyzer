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

// Interview Prep Types
export interface InterviewQuestion {
  id: string;
  question: string;
  context: string;
  aiStrategy: string;
  difficulty: 'easy' | 'medium' | 'hard';
  isGapQuestion: boolean;
}

export interface InterviewSession {
  questions: InterviewQuestion[];
  currentIndex: number;
  completedCount: number;
}

// Learning Path Types
export interface LearningResource {
  id: string;
  title: string;
  url: string;
  type: 'docs' | 'video' | 'course' | 'article';
}

export interface Concept {
  id: string;
  name: string;
  description: string;
  resources: LearningResource[];
  learned: boolean;
}

export interface LearningPath {
  id: string;
  skill: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDays: number;
  concepts: Concept[];
  progress: number;
}

// Salary Negotiation Types
export interface SalaryData {
  position: string;
  location: string;
  currency: string;
  min: number;
  median: number;
  max: number;
}

export interface NegotiationMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export interface NegotiationFeedback {
  score: number;
  reasoning: string;
  tips: string[];
}
