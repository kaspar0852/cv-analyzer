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
  }

  // Step 1: Upload the file to the Upload Service
  async uploadCV(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    
    // Hits our Upload Service
    const response = await this.client.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    
    return response.data.uploadId || response.data.id; // Returns the UploadId
  }

  // Step 2: Poll the Results Service for status
  async checkStatus(uploadId: string): Promise<{ status: string, score?: number }> {
    try {
      // Hits our Results Service Dashboard via API Gateway
      const response = await this.client.get(`/api/results/${uploadId}`);
      return response.data; // { status: "Completed", overallScore: 85 }
    } catch (error: any) {
      // If the record isn't created in the Results Service yet, it returns 404.
      // We treat this as "Still Processing".
      if (error.response && error.response.status === 404) {
        return { status: "Processing" };
      }
      throw error;
    }
  }

  // Step 3: Fetch the deep 7-stage report from the source of truth
  async getFullReport(uploadId: string): Promise<any> {
    // Hits the Results Service's proxy via API Gateway
    const response = await this.client.get(`/api/results/${uploadId}/full-report`);
    return response.data;
  }
}

export const cvApiClient = new CVAnalyzerApiClient();
