/*
  # Fix Authentication and Role Management

  1. Changes
    - Creates custom roles
    - Updates policies to use custom roles
    - Fixes public data access
  
  2. Security
    - Implements proper role-based access control
    - Maintains data security while allowing public access
*/

-- Create custom roles
CREATE TYPE user_role AS ENUM ('admin', 'user', 'investor');

-- Create a function to check admin access
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT COALESCE(
    current_setting('request.jwt.claims', true)::json->>'role' = 'admin',
    false
  );
$$;

-- Create a function to check authenticated access
CREATE OR REPLACE FUNCTION is_authenticated()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT COALESCE(
    current_setting('request.jwt.claims', true)::json->>'role' IS NOT NULL,
    false
  );
$$;

-- Update policies for public tables to use the new functions
DROP POLICY IF EXISTS "Allow public read access" ON team_members;
DROP POLICY IF EXISTS "Allow public read access" ON news_updates;
DROP POLICY IF EXISTS "Allow public read access" ON products;
DROP POLICY IF EXISTS "Allow public read access" ON research_publications;

CREATE POLICY "Enable read access for all users" ON team_members
  FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON news_updates
  FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON products
  FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON research_publications
  FOR SELECT USING (true);

-- Update admin policies to use the new is_admin function
DROP POLICY IF EXISTS "Allow admin write access" ON team_members;
DROP POLICY IF EXISTS "Allow admin write access" ON news_updates;
DROP POLICY IF EXISTS "Allow admin write access" ON products;
DROP POLICY IF EXISTS "Allow admin write access" ON research_publications;

CREATE POLICY "Enable admin write access" ON team_members
  FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Enable admin write access" ON news_updates
  FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Enable admin write access" ON products
  FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Enable admin write access" ON research_publications
  FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Update investor document policies
DROP POLICY IF EXISTS "Approved investors can view documents" ON investor_documents;
DROP POLICY IF EXISTS "Admins can manage documents" ON investor_documents;

CREATE POLICY "Enable investor document access" ON investor_documents
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM investor_registrations
      WHERE user_id = auth.uid()
      AND status = 'approved'
    )
    OR is_admin()
  );

CREATE POLICY "Enable admin document management" ON investor_documents
  FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Update investor registration policies
DROP POLICY IF EXISTS "Users can view their own registration" ON investor_registrations;
DROP POLICY IF EXISTS "Users can create their own registration" ON investor_registrations;
DROP POLICY IF EXISTS "Admins can update registrations" ON investor_registrations;

CREATE POLICY "Enable registration access" ON investor_registrations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR is_admin());

CREATE POLICY "Enable registration creation" ON investor_registrations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable admin registration management" ON investor_registrations
  FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Update user management functions
CREATE OR REPLACE FUNCTION get_users()
RETURNS SETOF public.managed_users
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF is_admin() THEN
    RETURN QUERY SELECT * FROM public.managed_users;
  ELSE
    RAISE EXCEPTION 'Only administrators can view users';
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION delete_managed_user(user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF is_admin() THEN
    DELETE FROM auth.users WHERE id = user_id;
  ELSE
    RAISE EXCEPTION 'Only administrators can delete users';
  END IF;
END;
$$;

-- Ensure admin user exists with proper role
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE email = 'admin@endocyclic.com'
  ) THEN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    )
    VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'admin@endocyclic.com',
      crypt('Admin123!', gen_salt('bf')),
      NOW(),
      '{"provider":"email","providers":["email"]}',
      '{"role":"admin"}',
      NOW(),
      NOW(),
      '',
      '',
      '',
      ''
    );
  END IF;
END $$;