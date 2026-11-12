import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, BookOpen, Dna, Search, Thermometer, Image as ImageIcon, GraduationCap } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { Microbe } from '@/lib/types';
import { COLORS, GROUP_COLORS } from '@/lib/theme';

type PageKey = 'classification' | 'growth-analysis' | 'compare' | 'image-exploration' | 'research-library' | 'learning' | 'about' | 'contact' | 'privacy' | 'terms' | 'pricing';
const PAGE: Record<PageKey, { title: string; eyebrow: string; description: string }> = {
  classification: { title: 'Taxonomic classification', eyebrow: 'MICROBIAL SYSTEMATICS', description: 'Explore microorganisms by biological group and review the taxonomy stored in each curated profile.' },
  'growth-analysis': { title: 'Growth analysis', eyebrow: 'ENVIRONMENTAL PARAMETERS', description: 'Review recorded temperature and pH ranges for organisms in the research collection.' },
  compare: { title: 'Microbial comparison', eyebrow: 'SIDE-BY-SIDE STUDY', description: 'Choose two organisms and compare their classification, morphology and growth conditions.' },
  'image-exploration': { title: 'Image exploration', eyebrow: 'VISUAL DISCOVERY', description: 'Explore organism images supplied with the research profiles. Profiles without images are clearly identified.' },
  'research-library': { title: 'Research library', eyebrow: 'SCIENTIFIC REFERENCES', description: 'Find reference details attached to microbial profiles. Verify publication details with the original publisher before citing.' },
  learning: { title: 'Learning centre', eyebrow: 'BIOLOGY LEARNING', description: 'Build a foundation in microbiology with concise learning notes and key concepts.' },
  about: { title: 'About the platform', eyebrow: 'OUR PURPOSE', description: 'Microbe Research Explorer organizes microbial information for students, educators and research learners.' },
  contact: { title: 'Contact', eyebrow: 'GET IN TOUCH', description: 'For corrections, suggestions or collaboration enquiries, contact the project team through your institution or project owner.' },
  privacy: { title: 'Privacy overview', eyebrow: 'YOUR DATA', description: 'This project uses Supabase authentication and database policies for account-specific features.' },
  terms: { title: 'Terms of use', eyebrow: 'RESPONSIBLE USE', description: 'Use this platform as an educational reference and verify scientific claims with primary literature.' },
  pricing: { title: 'Access', eyebrow: 'PLATFORM ACCESS', description: 'Core browsing features are available without an account. Account creation enables personal saved-profile features.' },
};

const LEARNING = [
  ['What is a microorganism?', 'Microorganisms are organisms or biological agents that are generally too small to be seen clearly without magnification. The group includes bacteria, archaea, many fungi, protozoa and microscopic algae.'],
  ['Microbial classification', 'Classification organizes organisms into related groups. Taxonomic ranks commonly include domain, kingdom, phylum, class, order, family, genus and species.'],
  ['Temperature and microbial growth', 'Temperature affects enzyme activity, membrane properties and growth rate. Minimum, optimum and maximum temperatures describe a growth range under specified conditions.'],
  ['pH and microbial growth', 'pH influences protein structure, transport and metabolism. Acidophiles, neutrophiles and alkaliphiles are broad categories based on preferred pH conditions.'],
  ['Oxygen requirements', 'Microbes differ in their relationship with oxygen. Common categories include obligate aerobes, obligate anaerobes and facultative anaerobes.'],
  ['Microbes in biotechnology', 'Microorganisms are used in food fermentation, enzyme production, recombinant protein expression, waste treatment and the manufacture of useful biomolecules.'],
];

