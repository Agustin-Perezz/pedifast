import { defineConfig, devices } from '@playwright/test';

import { monocartReporter } from './playwright.monocart-reporter';

export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list'], monocartReporter],
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'on-first-retry'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ],
  webServer: {
    command: 'npm run build && npm run preview',
    port: 4173,
    reuseExistingServer: !process.env.CI,
    env: {
      PUBLIC_SUPABASE_URL:
        process.env.PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
      PUBLIC_SUPABASE_ANON_KEY:
        process.env.PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'
    }
  }
});
