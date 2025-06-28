// MediSim Supabase API Examples
// This file contains example API calls for interacting with the Supabase backend

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client (replace with your actual URL and key)
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

// ===== Authentication Examples =====

// Sign up a new user
export async function signUpUser(email, password, fullName) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    });

    if (error) throw error;

    // After successful signup, create a record in the users table
    if (data.user) {
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: data.user.id,
          email,
          full_name: fullName,
          plan: 'free',
          subscription_status: 'inactive'
        });

      if (profileError) throw profileError;
    }

    return data;
  } catch (error) {
    console.error('Error signing up:', error.message);
    throw error;
  }
}

// Sign in a user
export async function signInUser(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error signing in:', error.message);
    throw error;
  }
}

// Sign out
export async function signOutUser() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('Error signing out:', error.message);
    throw error;
  }
}

// Get current user
export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) throw error;
    return user;
  } catch (error) {
    console.error('Error getting current user:', error.message);
    return null;
  }
}

// ===== User Profile Examples =====

// Get user profile
export async function getUserProfile() {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching profile:', error.message);
    throw error;
  }
}

// Update user profile
export async function updateUserProfile(updates) {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating profile:', error.message);
    throw error;
  }
}

// ===== Report Management Examples =====

// Upload a medical report
export async function uploadReport(file, reportType) {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Not authenticated');

    // Generate a unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    // Upload file to storage
    const { data: fileData, error: uploadError } = await supabase
      .storage
      .from('user-reports')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    // Get the public URL
    const { data: { publicUrl } } = supabase
      .storage
      .from('user-reports')
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

// Get user's reports
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

// Get a specific report with its analysis and visualizations
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

// ===== AI Processing Examples =====

// Save AI analysis results
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

// Save AI generated image
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

// ===== Educational Content Examples =====

// Get educational sections by type
export async function getEducationalContent(sectionType) {
  try {
    const query = supabase
      .from('education_sections')
      .select('*');

    if (sectionType) {
      query.eq('section_type', sectionType);
    }

    const { data, error } = await query.order('title');

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching educational content:', error.message);
    throw error;
  }
}

// Get specific educational item
export async function getEducationalItem(itemId) {
  try {
    const { data, error } = await supabase
      .from('education_sections')
      .select('*')
      .eq('id', itemId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching educational item:', error.message);
    throw error;
  }
}

// Get 3D model URL from the 3d-stuff bucket
export async function get3DModelUrl(modelFileName) {
  try {
    const { data } = supabase
      .storage
      .from('3d-stuff')
      .getPublicUrl(modelFileName);

    return data.publicUrl;
  } catch (error) {
    console.error('Error getting 3D model URL:', error.message);
    throw error;
  }
}

// Upload a 3D model to the 3d-stuff bucket
export async function upload3DModel(file, modelName) {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Not authenticated');

    // Only allow admin users to upload 3D models
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('plan')
      .eq('id', user.id)
      .single();

    if (userError) throw userError;
    if (userData.plan !== 'admin') throw new Error('Unauthorized: Only admins can upload 3D models');

    // Generate a unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${modelName.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.${fileExt}`;

    // Upload file to storage
    const { data, error } = await supabase
      .storage
      .from('3d-stuff')
      .upload(fileName, file);

    if (error) throw error;

    return fileName;
  } catch (error) {
    console.error('Error uploading 3D model:', error.message);
    throw error;
  }
}

// ===== Feedback Example =====

// Submit user feedback
export async function submitFeedback(feedbackType, message) {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('feedback')
      .insert({
        user_id: user?.id || null, // Allow anonymous feedback
        type: feedbackType,
        message
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error submitting feedback:', error.message);
    throw error;
  }
}

// ===== Subscription Management =====

// Update user subscription status (after RevenueCat webhook)
export async function updateSubscriptionStatus(userId, plan, status) {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({
        plan,
        subscription_status: status
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating subscription:', error.message);
    throw error;
  }
}
