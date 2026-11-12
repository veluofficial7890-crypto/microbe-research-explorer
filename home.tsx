import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Microscope, Search, GitBranch, Microscope as MorphIcon, BarChart3,
  Scale, BookOpen, ArrowRight, FlaskConical, Thermometer, Dna, Leaf,
  Factory, Stethoscope, Globe, Beaker,
} from 'lucide-react-native';
import { Header, Footer } from '@/lib/navigation';
import { COLORS, GROUP_COLORS } from '@/lib/theme';
import { supabase } from '@/lib/supabase';
import { Microbe } from '@/lib/types';

const HERO_IMG = 'https://images.pexels.com/photos/4033151/pexels-photo-4033151.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';
const PETRI_IMG = 'https://images.pexels.com/photos/4031367/pexels-photo-4031367.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';

const FEATURES = [
  { icon: Search, title: 'Microbial Search', desc: 'Find organisms by name, genus, or characteristics', href: '/(tabs)/index' },
  { icon: GitBranch, title: 'Taxonomic Classification', desc: 'Explore domain through species hierarchies', href: '/classification' },
  { icon: MorphIcon, title: 'Morphological Characteristics', desc: 'Cell shape, arrangement, Gram reaction & more', href: '/(tabs)/index' },
  { icon: BarChart3, title: 'Growth Analysis', desc: 'Interactive temperature and pH growth charts', href: '/growth-analysis' },
  { icon: Scale, title: 'Microbial Comparison', desc: 'Compare two or more organisms side by side', href: '/compare' },
  { icon: BookOpen, title: 'Research Library', desc: 'Curated scientific resources and references', href: '/research-library' },
];

const IMPORTANCE = [
  { icon: Beaker, title: 'Biotechnology', desc: 'Host organisms for genetic engineering and protein production' },
  { icon: Leaf, title: 'Agriculture', desc: 'Nitrogen fixation, plant growth promotion, and soil health' },
  { icon: Stethoscope, title: 'Medicine', desc: 'Antibiotic production, probiotics, and pathogen research' },
  { icon: FlaskConical, title: 'Food Science', desc: 'Fermentation, food preservation, and quality control' },
  { icon: Globe, title: 'Environmental Science', desc: 'Bioremediation, nutrient cycling, and wastewater treatment' },
  { icon: Factory, title: 'Industrial Microbiology', desc: 'Enzyme, biofuel, and biochemical production at scale' },
];

const STEPS = ['SEARCH', 'EXPLORE', 'UNDERSTAND', 'COMPARE', 'LEARN'];

