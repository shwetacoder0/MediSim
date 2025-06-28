// Configuration constants for MediSim
export const SUPABASE_URL = 'https://lietwvmpknkteaptxvqm.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpZXR3dm1wa25rdGVhcHR4dnFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwMzA0NTksImV4cCI6MjA2NjYwNjQ1OX0.0DdyqYTF8CtwyS3GAdt00Buh4lj8KYQoFFGO49KdJGc';

// Pica API Configuration
export const PICA_CONFIG = {
  SECRET_KEY: 'your-pica-secret-key',
  GEMINI_CONNECTION_KEY: 'test::github::default::d8ba768627184e909eec3cbeafa97380',
  ACTION_ID: 'conn_mod_def::GCmd5BQE388::PISTzTbvRSqXx0N0rMa-Lw',
  BASE_URL: 'https://api.picaos.com/v1/passthrough/models/gemini-1.5-flash:generateContent'
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