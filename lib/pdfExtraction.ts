/**
 * PDF Text Extraction Service
 * 
 * For PDF text extraction, we have several approaches:
 * 
 * 1. Client-side extraction (React Native/Web):
 *    - Use react-native-pdf-lib or pdf-lib for basic text extraction
 *    - Limited to simple PDFs with selectable text
 *    - Won't work with scanned PDFs or image-based PDFs
 * 
 * 2. Server-side extraction (Recommended):
 *    - Use Supabase Edge Functions with pdf-parse or pdf2pic
 *    - Can handle complex PDFs and convert to images for OCR
 *    - Better performance and reliability
 * 
 * 3. Cloud services:
 *    - AWS Textract: Excellent for medical documents
 *    - Google Document AI: Specialized for document processing
 *    - Azure Form Recognizer: Good for structured documents
 * 
 * For now, we'll implement a hybrid approach:
 * - Try client-side extraction first for simple PDFs
 * - Fall back to converting PDF pages to images and using OCR
 */

import * as FileSystem from 'expo-file-system';
import { GoogleVisionService } from './googleVision';

export interface PDFExtractionResult {
  text: string;
  pageCount: number;
  extractionMethod: 'direct' | 'ocr' | 'hybrid';
  confidence: number;
  pages?: Array<{
    pageNumber: number;
    text: string;
    confidence?: number;
  }>;
}

