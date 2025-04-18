import React, { useState, useEffect } from 'react';
import { TamaguiProvider, useMedia } from 'tamagui';
import { ToastViewport } from '@tamagui/toast';
import { tamaguiConfig } from '../tamagui.config';
import { ToastProvider } from '@tamagui/toast';
import { Header } from '@/components/Header/Header';
import { SideBar } from '@/components/SideBar/SideBar';
import { useFonts } from 'expo-font';
import { Stack, useSegments, router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores';
import '@tamagui/core/reset.css';
import { getCustomer } from '@/services';
import { MyToast } from '@/components/shared/Toast/Toast';
import Div100vh from 'react-div-100vh';

const UNAUTHORIZED_ROUTES = ['login', 'register'];

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const media = useMedia();

  const segments = useSegments();
  const [sessionLoading, setSessionLoading] = useState(false);
  const { setSession, session } = useAuthStore();

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    (async () => {
      setSessionLoading(true);
      const latestSession = await supabase.auth.getSession();

      if (latestSession.data.session) {
        const userId = latestSession.data.session?.user.id;
        // console.log('Fetched session on load:', latestSession.data.session);

        const { data: customer, error } = await getCustomer(userId);

        if (error || !customer) {
          console.error(error ? error : 'No customer response on layout load');
          setSessionLoading(false);
          return;
        }

        setSession(latestSession.data.session, customer);
      }

      setSessionLoading(false);

      // Listen for auth state changes
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (_event === 'PASSWORD_RECOVERY') {
          //Login the user
          return console.log('Password recovery event');
        }
        // console.log('Auth State Changed:', session);

        if (session) {
          setTimeout(async () => {
            const { data: customer, error } = await getCustomer(session.user.id);
            if (error || !customer) {
              console.error(error ? error : 'No customer available on Auth State Change');
              return setSession(session, null);
            }

            setSession(session, customer);
          }, 100);
        } else {
          setSession(null, null);
        }
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
    if (loaded && !sessionLoading) {
      const isInNonAuthGroup = UNAUTHORIZED_ROUTES.includes(segments[0]);

      if (isInNonAuthGroup && session) {
        console.log('redirecting');

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
        <SideBar />

        <Div100vh
          style={{
            overflowY: 'scroll',
          }}
        >
          <Header />
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="+not-found" />
          </Stack>
        </Div100vh>
        <MyToast />
        <ToastViewport
          top={'5%'}
          alignSelf="center"
          right={media['2xl'] ? '20%' : media.lg ? '15%' : undefined}
        />
      </ToastProvider>
    </TamaguiProvider>
  );
}
