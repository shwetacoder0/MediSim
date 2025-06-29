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

// Fixed OCR text for testing
const FIXED_OCR_TEXT = `EXAMINATION: CT STONOGRAM

CLINICAL INFORMATION: Right lower quadrant pain; hematuria; Pyuria

TECHNIQUE: Plain multislice axial CT images through the urinary tract were obtained with sagittal and coronal reconstructions in DICOM viewer.

The following findings were noted:

The right kidney measures 11.3 x 4.5 x 5.2 cm. while the left kidney measures 10.6 x 4.5 x 5.4. There is no opaque density or hydronephrosis in the right kidney.
There appears to be however an extra renal type of renal pelvis. There is a 0.2 cm (HU=+150) opaque density in the left kidney interpolar region with no hydronephrosis.

Both ureters are not dilated without opaque lithiasis. The urinary bladder is adequately filled with no intravesical filling defect.

The visualized liver, gallbladder, pancreas, spleen and adrenal glands are grossly unremarkable.

Segmental wall calcifications of the abdominal aorta and right ilio-femoral arteries.

There are pelvic phleboliths

Marginal osteophytes in the dorsal spine and the included visualized iliac bones.

IMPRESSION: Consider tiny nonobstructing left nephrolithiasis
Suggestive extrarenal type of renal pelvis, right

Thank you for your referral.`;

export class TextExtractionService {
  /**
   * Extract text from an image using Google Vision OCR
   * Currently using fixed text for testing
   */
  static async extractFromImage(imageUri: string): Promise<ExtractedText> {
    try {
      console.log('Using fixed OCR text instead of Google Vision API...');

      // Return fixed text instead of calling Google Vision API
      return {
        text: FIXED_OCR_TEXT,
        confidence: 0.95,
        extractionMethod: 'ocr',
        metadata: {
          format: 'image',
          language: 'en',
          detectedType: 'CT Scan',
          isValidMedical: true
        }
      };

      // Original Google Vision API code (commented out)
      /*
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
      */
    } catch (error) {
      console.error('Error extracting text from image:', error);

      // Return fixed text even if there's an error
      return {
        text: FIXED_OCR_TEXT,
        confidence: 0.95,
        extractionMethod: 'ocr',
        metadata: {
          format: 'image',
          language: 'en',
          detectedType: 'CT Scan',
          isValidMedical: true
        }
      };
    }
  }

  /**
   * Extract text from a PDF document
   * Currently using fixed text for testing
   */
  static async extractFromPDF(pdfUri: string): Promise<ExtractedText> {
    try {
      console.log('Using fixed OCR text instead of PDF extraction...');

      // Return fixed text instead of calling PDF extraction
      return {
        text: FIXED_OCR_TEXT,
        confidence: 0.95,
        extractionMethod: 'pdf-direct',
        metadata: {
          pageCount: 1,
          format: 'pdf',
          language: 'en',
          isValidMedical: true
        }
      };

      // Original PDF extraction code (commented out)
      /*
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
      */
    } catch (error) {
      console.error('Error extracting text from PDF:', error);

      // Return fixed text even if there's an error
      return {
        text: FIXED_OCR_TEXT,
        confidence: 0.95,
        extractionMethod: 'pdf-direct',
        metadata: {
          pageCount: 1,
          format: 'pdf',
          language: 'en',
          isValidMedical: true
        }
      };
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
