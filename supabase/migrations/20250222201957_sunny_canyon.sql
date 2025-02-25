/*
  # Fix Products Table Access

  1. Changes
    - Updates products table policies
    - Adds proper public access
    - Ensures data consistency
  
  2. Security
    - Maintains RLS while allowing public read access
    - Preserves admin write access
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for all users" ON products;
DROP POLICY IF EXISTS "Enable admin write access" ON products;

-- Create new policies with proper access control
CREATE POLICY "Allow public read access" ON products
  FOR SELECT
  USING (true);

CREATE POLICY "Allow admin write access" ON products
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Ensure products table has proper indexes
CREATE INDEX IF NOT EXISTS products_category_idx ON products(category);
CREATE INDEX IF NOT EXISTS products_phase_idx ON products(phase);

-- Refresh sample data
TRUNCATE TABLE products;

INSERT INTO products (name, phase, description, progress, category, details) VALUES
(
  'ENDO-205',
  'Therapeutics',
  'An investigational non-hormonal, disease-modifying therapeutic for endometriosis and endometrial cancer',
  65,
  'Clinical Development',
  '{"features": ["Non-hormonal mechanism", "Disease-modifying approach", "Dual indication potential", "Novel molecular target"]}'
),
(
  'ENDO-995',
  'Therapeutics',
  'An investigational first-in-class disease-modifying therapeutic for colon cancer',
  45,
  'Preclinical',
  '{"features": ["First-in-class compound", "Disease-modifying mechanism", "Targeted therapy", "Strong safety profile"]}'
),
(
  'ENDO-210',
  'Diagnostics',
  'An investigational MRI imaging agent with the potential for definitive noninvasive diagnosis of endometriosis',
  85,
  'Late Stage Development',
  '{"features": ["Non-invasive diagnosis", "High specificity", "MRI compatibility", "Rapid results"]}'
),
(
  'ENDO-311',
  'Diagnostics',
  'An investigational MRI imaging agent with the potential for definitive noninvasive diagnosis of colon cancer',
  75,
  'Clinical Validation',
  '{"features": ["Non-invasive detection", "Enhanced MRI visualization", "Early diagnosis potential", "Precise localization"]}'
);