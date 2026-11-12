import { useState } from 'react';
import { Pressable, StyleSheet, Text, View, ScrollView, useWindowDimensions, Platform } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Microscope, Menu, X, Search } from 'lucide-react-native';
import { COLORS } from './theme';

const NAV_ITEMS = [
  { label: 'Home', href: '/home' },
  { label: 'Explore Microbes', href: '/(tabs)/index' },
  { label: 'Classification', href: '/classification' },
  { label: 'Growth Analysis', href: '/growth-analysis' },
  { label: 'Compare', href: '/compare' },
  { label: 'Image Exploration', href: '/image-exploration' },
  { label: 'Research Library', href: '/research-library' },
  { label: 'Learning Centre', href: '/learning' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const [menuOpen, setMenuOpen] = useState(false);
  const isDesktop = width >= 768;

  const isActive = (href: string) => {
    const cleanPath = href.replace(/^\//, '').replace(/^\(tabs\)\//, '');
    if (cleanPath === 'home' && pathname === '/home') return true;
    if (cleanPath === '(tabs)/index' && pathname.startsWith('/(tabs)')) return true;
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <>
      <View style={styles.header}>
        <Pressable style={styles.logoRow} onPress={() => router.push('/home')}>
          <View style={styles.logoMark}>
            <Microscope size={20} color="#FFFFFF" strokeWidth={2.2} />
          </View>
          <View>
            <Text style={styles.logoTitle}>MICROBE RESEARCH EXPLORER</Text>
            <Text style={styles.logoTagline}>Discover Microbes. Explore Science. Understand Life.</Text>
          </View>
        </Pressable>

        {isDesktop ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.navRow}>
            {NAV_ITEMS.map(item => (
              <Pressable
                key={item.href}
                style={[styles.navItem, isActive(item.href) && styles.navItemActive]}
                onPress={() => router.push(item.href as any)}
              >
                <Text style={[styles.navText, isActive(item.href) && styles.navTextActive]}>{item.label}</Text>
              </Pressable>
            ))}
          </ScrollView>
        ) : (
          <Pressable style={styles.menuButton} onPress={() => setMenuOpen(!menuOpen)} hitSlop={12}>
            {menuOpen ? <X size={24} color={COLORS.white} /> : <Menu size={24} color={COLORS.white} />}
          </Pressable>
        )}
      </View>

      {!isDesktop && menuOpen && (
        <View style={styles.mobileMenu}>
          <ScrollView>
            {NAV_ITEMS.map(item => (
              <Pressable
                key={item.href}
                style={[styles.mobileNavItem, isActive(item.href) && styles.mobileNavActive]}
                onPress={() => { router.push(item.href as any); setMenuOpen(false); }}
              >
                <Text style={[styles.mobileNavText, isActive(item.href) && styles.mobileNavTextActive]}>{item.label}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}
    </>
  );
}

export function Footer() {
  const router = useRouter();
  return (
    <View style={styles.footer}>
      <View style={styles.footerInner}>
        <View style={styles.footerCol}>
          <Text style={styles.footerTitle}>MICROBE RESEARCH EXPLORER</Text>
          <Text style={styles.footerTagline}>Connecting Microbial Knowledge with Digital Innovation.</Text>
        </View>
        <View style={styles.footerRow}>
          <Pressable onPress={() => router.push('/about' as any)}><Text style={styles.footerLink}>About Us</Text></Pressable>
          <Pressable onPress={() => router.push('/contact' as any)}><Text style={styles.footerLink}>Contact</Text></Pressable>
          <Pressable onPress={() => router.push('/privacy' as any)}><Text style={styles.footerLink}>Privacy Policy</Text></Pressable>
          <Pressable onPress={() => router.push('/terms' as any)}><Text style={styles.footerLink}>Terms & Conditions</Text></Pressable>
        </View>
      </View>
      <Text style={styles.footerDisclaimer}>
        Microbe Research Explorer is an educational and research-support platform. Information is provided for scientific learning and reference purposes. It is not a clinical diagnostic service. Users should consult authoritative scientific sources and qualified professionals for specialized applications.
      </Text>
      <Text style={styles.footerCopyright}>© 2026 Microbe Research Explorer. All rights reserved.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: COLORS.navy,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'web' ? 16 : 50,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  logoMark: { width: 38, height: 38, borderRadius: 10, backgroundColor: COLORS.teal, alignItems: 'center', justifyContent: 'center' },
  logoTitle: { color: COLORS.white, fontSize: 12, fontWeight: '800', letterSpacing: 1.5 },
  logoTagline: { color: COLORS.lightTeal, fontSize: 9, marginTop: 2 },
  navRow: { flexDirection: 'row', alignItems: 'center', gap: 6, maxWidth: 600 },
  navItem: { paddingHorizontal: 10, paddingVertical: 8, borderRadius: 8 },
  navItemActive: { backgroundColor: COLORS.teal },
  navText: { color: '#B8C8D6', fontSize: 11, fontWeight: '700' },
  navTextActive: { color: COLORS.white },
  menuButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  mobileMenu: { backgroundColor: COLORS.navy, paddingHorizontal: 20, paddingBottom: 20 },
  mobileNavItem: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#1F3850' },
  mobileNavActive: {},
  mobileNavText: { color: '#B8C8D6', fontSize: 14, fontWeight: '700' },
  mobileNavTextActive: { color: COLORS.teal },
  footer: { backgroundColor: COLORS.navy, paddingHorizontal: 24, paddingTop: 36, paddingBottom: 24 },
  footerInner: { gap: 16, maxWidth: 1000, alignSelf: 'center', width: '100%' },
  footerCol: { gap: 6 },
  footerTitle: { color: COLORS.white, fontSize: 12, fontWeight: '800', letterSpacing: 1 },
  footerTagline: { color: COLORS.lightTeal, fontSize: 10, lineHeight: 16 },
  footerRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  footerLink: { color: '#B8C8D6', fontSize: 11, fontWeight: '600' },
  footerDisclaimer: { color: '#889AAB', fontSize: 10, lineHeight: 16, marginTop: 16, maxWidth: 800, alignSelf: 'center', textAlign: 'center' },
  footerCopyright: { color: '#6D8294', fontSize: 10, textAlign: 'center', marginTop: 12 },
});
