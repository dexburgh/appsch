import { NextResponse } from 'next/server';

const ALLOWED_PROTOCOLS = new Set(['http:', 'https:']);
const BLOCKED_HOSTS = new Set(['localhost', '127.0.0.1', '0.0.0.0']);
const FETCH_TIMEOUT_MS = 5000;

function badRequest(message) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const target = searchParams.get('url');

  if (!target) {
    return badRequest('Missing required "url" query parameter.');
  }

  let parsed;
  try {
    parsed = new URL(target);
  } catch (error) {
    return badRequest('Invalid URL supplied.');
  }

  if (!ALLOWED_PROTOCOLS.has(parsed.protocol)) {
    return badRequest('Only http and https URLs are allowed.');
  }

  if (BLOCKED_HOSTS.has(parsed.hostname) || parsed.hostname.endsWith('.internal')) {
    return badRequest('The requested host is not permitted.');
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(parsed.toString(), {
      signal: controller.signal,
      headers: {
        'user-agent': 'MediBurgh-demo/1.0 (+https://example.com)'
      },
      cache: 'no-store',
    });

    const body = await response.text();
    const preview = body.slice(0, 200);

    return NextResponse.json({
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      bytes: body.length,
      preview,
    });
  } catch (error) {
    if (error.name === 'AbortError') {
      return NextResponse.json(
        { error: 'Upstream request exceeded 5 seconds and was aborted.' },
        { status: 504 }
      );
    }

    return NextResponse.json({ error: 'Failed to fetch upstream resource.' }, { status: 502 });
  } finally {
    clearTimeout(timeout);
  }
}