export default function FeatureScreen({ page }: { page: PageKey }) {
  const config = PAGE[page];
  const [microbes, setMicrobes] = useState<Microbe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [firstId, setFirstId] = useState('');
  const [secondId, setSecondId] = useState('');

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { data, error: dbError } = await supabase.from('microbes').select('*').order('scientific_name');
        if (!alive) return;
        if (dbError) setError('The microbial database could not be reached. Check your Supabase configuration and database migration.');
        else setMicrobes((data ?? []) as Microbe[]);
      } catch {
        if (alive) setError('Unable to connect to the microbial database. Check your internet connection and Supabase settings.');
      } finally { if (alive) setLoading(false); }
    })();
    return () => { alive = false; };
  }, []);

  const filtered = useMemo(() => microbes.filter(m => `${m.scientific_name} ${m.common_name} ${m.group_name}`.toLowerCase().includes(query.toLowerCase())), [microbes, query]);
  const first = microbes.find(m => m.id === firstId);
  const second = microbes.find(m => m.id === secondId);
  const groups = [...new Set(microbes.map(m => m.group_name))].sort();

  const open = (m: Microbe) => router.push(`/microbe/${m.id}`);
  const shell = (children: ReactNode) => (
    <View style={styles.page}>
      <View style={styles.topbar}><Pressable onPress={() => router.back()} style={styles.back}><ArrowLeft size={17} color={COLORS.teal}/><Text style={styles.backText}>Back</Text></Pressable><Pressable onPress={() => router.push('/home')}><Text style={styles.home}>Home</Text></Pressable></View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.eyebrow}>{config.eyebrow}</Text><Text style={styles.title}>{config.title}</Text><Text style={styles.description}>{config.description}</Text>
        {children}
      </ScrollView>
    </View>
  );

  if (page === 'learning') return shell(<View style={styles.grid}>{LEARNING.map(([title, body], i) => <View key={title} style={styles.card}><View style={styles.icon}><GraduationCap size={20} color={COLORS.teal}/></View><Text style={styles.cardTitle}>{i + 1}. {title}</Text><Text style={styles.body}>{body}</Text></View>)}</View>);
  if (['about','contact','privacy','terms','pricing'].includes(page)) {
    const details: Record<string, string[]> = {
      about: ['Structured profiles cover taxonomy, morphology, growth conditions and selected applications.', 'The collection is designed for learning and research orientation, not as a substitute for peer-reviewed literature.', 'Database coverage depends on the profiles currently curated by the project.'],
      contact: ['Please include the organism name, the field that needs correction and a reliable source such as a DOI or institutional publication.', 'Do not submit personal medical information or confidential research data through this educational platform.'],
      privacy: ['Browsing public microbial profiles does not require an account.', 'If you create an account, authentication is handled by Supabase. Saved profiles and recent searches are associated with your account under row-level security policies.', 'Never share your password. The public anonymous API key is intended for client use; privileged service-role keys must never be placed in the website.'],
      terms: ['Scientific information is provided for education and general research support.', 'Values such as optimum temperature and pH can vary by strain, medium and experimental method.', 'Do not use the platform as clinical, diagnostic or biosafety guidance. Follow institutional procedures and authoritative sources.'],
      pricing: ['Browse and search the available microbial profiles as a guest.', 'Create a free account to save profiles and keep a personal reference list.', 'No payment processing or paid subscription is currently configured in this project.'],
    };
    return shell(<View style={styles.card}>{details[page].map((line, i) => <View key={i} style={styles.bullet}><Text style={styles.bulletDot}>•</Text><Text style={styles.body}>{line}</Text></View>)}</View>);
  }

  if (loading) return shell(<View style={styles.loading}><ActivityIndicator color={COLORS.teal}/><Text style={styles.body}>Loading microbial records…</Text></View>);
  if (error) return shell(<View style={styles.card}><Text style={styles.cardTitle}>Database connection issue</Text><Text style={styles.body}>{error}</Text></View>);
  if (page === 'compare') return shell(<>
    <View style={styles.compareSelectors}>{[0,1].map((n) => <View key={n} style={styles.selector}><Text style={styles.label}>ORGANISM {n + 1}</Text><ScrollView style={{maxHeight:180}}>{microbes.map(m => <Pressable key={m.id} onPress={() => n === 0 ? setFirstId(m.id) : setSecondId(m.id)} style={[styles.option, (n === 0 ? firstId : secondId) === m.id && styles.optionActive]}><Text style={styles.optionText}>{m.scientific_name}</Text></Pressable>)}</ScrollView></View>)}</View>
    {first && second ? <View style={styles.card}><Text style={styles.cardTitle}>Comparison</Text>{[['Group',first.group_name,second.group_name],['Common name',first.common_name,second.common_name],['Cell shape',first.morphology?.cell_shape ?? '—',second.morphology?.cell_shape ?? '—'],['Oxygen requirement',first.oxygen_requirement,second.oxygen_requirement],['Temperature range',`${first.temperature_min ?? '—'}–${first.temperature_max ?? '—'} °C`,`${second.temperature_min ?? '—'}–${second.temperature_max ?? '—'} °C`],['Optimum temperature',`${first.temperature_optimum ?? '—'} °C`,`${second.temperature_optimum ?? '—'} °C`],['pH range',`${first.ph_min ?? '—'}–${first.ph_max ?? '—'}`,`${second.ph_min ?? '—'}–${second.ph_max ?? '—'}`],['Optimum pH',first.ph_optimum ?? '—',second.ph_optimum ?? '—']].map(([label,a,b]) => <View key={String(label)} style={styles.compareRow}><Text style={styles.compareLabel}>{label}</Text><Text style={styles.compareValue}>{a}</Text><Text style={styles.compareValue}>{b}</Text></View>)}</View> : <Text style={styles.hint}>Select two different organisms to see a side-by-side comparison.</Text>}
  </>);

  return shell(<>
    <View style={styles.search}><Search size={17} color={COLORS.grey}/><TextInput value={query} onChangeText={setQuery} placeholder="Search organisms…" placeholderTextColor={COLORS.lightGreyText} style={styles.searchInput}/></View>
    {page === 'classification' && groups.map(group => <View key={group} style={styles.group}><Text style={styles.groupTitle}>{group} <Text style={styles.count}>· {microbes.filter(m => m.group_name === group).length}</Text></Text>{microbes.filter(m => m.group_name === group).filter(m => `${m.scientific_name} ${m.common_name}`.toLowerCase().includes(query.toLowerCase())).map(m => <Pressable key={m.id} style={styles.row} onPress={() => open(m)}><Dna size={18} color={GROUP_COLORS[group] || COLORS.teal}/><View style={{flex:1}}><Text style={styles.organism}>{m.scientific_name}</Text><Text style={styles.meta}>{Object.entries(m.taxonomy ?? {}).map(([k,v]) => `${k}: ${v}`).join(' · ') || m.common_name}</Text></View><Text style={styles.link}>View →</Text></Pressable>)}</View>)}
    {page === 'growth-analysis' && <View style={styles.grid}>{filtered.map(m => <Pressable key={m.id} style={styles.card} onPress={() => open(m)}><View style={styles.cardHeading}><Thermometer size={18} color={COLORS.teal}/><Text style={styles.cardTitle}>{m.scientific_name}</Text></View><Text style={styles.body}>Temperature: {m.temperature_min ?? '—'} to {m.temperature_max ?? '—'} °C · optimum {m.temperature_optimum ?? '—'} °C</Text><Text style={styles.body}>pH: {m.ph_min ?? '—'} to {m.ph_max ?? '—'} · optimum {m.ph_optimum ?? '—'}</Text><Text style={styles.meta}>Reference values only; conditions may vary by strain and method.</Text></Pressable>)}</View>}
    {page === 'image-exploration' && <View style={styles.grid}>{filtered.map(m => <Pressable key={m.id} style={styles.card} onPress={() => open(m)}>{m.image_url ? <Image source={{uri:m.image_url}} style={styles.microbeImage} resizeMode="cover"/> : <View style={styles.imagePlaceholder}><ImageIcon size={30} color={COLORS.teal}/><Text style={styles.meta}>No profile image added</Text></View>}<Text style={styles.cardTitle}>{m.scientific_name}</Text><Text style={styles.meta}>{m.group_name} · {m.common_name}</Text></Pressable>)}</View>}
    {page === 'research-library' && <View style={styles.grid}>{filtered.flatMap(m => (m.references ?? []).map((r,i) => <View key={`${m.id}-${i}`} style={styles.card}><Text style={styles.cardTitle}>{r.title}</Text><Text style={styles.body}>{r.author} · {r.year} · {r.source_name}</Text><Text style={styles.meta}>Related organism: {m.scientific_name}</Text><Text style={styles.body}>{r.doi_or_url}</Text></View>))}{microbes.every(m => !(m.references?.length)) && <View style={styles.card}><BookOpen size={22} color={COLORS.teal}/><Text style={styles.cardTitle}>No references have been attached yet</Text><Text style={styles.body}>Add publication details to a microbial profile to make them appear in this library.</Text></View>}</View>}
    <Text style={styles.resultCount}>{filtered.length} organism profiles</Text>
  </>);
}

