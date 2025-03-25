import React, { useState, useEffect } from 'react';
import { TamaguiProvider, YStack } from 'tamagui';
import { tamaguiConfig } from '../tamagui.config';
import { ToastProvider } from '@tamagui/toast';
import { Header } from '@/components/Header/Header';
import { useFonts } from 'expo-font';
import { Stack, useSegments, router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores';
import "@tamagui/core/reset.css";

const UNAUTHORIZED_ROUTES = ['login', 'register'];

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const segments = useSegments();
  const [sessionLoading, setSessionLoading] = useState(true);
  const { setSession, session } = useAuthStore();

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    (async () => {
      setSessionLoading(true);
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setSessionLoading(false);
      });

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
      });
      return () => subscription.unsubscribe();
    })();
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    console.log('segments', segments);
    if (loaded && !sessionLoading) {
      const isInNonAuthGroup = UNAUTHORIZED_ROUTES.includes(segments[0]);

      if (isInNonAuthGroup && session) {
        router.replace('/');
      }
    }
  }, [segments, session]);

  if (!loaded || sessionLoading) {
    return null;
  }

  return (
    <TamaguiProvider config={tamaguiConfig}>
      <ToastProvider>
        <YStack flex={1} overflow="scroll" bg="$white2">
          <Header />
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="+not-found" />
          </Stack>
        </YStack>
      </ToastProvider>
    </TamaguiProvider>
  );
}
