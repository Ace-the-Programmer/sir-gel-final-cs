import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.locarate',
  appName: 'LocaRate',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
