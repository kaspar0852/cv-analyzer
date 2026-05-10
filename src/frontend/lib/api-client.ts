import axios, { AxiosInstance } from 'axios';
import { CVAnalysisResult } from './types';

class CVAnalyzerApiClient {
  private client: AxiosInstance;
  private baseURL: string;

  constructor(baseURL: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080') {
    this.baseURL = baseURL;
    this.client = axios.create({
      baseURL: this.baseURL,
    });

    // Add interceptor to attach JWT token to every request if it exists
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  // --- AUTH ENDPOINTS ---
  
  async login(credentials: any): Promise<any> {
    const response = await this.client.post('/api/auth/login', credentials);
    return response.data;
  }

  async register(data: any): Promise<any> {
    const response = await this.client.post('/api/auth/register', data);
    return response.data;
  }

  // --- UPLOAD & ANALYSIS ---

  async uploadCV(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await this.client.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    
    return response.data.uploadId || response.data.id;
  }

  async checkStatus(uploadId: string): Promise<{ status: string, score?: number }> {
    try {
      const response = await this.client.get(`/api/results/${uploadId}`);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        return { status: "Processing" };
      }
      throw error;
    }
  }

  async getFullReport(uploadId: string): Promise<any> {
    const response = await this.client.get(`/api/results/${uploadId}/full-report`);
    return response.data;
  }

  // Fetch history for logged in users
  async getRecentAnalysis(): Promise<any[]> {
    const response = await this.client.get('/api/results');
    return response.data;
  }
}

export const cvApiClient = new CVAnalyzerApiClient();
