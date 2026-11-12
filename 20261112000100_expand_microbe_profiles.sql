-- Optional profile fields used by the web and mobile detail views.
ALTER TABLE public.microbes
  ADD COLUMN IF NOT EXISTS habitat text,
  ADD COLUMN IF NOT EXISTS ecological_role text,
  ADD COLUMN IF NOT EXISTS industrial_applications text,
  ADD COLUMN IF NOT EXISTS medical_relevance text,
  ADD COLUMN IF NOT EXISTS biotech_applications text,
  ADD COLUMN IF NOT EXISTS environmental_importance text,
  ADD COLUMN IF NOT EXISTS introduction text,
  ADD COLUMN IF NOT EXISTS "references" jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS image_url text,
  ADD COLUMN IF NOT EXISTS synonyms text[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS metabolic_category text,
  ADD COLUMN IF NOT EXISTS temperature_classification text,
  ADD COLUMN IF NOT EXISTS ph_classification text;

-- Only project administrators (assigned through Supabase Auth app_metadata) may
-- create, edit or delete shared reference records. Never expose the service key.
DROP POLICY IF EXISTS "Project admins can insert microbes" ON public.microbes;
CREATE POLICY "Project admins can insert microbes" ON public.microbes
  FOR INSERT TO authenticated
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS "Project admins can update microbes" ON public.microbes;
CREATE POLICY "Project admins can update microbes" ON public.microbes
  FOR UPDATE TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS "Project admins can delete microbes" ON public.microbes;
CREATE POLICY "Project admins can delete microbes" ON public.microbes
  FOR DELETE TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
