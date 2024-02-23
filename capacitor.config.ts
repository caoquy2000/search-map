import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.search.map',
  appName: 'demo-search-map',
  webDir: 'build',
  server: {
    androidScheme: 'https'
  }
};

export default config;
