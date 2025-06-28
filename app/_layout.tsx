import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AuthProvider } from '../lib/auth-context';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="features" />
        <Stack.Screen name="auth" />
        <Stack.Screen name="paywall" />
        <Stack.Screen name="home" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="diseases" />
        <Stack.Screen name="treatments" />
        <Stack.Screen name="3d-models" />
        <Stack.Screen name="disease-detail" />
        <Stack.Screen name="treatment-detail" />
        <Stack.Screen name="model-detail" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="light" />
    </AuthProvider>
  );
}
