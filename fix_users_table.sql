-- Fix the users table to properly connect with auth.users
-- First, let's enable RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create a trigger to automatically create a user record when a new auth user is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, plan, subscription_status, created_at)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    'free',
    'inactive',
    NEW.created_at
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger on auth.users
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add policies for row level security
-- Allow users to read their own data
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid() = id);

-- Allow users to update their own data
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Allow service role to manage all users
CREATE POLICY "Service role can manage users" ON users
  USING (auth.role() = 'service_role');

-- Add foreign key constraint to ensure users table references auth.users
ALTER TABLE users
ADD CONSTRAINT users_id_fkey
FOREIGN KEY (id)
REFERENCES auth.users(id)
ON DELETE CASCADE;

-- Verify existing users have corresponding entries
DO $$
DECLARE
  auth_user RECORD;
BEGIN
  FOR auth_user IN SELECT id, email, created_at FROM auth.users LOOP
    -- Check if user exists in public.users
    IF NOT EXISTS (SELECT 1 FROM public.users WHERE id = auth_user.id) THEN
      -- Create missing user
      INSERT INTO public.users (id, email, plan, subscription_status, created_at)
      VALUES (auth_user.id, auth_user.email, 'free', 'inactive', auth_user.created_at);
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;
