/*
  # Investor Authentication and Document Management

  1. New Tables
    - `investor_registrations`
      - Stores investor registration requests and approval status
      - Links to Supabase auth users
    - `investor_documents`
      - Stores documents available to approved investors
      - Includes metadata and access controls

  2. Security
    - Enable RLS on all tables
    - Create policies for different access levels
    - Ensure proper data isolation

  3. Document Categories
    - Financial Reports
    - Clinical Data
    - Research Updates
    - Investor Presentations
*/

-- Create investor_registrations table
CREATE TABLE IF NOT EXISTS investor_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  email text NOT NULL UNIQUE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  company text,
  role text,
  phone text,
  investment_preferences text[] DEFAULT '{}',
  accreditation_status text NOT NULL,
  investment_capacity_range text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create investor_documents table
CREATE TABLE IF NOT EXISTS investor_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  file_type text NOT NULL CHECK (file_type IN ('pdf', 'image', 'spreadsheet', 'presentation')),
  file_size integer NOT NULL,
  url text NOT NULL,
  preview_url text,
  publish_date timestamptz NOT NULL DEFAULT now(),
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE investor_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE investor_documents ENABLE ROW LEVEL SECURITY;

-- Policies for investor_registrations
CREATE POLICY "Users can view their own registration"
  ON investor_registrations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Users can create their own registration"
  ON investor_registrations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policies for investor_documents
CREATE POLICY "Approved investors can view documents"
  ON investor_documents
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM investor_registrations
      WHERE user_id = auth.uid()
      AND status = 'approved'
    )
    OR auth.jwt() ->> 'role' = 'admin'
  );

-- Add sample investor documents
INSERT INTO investor_documents (
  title,
  description,
  category,
  file_type,
  file_size,
  url,
  preview_url,
  tags,
  publish_date
) VALUES
(
  'Q4 2024 Investor Presentation',
  'Comprehensive overview of our clinical pipeline and development progress',
  'Investor Presentations',
  'presentation',
  2048,
  'https://example.com/documents/q4-2024-presentation.pdf',
  'https://example.com/documents/q4-2024-presentation-preview.jpg',
  ARRAY['Clinical Pipeline', 'Financial Results', 'Development Updates'],
  '2024-02-15'
),
(
  'Phase II Clinical Trial Results - ENDO-205',
  'Detailed analysis of Phase II trial outcomes for our lead therapeutic candidate',
  'Clinical Data',
  'pdf',
  1536,
  'https://example.com/documents/phase2-results.pdf',
  null,
  ARRAY['Clinical Trials', 'ENDO-205', 'Phase II'],
  '2024-02-01'
),
(
  'Financial Report - FY 2024',
  'Annual financial statements and analysis',
  'Financial Reports',
  'spreadsheet',
  1024,
  'https://example.com/documents/fy2024-financials.xlsx',
  null,
  ARRAY['Financial', 'Annual Report', 'FY2024'],
  '2024-01-30'
);