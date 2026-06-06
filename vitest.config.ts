import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['__tests__/**/*.test.ts'],
    setupFiles: ['__tests__/setup/prisma-mock.ts'],
    coverage: {
      provider: 'v8',
      include: [
        'lib/anonymize.ts',
        'lib/candidate-profile.ts',
        'lib/recruiter-credits.ts',
        'lib/rate-limit.ts',
        'lib/referral.ts',
        'lib/credits.ts',
        'lib/config.ts',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
