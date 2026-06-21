import type { ExpoConfig } from 'expo/config';

/**
 * Configuração do app Ampara (paciente). `scheme` define o deep link consumido
 * pela Track B (aceite de convite). Apenas chaves públicas Supabase entram via
 * EXPO_PUBLIC_* — segredos de servidor nunca vão para o bundle.
 */
const config: ExpoConfig = {
  name: 'Ampara',
  slug: 'ampara-mobile',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'ampara',
  userInterfaceStyle: 'automatic',
  android: {
    package: 'com.ampara.mobile',
    adaptiveIcon: {
      backgroundColor: '#E6F4FE',
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
  },
  ios: {
    bundleIdentifier: 'com.ampara.mobile',
    supportsTablet: true,
  },
  web: {
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    'expo-secure-store',
    [
      'expo-splash-screen',
      {
        backgroundColor: '#208AEF',
        android: { image: './assets/images/splash-icon.png', imageWidth: 76 },
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
};

export default config;
