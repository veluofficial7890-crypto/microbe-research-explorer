import { useState, useEffect } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Plus, Save, Trash2, X } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { Microbe, GrowthPoint } from '@/lib/types';

const GROUPS = ['Bacteria', 'Fungi', 'Protozoa', 'Algae', 'Archaea'];
const TAXONOMY_LEVELS = ['domain', 'kingdom', 'phylum', 'class', 'order', 'family', 'genus', 'species'];
const MORPHOLOGY_FIELDS = ['cell_shape', 'gram_reaction', 'motility', 'spore_formation', 'cell_size', 'colony_characteristics'];

type FormState = {
  scientific_name: string;
  common_name: string;
  group_name: string;
  taxonomy: Record<string, string>;
  morphology: Record<string, string>;
  salient_features: string[];
  suitable_conditions: string;
  temperature_min: string;
  temperature_optimum: string;
  temperature_max: string;
  ph_min: string;
  ph_optimum: string;
  ph_max: string;
  oxygen_requirement: string;
  beneficial_uses: string;
  diseases_caused: string;
  temperature_growth: GrowthPoint[];
  ph_growth: GrowthPoint[];
};

function emptyForm(): FormState {
  return {
    scientific_name: '',
    common_name: '',
    group_name: 'Bacteria',
    taxonomy: {},
    morphology: {},
    salient_features: [''],
    suitable_conditions: '',
    temperature_min: '',
    temperature_optimum: '',
    temperature_max: '',
    ph_min: '',
    ph_optimum: '',
    ph_max: '',
    oxygen_requirement: '',
    beneficial_uses: '',
    diseases_caused: '',
    temperature_growth: [],
    ph_growth: [],
  };
}

function microbeToForm(m: Microbe): FormState {
  return {
    scientific_name: m.scientific_name,
    common_name: m.common_name,
    group_name: m.group_name,
    taxonomy: { ...m.taxonomy },
    morphology: { ...m.morphology },
    salient_features: m.salient_features.length > 0 ? [...m.salient_features] : [''],
    suitable_conditions: m.suitable_conditions,
    temperature_min: m.temperature_min?.toString() ?? '',
    temperature_optimum: m.temperature_optimum?.toString() ?? '',
    temperature_max: m.temperature_max?.toString() ?? '',
    ph_min: m.ph_min?.toString() ?? '',
    ph_optimum: m.ph_optimum?.toString() ?? '',
    ph_max: m.ph_max?.toString() ?? '',
    oxygen_requirement: m.oxygen_requirement,
    beneficial_uses: m.beneficial_uses,
    diseases_caused: m.diseases_caused,
    temperature_growth: [...m.temperature_growth],
    ph_growth: [...m.ph_growth],
  };
}

function numOrNull(s: string): number | null {
  if (s.trim() === '') return null;
  const n = parseFloat(s);
  return isNaN(n) ? null : n;
}

function formToPayload(f: FormState): Omit<Microbe, 'id'> {
  return {
    scientific_name: f.scientific_name.trim(),
    common_name: f.common_name.trim(),
    group_name: f.group_name,
    taxonomy: Object.fromEntries(Object.entries(f.taxonomy).filter(([, v]) => v.trim() !== '')),
    morphology: Object.fromEntries(Object.entries(f.morphology).filter(([, v]) => v.trim() !== '')),
    salient_features: f.salient_features.map(s => s.trim()).filter(s => s !== ''),
    suitable_conditions: f.suitable_conditions.trim(),
    temperature_min: numOrNull(f.temperature_min),
    temperature_optimum: numOrNull(f.temperature_optimum),
    temperature_max: numOrNull(f.temperature_max),
    ph_min: numOrNull(f.ph_min),
    ph_optimum: numOrNull(f.ph_optimum),
    ph_max: numOrNull(f.ph_max),
    oxygen_requirement: f.oxygen_requirement.trim(),
    beneficial_uses: f.beneficial_uses.trim(),
    diseases_caused: f.diseases_caused.trim(),
    temperature_growth: f.temperature_growth,
    ph_growth: f.ph_growth,
  };
}

