import { type BodyMarkings, type EmotionResult } from '@/types/bodyMap';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Body Mapping endpoints
  async createBodyMapping(sessionId: string, sensations: Array<{
    body_region: string;
    sensation_type: string;
    view: string;
  }>): Promise<any> {
    return this.request('/body-mappings/', {
      method: 'POST',
      body: JSON.stringify({
        session_id: sessionId,
        sensations,
      }),
    });
  }

  async getBodyMapping(mappingId: number): Promise<any> {
    return this.request(`/body-mappings/${mappingId}`);
  }

  async getBodyMappingBySession(sessionId: string): Promise<any> {
    return this.request(`/body-mappings/session/${sessionId}`);
  }

  async updateBodyMapping(mappingId: number, sensations: Array<{
    body_region: string;
    sensation_type: string;
    view: string;
  }>): Promise<any> {
    return this.request(`/body-mappings/${mappingId}`, {
      method: 'PUT',
      body: JSON.stringify({
        sensations,
      }),
    });
  }

  async deleteBodyMapping(mappingId: number): Promise<any> {
    return this.request(`/body-mappings/${mappingId}`, {
      method: 'DELETE',
    });
  }

  // Emotion Analysis endpoints
  async analyzeEmotions(markings: BodyMarkings): Promise<EmotionResult[]> {
    return this.request('/emotions/analyze', {
      method: 'POST',
      body: JSON.stringify(markings),
    });
  }

  async analyzeEmotionsFromMapping(mappingId: number): Promise<EmotionResult[]> {
    return this.request(`/emotions/body-mapping/${mappingId}`);
  }

  async analyzeEmotionsFromSession(sessionId: string): Promise<EmotionResult[]> {
    return this.request(`/emotions/session/${sessionId}`);
  }

  async getEmotionPatterns(): Promise<any> {
    return this.request('/emotions/patterns');
  }

  async getSensationTypes(): Promise<any> {
    return this.request('/emotions/sensations');
  }

  // Health check
  async healthCheck(): Promise<any> {
    return this.request('/health');
  }
}

// Create and export a singleton instance
export const apiService = new ApiService();

// Export the class for testing or custom instances
export { ApiService };
