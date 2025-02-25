/*
  # Update Products Table Content

  1. Changes
    - Clear existing products data
    - Insert new therapeutics and diagnostics products
    - Update schema to better reflect product information

  2. Products Added
    - ENDO-205: Non-hormonal therapeutic for endometriosis/endometrial cancer
    - ENDO-995: Disease-modifying therapeutic for colon cancer
    - ENDO-210: MRI imaging agent for endometriosis diagnosis
    - ENDO-311: MRI imaging agent for colon cancer diagnosis
*/

-- Clear existing products
TRUNCATE TABLE products;

-- Insert new products
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