import { defineConfig } from '@playwright/test';
import { sitePath } from './tests/e2e/paths';

const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;
const port = Number(process.env.PLAYWRIGHT_PORT || 4321);

export default defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    launchOptions: executablePath ? { executablePath } : undefined,
  },
  webServer: {
    command: `npm run build && npm run preview -- --host 127.0.0.1 --port ${port}`,
    url: `http://127.0.0.1:${port}${sitePath()}`,
    reuseExistingServer: true,
  },
});
