/*
  # Admin Approval System

  1. New Policies
    - Allow admins to update investor registrations
    - Allow admins to manage documents

  2. Security
    - Ensure proper admin role checks
    - Maintain data isolation
*/

-- Add admin update policy for investor_registrations
CREATE POLICY "Admins can update registrations"
  ON investor_registrations
  FOR UPDATE
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Add admin management policies for investor_documents
CREATE POLICY "Admins can manage documents"
  ON investor_documents
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');