-- MediSim Database Schema
-- This file contains the SQL commands to create the database schema for the MediSim app

-- Enable UUID extension for PostgreSQL
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table (Linked to auth.users)
CREATE TABLE users (
    id UUID PRIMARY KEY, -- Same as auth.users.id
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    full_name TEXT,
    email TEXT NOT NULL,
    plan TEXT DEFAULT 'free',
    subscription_status TEXT DEFAULT 'inactive'
);

-- 2. Reports Table
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    file_url TEXT NOT NULL,
    report_type TEXT,
    original_filename TEXT
);

-- 3. Report Analysis Table
CREATE TABLE report_analysis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    ai_summary TEXT,
    ai_doctor_explanation TEXT,
    analysis_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Visualization Data Table
CREATE TABLE visualization_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    chart_data JSONB,
    metrics JSONB,
    visual_notes TEXT
);

-- 5. AI Images Table
CREATE TABLE ai_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    model_used TEXT,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Education Sections Table
CREATE TABLE education_sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section_type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    content_type TEXT NOT NULL,
    content_url TEXT,
    glb_file_url TEXT
);

-- 7. Feedback Table (Optional)
CREATE TABLE feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    type TEXT,
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_reports_user_id ON reports(user_id);
CREATE INDEX idx_report_analysis_report_id ON report_analysis(report_id);
CREATE INDEX idx_visualization_data_report_id ON visualization_data(report_id);
CREATE INDEX idx_ai_images_report_id ON ai_images(report_id);
CREATE INDEX idx_education_sections_section_type ON education_sections(section_type);
CREATE INDEX idx_feedback_user_id ON feedback(user_id);

-- Create storage buckets (Supabase specific - this is a comment for reference)
-- These need to be created in the Supabase dashboard or using their API:
-- 1. user-reports
-- 2. ai-images
-- 3. education-static
-- 4. 3d-stuff
