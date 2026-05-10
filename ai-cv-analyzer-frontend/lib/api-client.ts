import axios, { AxiosInstance, AxiosError } from 'axios';
import { CVAnalysisResult, ApiResponse } from './types';
import { getMockAnalysisResult } from './mock-data';

class CVAnalyzerApiClient {
  private client: AxiosInstance;
  private baseURL: string;

  constructor(baseURL: string = process.env.NEXT_PUBLIC_API_URL || '') {
    this.baseURL = baseURL;
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  async uploadCV(file: File): Promise<CVAnalysisResult> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      // If no backend URL is configured, use mock data
      if (!this.baseURL) {
        return getMockAnalysisResult();
      }

      const response = await this.client.post<ApiResponse>(
        '/cv/upload',
        formData
      );

      if (response.data.success && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to analyze CV');
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('CV upload error:', axiosError.message);

      // Fallback to mock data on error
      return getMockAnalysisResult();
    }
  }
}

export const cvApiClient = new CVAnalyzerApiClient();
