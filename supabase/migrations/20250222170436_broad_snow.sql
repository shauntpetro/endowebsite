/*
  # User Management System

  1. New Tables
    - Creates a secure table for managing user metadata
    - Provides controlled access to user data
  
  2. Security
    - Enables RLS on tables
    - Adds policies for admin access
    - Protects sensitive user data
*/

-- Create a table to store additional user metadata
CREATE TABLE IF NOT EXISTS user_metadata (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text NOT NULL,
  role text NOT NULL DEFAULT 'user',
  last_sign_in_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_metadata ENABLE ROW LEVEL SECURITY;

-- Create policy for admin access to the metadata table
CREATE POLICY "Allow admin access to user metadata"
  ON user_metadata
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Create function to handle user deletion
CREATE OR REPLACE FUNCTION delete_user(user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only allow admins to delete users
  IF (auth.jwt() ->> 'role') = 'admin' THEN
    -- Delete from metadata first (due to foreign key)
    DELETE FROM user_metadata WHERE id = user_id;
    -- Then delete from auth.users
    DELETE FROM auth.users WHERE id = user_id;
  ELSE
    RAISE EXCEPTION 'Only administrators can delete users';
  END IF;
END;
$$;

-- Create function to sync user metadata
CREATE OR REPLACE FUNCTION sync_user_metadata()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO user_metadata (id, email, role)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'role', 'user'))
  ON CONFLICT (id) DO UPDATE
  SET 
    email = EXCLUDED.email,
    role = COALESCE(NEW.raw_user_meta_data->>'role', user_metadata.role),
    updated_at = now();
  RETURN NEW;
END;
$$;

-- Create function to handle metadata updates
CREATE OR REPLACE FUNCTION handle_metadata_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    NEW.updated_at = now();
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger for metadata updates
CREATE TRIGGER update_user_metadata_timestamp
  BEFORE UPDATE ON user_metadata
  FOR EACH ROW
  EXECUTE FUNCTION handle_metadata_changes();