const styles = StyleSheet.create({
  page:{flex:1,backgroundColor:COLORS.lightGrey},topbar:{height:58,backgroundColor:COLORS.navy,paddingHorizontal:22,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},back:{flexDirection:'row',alignItems:'center',gap:7},backText:{color:COLORS.white,fontWeight:'700'},home:{color:COLORS.lightTeal,fontWeight:'700'},content:{width:'100%',maxWidth:1100,alignSelf:'center',padding:22,paddingBottom:70},eyebrow:{color:COLORS.teal,fontSize:11,fontWeight:'800',letterSpacing:2,marginTop:10},title:{fontSize:30,fontWeight:'800',color:COLORS.darkText,marginTop:7},description:{fontSize:14,lineHeight:22,color:COLORS.grey,marginTop:8,marginBottom:22,maxWidth:760},search:{height:48,backgroundColor:COLORS.white,borderRadius:12,borderWidth:1,borderColor:COLORS.border,paddingHorizontal:14,flexDirection:'row',alignItems:'center',gap:10,marginBottom:16},searchInput:{flex:1,color:COLORS.darkText},grid:{flexDirection:'row',flexWrap:'wrap',gap:14},card:{backgroundColor:COLORS.white,borderRadius:16,padding:18,borderWidth:1,borderColor:COLORS.border,marginBottom:12,minWidth:260,flexGrow:1,flexBasis:300},icon:{width:42,height:42,borderRadius:12,backgroundColor:COLORS.lightTeal,alignItems:'center',justifyContent:'center',marginBottom:12},cardTitle:{fontSize:16,fontWeight:'800',color:COLORS.darkText,marginTop:8},body:{fontSize:13,lineHeight:21,color:COLORS.grey,marginTop:8},bullet:{flexDirection:'row',gap:10,marginVertical:9},bulletDot:{color:COLORS.teal,fontWeight:'900'},loading:{padding:40,alignItems:'center',gap:12},group:{backgroundColor:COLORS.white,borderRadius:15,padding:16,marginBottom:14,borderWidth:1,borderColor:COLORS.border},groupTitle:{fontSize:17,fontWeight:'800',color:COLORS.darkText,marginBottom:8},count:{fontSize:12,color:COLORS.grey},row:{flexDirection:'row',alignItems:'center',gap:12,paddingVertical:12,borderTopWidth:1,borderTopColor:COLORS.border},organism:{fontSize:14,fontWeight:'800',fontStyle:'italic',color:COLORS.darkText},meta:{fontSize:11,color:COLORS.lightGreyText,marginTop:4,lineHeight:17},link:{color:COLORS.teal,fontSize:12,fontWeight:'800'},resultCount:{color:COLORS.lightGreyText,fontSize:12,marginTop:16},cardHeading:{flexDirection:'row',alignItems:'center',gap:8},microbeImage:{height:170,width:'100%',borderRadius:12},imagePlaceholder:{height:170,backgroundColor:COLORS.lightTeal,borderRadius:12,alignItems:'center',justifyContent:'center',gap:8},compareSelectors:{flexDirection:'row',flexWrap:'wrap',gap:14},selector:{backgroundColor:COLORS.white,borderRadius:14,padding:12,borderWidth:1,borderColor:COLORS.border,flex:1,minWidth:240},label:{fontSize:10,fontWeight:'800',letterSpacing:1,color:COLORS.teal,marginBottom:8},option:{padding:9,borderRadius:8},optionActive:{backgroundColor:COLORS.lightTeal},optionText:{fontSize:12,color:COLORS.darkText},compareRow:{flexDirection:'row',gap:8,paddingVertical:10,borderTopWidth:1,borderTopColor:COLORS.border},compareLabel:{width:'27%',fontSize:11,fontWeight:'800',color:COLORS.darkText},compareValue:{flex:1,fontSize:11,color:COLORS.grey},hint:{fontSize:13,color:COLORS.grey,marginTop:16},
});