export default function HomePage() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const [microbes, setMicrobes] = useState<Microbe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data } = await supabase.from('microbes').select('*').order('scientific_name').limit(6);
        if (active && data) setMicrobes(data as Microbe[]);
      } catch {
        // Keep the landing page usable even when the database is temporarily offline.
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  return (
    <View style={styles.page}>
      <Header />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.hero}>
          {isDesktop ? (
            <View style={styles.heroRow}>
              <View style={styles.heroTextCol}>
                <Text style={styles.heroEyebrow}>ADVANCED DIGITAL BIOTECHNOLOGY PLATFORM</Text>
                <Text style={styles.heroTitle}>MICROBE RESEARCH{'\n'}EXPLORER</Text>
                <Text style={styles.heroTagline}>Discover Microbes. Explore Science. Understand Life.</Text>
                <Text style={styles.heroIntro}>
                  Explore the fascinating world of microorganisms through organized scientific information,
                  microbial classification, morphological characteristics and interactive growth analysis.
                </Text>
                <View style={styles.heroButtons}>
                  <Pressable style={styles.heroPrimaryBtn} onPress={() => router.push('/(tabs)/index')}>
                    <Text style={styles.heroPrimaryBtnText}>Explore Microbes</Text>
                    <ArrowRight size={16} color="#FFFFFF" />
                  </Pressable>
                  <Pressable style={styles.heroSecondaryBtn} onPress={() => router.push('/growth-analysis' as any)}>
                    <Text style={styles.heroSecondaryBtnText}>Discover Features</Text>
                  </Pressable>
                </View>
              </View>
              <View style={styles.heroImgCol}>
                <Image source={{ uri: HERO_IMG }} style={styles.heroImg} resizeMode="cover" />
                <View style={styles.heroImgBadge}>
                  <Microscope size={14} color={COLORS.teal} />
                  <Text style={styles.heroImgBadgeText}>Scientific Research</Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.heroTextCol}>
              <Text style={styles.heroEyebrow}>ADVANCED DIGITAL BIOTECHNOLOGY PLATFORM</Text>
              <Text style={styles.heroTitle}>MICROBE RESEARCH{'\n'}EXPLORER</Text>
              <Text style={styles.heroTagline}>Discover Microbes. Explore Science. Understand Life.</Text>
              <Image source={{ uri: HERO_IMG }} style={styles.heroImgMobile} resizeMode="cover" />
              <Text style={styles.heroIntro}>
                Explore the fascinating world of microorganisms through organized scientific information,
                microbial classification, morphological characteristics and interactive growth analysis.
              </Text>
              <View style={styles.heroButtons}>
                <Pressable style={styles.heroPrimaryBtn} onPress={() => router.push('/(tabs)/index')}>
                  <Text style={styles.heroPrimaryBtnText}>Explore Microbes</Text>
                  <ArrowRight size={16} color="#FFFFFF" />
                </Pressable>
                <Pressable style={styles.heroSecondaryBtn} onPress={() => router.push('/growth-analysis' as any)}>
                  <Text style={styles.heroSecondaryBtnText}>Discover Features</Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>

        {/* Platform Introduction */}
        <View style={styles.introSection}>
          <View style={styles.introInner}>
            <Text style={styles.sectionEyebrow}>ABOUT THE PLATFORM</Text>
            <Text style={styles.sectionTitle}>Making microbial knowledge accessible</Text>
            <Text style={styles.sectionBody}>
              Microbe Research Explorer bridges the gap between complex scientific literature and accessible
              learning. Our platform organizes verified microbial information into structured profiles —
              covering taxonomy, morphology, growth conditions, and ecological significance — so students,
              researchers, and enthusiasts can explore microorganisms with clarity and confidence.
            </Text>
          </View>
        </View>

        {/* Feature Cards */}
        <View style={styles.featuresSection}>
          <View style={styles.featuresInner}>
            <Text style={styles.sectionEyebrow}>PLATFORM FEATURES</Text>
            <Text style={styles.sectionTitle}>Six powerful exploration tools</Text>
            <View style={[styles.featureGrid, isDesktop && styles.featureGridDesktop]}>
              {FEATURES.map((f) => (
                <Pressable
                  key={f.title}
                  style={[styles.featureCard, isDesktop && styles.featureCardDesktop]}
                  onPress={() => router.push(f.href as any)}
                >
                  <View style={styles.featureIcon}>
                    <f.icon size={22} color={COLORS.teal} strokeWidth={2} />
                  </View>
                  <Text style={styles.featureTitle}>{f.title}</Text>
                  <Text style={styles.featureDesc}>{f.desc}</Text>
                  <View style={styles.featureArrow}>
                    <ArrowRight size={14} color={COLORS.teal} />
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
        </View>

        {/* Featured Microorganisms */}
        <View style={styles.featuredSection}>
          <View style={styles.featuredInner}>
            <Text style={styles.sectionEyebrow}>FROM THE DATABASE</Text>
            <Text style={styles.sectionTitle}>Featured microorganisms</Text>
            {loading ? (
              <View style={styles.loadingRow}><ActivityIndicator color={COLORS.teal} /></View>
            ) : (
              <View style={[styles.microbeGrid, isDesktop && styles.microbeGridDesktop]}>
                {microbes.map((m) => (
                  <Pressable
                    key={m.id}
                    style={[styles.microbeCard, isDesktop && styles.microbeCardDesktop]}
                    onPress={() => router.push(`/microbe/${m.id}`)}
                  >
                    <View style={[styles.microbeCardIcon, { backgroundColor: (GROUP_COLORS[m.group_name] || COLORS.teal) + '22' }]}>
                      <Dna size={20} color={GROUP_COLORS[m.group_name] || COLORS.teal} />
                    </View>
                    <Text style={styles.microbeCardName}>{m.scientific_name}</Text>
                    <Text style={styles.microbeCardCommon}>{m.common_name}</Text>
                    <View style={[styles.microbeCardTag, { backgroundColor: (GROUP_COLORS[m.group_name] || COLORS.teal) + '18' }]}>
                      <Text style={[styles.microbeCardTagText, { color: GROUP_COLORS[m.group_name] || COLORS.teal }]}>{m.group_name}</Text>
                    </View>
                    {m.temperature_optimum !== null && (
                      <View style={styles.microbeCardMeta}>
                        <Thermometer size={11} color={COLORS.grey} />
                        <Text style={styles.microbeCardMetaText}>Opt. {m.temperature_optimum}°C</Text>
                      </View>
                    )}
                    <Text style={styles.microbeCardBtn}>View Profile →</Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* How It Works */}
        <View style={styles.howSection}>
          <View style={styles.howInner}>
            <Text style={styles.sectionEyebrow}>HOW IT WORKS</Text>
            <Text style={styles.sectionTitle}>Your research workflow</Text>
            <View style={[styles.stepsRow, !isDesktop && styles.stepsRowMobile]}>
              {STEPS.map((step, i) => (
                <View key={step} style={styles.stepItem}>
                  <View style={styles.stepCircle}>
                    <Text style={styles.stepNum}>{i + 1}</Text>
                  </View>
                  <Text style={styles.stepLabel}>{step}</Text>
                  {i < STEPS.length - 1 && <View style={styles.stepConnector} />}
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Scientific Importance */}
        <View style={styles.importanceSection}>
          <View style={styles.importanceInner}>
            <Text style={styles.sectionEyebrow}>SCIENTIFIC IMPORTANCE</Text>
            <Text style={styles.sectionTitle}>Why microorganisms matter</Text>
            <View style={[styles.importanceGrid, isDesktop && styles.importanceGridDesktop]}>
              {IMPORTANCE.map(item => (
                <View key={item.title} style={[styles.importanceCard, isDesktop && styles.importanceCardDesktop]}>
                  <View style={styles.importanceIcon}>
                    <item.icon size={20} color={COLORS.teal} strokeWidth={2} />
                  </View>
                  <Text style={styles.importanceTitle}>{item.title}</Text>
                  <Text style={styles.importanceDesc}>{item.desc}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* CTA */}
        <View style={styles.ctaSection}>
          <Image source={{ uri: PETRI_IMG }} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
          <View style={styles.ctaOverlay} />
          <View style={styles.ctaInner}>
            <Text style={styles.ctaTitle}>Start exploring the microbial world</Text>
            <Text style={styles.ctaSubtitle}>Access curated scientific profiles, interactive growth charts, and educational resources.</Text>
            <Pressable style={styles.ctaButton} onPress={() => router.push('/(tabs)/index')}>
              <Text style={styles.ctaButtonText}>Browse the collection</Text>
              <ArrowRight size={16} color={COLORS.navy} />
            </Pressable>
          </View>
        </View>

        <Footer />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: COLORS.lightGrey },
  // Hero
  hero: { backgroundColor: COLORS.navy, paddingHorizontal: 24, paddingTop: 20, paddingBottom: 48 },
  heroRow: { flexDirection: 'row', alignItems: 'center', gap: 40, maxWidth: 1100, alignSelf: 'center', width: '100%' },
  heroTextCol: { flex: 1, gap: 14 },
  heroEyebrow: { color: COLORS.teal, fontSize: 10, fontWeight: '800', letterSpacing: 2 },
  heroTitle: { color: COLORS.white, fontSize: 38, fontWeight: '800', lineHeight: 44, letterSpacing: -1 },
  heroTagline: { color: COLORS.lightTeal, fontSize: 15, fontWeight: '600', fontStyle: 'italic' },
  heroIntro: { color: '#B8C8D6', fontSize: 14, lineHeight: 22 },
  heroButtons: { flexDirection: 'row', gap: 12, marginTop: 6 },
  heroPrimaryBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: COLORS.teal, paddingHorizontal: 20, paddingVertical: 14, borderRadius: 12 },
  heroPrimaryBtnText: { color: COLORS.white, fontSize: 14, fontWeight: '800' },
  heroSecondaryBtn: { paddingHorizontal: 20, paddingVertical: 14, borderRadius: 12, borderWidth: 1.5, borderColor: '#2A4860' },
  heroSecondaryBtnText: { color: COLORS.lightTeal, fontSize: 14, fontWeight: '700' },
  heroImgCol: { flex: 1, position: 'relative' },
  heroImg: { width: '100%', height: 320, borderRadius: 20 },
  heroImgMobile: { width: '100%', height: 220, borderRadius: 16, marginVertical: 8 },
  heroImgBadge: { position: 'absolute', bottom: 12, left: 12, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: COLORS.white, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 6 },
  heroImgBadgeText: { color: COLORS.teal, fontSize: 10, fontWeight: '800' },
  // Intro
  introSection: { backgroundColor: COLORS.white, paddingHorizontal: 24, paddingVertical: 48 },
  introInner: { maxWidth: 800, alignSelf: 'center', gap: 10 },
  sectionEyebrow: { color: COLORS.teal, fontSize: 10, fontWeight: '800', letterSpacing: 2 },
  sectionTitle: { color: COLORS.darkText, fontSize: 24, fontWeight: '800', letterSpacing: -0.5 },
  sectionBody: { color: COLORS.grey, fontSize: 14, lineHeight: 23 },
  // Features
  featuresSection: { backgroundColor: COLORS.lightGrey, paddingHorizontal: 24, paddingVertical: 48 },
  featuresInner: { maxWidth: 1100, alignSelf: 'center', gap: 20 },
  featureGrid: { gap: 14 },
  featureGridDesktop: { flexDirection: 'row', flexWrap: 'wrap' },
  featureCard: { backgroundColor: COLORS.white, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: COLORS.border, position: 'relative' },
  featureCardDesktop: { width: '31.5%' },
  featureIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: COLORS.lightTeal, alignItems: 'center', justifyContent: 'center' },
  featureTitle: { color: COLORS.darkText, fontSize: 15, fontWeight: '800', marginTop: 14 },
  featureDesc: { color: COLORS.grey, fontSize: 12, lineHeight: 18, marginTop: 6 },
  featureArrow: { position: 'absolute', top: 20, right: 20 },
  // Featured microbes
  featuredSection: { backgroundColor: COLORS.white, paddingHorizontal: 24, paddingVertical: 48 },
  featuredInner: { maxWidth: 1100, alignSelf: 'center', gap: 16 },
  loadingRow: { paddingVertical: 40, alignItems: 'center' },
  microbeGrid: { gap: 14 },
  microbeGridDesktop: { flexDirection: 'row', flexWrap: 'wrap' },
  microbeCard: { backgroundColor: COLORS.lightGrey, borderRadius: 16, padding: 18, borderWidth: 1, borderColor: COLORS.border },
  microbeCardDesktop: { width: '31.5%' },
  microbeCardIcon: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  microbeCardName: { color: COLORS.darkText, fontSize: 14, fontWeight: '800', fontStyle: 'italic', marginTop: 12 },
  microbeCardCommon: { color: COLORS.grey, fontSize: 12, marginTop: 2 },
  microbeCardTag: { alignSelf: 'flex-start', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, marginTop: 10 },
  microbeCardTagText: { fontSize: 10, fontWeight: '800' },
  microbeCardMeta: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 8 },
  microbeCardMetaText: { color: COLORS.grey, fontSize: 11, fontWeight: '600' },
  microbeCardBtn: { color: COLORS.teal, fontSize: 12, fontWeight: '800', marginTop: 12 },
  // How it works
  howSection: { backgroundColor: COLORS.lightGrey, paddingHorizontal: 24, paddingVertical: 48 },
  howInner: { maxWidth: 1100, alignSelf: 'center', gap: 24 },
  stepsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  stepsRowMobile: { flexDirection: 'column', gap: 16 },
  stepItem: { alignItems: 'center', position: 'relative', flex: 1 },
  stepCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.teal, alignItems: 'center', justifyContent: 'center' },
  stepNum: { color: COLORS.white, fontSize: 14, fontWeight: '800' },
  stepLabel: { color: COLORS.darkText, fontSize: 11, fontWeight: '700', marginTop: 8 },
  stepConnector: { position: 'absolute', top: 18, right: '-50%', width: '100%', height: 2, backgroundColor: COLORS.border, zIndex: -1 },
  // Importance
  importanceSection: { backgroundColor: COLORS.white, paddingHorizontal: 24, paddingVertical: 48 },
  importanceInner: { maxWidth: 1100, alignSelf: 'center', gap: 20 },
  importanceGrid: { gap: 14 },
  importanceGridDesktop: { flexDirection: 'row', flexWrap: 'wrap' },
  importanceCard: { backgroundColor: COLORS.lightGrey, borderRadius: 14, padding: 18, borderWidth: 1, borderColor: COLORS.border },
  importanceCardDesktop: { width: '31.5%' },
  importanceIcon: { width: 40, height: 40, borderRadius: 10, backgroundColor: COLORS.lightTeal, alignItems: 'center', justifyContent: 'center' },
  importanceTitle: { color: COLORS.darkText, fontSize: 14, fontWeight: '800', marginTop: 12 },
  importanceDesc: { color: COLORS.grey, fontSize: 12, lineHeight: 18, marginTop: 6 },
  // CTA
  ctaSection: { position: 'relative', paddingVertical: 56, paddingHorizontal: 24, overflow: 'hidden' },
  ctaOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(16,36,58,0.88)' },
  ctaInner: { alignItems: 'center', gap: 12, position: 'relative' },
  ctaTitle: { color: COLORS.white, fontSize: 24, fontWeight: '800', textAlign: 'center' },
  ctaSubtitle: { color: COLORS.lightTeal, fontSize: 14, textAlign: 'center', maxWidth: 500, lineHeight: 22 },
  ctaButton: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: COLORS.white, paddingHorizontal: 24, paddingVertical: 14, borderRadius: 12, marginTop: 8 },
  ctaButtonText: { color: COLORS.navy, fontSize: 14, fontWeight: '800' },
});