function titleCase(s: string): string {
  return s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export default function MicrobeFormScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEditing = !!id;
  const [form, setForm] = useState<FormState>(emptyForm());
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data } = await supabase.from('microbes').select('*').eq('id', id).maybeSingle();
      if (data) setForm(microbeToForm(data as Microbe));
      setLoading(false);
    })();
  }, [id]);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const updateTaxonomy = (level: string, value: string) => {
    setForm(prev => ({ ...prev, taxonomy: { ...prev.taxonomy, [level]: value } }));
  };

  const updateMorphology = (field: string, value: string) => {
    setForm(prev => ({ ...prev, morphology: { ...prev.morphology, [field]: value } }));
  };

  const updateFeature = (index: number, value: string) => {
    setForm(prev => {
      const features = [...prev.salient_features];
      features[index] = value;
      return { ...prev, salient_features: features };
    });
  };

  const addFeature = () => setForm(prev => ({ ...prev, salient_features: [...prev.salient_features, ''] }));
  const removeFeature = (index: number) => setForm(prev => ({ ...prev, salient_features: prev.salient_features.filter((_, i) => i !== index) }));

  const updateGrowthPoint = (type: 'temperature_growth' | 'ph_growth', index: number, axis: 'x' | 'y', value: string) => {
    const n = parseFloat(value);
    setForm(prev => {
      const points = [...prev[type]];
      points[index] = { ...points[index], [axis]: isNaN(n) ? 0 : n };
      return { ...prev, [type]: points };
    });
  };

  const addGrowthPoint = (type: 'temperature_growth' | 'ph_growth') => {
    setForm(prev => ({ ...prev, [type]: [...prev[type], { x: 0, y: 0 }] }));
  };

  const removeGrowthPoint = (type: 'temperature_growth' | 'ph_growth', index: number) => {
    setForm(prev => ({ ...prev, [type]: prev[type].filter((_, i) => i !== index) }));
  };

  const save = async () => {
    if (!form.scientific_name.trim() || !form.common_name.trim()) {
      setError('Scientific name and common name are required.');
      return;
    }
    setSaving(true);
    setError('');
    const payload = formToPayload(form);
    let result;
    if (isEditing && id) {
      result = await supabase.from('microbes').update(payload).eq('id', id).select().single();
    } else {
      result = await supabase.from('microbes').insert(payload).select().single();
    }
    setSaving(false);
    if (result.error) {
      setError(result.error.message);
      return;
    }
    if (isEditing) {
      router.back();
    } else if (result.data) {
      router.replace(`/microbe/${result.data.id}`);
    }
  };

  const remove = async () => {
    if (!id) return;
    setSaving(true);
    const { error: delError } = await supabase.from('microbes').delete().eq('id', id);
    setSaving(false);
    if (delError) { setError(delError.message); return; }
    router.replace('/(tabs)/browse');
  };

  if (loading) return <View style={styles.center}><ActivityIndicator color="#0f766e" /></View>;

  return (
    <KeyboardAvoidingView style={styles.page} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()} hitSlop={12}>
          <ArrowLeft size={20} color="#173b3a" />
        </Pressable>
        <Text style={styles.headerTitle}>{isEditing ? 'Edit microbe' : 'Add microbe'}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 100 }}>
        <FormSection title="Basic information">
          <FormField label="Scientific name *" value={form.scientific_name} onChangeText={v => update('scientific_name', v)} placeholder="e.g. Lactobacillus acidophilus" />
          <FormField label="Common name *" value={form.common_name} onChangeText={v => update('common_name', v)} placeholder="e.g. Acidophilus" />
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Microbial group</Text>
            <View style={styles.chipRow}>
              {GROUPS.map(g => (
                <Pressable key={g} style={[styles.chip, form.group_name === g && styles.chipActive]} onPress={() => update('group_name', g)}>
                  <Text style={[styles.chipText, form.group_name === g && styles.chipTextActive]}>{g}</Text>
                </Pressable>
              ))}
            </View>
          </View>
          <FormField label="Oxygen requirement" value={form.oxygen_requirement} onChangeText={v => update('oxygen_requirement', v)} placeholder="e.g. Facultative anaerobe" />
          <FormField label="Suitable conditions" value={form.suitable_conditions} onChangeText={v => update('suitable_conditions', v)} placeholder="e.g. Mesophilic, nutrient-rich media" multiline />
        </FormSection>

        <FormSection title="Taxonomic classification">
          {TAXONOMY_LEVELS.map(level => (
            <FormField key={level} label={titleCase(level)} value={form.taxonomy[level] ?? ''} onChangeText={v => updateTaxonomy(level, v)} placeholder={level === 'domain' ? 'e.g. Bacteria' : `e.g. ${level}`} />
          ))}
        </FormSection>

        <FormSection title="Morphological characteristics">
          {MORPHOLOGY_FIELDS.map(field => (
            <FormField key={field} label={titleCase(field)} value={form.morphology[field] ?? ''} onChangeText={v => updateMorphology(field, v)} placeholder={`Enter ${field.replace(/_/g, ' ')}`} />
          ))}
        </FormSection>

        <FormSection title="Salient features">
          {form.salient_features.map((f, i) => (
            <View key={i} style={styles.dynamicRow}>
              <TextInput style={styles.dynamicInput} value={f} onChangeText={v => updateFeature(i, v)} placeholder={`Feature ${i + 1}`} placeholderTextColor="#8b9a9a" />
              <Pressable style={styles.dynamicRemove} onPress={() => removeFeature(i)}><X size={15} color="#b45344" /></Pressable>
            </View>
          ))}
          <Pressable style={styles.addRowButton} onPress={addFeature}>
            <Plus size={16} color="#0f766e" /><Text style={styles.addRowText}>Add feature</Text>
          </Pressable>
        </FormSection>

        <FormSection title="Temperature range (°C)">
          <View style={styles.tripleRow}>
            <FormField label="Min" value={form.temperature_min} onChangeText={v => update('temperature_min', v)} placeholder="10" keyboardType="numeric" />
            <FormField label="Optimum" value={form.temperature_optimum} onChangeText={v => update('temperature_optimum', v)} placeholder="37" keyboardType="numeric" />
            <FormField label="Max" value={form.temperature_max} onChangeText={v => update('temperature_max', v)} placeholder="45" keyboardType="numeric" />
          </View>
          <GrowthPointEditor label="Temperature growth data (X = temp °C, Y = growth %)" points={form.temperature_growth} onChange={(i, axis, v) => updateGrowthPoint('temperature_growth', i, axis, v)} onAdd={() => addGrowthPoint('temperature_growth')} onRemove={(i) => removeGrowthPoint('temperature_growth', i)} />
        </FormSection>

        <FormSection title="pH range">
          <View style={styles.tripleRow}>
            <FormField label="Min" value={form.ph_min} onChangeText={v => update('ph_min', v)} placeholder="6.0" keyboardType="numeric" />
            <FormField label="Optimum" value={form.ph_optimum} onChangeText={v => update('ph_optimum', v)} placeholder="7.0" keyboardType="numeric" />
            <FormField label="Max" value={form.ph_max} onChangeText={v => update('ph_max', v)} placeholder="8.0" keyboardType="numeric" />
          </View>
          <GrowthPointEditor label="pH growth data (X = pH, Y = growth %)" points={form.ph_growth} onChange={(i, axis, v) => updateGrowthPoint('ph_growth', i, axis, v)} onAdd={() => addGrowthPoint('ph_growth')} onRemove={(i) => removeGrowthPoint('ph_growth', i)} />
        </FormSection>

        <FormSection title="Research notes">
          <FormField label="Beneficial uses" value={form.beneficial_uses} onChangeText={v => update('beneficial_uses', v)} placeholder="e.g. Probiotic, fermentation" multiline />
          <FormField label="Diseases caused" value={form.diseases_caused} onChangeText={v => update('diseases_caused', v)} placeholder="e.g. None known" multiline />
        </FormSection>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </ScrollView>

      <View style={styles.footer}>
        {isEditing ? (
          <Pressable style={styles.deleteButton} onPress={remove} disabled={saving}>
            <Trash2 size={18} color="#b45344" /><Text style={styles.deleteText}>Delete</Text>
          </Pressable>
        ) : null}
        <Pressable style={({ pressed }) => [styles.saveButton, pressed && styles.pressed]} onPress={save} disabled={saving}>
          {saving ? <ActivityIndicator color="#ffffff" /> : <><Save size={18} color="#ffffff" /><Text style={styles.saveButtonText}>{isEditing ? 'Save changes' : 'Create profile'}</Text></>}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionCard}>{children}</View>
    </View>
  );
}

