import { NextResponse } from 'next/server';

const MAX_HEADER_BYTES = 256;
const allowHeader = { Allow: 'GET' };

export async function GET(request) {
  const clientVersion = request.headers.get('x-client-version') ?? '';
  const metadata = request.headers.get('x-metadata') ?? '';

  if (!clientVersion) {
    return NextResponse.json(
      { error: 'Missing required x-client-version header.' },
      { status: 400 }
    );
  }

  if (metadata.length > MAX_HEADER_BYTES) {
    return NextResponse.json(
      {
        error: 'Custom metadata header is too large.',
        limit: MAX_HEADER_BYTES,
      },
      {
        status: 431,
        headers: { Connection: 'close' },
      }
    );
  }

  return NextResponse.json({
    ok: true,
    clientVersion,
    metadataLength: metadata.length,
    tip: 'Keep custom headers small to avoid REQUEST_HEADER_TOO_LARGE responses.',
  });
}

function methodNotAllowed() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405, headers: allowHeader });
}

export const POST = methodNotAllowed;
export const PUT = methodNotAllowed;
export const PATCH = methodNotAllowed;
export const DELETE = methodNotAllowed;
export const OPTIONS = () => new NextResponse(null, { status: 204, headers: allowHeader });