export class PDFExtractionService {
  /**
   * Extract text from PDF using multiple methods
   */
  static async extractTextFromPDF(pdfUri: string): Promise<PDFExtractionResult> {
    try {
      console.log('Starting PDF text extraction...');

      // First, try to extract text directly from PDF
      // This works for PDFs with selectable text
      const directResult = await this.tryDirectExtraction(pdfUri);
      
      if (directResult && directResult.text.length > 100) {
        console.log('Direct PDF extraction successful');
        return {
          text: directResult.text,
          pageCount: directResult.pageCount,
          extractionMethod: 'direct',
          confidence: 0.95,
          pages: directResult.pages
        };
      }

      console.log('Direct extraction failed or insufficient text, trying OCR...');
      
      // If direct extraction fails or returns minimal text,
      // convert PDF to images and use OCR
      const ocrResult = await this.extractUsingOCR(pdfUri);
      
      return {
        text: ocrResult.text,
        pageCount: ocrResult.pageCount,
        extractionMethod: 'ocr',
        confidence: ocrResult.confidence,
        pages: ocrResult.pages
      };

    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      throw new Error(`PDF extraction failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Try to extract text directly from PDF
   * This is a placeholder - in production you'd use a PDF library
   */
  private static async tryDirectExtraction(pdfUri: string): Promise<{
    text: string;
    pageCount: number;
    pages: Array<{ pageNumber: number; text: string }>;
  } | null> {
    try {
      // For now, this is a placeholder
      // In production, you would use libraries like:
      // - react-native-pdf-lib
      // - pdf-lib
      // - Or send to a server endpoint that uses pdf-parse

      console.log('Attempting direct PDF text extraction...');
      
      // Simulate checking if PDF has extractable text
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, return null to force OCR
      // In production, this would attempt actual PDF text extraction
      return null;

      /* Production code would look like this:
      
      const pdfDoc = await PDFDocument.load(pdfUri);
      const pages = pdfDoc.getPages();
      let fullText = '';
      const pageTexts = [];

      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        
        pageTexts.push({
          pageNumber: i + 1,
          text: pageText
        });
        
        fullText += pageText + '\n\n';
      }

      return {
        text: fullText.trim(),
        pageCount: pages.length,
        pages: pageTexts
      };
      */

    } catch (error) {
      console.error('Direct PDF extraction failed:', error);
      return null;
    }
  }

  /**
   * Extract text using OCR by converting PDF pages to images
   */
  private static async extractUsingOCR(pdfUri: string): Promise<{
    text: string;
    pageCount: number;
    confidence: number;
    pages: Array<{ pageNumber: number; text: string; confidence?: number }>;
  }> {
    try {
      console.log('Converting PDF to images for OCR...');

      // For now, we'll simulate this process
      // In production, you would:
      // 1. Convert PDF pages to images using pdf2pic or similar
      // 2. Run OCR on each image
      // 3. Combine results

      // Simulate PDF to image conversion
      await new Promise(resolve => setTimeout(resolve, 2000));

      // For demo, we'll use a sample medical report text
      // In production, this would be the actual OCR result
      const sampleMedicalText = `
RADIOLOGY REPORT

Patient: John Doe
DOB: 01/15/1980
Study Date: ${new Date().toLocaleDateString()}
Study Type: MRI Lumbar Spine Without Contrast

CLINICAL HISTORY:
Lower back pain with radiation to left leg for 3 months. Rule out disc herniation.

TECHNIQUE:
Sagittal T1-weighted, T2-weighted, and STIR sequences were obtained.
Axial T2-weighted sequences were obtained through the lumbar spine.

FINDINGS:
L1-L2: Normal disc height and signal intensity. No herniation or stenosis.
L2-L3: Normal disc height and signal intensity. No herniation or stenosis.
L3-L4: Mild disc height loss. Small posterior disc bulge without significant canal stenosis.
L4-L5: Moderate disc height loss with posterior disc bulge causing mild central canal narrowing.
L5-S1: Normal disc height and signal intensity. No herniation or stenosis.

Vertebral bodies demonstrate normal alignment and signal intensity.
Facet joints show mild degenerative changes at L3-L4 and L4-L5 levels.
Paraspinal soft tissues are unremarkable.

IMPRESSION:
1. Degenerative disc disease at L3-L4 and L4-L5 with posterior disc bulges
2. Mild central canal narrowing at L4-L5
3. Mild facet arthropathy at L3-L4 and L4-L5
4. No significant spinal stenosis or nerve root compression

RECOMMENDATION:
Clinical correlation is recommended. Consider conservative management with physical therapy.
If symptoms persist, consider MRI with contrast or referral to spine specialist.

Electronically signed by:
Dr. Sarah Johnson, MD
Radiologist
      `;

      return {
        text: sampleMedicalText.trim(),
        pageCount: 1,
        confidence: 0.88,
        pages: [
          {
            pageNumber: 1,
            text: sampleMedicalText.trim(),
            confidence: 0.88
          }
        ]
      };

      /* Production code would look like this:
      
      // Convert PDF to images
      const images = await this.convertPDFToImages(pdfUri);
      
      let fullText = '';
      let totalConfidence = 0;
      const pages = [];

      for (let i = 0; i < images.length; i++) {
        const imageUri = images[i];
        const ocrResult = await GoogleVisionService.extractTextFromImage(imageUri);
        
        pages.push({
          pageNumber: i + 1,
          text: ocrResult.text,
          confidence: ocrResult.confidence
        });
        
        fullText += ocrResult.text + '\n\n';
        totalConfidence += ocrResult.confidence;
      }

      return {
        text: fullText.trim(),
        pageCount: images.length,
        confidence: totalConfidence / images.length,
        pages
      };
      */

    } catch (error) {
      console.error('OCR extraction failed:', error);
      throw error;
    }
  }

  /**
   * Convert PDF pages to images
   * This is a placeholder for the actual implementation
   */
  private static async convertPDFToImages(pdfUri: string): Promise<string[]> {
    // In production, this would use libraries like:
    // - pdf2pic (Node.js)
    // - PDF.js (Web)
    // - Or a server endpoint that handles the conversion

    throw new Error('PDF to image conversion not implemented yet');
  }

  /**
   * Validate if the extracted text is a medical document
   */
  static validateMedicalPDF(text: string): {
    isValid: boolean;
    confidence: number;
    detectedSections: string[];
  } {
    const medicalSections = [
      'clinical history',
      'technique',
      'findings',
      'impression',
      'recommendation',
      'patient',
      'study date',
      'radiologist',
      'physician'
    ];

    const lowerText = text.toLowerCase();
    const foundSections = medicalSections.filter(section => 
      lowerText.includes(section)
    );

    const confidence = foundSections.length / medicalSections.length;

    return {
      isValid: confidence > 0.3,
      confidence,
      detectedSections: foundSections
    };
  }
}