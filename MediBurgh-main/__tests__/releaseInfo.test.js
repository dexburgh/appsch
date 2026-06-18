import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { getReleaseInfo } from '@/lib/releaseInfo';

const packageJson = await import('../package.json', {
  with: { type: 'json' },
});

describe('getReleaseInfo', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns project metadata from package.json', () => {
    const mockDate = new Date('2024-01-01T00:00:00.000Z');
    vi.setSystemTime(mockDate);

    const info = getReleaseInfo();

    expect(info).toMatchObject({
      name: packageJson.default.name,
      version: packageJson.default.version,
    });
    expect(new Date(info.lastAudited).toISOString()).toBe(mockDate.toISOString());
  });
});
