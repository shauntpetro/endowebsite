/*
  # Create Content Tables

  1. New Tables
    - `team_members`: Company leadership and team information
    - `news_updates`: Company news and announcements
    - `products`: Product pipeline information
    - `research_publications`: Scientific publications and research

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access
    - Add policies for admin write access

  3. Sample Data
    - Add initial content for each table
*/

-- Create team_members table
CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  bio text NOT NULL,
  image_url text NOT NULL,
  linkedin_url text,
  email text,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create news_updates table
CREATE TABLE IF NOT EXISTS news_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  category text NOT NULL,
  publish_date timestamptz NOT NULL DEFAULT now(),
  icon text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phase text NOT NULL,
  description text NOT NULL,
  progress integer NOT NULL CHECK (progress >= 0 AND progress <= 100),
  category text NOT NULL,
  details jsonb NOT NULL DEFAULT '{"features": []}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create research_publications table
CREATE TABLE IF NOT EXISTS research_publications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  authors text[] NOT NULL,
  journal text NOT NULL,
  publication_date timestamptz NOT NULL,
  abstract text NOT NULL,
  doi text NOT NULL,
  category text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_publications ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access" ON team_members FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON news_updates FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON products FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON research_publications FOR SELECT USING (true);

-- Create policies for admin write access
CREATE POLICY "Allow admin write access" ON team_members 
  FOR ALL 
  TO authenticated 
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Allow admin write access" ON news_updates 
  FOR ALL 
  TO authenticated 
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Allow admin write access" ON products 
  FOR ALL 
  TO authenticated 
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Allow admin write access" ON research_publications 
  FOR ALL 
  TO authenticated 
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Add triggers for updated_at
CREATE TRIGGER update_team_members_timestamp
  BEFORE UPDATE ON team_members
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_timestamp();

CREATE TRIGGER update_news_updates_timestamp
  BEFORE UPDATE ON news_updates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_timestamp();

CREATE TRIGGER update_products_timestamp
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_timestamp();

CREATE TRIGGER update_research_publications_timestamp
  BEFORE UPDATE ON research_publications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_timestamp();

-- Add sample data
INSERT INTO team_members (name, role, bio, image_url, linkedin_url, email, order_index) VALUES
(
  'Dr. Sarah Chen',
  'Chief Executive Officer',
  'Pioneering researcher in women''s health with over 15 years of experience in biotech leadership and drug development.',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
  'https://linkedin.com/in/sarahchen',
  'sarah.chen@endocyclic.com',
  1
),
(
  'Dr. Michael Rodriguez',
  'Chief Scientific Officer',
  'Leading expert in molecular biology and drug discovery with a track record of bringing novel therapeutics to market.',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80',
  'https://linkedin.com/in/michaelrodriguez',
  'michael.rodriguez@endocyclic.com',
  2
),
(
  'Dr. Emily Taylor',
  'Head of Clinical Development',
  'Experienced clinical researcher specializing in women''s health and reproductive medicine.',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80',
  'https://linkedin.com/in/emilytaylor',
  'emily.taylor@endocyclic.com',
  3
),
(
  'James Wilson',
  'Chief Technology Officer',
  'AI and machine learning expert leading our computational drug discovery platform.',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
  'https://linkedin.com/in/jameswilson',
  'james.wilson@endocyclic.com',
  4
);

INSERT INTO products (name, phase, description, progress, category, details) VALUES
(
  'EC-101',
  'Therapeutics',
  'Novel non-hormonal therapeutic for endometriosis targeting inflammatory pathways.',
  75,
  'Clinical Stage',
  '{"features": ["Phase II clinical trials", "Demonstrated safety profile", "Targeted delivery system", "Non-hormonal mechanism"]}'
),
(
  'EC-201',
  'Therapeutics',
  'First-in-class treatment for uterine fibroids with tissue-specific activation.',
  45,
  'Preclinical',
  '{"features": ["Preclinical validation", "Novel target pathway", "Tissue-specific action", "Minimal side effects"]}'
),
(
  'EC-Dx',
  'Diagnostics',
  'AI-powered diagnostic platform for early detection of endometriosis.',
  90,
  'Late Stage',
  '{"features": ["Non-invasive testing", "AI-driven analysis", "High accuracy rate", "Rapid results"]}'
);

INSERT INTO news_updates (title, content, category, publish_date, icon) VALUES
(
  'FDA Fast Track Designation',
  'EC-101 receives Fast Track designation for endometriosis treatment',
  'Regulatory',
  '2024-03-01',
  'Award'
),
(
  'Phase II Trial Success',
  'EC-101 demonstrates significant efficacy in Phase II clinical trials',
  'Clinical',
  '2024-02-15',
  'Flask'
),
(
  'Research Publication',
  'Groundbreaking mechanism of action published in Nature Biotechnology',
  'Research',
  '2024-01-30',
  'Microscope'
);

INSERT INTO research_publications (title, authors, journal, publication_date, abstract, doi, category) VALUES
(
  'Novel pH-Dependent Peptide Platform for Targeted Therapeutics',
  ARRAY['Chen S', 'Rodriguez M', 'Taylor E', 'Wilson J'],
  'Nature Biotechnology',
  '2024-01-30',
  'We present a novel peptide-based platform that enables precise targeting of diseased tissue through pH-dependent activation. This approach demonstrates unprecedented specificity in preclinical models of endometriosis.',
  '10.1038/nbt.2024.1234',
  'Platform Technology'
),
(
  'AI-Driven Discovery of Non-Hormonal Therapeutic Targets',
  ARRAY['Wilson J', 'Chen S', 'Rodriguez M'],
  'Science Advances',
  '2023-12-15',
  'Application of machine learning algorithms to identify novel therapeutic targets for endometriosis, leading to the development of non-hormonal treatment approaches.',
  '10.1126/sciadv.2023.5678',
  'Drug Discovery'
),
(
  'Clinical Validation of EC-101 in Phase II Trials',
  ARRAY['Taylor E', 'Chen S', 'Rodriguez M'],
  'Journal of Clinical Investigation',
  '2024-02-15',
  'Results from a Phase II clinical trial demonstrating the safety and efficacy of EC-101 in patients with endometriosis.',
  '10.1172/JCI.2024.9012',
  'Clinical Research'
);