import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: ['**/*.spec.ts'],
  use: {
    baseURL: 'http://localhost:4000',
    permissions: ['camera', 'microphone', 'clipboard-read', 'clipboard-write'],
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Prefer installed Chrome — bundled Chromium crashes on Meeting Notes hydration
        // (Whisper worker / WASM) on Windows in this environment.
        channel: 'chrome',
        launchOptions: {
          args: [
            '--use-fake-ui-for-media-stream',
            '--use-fake-device-for-media-stream',
            '--auto-select-desktop-capture-source=Entire screen',
            '--autoplay-policy=no-user-gesture-required',
          ],
        },
      },
    },
  ],
  webServer: {
    command: 'python3 -m http.server 4000 --directory dist',
    url: 'http://localhost:4000',
    reuseExistingServer: !process.env.CI,
    timeout: 15000,
  },
});

