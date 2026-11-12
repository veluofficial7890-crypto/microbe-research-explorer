import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AuthProvider } from '@/lib/auth';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="home" />
        <Stack.Screen name="classification" />
        <Stack.Screen name="growth-analysis" />
        <Stack.Screen name="compare" />
        <Stack.Screen name="image-exploration" />
        <Stack.Screen name="research-library" />
        <Stack.Screen name="learning" />
        <Stack.Screen name="about" />
        <Stack.Screen name="contact" />
        <Stack.Screen name="privacy" />
        <Stack.Screen name="terms" />
        <Stack.Screen name="pricing" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="microbe/[id]" options={{ presentation: 'card' }} />
        <Stack.Screen name="microbe-form" options={{ presentation: 'card' }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="light" />
    </AuthProvider>
  );
}
