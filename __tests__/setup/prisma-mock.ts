/**
 * Global Prisma Mock for Vitest.
 *
 * Intercepts all imports of '@/lib/prisma' so that test suites
 * can load modules that depend on Prisma without requiring
 * a real DATABASE_URL or database connection.
 *
 * The mock exposes a recursive Proxy that returns no-op functions
 * for any chained method call (e.g. prisma.user.findUnique()).
 * This is sufficient for unit tests that verify pure logic
 * without touching the database.
 */

import { vi } from 'vitest';

function createRecursiveProxy(): any {
  return new Proxy(
    {},
    {
      get(_target, prop) {
        if (prop === 'then') return undefined;
        if (prop === '$transaction') {
          return async (fn: any) => {
            if (typeof fn === 'function') {
              return fn(createRecursiveProxy());
            }
            return [];
          };
        }
        return createRecursiveProxy();
      },
      apply() {
        return Promise.resolve(null);
      },
    }
  );
}

vi.mock('@/lib/prisma', () => ({
  prisma: createRecursiveProxy(),
}));
