// Tavus Conversational AI Service
export interface TavusConfig {
  apiKey: string;
  replicaId: string;
  baseUrl: string;
}

export interface ConversationSession {
  sessionId: string;
  status: 'connecting' | 'connected' | 'disconnected' | 'error';
  videoUrl?: string;
}

export class TavusService {
  private config: TavusConfig;

  constructor(config: TavusConfig) {
    this.config = config;
  }

  /**
   * Start a new conversation session with the AI doctor
   */
  async startConversation(): Promise<ConversationSession> {
    try {
      const response = await fetch(`${this.config.baseUrl}/v2/conversations`, {
        method: 'POST',
        headers: {
          'x-api-key': this.config.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          replica_id: this.config.replicaId,
          conversation_name: `medical_consultation_${Date.now()}`,
          callback_url: 'your_webhook_url', // Optional
          properties: {
            max_duration: 1800, // 30 minutes
            language: 'en',
            voice_settings: {
              stability: 0.8,
              similarity_boost: 0.8,
            }
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`Tavus API error: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        sessionId: data.conversation_id,
        status: 'connecting',
        videoUrl: data.conversation_url,
      };
    } catch (error) {
      console.error('Error starting Tavus conversation:', error);
      throw error;
    }
  }

  /**
   * End the conversation session
   */
  async endConversation(sessionId: string): Promise<void> {
    try {
      await fetch(`${this.config.baseUrl}/v2/conversations/${sessionId}/end`, {
        method: 'POST',
        headers: {
          'x-api-key': this.config.apiKey,
        },
      });
    } catch (error) {
      console.error('Error ending conversation:', error);
      throw error;
    }
  }

  /**
   * Get conversation status
   */
  async getConversationStatus(sessionId: string): Promise<ConversationSession> {
    try {
      const response = await fetch(`${this.config.baseUrl}/v2/conversations/${sessionId}`, {
        headers: {
          'x-api-key': this.config.apiKey,
        },
      });

      const data = await response.json();
      
      return {
        sessionId,
        status: data.status,
        videoUrl: data.conversation_url,
      };
    } catch (error) {
      console.error('Error getting conversation status:', error);
      throw error;
    }
  }
}