export const COLORS = {
  navy: '#10243A',
  darkBlue: '#173B57',
  teal: '#16A6A1',
  tealDark: '#0F8580',
  lightTeal: '#DDF4F1',
  white: '#FFFFFF',
  lightGrey: '#F4F7FA',
  darkText: '#243447',
  grey: '#5A6B7E',
  lightGreyText: '#8E9BA9',
  border: '#E4ECF2',
  error: '#C0392B',
  warning: '#E67E22',
  success: '#27AE60',
} as const;

export const GROUPS = ['Bacteria', 'Archaea', 'Fungi', 'Protozoa', 'Microscopic algae', 'Viruses'] as const;

export const GROUP_COLORS: Record<string, string> = {
  Bacteria: '#16A6A1',
  Archaea: '#E67E22',
  Fungi: '#8E44AD',
  Protozoa: '#2980B9',
  'Microscopic algae': '#27AE60',
  Viruses: '#C0392B',
};

export const TEMP_CLASSES: Record<string, string> = {
  psychrophilic: 'Psychrophilic (cold-loving)',
  mesophilic: 'Mesophilic (moderate)',
  thermophilic: 'Thermophilic (heat-loving)',
  hyperthermophilic: 'Hyperthermophilic',
};

export function tempClass(opt: number | null): string {
  if (opt === null) return 'Not classified';
  if (opt < 20) return 'Psychrophilic (cold-loving)';
  if (opt < 45) return 'Mesophilic (moderate)';
  if (opt < 65) return 'Thermophilic (heat-loving)';
  return 'Hyperthermophilic';
}

export function phClass(opt: number | null): string {
  if (opt === null) return 'Not classified';
  if (opt < 5.5) return 'Acidophilic';
  if (opt <= 8.5) return 'Neutrophilic';
  return 'Alkaliphilic';
}
