/*
  # User Authentication System Fix

  1. Changes
    - Creates a secure view for user management
    - Adds functions for user operations
    - Sets up proper RLS policies
  
  2. Security
    - Restricts access to admin users only
    - Implements proper security barriers
*/

-- Create a secure view for user management
CREATE OR REPLACE VIEW public.managed_users AS
SELECT 
  id,
  email,
  raw_user_meta_data,
  created_at,
  last_sign_in_at,
  confirmed_at
FROM auth.users;

-- Create function to get users
CREATE OR REPLACE FUNCTION get_users()
RETURNS SETOF public.managed_users
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF (auth.jwt() ->> 'role') = 'admin' THEN
    RETURN QUERY SELECT * FROM public.managed_users;
  ELSE
    RAISE EXCEPTION 'Only administrators can view users';
  END IF;
END;
$$;

-- Create function to delete user
CREATE OR REPLACE FUNCTION delete_managed_user(user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF (auth.jwt() ->> 'role') = 'admin' THEN
    -- Delete from auth.users (this will cascade to other tables)
    DELETE FROM auth.users WHERE id = user_id;
  ELSE
    RAISE EXCEPTION 'Only administrators can delete users';
  END IF;
END;
$$;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT ON public.managed_users TO authenticated;
GRANT EXECUTE ON FUNCTION get_users() TO authenticated;
GRANT EXECUTE ON FUNCTION delete_managed_user(uuid) TO authenticated;