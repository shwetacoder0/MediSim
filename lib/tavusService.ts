// Tavus Conversational AI Service
export interface TavusConfig {
  apiKey: string;
  replicaId: string;
  personaId?: string;
  baseUrl: string;
}

export interface ConversationSession {
  conversationId: string;
  conversationUrl: string;
  status: 'connecting' | 'connected' | 'disconnected' | 'error';
}

export interface CreatePersonaRequest {
  persona_name: string;
  system_prompt: string;
  context: string;
  layers: {
    llm: {
      model: string;
    };
  };
}

export interface CreateConversationRequest {
  persona_id: string;
  replica_id: string;
  conversation_name: string;
  conversational_context?: string;
  properties: {
    max_call_duration: number;
    language: string;
  };
}

export class TavusService {
  private config: TavusConfig;

  constructor(config: TavusConfig) {
    this.config = config;
  }

  /**
   * Create a doctor persona (one-time setup)
   * This should be done once and the persona_id stored for reuse
   */
  async createDoctorPersona(): Promise<string> {
    try {
      const personaData: CreatePersonaRequest = {
        persona_name: "AI Medical Assistant",
        system_prompt: `You are Dr. Sarah, a compassionate and knowledgeable medical assistant. You provide helpful medical information and guidance while maintaining a professional, caring bedside manner. 

Key guidelines:
- Always be empathetic and understanding
- Explain medical terms in simple language
- Remind users to consult their healthcare provider for serious concerns
- Stay within your scope as an AI assistant
- Be encouraging and supportive
- Keep responses concise but thorough

You can discuss:
- General health questions
- Symptom explanations
- Medication information
- Lifestyle recommendations
- When to seek medical care
- Preventive health measures

You cannot:
- Provide specific diagnoses
- Prescribe medications
- Replace professional medical advice
- Access patient medical records`,
        context: `You have extensive medical knowledge and experience in general practice. You can discuss common health issues, medications, preventive care, and when patients should seek immediate medical attention. You maintain a warm, professional demeanor and always prioritize patient safety by recommending professional medical consultation when appropriate.`,
        layers: {
          llm: {
            model: "tavus-gpt-4o"
          }
        }
      };

      const response = await fetch(`${this.config.baseUrl}/v2/personas`, {
        method: 'POST',
        headers: {
          'x-api-key': this.config.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(personaData),
      });

      if (!response.ok) {
        throw new Error(`Tavus Persona API error: ${response.status}`);
      }

      const data = await response.json();
      return data.persona_id;
    } catch (error) {
      console.error('Error creating Tavus persona:', error);
      throw error;
    }
  }

  /**
   * Start a new conversation with the AI doctor
   */
  async startConversation(patientContext?: string): Promise<ConversationSession> {
    try {
      if (!this.config.personaId) {
        throw new Error('Persona ID not configured. Please create a persona first.');
      }

      const conversationData: CreateConversationRequest = {
        persona_id: this.config.personaId,
        replica_id: this.config.replicaId,
        conversation_name: `Medical Consultation - ${new Date().toISOString()}`,
        conversational_context: patientContext || "Patient is seeking general medical guidance and health information.",
        properties: {
          max_call_duration: 1800, // 30 minutes
          language: "multilingual"
        }
      };

      const response = await fetch(`${this.config.baseUrl}/v2/conversations`, {
        method: 'POST',
        headers: {
          'x-api-key': this.config.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(conversationData),
      });

      if (!response.ok) {
        throw new Error(`Tavus Conversation API error: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        conversationId: data.conversation_id,
        conversationUrl: data.conversation_url,
        status: 'connecting',
      };
    } catch (error) {
      console.error('Error starting Tavus conversation:', error);
      throw error;
    }
  }

  /**
   * End the conversation session
   */
  async endConversation(conversationId: string): Promise<void> {
    try {
      await fetch(`${this.config.baseUrl}/v2/conversations/${conversationId}/end`, {
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
  async getConversationStatus(conversationId: string): Promise<ConversationSession> {
    try {
      const response = await fetch(`${this.config.baseUrl}/v2/conversations/${conversationId}`, {
        headers: {
          'x-api-key': this.config.apiKey,
        },
      });

      const data = await response.json();
      
      return {
        conversationId,
        conversationUrl: data.conversation_url,
        status: data.status,
      };
    } catch (error) {
      console.error('Error getting conversation status:', error);
      throw error;
    }
  }
}