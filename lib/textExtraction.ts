// Text extraction utilities for medical reports
import { GoogleVisionService, OCRResult } from './googleVision';
import { PDFExtractionService, PDFExtractionResult } from './pdfExtraction';

export interface ExtractedText {
  text: string;
  confidence: number;
  extractionMethod: 'ocr' | 'pdf-direct' | 'pdf-ocr';
  metadata?: {
    pageCount?: number;
    language?: string;
    format?: string;
    detectedType?: string;
    isValidMedical?: boolean;
  };
}

export class TextExtractionService {
  /**
   * Extract text from an image using Google Vision OCR
   */
  static async extractFromImage(imageUri: string): Promise<ExtractedText> {
    try {
      console.log('Starting image text extraction with Google Vision...');

      // Use Google Vision API for OCR
      const ocrResult: OCRResult = await GoogleVisionService.extractTextFromImage(imageUri);

      // Validate if it's a medical report
      const validation = GoogleVisionService.validateMedicalReport(ocrResult.text);

      // Preprocess the text for better analysis
      const cleanedText = GoogleVisionService.preprocessMedicalText(ocrResult.text);

      console.log(`Image OCR completed. Confidence: ${ocrResult.confidence}, Medical validation: ${validation.confidence}`);

      return {
        text: cleanedText,
        confidence: ocrResult.confidence,
        extractionMethod: 'ocr',
        metadata: {
          format: 'image',
          language: 'en',
          detectedType: validation.detectedType,
          isValidMedical: validation.isValid
        }
      };
    } catch (error) {
      console.error('Error extracting text from image:', error);
      
      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          throw new Error('Google Vision API configuration error. Please check your API key.');
        } else if (error.message.includes('quota')) {
          throw new Error('OCR service quota exceeded. Please try again later.');
        } else if (error.message.includes('No text')) {
          throw new Error('No readable text found in the image. Please ensure the image is clear and contains text.');
        }
      }
      
      throw new Error(`Failed to extract text from image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Extract text from a PDF document
   */
  static async extractFromPDF(pdfUri: string): Promise<ExtractedText> {
    try {
      console.log('Starting PDF text extraction...');

      // Use PDF extraction service
      const pdfResult: PDFExtractionResult = await PDFExtractionService.extractTextFromPDF(pdfUri);

      // Validate if it's a medical document
      const validation = PDFExtractionService.validateMedicalPDF(pdfResult.text);

      // Preprocess the text
      const cleanedText = GoogleVisionService.preprocessMedicalText(pdfResult.text);

      console.log(`PDF extraction completed. Method: ${pdfResult.extractionMethod}, Confidence: ${pdfResult.confidence}`);

      return {
        text: cleanedText,
        confidence: pdfResult.confidence,
        extractionMethod: pdfResult.extractionMethod === 'direct' ? 'pdf-direct' : 'pdf-ocr',
        metadata: {
          pageCount: pdfResult.pageCount,
          format: 'pdf',
          language: 'en',
          isValidMedical: validation.isValid
        }
      };
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      throw new Error(`Failed to extract text from PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Determine the best extraction method based on file type and extract text
   */
  static async extractText(fileUri: string, mimeType: string): Promise<ExtractedText> {
    try {
      console.log(`Starting text extraction for file type: ${mimeType}`);

      if (mimeType.startsWith('image/')) {
        return await this.extractFromImage(fileUri);
      } else if (mimeType === 'application/pdf') {
        return await this.extractFromPDF(fileUri);
      } else {
        throw new Error(`Unsupported file type: ${mimeType}. Please upload an image (JPG, PNG) or PDF file.`);
      }
    } catch (error) {
      console.error('Text extraction failed:', error);
      throw error;
    }
  }

  /**
   * Validate extracted text quality and provide feedback
   */
  static validateExtractedText(extractedText: ExtractedText): {
    isValid: boolean;
    issues: string[];
    suggestions: string[];
  } {
    const issues: string[] = [];
    const suggestions: string[] = [];

    // Check text length
    if (extractedText.text.length < 50) {
      issues.push('Very little text was extracted');
      suggestions.push('Ensure the image is clear and well-lit');
    }

    // Check confidence
    if (extractedText.confidence < 0.7) {
      issues.push('Low extraction confidence');
      suggestions.push('Try taking a clearer photo or scanning at higher resolution');
    }

    // Check if it looks like a medical report
    if (extractedText.metadata?.isValidMedical === false) {
      issues.push('Document may not be a medical report');
      suggestions.push('Please upload a medical report, lab result, or diagnostic image');
    }

    // Check for common OCR issues
    const hasLotsOfNumbers = (extractedText.text.match(/\d/g) || []).length > extractedText.text.length * 0.3;
    if (hasLotsOfNumbers && extractedText.confidence < 0.8) {
      issues.push('Document contains many numbers which may have OCR errors');
      suggestions.push('Double-check that numerical values are correctly interpreted');
    }

    return {
      isValid: issues.length === 0,
      issues,
      suggestions
    };
  }

  /**
   * Get extraction statistics for debugging
   */
  static getExtractionStats(extractedText: ExtractedText): {
    characterCount: number;
    wordCount: number;
    lineCount: number;
    confidence: number;
    method: string;
  } {
    const text = extractedText.text;
    
    return {
      characterCount: text.length,
      wordCount: text.split(/\s+/).filter(word => word.length > 0).length,
      lineCount: text.split('\n').length,
      confidence: extractedText.confidence,
      method: extractedText.extractionMethod
    };
  }
}