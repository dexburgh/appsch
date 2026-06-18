import { NextResponse } from 'next/server';

const MAX_BYTES = 1024 * 1024; // 1 MiB
const allowHeader = { Allow: 'POST' };

function methodNotAllowed() {
  return NextResponse.json({ error: 'Only POST is supported.' }, { status: 405, headers: allowHeader });
}

export async function POST(request) {
  const contentLength = request.headers.get('content-length');
  if (contentLength && Number(contentLength) > MAX_BYTES) {
    return NextResponse.json(
      { error: 'Payload too large. Limit is 1 MiB.' },
      { status: 413, headers: { Connection: 'close' } }
    );
  }

  const buffer = await request.arrayBuffer();
  if (buffer.byteLength > MAX_BYTES) {
    return NextResponse.json(
      { error: 'Payload too large after buffering. Limit is 1 MiB.' },
      { status: 413 }
    );
  }

  return NextResponse.json({
    ok: true,
    bytesReceived: buffer.byteLength,
    hint: 'Enforce an upper bound before processing uploads to avoid FUNCTION_PAYLOAD_TOO_LARGE errors.',
  });
}

export const GET = methodNotAllowed;
export const PUT = methodNotAllowed;
export const PATCH = methodNotAllowed;
export const DELETE = methodNotAllowed;
export const OPTIONS = () => new NextResponse(null, { status: 204, headers: allowHeader });
