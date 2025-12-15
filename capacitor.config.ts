import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.globalgourmet.scout',
  appName: 'Global Gourmet Scout',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;