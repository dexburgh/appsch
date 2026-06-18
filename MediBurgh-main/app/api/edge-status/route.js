export const runtime = 'edge';

export async function GET() {
  return new Response(
    JSON.stringify({
      ok: true,
      region: process.env.VERCEL_REGION ?? 'local-development',
      time: new Date().toISOString(),
    }),
    {
      status: 200,
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'cache-control': 'no-store',
      },
    }
  );
}
