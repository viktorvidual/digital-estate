import { AppState } from 'react-native';
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, SupportedStorage } from '@supabase/supabase-js';
import { isWeb } from 'tamagui';

// Create a safe storage implementation that handles SSR
const storage: SupportedStorage = {
  getItem: async (key: string) => {
    try {
      if (isWeb && typeof window !== 'undefined') {
        return window.localStorage.getItem(key);
      }

      if (typeof window === 'undefined') {
        // Server-side rendering context
        return null;
      }

      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.warn('Error accessing storage:', error);
      return null;
    }
  },
  setItem: async (key: string, value: string) => {
    try {
      if (isWeb && typeof window !== 'undefined') {
        window.localStorage.setItem(key, value);
        return;
      }

      if (typeof window === 'undefined') {
        // Server-side rendering context
        return;
      }

      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.warn('Error setting storage:', error);
    }
  },
  removeItem: async (key: string) => {
    try {
      if (isWeb && typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
        return;
      }

      if (typeof window === 'undefined') {
        // Server-side rendering context
        return;
      }

      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.warn('Error removing from storage:', error);
    }
  },
};

const supabaseUrl = 'https://skuuzyjqzwtnufyszhwo.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrdXV6eWpxend0bnVmeXN6aHdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MTA2NTgsImV4cCI6MjA1ODM4NjY1OH0.sRVAoTDlSB5tS92VJsjEW9XtcP30P-xHHD8AwQU1o70';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: storage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Tells Supabase Auth to continuously refresh the session automatically
// if the app is in the foreground. When this is added, you will continue
// to receive `onAuthStateChange` events with the `TOKEN_REFRESHED` or
// `SIGNED_OUT` event if the user's session is terminated. This should
// only be registered once.
if (typeof window !== 'undefined') {
  AppState.addEventListener('change', state => {
    if (state === 'active') {
      supabase.auth.startAutoRefresh();
    } else {
      supabase.auth.stopAutoRefresh();
    }
  });
}
