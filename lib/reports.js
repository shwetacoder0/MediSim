import { supabase } from './supabase';
import { STORAGE_BUCKETS } from './supabase';
import * as FileSystem from 'expo-file-system';

/**
 * Upload a medical report
 * @param {Object} file File object from document picker or camera
 * @param {string} reportType Type of medical report
 * @returns {Promise} Report data
 */
export async function uploadReport(file, reportType) {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Not authenticated');

    // Generate a unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    // Convert file to blob for Supabase storage
    const fileUri = file.uri;
    const fileInfo = await FileSystem.getInfoAsync(fileUri);

    if (!fileInfo.exists) {
      throw new Error('File does not exist');
    }

    const fileBlob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        resolve(xhr.response);
      };
      xhr.onerror = function(e) {
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', fileUri, true);
      xhr.send(null);
    });

    // Upload file to storage
    const { data: fileData, error: uploadError } = await supabase
      .storage
      .from(STORAGE_BUCKETS.REPORTS)
      .upload(fileName, fileBlob, {
        contentType: file.mimeType || 'application/octet-stream'
      });

    if (uploadError) throw uploadError;

    // Get the public URL
    const { data: { publicUrl } } = supabase
      .storage
      .from(STORAGE_BUCKETS.REPORTS)
      .getPublicUrl(fileName);

    // Create a record in the reports table
    const { data: reportData, error: reportError } = await supabase
      .from('reports')
      .insert({
        user_id: user.id,
        file_url: publicUrl,
        report_type: reportType,
        original_filename: file.name
      })
      .select()
      .single();

    if (reportError) throw reportError;

    return reportData;
  } catch (error) {
    console.error('Error uploading report:', error.message);
    throw error;
  }
}

/**
 * Get all reports for the current user
 * @returns {Promise} Array of reports
 */
export async function getUserReports() {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('user_id', user.id)
      .order('uploaded_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching reports:', error.message);
    throw error;
  }
}

/**
 * Get a specific report with all related data
 * @param {string} reportId Report ID
 * @returns {Promise} Report data with analysis, visualization, and images
 */
export async function getReportDetails(reportId) {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Not authenticated');

    // Get the report
    const { data: report, error: reportError } = await supabase
      .from('reports')
      .select('*')
      .eq('id', reportId)
      .eq('user_id', user.id)
      .single();

    if (reportError) throw reportError;

    // Get the analysis
    const { data: analysis, error: analysisError } = await supabase
      .from('report_analysis')
      .select('*')
      .eq('report_id', reportId)
      .single();

    if (analysisError && analysisError.code !== 'PGRST116') throw analysisError;

    // Get visualization data
    const { data: visualization, error: vizError } = await supabase
      .from('visualization_data')
      .select('*')
      .eq('report_id', reportId)
      .single();

    if (vizError && vizError.code !== 'PGRST116') throw vizError;

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
    console.error('Error fetching report details:', error.message);
    throw error;
  }
}

/**
 * Save AI analysis results for a report
 * @param {string} reportId Report ID
 * @param {string} aiSummary AI-generated summary
 * @param {string} doctorExplanation AI doctor explanation
 * @returns {Promise} Analysis data
 */
export async function saveReportAnalysis(reportId, aiSummary, doctorExplanation) {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Not authenticated');

    // Check if the report belongs to the user
    const { data: report, error: reportError } = await supabase
      .from('reports')
      .select('user_id')
      .eq('id', reportId)
      .single();

    if (reportError) throw reportError;
    if (report.user_id !== user.id) throw new Error('Unauthorized');

    // Insert or update the analysis
    const { data, error } = await supabase
      .from('report_analysis')
      .upsert({
        report_id: reportId,
        ai_summary: aiSummary,
        ai_doctor_explanation: doctorExplanation
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving analysis:', error.message);
    throw error;
  }
}

/**
 * Save AI generated image for a report
 * @param {string} reportId Report ID
 * @param {string} imageUrl URL of the generated image
 * @param {string} modelUsed AI model used
 * @returns {Promise} Image data
 */
export async function saveAIImage(reportId, imageUrl, modelUsed) {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Not authenticated');

    // Check if the report belongs to the user
    const { data: report, error: reportError } = await supabase
      .from('reports')
      .select('user_id')
      .eq('id', reportId)
      .single();

    if (reportError) throw reportError;
    if (report.user_id !== user.id) throw new Error('Unauthorized');

    // Save the image data
    const { data, error } = await supabase
      .from('ai_images')
      .insert({
        report_id: reportId,
        image_url: imageUrl,
        model_used: modelUsed
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving AI image:', error.message);
    throw error;
  }
}

/**
 * Save visualization data for a report
 * @param {string} reportId Report ID
 * @param {Object} chartData Chart data in JSON format
 * @param {Object} metrics Key-value metrics
 * @param {string} visualNotes Additional notes
 * @returns {Promise} Visualization data
 */
export async function saveVisualizationData(reportId, chartData, metrics, visualNotes) {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Not authenticated');

    // Check if the report belongs to the user
    const { data: report, error: reportError } = await supabase
      .from('reports')
      .select('user_id')
      .eq('id', reportId)
      .single();

    if (reportError) throw reportError;
    if (report.user_id !== user.id) throw new Error('Unauthorized');

    // Insert or update visualization data
    const { data, error } = await supabase
      .from('visualization_data')
      .upsert({
        report_id: reportId,
        chart_data: chartData,
        metrics: metrics,
        visual_notes: visualNotes
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving visualization data:', error.message);
    throw error;
  }
}
