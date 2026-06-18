import { NextResponse } from 'next/server';

import { serverlessCatalog } from '@/lib/serverlessCatalog';
import { getReleaseInfo } from '@/lib/releaseInfo';

export async function GET() {
  const release = getReleaseInfo();

  return NextResponse.json({
    ok: true,
    release,
    functions: serverlessCatalog.map((fn) => ({
      name: fn.name,
      endpoint: fn.endpoint,
      methods: fn.methods,
      description: fn.description,
    })),
  });
}