function FormField({ label, value, onChangeText, placeholder, multiline, keyboardType }: { label: string; value: string; onChangeText: (v: string) => void; placeholder?: string; multiline?: boolean; keyboardType?: 'default' | 'numeric' }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput style={[styles.input, multiline && styles.inputMultiline]} value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor="#8b9a9a" multiline={multiline} keyboardType={keyboardType} autoCapitalize="none" />
    </View>
  );
}

function GrowthPointEditor({ label, points, onChange, onAdd, onRemove }: { label: string; points: GrowthPoint[]; onChange: (index: number, axis: 'x' | 'y', value: string) => void; onAdd: () => void; onRemove: (index: number) => void }) {
  return (
    <View style={styles.growthEditor}>
      <Text style={styles.growthEditorLabel}>{label}</Text>
      {points.map((p, i) => (
        <View key={i} style={styles.growthPointRow}>
          <TextInput style={styles.growthPointInput} value={p.x.toString()} onChangeText={v => onChange(i, 'x', v)} placeholder="X" placeholderTextColor="#8b9a9a" keyboardType="numeric" />
          <TextInput style={styles.growthPointInput} value={p.y.toString()} onChangeText={v => onChange(i, 'y', v)} placeholder="Y" placeholderTextColor="#8b9a9a" keyboardType="numeric" />
          <Pressable style={styles.dynamicRemove} onPress={() => onRemove(i)}><X size={15} color="#b45344" /></Pressable>
        </View>
      ))}
      <Pressable style={styles.addRowButton} onPress={onAdd}>
        <Plus size={16} color="#0f766e" /><Text style={styles.addRowText}>Add data point</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#f3f7f5' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 22, paddingTop: 50, paddingBottom: 14, backgroundColor: '#ffffff' },
  backButton: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#f0f5f3', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: '#173b3a', fontSize: 18, fontWeight: '800' },
  scroll: { flex: 1 },
  section: { paddingHorizontal: 20, marginTop: 18 },
  sectionTitle: { color: '#173b3a', fontSize: 14, fontWeight: '800', marginBottom: 10 },
  sectionCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#eef4f2', gap: 12 },
  field: { gap: 6 },
  fieldLabel: { color: '#7a8a89', fontSize: 11, fontWeight: '700' },
  input: { height: 46, backgroundColor: '#f5f8f7', borderRadius: 10, paddingHorizontal: 12, color: '#173b3a', fontSize: 13, borderWidth: 1, borderColor: '#e4edeb' },
  inputMultiline: { height: 80, paddingTop: 10, textAlignVertical: 'top' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { height: 32, backgroundColor: '#f5f8f7', borderRadius: 16, paddingHorizontal: 13, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#e4edeb' },
  chipActive: { backgroundColor: '#0f766e', borderColor: '#0f766e' },
  chipText: { color: '#46615f', fontSize: 12, fontWeight: '700' },
  chipTextActive: { color: '#ffffff' },
  tripleRow: { flexDirection: 'row', gap: 10 },
  dynamicRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  dynamicInput: { flex: 1, height: 42, backgroundColor: '#f5f8f7', borderRadius: 10, paddingHorizontal: 12, color: '#173b3a', fontSize: 13, borderWidth: 1, borderColor: '#e4edeb' },
  dynamicRemove: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#fdf0ee', alignItems: 'center', justifyContent: 'center' },
  addRowButton: { flexDirection: 'row', gap: 6, alignItems: 'center', paddingVertical: 8 },
  addRowText: { color: '#0f766e', fontSize: 13, fontWeight: '700' },
  growthEditor: { marginTop: 6 },
  growthEditorLabel: { color: '#7a8a89', fontSize: 11, fontWeight: '700', marginBottom: 8 },
  growthPointRow: { flexDirection: 'row', gap: 8, alignItems: 'center', marginBottom: 8 },
  growthPointInput: { flex: 1, height: 42, backgroundColor: '#f5f8f7', borderRadius: 10, paddingHorizontal: 12, color: '#173b3a', fontSize: 13, borderWidth: 1, borderColor: '#e4edeb' },
  errorText: { color: '#b45344', fontSize: 13, textAlign: 'center', marginTop: 16, paddingHorizontal: 20, lineHeight: 20 },
  footer: { flexDirection: 'row', gap: 10, paddingHorizontal: 20, paddingTop: 14, paddingBottom: 30, backgroundColor: '#ffffff', borderTopWidth: 1, borderTopColor: '#e4edeb' },
  deleteButton: { height: 50, backgroundColor: '#fdf0ee', borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1, borderColor: '#f0d9d4', paddingHorizontal: 16 },
  deleteText: { color: '#b45344', fontSize: 14, fontWeight: '800' },
  saveButton: { flex: 1, height: 50, backgroundColor: '#0f766e', borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  pressed: { opacity: 0.82 },
  saveButtonText: { color: '#ffffff', fontSize: 14, fontWeight: '800' },
});
