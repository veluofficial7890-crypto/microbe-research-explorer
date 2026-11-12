export type GrowthPoint = { x: number; y: number };

export type Microbe = {
  id: string;
  scientific_name: string;
  common_name: string;
  group_name: string;
  taxonomy: Record<string, string>;
  morphology: Record<string, string>;
  salient_features: string[];
  suitable_conditions: string;
  temperature_min: number | null;
  temperature_optimum: number | null;
  temperature_max: number | null;
  ph_min: number | null;
  ph_optimum: number | null;
  ph_max: number | null;
  oxygen_requirement: string;
  beneficial_uses: string;
  diseases_caused: string;
  temperature_growth: GrowthPoint[];
  ph_growth: GrowthPoint[];
  habitat?: string;
  ecological_role?: string;
  industrial_applications?: string;
  medical_relevance?: string;
  biotech_applications?: string;
  environmental_importance?: string;
  introduction?: string;
  references?: MicrobeReference[];
  image_url?: string | null;
  synonyms?: string[];
  metabolic_category?: string;
  temperature_classification?: string;
  ph_classification?: string;
};

export type MicrobeReference = {
  title: string;
  author: string;
  year: string;
  doi_or_url: string;
  source_name: string;
  access_date: string;
};

export type ResearchResource = {
  id: string;
  title: string;
  topic: string;
  summary: string;
  author: string;
  year: string;
  source_url: string;
  category: string;
};

export type QuizQuestion = {
  id: string;
  topic: string;
  question: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
};

export type LearningTopic = {
  id: string;
  title: string;
  category: string;
  notes: string;
  summary: string;
};

export type GlossaryTerm = {
  id: string;
  term: string;
  definition: string;
  category: string;
};
