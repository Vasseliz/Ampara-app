import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import { env } from '../config/env';
import { secureStorage } from '../storage/secure';

/**
 * Cliente Supabase para o app. Usa fluxo PKCE (adequado para cliente nativo /
 * APK real) e guarda o material de sessão no SecureStore (nunca AsyncStorage).
 */
const secureStoreAuthAdapter = {
  getItem: (key: string) => secureStorage.getItem(key),
  setItem: (key: string, value: string) => secureStorage.setItem(key, value),
  removeItem: (key: string) => secureStorage.deleteItem(key),
};

export const supabase = createClient(env.supabaseUrl, env.supabaseAnonKey, {
  auth: {
    storage: secureStoreAuthAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    flowType: 'pkce',
  },
});
