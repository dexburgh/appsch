import { describe, it, expect } from 'vitest';

import { serverlessCatalog } from '@/lib/serverlessCatalog';

function isHttpMethod(value) {
  return /^[A-Z]+$/.test(value);
}

describe('serverlessCatalog', () => {
  it('includes a friendly name, endpoint, and methods for each function', () => {
    serverlessCatalog.forEach((fn) => {
      expect(fn.name, 'name should be present').toBeTruthy();
      expect(fn.endpoint, 'endpoint should be present').toBeTruthy();
      expect(Array.isArray(fn.methods), 'methods should be an array').toBe(true);
      expect(fn.methods.length, 'methods should not be empty').toBeGreaterThan(0);
      fn.methods.forEach((method) => {
        expect(isHttpMethod(method), `method ${method} should be uppercase HTTP verb`).toBe(true);
      });
      expect(fn.description, 'description should be present').toBeTruthy();
    });
  });

  it('does not duplicate endpoints', () => {
    const endpoints = new Set();

    serverlessCatalog.forEach((fn) => {
      expect(endpoints.has(fn.endpoint), `${fn.endpoint} should only appear once`).toBe(false);
      endpoints.add(fn.endpoint);
    });
  });
});
