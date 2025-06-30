// Configuration constants for MediSim
export const SUPABASE_URL = 'https://lietwvmpknkteaptxvqm.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpZXR3dm1wa25rdGVhcHR4dnFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwMzA0NTksImV4cCI6MjA2NjYwNjQ1OX0.0DdyqYTF8CtwyS3GAdt00Buh4lj8KYQoFFGO49KdJGc';

// Gemini API Configuration
export const GEMINI_CONFIG = {
  API_KEY: 'AIzaSyDSVlzZiZuTTH250Dp36K72DejUnJsHNS8', // Replace with your actual Gemini API key
  BASE_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'
};

// Pica API Configuration
export const PICA_CONFIG = {
  SECRET_KEY: 'your-pica-secret-key', // Replace with your actual Pica secret key
  GEMINI_CONNECTION_KEY: 'your-pica-gemini-connection-key', // Replace with your actual connection key
  ACTION_ID: 'conn_mod_def::GCmd5BQE388::PISTzTbvRSqXx0N0rMa-Lw',
  BASE_URL: 'https://api.picaos.com/v1/passthrough/models/gemini-1.5-flash:generateContent'
};

// Tavus API Configuration
export const TAVUS_CONFIG = {
  apiKey: '7ada0c6e9b1141168a7f13c5fbba99da', // Replace with your actual Tavus API key
  replicaId: 'rc2146c13e81', // Replace with your doctor avatar replica ID
  personaId: 'pb407e8bc852', // Replace with your doctor persona ID (create once)
  baseUrl: 'https://tavusapi.com', // Tavus API base URL
};

// Google Vision API Configuration
export const GOOGLE_VISION_CONFIG = {
  API_KEY: '', // Replace with your actual API key
  BASE_URL: 'https://vision.googleapis.com/v1/images:annotate'
};

// OpenAI Configuration (for image generation)
export const OPENAI_CONFIG = {
  API_KEY: 'your-openai-api-key',
  BASE_URL: 'https://api.openai.com/v1'
};

// App Constants
export const FREE_TIER_LIMITS = {
  AI_IMAGES: 1,
  AI_DOCTOR_VIDEOS: 1,
  QNA_PER_DAY: 1
};

// Subscription Plans
export const SUBSCRIPTION_PLANS = {
  FREE: 'free',
  PRO: 'pro',
  ADMIN: 'admin'
};

// Report Types
export const REPORT_TYPES = [
  'MRI Brain',
  'MRI Spine',
  'MRI Knee',
  'CT Scan',
  'X-Ray',
  'Ultrasound',
  'Blood Test',
  'Other'
];

// Storage Buckets
export const STORAGE_BUCKETS = {
  REPORTS: 'user-reports',
  AI_IMAGES: 'ai-images',
  EDUCATION: 'education-static',
  MODELS_3D: '3d-stuff'
};