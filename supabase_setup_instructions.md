# MediSim Supabase Setup Instructions

This document provides step-by-step instructions for setting up the Supabase backend for the MediSim app.

## 1. Create a Supabase Project

1. Sign up or log in to [Supabase](https://supabase.com/)
2. Create a new project and note down the project URL and API keys

## 2. Database Setup

### Option 1: Using the SQL Editor

1. Navigate to the SQL Editor in your Supabase dashboard
2. Copy the entire contents of `medisim_schema.sql`
3. Paste it into the SQL Editor and run the query

### Option 2: Using the Supabase CLI

```bash
# Install Supabase CLI if you haven't already
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Push the schema
supabase db push medisim_schema.sql
```

## 3. Set Up Authentication

1. Go to Authentication → Settings in your Supabase dashboard
2. Enable Email authentication
3. Optionally, set up Google OAuth:
   - Create a project in the [Google Cloud Console](
   )
   - Set up OAuth credentials
   - Add the redirect URL from Supabase
   - Copy the Client ID and Secret to Supabase

## 4. Create Storage Buckets

1. Go to Storage in your Supabase dashboard
2. Create the following buckets:
   - `user-reports` - For storing uploaded medical reports (PDF/images)
   - `ai-images` - For storing AI-generated images
   - `education-static` - For educational content thumbnails
   - `3d-stuff` - For 3D model files (.glb)

3. Set up bucket permissions:
   - `user-reports`: Private (authenticated users can upload/download their own files)
   - `ai-images`: Private (authenticated users can view their own generated images)
   - `education-static`: Public (anyone can view)
   - `3d-stuff`: Public (anyone can view)

## 5. Set Up Row Level Security (RLS)

Apply these RLS policies to protect user data:

### For the `users` table:

```sql
-- Users can read and update only their own data
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);
```

### For the `reports` table:

```sql
-- Users can CRUD only their own reports
CREATE POLICY "Users can CRUD own reports" ON reports
  USING (auth.uid() = user_id);
```

### For the `report_analysis`, `visualization_data`, and `ai_images` tables:

```sql
-- Users can read data related to their own reports
CREATE POLICY "Users can read own report data" ON report_analysis
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM reports WHERE id = report_analysis.report_id
    )
  );

-- Similar policies for visualization_data and ai_images
```

### For the `education_sections` table:

```sql
-- Anyone can read education content
CREATE POLICY "Public read access for education" ON education_sections
  FOR SELECT USING (true);
```

## 6. Set Up Edge Functions (Optional)

For AI processing, you may want to set up Supabase Edge Functions:

1. Create a new function for processing reports:

```bash
supabase functions new process-report
```

2. Implement the function to call OpenAI/Runway and other AI services
3. Deploy the function:

```bash
supabase functions deploy process-report
```

## 7. Connect to Your React Native App

1. Install the Supabase client in your React Native project:

```bash
npm install @supabase/supabase-js
```

2. Create a configuration file with your Supabase URL and anon key:

```javascript
// supabaseConfig.js
export const SUPABASE_URL = 'your-supabase-url';
export const SUPABASE_ANON_KEY = 'your-anon-key';
```

3. Initialize the Supabase client in your app:

```javascript
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabaseConfig';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
```

## 8. Testing Your Setup

1. Test authentication by signing up a test user
2. Test file uploads to the storage buckets
3. Verify that RLS policies are working correctly by attempting to access data from different user accounts

## 9. Monitoring and Maintenance

1. Set up database backups in the Supabase dashboard
2. Monitor API usage and database performance
3. Set up alerts for any critical errors

---

For any issues or questions, refer to the [Supabase documentation](https://supabase.com/docs) or contact the MediSim development team.
