import { GOOGLE_VISION_CONFIG } from '../config/constants';
import * as FileSystem from 'expo-file-system';

export interface OCRResult {
  text: string;
  confidence: number;
  boundingBoxes?: Array<{
    text: string;
    vertices: Array<{ x: number; y: number }>;
  }>;
}

export class GoogleVisionService {
  /**
   * Convert image file to base64 for Google Vision API
   */
  private static async imageToBase64(imageUri: string): Promise<string> {
    try {
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return base64;
    } catch (error) {
      console.error('Error converting image to base64:', error);
      throw new Error('Failed to process image file');
    }
  }

  /**
   * Extract text from image using Google Vision API
   */
  static async extractTextFromImage(imageUri: string): Promise<OCRResult> {
    try {
      console.log('Starting OCR with Google Vision API...');

      // Convert image to base64
      const base64Image = await this.imageToBase64(imageUri);

      // Prepare the request payload
      const requestPayload = {
        requests: [
          {
            image: {
              content: base64Image
            },
            features: [
              {
                type: 'TEXT_DETECTION',
                maxResults: 1
              },
              {
                type: 'DOCUMENT_TEXT_DETECTION',
                maxResults: 1
              }
            ],
            imageContext: {
              languageHints: ['en'] // Primarily English medical reports
            }
          }
        ]
      };

      // Make API request to Google Vision
      const response = await fetch(
        `${GOOGLE_VISION_CONFIG.BASE_URL}?key=${GOOGLE_VISION_CONFIG.API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestPayload)
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Google Vision API error:', errorData);
        throw new Error(`Google Vision API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      console.log('Google Vision API response received');

      // Extract text from response
      const annotations = data.responses[0];
      
      if (!annotations || annotations.error) {
        throw new Error(`Vision API error: ${annotations?.error?.message || 'No text detected'}`);
      }

      // Get full text annotation (best for documents)
      const fullTextAnnotation = annotations.fullTextAnnotation;
      const textAnnotations = annotations.textAnnotations;

      let extractedText = '';
      let confidence = 0;
      const boundingBoxes: Array<{
        text: string;
        vertices: Array<{ x: number; y: number }>;
      }> = [];

      if (fullTextAnnotation) {
        // Use full text annotation for better document structure
        extractedText = fullTextAnnotation.text;
        
        // Calculate average confidence from pages
        if (fullTextAnnotation.pages && fullTextAnnotation.pages.length > 0) {
          const totalConfidence = fullTextAnnotation.pages.reduce((sum: number, page: any) => {
            return sum + (page.confidence || 0);
          }, 0);
          confidence = totalConfidence / fullTextAnnotation.pages.length;
        }
      } else if (textAnnotations && textAnnotations.length > 0) {
        // Fallback to text annotations
        extractedText = textAnnotations[0].description;
        confidence = textAnnotations[0].score || 0.8;

        // Extract bounding boxes for individual text elements
        textAnnotations.slice(1).forEach((annotation: any) => {
          if (annotation.boundingPoly && annotation.boundingPoly.vertices) {
            boundingBoxes.push({
              text: annotation.description,
              vertices: annotation.boundingPoly.vertices
            });
          }
        });
      }

      if (!extractedText || extractedText.trim().length === 0) {
        throw new Error('No text could be extracted from the image');
      }

      console.log(`OCR completed. Extracted ${extractedText.length} characters with confidence: ${confidence}`);

      return {
        text: extractedText.trim(),
        confidence: confidence,
        boundingBoxes: boundingBoxes.length > 0 ? boundingBoxes : undefined
      };

    } catch (error) {
      console.error('Error in Google Vision OCR:', error);
      
      // If API fails, provide a helpful error message
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          throw new Error('Google Vision API key is invalid or missing. Please check your configuration.');
        } else if (error.message.includes('quota')) {
          throw new Error('Google Vision API quota exceeded. Please try again later.');
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          throw new Error('Network error. Please check your internet connection and try again.');
        }
      }
      
      throw new Error(`OCR failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Validate if the extracted text looks like a medical report
   */
  static validateMedicalReport(text: string): {
    isValid: boolean;
    confidence: number;
    detectedType?: string;
  } {
    const medicalKeywords = [
      'patient', 'diagnosis', 'findings', 'impression', 'recommendation',
      'clinical', 'medical', 'report', 'examination', 'study', 'scan',
      'mri', 'ct', 'x-ray', 'ultrasound', 'blood', 'test', 'result',
      'normal', 'abnormal', 'within limits', 'doctor', 'physician',
      'hospital', 'clinic', 'radiology', 'pathology', 'laboratory'
    ];

    const reportTypes = [
      { keywords: ['mri', 'magnetic resonance'], type: 'MRI' },
      { keywords: ['ct', 'computed tomography', 'cat scan'], type: 'CT Scan' },
      { keywords: ['x-ray', 'radiograph', 'chest film'], type: 'X-Ray' },
      { keywords: ['ultrasound', 'sonogram', 'echo'], type: 'Ultrasound' },
      { keywords: ['blood', 'lab', 'laboratory', 'cbc', 'chemistry'], type: 'Blood Test' },
      { keywords: ['pathology', 'biopsy', 'tissue'], type: 'Pathology' }
    ];

    const lowerText = text.toLowerCase();
    
    // Count medical keywords
    const foundKeywords = medicalKeywords.filter(keyword => 
      lowerText.includes(keyword)
    );

    // Detect report type
    let detectedType: string | undefined;
    for (const reportType of reportTypes) {
      if (reportType.keywords.some(keyword => lowerText.includes(keyword))) {
        detectedType = reportType.type;
        break;
      }
    }

    // Calculate confidence based on keyword density and structure
    const keywordDensity = foundKeywords.length / medicalKeywords.length;
    const hasStructure = lowerText.includes('findings') || lowerText.includes('impression');
    const hasPatientInfo = lowerText.includes('patient') || lowerText.includes('name');
    
    let confidence = keywordDensity * 0.6;
    if (hasStructure) confidence += 0.2;
    if (hasPatientInfo) confidence += 0.1;
    if (detectedType) confidence += 0.1;

    return {
      isValid: confidence > 0.3, // Threshold for medical report
      confidence: Math.min(confidence, 1.0),
      detectedType
    };
  }

  /**
   * Clean and preprocess extracted text for better analysis
   */
  static preprocessMedicalText(text: string): string {
    // Remove excessive whitespace and normalize line breaks
    let cleaned = text.replace(/\s+/g, ' ').trim();
    
    // Fix common OCR errors in medical terms
    const corrections = [
      { from: /\bpatient\b/gi, to: 'patient' },
      { from: /\bfindings\b/gi, to: 'findings' },
      { from: /\bimpression\b/gi, to: 'impression' },
      { from: /\bnormal\b/gi, to: 'normal' },
      { from: /\babnormal\b/gi, to: 'abnormal' },
      { from: /\bmm\b/gi, to: 'mm' },
      { from: /\bcm\b/gi, to: 'cm' },
      { from: /\bml\b/gi, to: 'ml' },
      { from: /\bmg\b/gi, to: 'mg' }
    ];

    corrections.forEach(correction => {
      cleaned = cleaned.replace(correction.from, correction.to);
    });

    // Restore proper paragraph structure
    cleaned = cleaned.replace(/\. ([A-Z])/g, '.\n\n$1');
    
    return cleaned;
  }
}