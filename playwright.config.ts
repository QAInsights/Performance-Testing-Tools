import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: 'http://127.0.0.1:4321',
    launchOptions: {
      executablePath: '/opt/.devin/chrome/chrome/linux-133.0.6943.126/chrome-linux64/chrome',
    },
  },
  webServer: {
    command: 'npm run build && npm run preview -- --host 127.0.0.1',
    url: 'http://127.0.0.1:4321/Performance-Testing-Tools/',
    reuseExistingServer: true,
  },
});
