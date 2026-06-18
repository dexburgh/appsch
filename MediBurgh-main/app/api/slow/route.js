import { NextResponse } from 'next/server';

const UPSTREAM_TIMEOUT_MS = 4500;

async function simulateUpstream(signal) {
  // Simulate an upstream that respects abort signals by racing a timeout.
  return new Promise((resolve, reject) => {
    const abortError = new Error('Aborted');
    abortError.name = 'AbortError';

    const onAbort = () => {
      signal.removeEventListener('abort', onAbort);
      reject(abortError);
    };

    signal.addEventListener('abort', onAbort, { once: true });

    const latency = 2000;
    const timer = setTimeout(() => {
      signal.removeEventListener('abort', onAbort);
      resolve({ latency });
    }, latency);

    if (signal.aborted) {
      clearTimeout(timer);
      onAbort();
    }
  });
}

export async function GET() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);

  try {
    const started = Date.now();
    const { latency } = await simulateUpstream(controller.signal);
    const duration = Date.now() - started;

    return NextResponse.json({
      ok: true,
      upstreamLatencyMs: latency,
      totalDurationMs: duration,
      note: 'Upstream completed within the configured timeout budget.',
    });
  } catch (error) {
    if (error.name === 'AbortError') {
      return NextResponse.json(
        {
          ok: false,
          error: 'Upstream timeout',
          hint: 'The upstream response exceeded 4.5 seconds and was aborted to avoid 504s.',
        },
        { status: 504 }
      );
    }

    return NextResponse.json(
      {
        ok: false,
        error: 'Unexpected upstream failure',
      },
      { status: 502 }
    );
  } finally {
    clearTimeout(timeout);
  }
}
