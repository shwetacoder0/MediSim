import { supabase } from './supabase';
import { TextExtractionService } from './textExtraction';
import { PicaService } from './pica';
import { ImageGenerationService } from './imageGeneration';
import { STORAGE_BUCKETS } from '../config/constants';

export interface ProcessingResult {
  reportId: string;
  analysisId: string;
  visualizationId: string;
  imageIds: string[];
  success: boolean;
  error?: string;
}

export class ReportProcessingService {
  /**
   * Process a complete medical report through the AI pipeline
   */
  static async processReport(
    reportId: string,
    fileUri: string,
    mimeType: string,
    reportType: string
  ): Promise<ProcessingResult> {
    try {
      console.log('Starting report processing for:', reportId);

      // Step 1: Extract text from the uploaded file
      console.log('Extracting text...');
      const extractedText = await TextExtractionService.extractText(fileUri, mimeType);
      
      if (!extractedText.text || extractedText.text.trim().length === 0) {
        throw new Error('No text could be extracted from the file');
      }

      // Step 2: Analyze the report with Pica/Gemini
      console.log('Analyzing with Pica/Gemini...');
      const analysis = await PicaService.analyzeReport(extractedText.text, reportType);

      // Step 3: Save the analysis to the database
      console.log('Saving analysis...');
      const { data: analysisData, error: analysisError } = await supabase
        .from('report_analysis')
        .insert({
          report_id: reportId,
          ai_summary: analysis.detailedAnalysis,
          ai_doctor_explanation: analysis.doctorScript
        })
        .select()
        .single();

      if (analysisError) {
        throw new Error(`Failed to save analysis: ${analysisError.message}`);
      }

      // Step 4: Save visualization data
      console.log('Saving visualization data...');
      const { data: vizData, error: vizError } = await supabase
        .from('visualization_data')
        .insert({
          report_id: reportId,
          chart_data: analysis.visualizationData.chartData,
          metrics: analysis.visualizationData.metrics,
          visual_notes: analysis.visualizationData.visualNotes
        })
        .select()
        .single();

      if (vizError) {
        throw new Error(`Failed to save visualization data: ${vizError.message}`);
      }

      // Step 5: Generate image prompt and create AI illustration
      console.log('Generating AI illustration...');
      const imagePrompt = await PicaService.generateImagePrompt(
        analysis.detailedAnalysis,
        reportType
      );

      const generatedImage = await ImageGenerationService.generateMedicalIllustration(imagePrompt);

      // Step 6: Save the generated image to the database
      console.log('Saving generated image...');
      const { data: imageData, error: imageError } = await supabase
        .from('ai_images')
        .insert({
          report_id: reportId,
          image_url: generatedImage.url,
          model_used: generatedImage.model
        })
        .select()
        .single();

      if (imageError) {
        throw new Error(`Failed to save generated image: ${imageError.message}`);
      }

      console.log('Report processing completed successfully');

      return {
        reportId,
        analysisId: analysisData.id,
        visualizationId: vizData.id,
        imageIds: [imageData.id],
        success: true
      };

    } catch (error) {
      console.error('Error processing report:', error);
      
      return {
        reportId,
        analysisId: '',
        visualizationId: '',
        imageIds: [],
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Get the complete processed report data
   */
  static async getProcessedReport(reportId: string) {
    try {
      // Get the main report
      const { data: report, error: reportError } = await supabase
        .from('reports')
        .select('*')
        .eq('id', reportId)
        .single();

      if (reportError) throw reportError;

      // Get the analysis
      const { data: analysis, error: analysisError } = await supabase
        .from('report_analysis')
        .select('*')
        .eq('report_id', reportId)
        .single();

      // Get visualization data
      const { data: visualization, error: vizError } = await supabase
        .from('visualization_data')
        .select('*')
        .eq('report_id', reportId)
        .single();

      // Get AI images
      const { data: images, error: imagesError } = await supabase
        .from('ai_images')
        .select('*')
        .eq('report_id', reportId);

      if (imagesError) throw imagesError;

      return {
        report,
        analysis: analysis || null,
        visualization: visualization || null,
        images: images || []
      };
    } catch (error) {
      console.error('Error fetching processed report:', error);
      throw error;
    }
  }

  /**
   * Check if a report has been fully processed
   */
  static async isReportProcessed(reportId: string): Promise<boolean> {
    try {
      const { data: analysis } = await supabase
        .from('report_analysis')
        .select('id')
        .eq('report_id', reportId)
        .single();

      const { data: visualization } = await supabase
        .from('visualization_data')
        .select('id')
        .eq('report_id', reportId)
        .single();

      const { data: images } = await supabase
        .from('ai_images')
        .select('id')
        .eq('report_id', reportId);

      return !!(analysis && visualization && images && images.length > 0);
    } catch (error) {
      console.error('Error checking report processing status:', error);
      return false;
    }
  }
}