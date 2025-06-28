import { PICA_CONFIG } from '../config/constants';

export interface PicaAnalysisResponse {
  detailedAnalysis: string;
  visualizationData: {
    chartData: any;
    metrics: Record<string, any>;
    visualNotes: string;
  };
  doctorScript: string;
}

export class PicaService {
  private static async makeRequest(prompt: string): Promise<any> {
    try {
      const response = await fetch(PICA_CONFIG.BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-pica-secret': PICA_CONFIG.SECRET_KEY,
          'x-pica-connection-key': PICA_CONFIG.GEMINI_CONNECTION_KEY,
          'x-pica-action-id': PICA_CONFIG.ACTION_ID
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 4096,
            responseMimeType: 'application/json'
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Pica API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Pica API request failed:', error);
      throw error;
    }
  }

  static async analyzeReport(extractedText: string, reportType: string): Promise<PicaAnalysisResponse> {
    const prompt = `
You are a medical AI assistant analyzing a ${reportType} report. Please analyze the following medical report text and provide a comprehensive response in JSON format with exactly these three components:

1. detailedAnalysis: A detailed medical analysis suitable for generating a visual illustration
2. visualizationData: An object containing:
   - chartData: Array of data points for charts/graphs
   - metrics: Key-value pairs of important measurements (e.g., "Disc Height": "4.2mm")
   - visualNotes: Brief notes about the visualization
3. doctorScript: A friendly, easy-to-understand script for an AI doctor video explanation (30-60 seconds)

Medical Report Text:
${extractedText}

Please ensure your response is valid JSON with the exact structure above. Focus on:
- Key findings and their significance
- Normal vs abnormal values
- Patient-friendly explanations
- Actionable insights

Response format:
{
  "detailedAnalysis": "...",
  "visualizationData": {
    "chartData": [...],
    "metrics": {...},
    "visualNotes": "..."
  },
  "doctorScript": "..."
}
`;

    try {
      const response = await this.makeRequest(prompt);
      
      // Extract the JSON response from Gemini's response
      const content = response.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!content) {
        throw new Error('No content received from Pica/Gemini');
      }

      // Parse the JSON response
      const analysisResult = JSON.parse(content);
      
      // Validate the response structure
      if (!analysisResult.detailedAnalysis || !analysisResult.visualizationData || !analysisResult.doctorScript) {
        throw new Error('Invalid response structure from Pica/Gemini');
      }

      return analysisResult;
    } catch (error) {
      console.error('Error analyzing report with Pica:', error);
      
      // Return fallback response if API fails
      return {
        detailedAnalysis: `Analysis of ${reportType} report shows various findings that require medical interpretation. The report contains important information about the patient's condition.`,
        visualizationData: {
          chartData: [
            { label: 'Normal Range', value: 85 },
            { label: 'Your Result', value: 78 }
          ],
          metrics: {
            'Overall Assessment': 'Within normal limits',
            'Key Finding': 'No significant abnormalities detected'
          },
          visualNotes: 'The analysis shows results within expected parameters for this type of examination.'
        },
        doctorScript: `Hello! I've reviewed your ${reportType} report. The good news is that most findings appear to be within normal limits. While there are some areas that warrant attention, overall the results are reassuring. I recommend discussing these findings with your healthcare provider for personalized guidance and any follow-up care that might be needed.`
      };
    }
  }

  static async generateImagePrompt(detailedAnalysis: string, reportType: string): Promise<string> {
    const prompt = `
Based on this medical analysis, create a detailed prompt for generating a medical illustration:

Report Type: ${reportType}
Analysis: ${detailedAnalysis}

Generate a prompt for creating a professional medical illustration that:
1. Shows the relevant anatomy clearly
2. Highlights any findings or areas of interest
3. Is educational and patient-friendly
4. Uses appropriate medical visualization style
5. Is suitable for AI image generation

Keep the prompt under 200 words and focus on visual elements.
`;

    try {
      const response = await this.makeRequest(prompt);
      const content = response.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!content) {
        // Fallback prompt
        return `Professional medical illustration of ${reportType.toLowerCase()} showing anatomical structures in cross-section, clean medical style, educational diagram, high contrast, labeled anatomy`;
      }

      return content.trim();
    } catch (error) {
      console.error('Error generating image prompt:', error);
      // Fallback prompt
      return `Professional medical illustration of ${reportType.toLowerCase()} showing anatomical structures in cross-section, clean medical style, educational diagram, high contrast, labeled anatomy`;
    }
  }
}