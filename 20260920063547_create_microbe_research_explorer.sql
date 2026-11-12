/*
# Create Microbe Research Explorer data model

1. New Tables
- `microbes` stores the curated scientific reference profiles shown in the app, including taxonomy, morphology, growth ranges, environmental conditions, and research notes.
- `recent_searches` stores each signed-in researcher's recent profile visits.
- `saved_microbes` stores each signed-in researcher's bookmarked profiles.

2. Data
- Seed six representative profiles from the supplied comprehensive microbe matrix: Escherichia coli, Bacillus subtilis, Saccharomyces cerevisiae, Penicillium chrysogenum, Plasmodium falciparum, and Chlorella vulgaris.
- Growth response arrays are stored as JSONB so the mobile app can draw compact temperature and pH visualizations.

3. Security
- Enable row-level security on every table.
- `microbes` is intentionally shared reference data and is readable by anonymous and authenticated visitors, but only writable by the service role.
- Recent searches and saved microbes are private to the authenticated owner and use `auth.uid()` ownership checks with four separate CRUD policies.

4. Important notes
- The seeded profiles are educational reference entries, not diagnostic guidance.
- The app can add more curated profiles later without changing the user activity model.
*/

CREATE TABLE IF NOT EXISTS public.microbes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scientific_name text NOT NULL UNIQUE,
  common_name text NOT NULL,
  group_name text NOT NULL,
  taxonomy jsonb NOT NULL DEFAULT '{}'::jsonb,
  morphology jsonb NOT NULL DEFAULT '{}'::jsonb,
  salient_features text[] NOT NULL DEFAULT '{}'::text[],
  suitable_conditions text NOT NULL DEFAULT '',
  temperature_min numeric,
  temperature_optimum numeric,
  temperature_max numeric,
  ph_min numeric,
  ph_optimum numeric,
  ph_max numeric,
  oxygen_requirement text NOT NULL DEFAULT '',
  beneficial_uses text NOT NULL DEFAULT '',
  diseases_caused text NOT NULL DEFAULT '',
  temperature_growth jsonb NOT NULL DEFAULT '[]'::jsonb,
  ph_growth jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.recent_searches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  microbe_id uuid NOT NULL REFERENCES public.microbes(id) ON DELETE CASCADE,
  searched_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, microbe_id)
);

CREATE TABLE IF NOT EXISTS public.saved_microbes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  microbe_id uuid NOT NULL REFERENCES public.microbes(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, microbe_id)
);

CREATE INDEX IF NOT EXISTS microbes_group_name_idx ON public.microbes(group_name);
CREATE INDEX IF NOT EXISTS recent_searches_user_searched_idx ON public.recent_searches(user_id, searched_at DESC);
CREATE INDEX IF NOT EXISTS saved_microbes_user_created_idx ON public.saved_microbes(user_id, created_at DESC);

ALTER TABLE public.microbes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recent_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_microbes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read microbes" ON public.microbes;
CREATE POLICY "Anyone can read microbes" ON public.microbes FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Authenticated users can insert microbes" ON public.microbes;
CREATE POLICY "Authenticated users can insert microbes" ON public.microbes FOR INSERT TO authenticated WITH CHECK (false);
DROP POLICY IF EXISTS "Authenticated users can update microbes" ON public.microbes;
CREATE POLICY "Authenticated users can update microbes" ON public.microbes FOR UPDATE TO authenticated USING (false) WITH CHECK (false);
DROP POLICY IF EXISTS "Authenticated users can delete microbes" ON public.microbes;
CREATE POLICY "Authenticated users can delete microbes" ON public.microbes FOR DELETE TO authenticated USING (false);

DROP POLICY IF EXISTS "Users can read own recent searches" ON public.recent_searches;
CREATE POLICY "Users can read own recent searches" ON public.recent_searches FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can create own recent searches" ON public.recent_searches;
CREATE POLICY "Users can create own recent searches" ON public.recent_searches FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own recent searches" ON public.recent_searches;
CREATE POLICY "Users can update own recent searches" ON public.recent_searches FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete own recent searches" ON public.recent_searches;
CREATE POLICY "Users can delete own recent searches" ON public.recent_searches FOR DELETE TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can read own saved microbes" ON public.saved_microbes;
CREATE POLICY "Users can read own saved microbes" ON public.saved_microbes FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can create own saved microbes" ON public.saved_microbes;
CREATE POLICY "Users can create own saved microbes" ON public.saved_microbes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own saved microbes" ON public.saved_microbes;
CREATE POLICY "Users can update own saved microbes" ON public.saved_microbes FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete own saved microbes" ON public.saved_microbes;
CREATE POLICY "Users can delete own saved microbes" ON public.saved_microbes FOR DELETE TO authenticated USING (auth.uid() = user_id);

