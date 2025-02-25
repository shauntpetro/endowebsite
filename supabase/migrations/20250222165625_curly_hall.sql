/*
  # Add Admin User

  1. Create admin user
    - Add a test admin user for development
    - Set appropriate role and permissions

  2. Security
    - Ensure proper role assignment
    - Set up initial credentials
*/

-- Create admin user
DO $$
BEGIN
  -- Check if admin user already exists
  IF NOT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE email = 'admin@endocyclic.com'
  ) THEN
    -- Insert admin user
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
      crypt('Admin123!', gen_salt('bf')), -- Default password: Admin123!
      NOW(),
      '{"provider":"email","providers":["email"],"role":"admin"}',
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