INSERT INTO public.microbes (scientific_name, common_name, group_name, taxonomy, morphology, salient_features, suitable_conditions, temperature_min, temperature_optimum, temperature_max, ph_min, ph_optimum, ph_max, oxygen_requirement, beneficial_uses, diseases_caused, temperature_growth, ph_growth)
VALUES
('Escherichia coli', 'E. coli', 'Bacteria', '{"domain":"Bacteria","class":"Gammaproteobacteria","family":"Enterobacteriaceae","genus":"Escherichia"}', '{"cell_shape":"Rod","gram_reaction":"Gram-negative","motility":"Motile","spore_formation":"Absent"}', ARRAY['Facultative anaerobe', 'Flagellated and motile', 'Model organism for research'], 'Mesophilic; thrives in nutrient-rich media.', 10, 37, 45, 6.0, 7.0, 8.0, 'Facultative anaerobe', 'Biotechnology host, vitamin K production, cloning.', 'UTIs, diarrhea, food poisoning.', '[{"x":10,"y":8},{"x":20,"y":32},{"x":30,"y":72},{"x":37,"y":100},{"x":45,"y":18}]', '[{"x":5,"y":15},{"x":6,"y":58},{"x":7,"y":100},{"x":8,"y":64},{"x":9,"y":18}]'),
('Bacillus subtilis', 'Hay Bacillus', 'Bacteria', '{"domain":"Bacteria","class":"Bacilli","family":"Bacillaceae","genus":"Bacillus"}', '{"cell_shape":"Rod","gram_reaction":"Gram-positive","motility":"Motile","spore_formation":"Forms endospores"}', ARRAY['Spore-forming', 'Highly resilient', 'Robust protein host'], 'Mesophilic, soil-dwelling, strict aerobic.', 15, 37, 50, 6.5, 7.5, 8.5, 'Aerobic', 'Enzyme production, amylase and protease.', 'Generally benign; rare opportunistic eye infections.', '[{"x":15,"y":12},{"x":25,"y":44},{"x":37,"y":100},{"x":45,"y":66},{"x":50,"y":22}]', '[{"x":5.5,"y":18},{"x":6.5,"y":56},{"x":7.5,"y":100},{"x":8.5,"y":48},{"x":9,"y":14}]'),
('Saccharomyces cerevisiae', 'Brewer’s Yeast', 'Fungi', '{"domain":"Eukarya","kingdom":"Fungi","class":"Saccharomycetes","genus":"Saccharomyces"}', '{"cell_shape":"Oval / spherical","gram_reaction":"Chitinous cell wall","motility":"Non-motile","spore_formation":"Ascospores"}', ARRAY['Unicellular budding yeast', 'Facultative anaerobe', 'Model eukaryote'], 'Sugar-rich habitats, fruits, high moisture.', 28, 32, 35, 4.5, 5.5, 6.5, 'Facultative anaerobe', 'Baking, brewing, bioethanol, genetic model.', 'Rare opportunistic infections in immunocompromised.', '[{"x":20,"y":12},{"x":28,"y":68},{"x":32,"y":100},{"x":35,"y":44},{"x":40,"y":10}]', '[{"x":3.5,"y":12},{"x":4.5,"y":68},{"x":5.5,"y":100},{"x":6.5,"y":28}]'),
('Penicillium chrysogenum', 'Penicillium', 'Fungi', '{"domain":"Eukarya","kingdom":"Fungi","class":"Eurotiomycetes","genus":"Penicillium"}', '{"cell_shape":"Filamentous hyphae","gram_reaction":"Chitinous cell wall","motility":"Non-motile","spore_formation":"Conidia"}', ARRAY['Septate hyphae', 'Brush-like conidiophores', 'Saprophytic growth'], 'Soil, decaying organic matter, indoor damp walls.', 23, 25, 30, 5.5, 6.5, 7.5, 'Aerobic', 'Primary source of penicillin, cheese ripening.', 'Asthma triggers, rare systemic infections.', '[{"x":15,"y":10},{"x":23,"y":72},{"x":25,"y":100},{"x":30,"y":52},{"x":35,"y":12}]', '[{"x":4.5,"y":18},{"x":5.5,"y":70},{"x":6.5,"y":100},{"x":7.5,"y":34}]'),
('Plasmodium falciparum', 'Malaria Parasite', 'Protozoa', '{"domain":"Eukarya","kingdom":"Protista","class":"Aconoidasida","genus":"Plasmodium"}', '{"cell_shape":"Intracellular protozoan","gram_reaction":"No cell wall","motility":"Host-dependent","spore_formation":"Absent"}', ARRAY['Obligate intracellular parasite', 'Complex life cycle', 'Mosquito-borne'], 'Human blood and liver; requires mosquito vector.', 25, 37, 40, 7.0, 7.4, 8.0, 'Obligate intracellular', 'Important model for antiparasitic research.', 'Malaria; cerebral malaria, anemia.', '[{"x":25,"y":18},{"x":30,"y":54},{"x":37,"y":100},{"x":40,"y":70},{"x":45,"y":12}]', '[{"x":6.5,"y":14},{"x":7,"y":68},{"x":7.4,"y":100},{"x":8,"y":20}]'),
('Chlorella vulgaris', 'Green Microalgae', 'Algae', '{"domain":"Eukarya","kingdom":"Plantae","class":"Trebouxiophyceae","genus":"Chlorella"}', '{"cell_shape":"Spherical","gram_reaction":"Cellulose cell wall","motility":"Non-motile","spore_formation":"Asexual autospores"}', ARRAY['Single-celled and chlorophyll-rich', 'Photosynthetic', 'High-protein biomass'], 'Freshwater bodies, bright light, dissolved CO2.', 25, 30, 40, 6.5, 7.5, 8.5, 'Photoautotroph', 'Superfood supplements, biofuel, wastewater treatment.', 'Non-pathogenic; can cause algal blooms.', '[{"x":20,"y":12},{"x":25,"y":66},{"x":30,"y":100},{"x":40,"y":42},{"x":45,"y":10}]', '[{"x":5.5,"y":18},{"x":6.5,"y":68},{"x":7.5,"y":100},{"x":8.5,"y":40}]')
ON CONFLICT (scientific_name) DO NOTHING;