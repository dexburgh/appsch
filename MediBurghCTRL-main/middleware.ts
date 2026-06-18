import { NextResponse } from 'next/server'

const hits = new Map<string, { count: number; ts: number }>()
const WINDOW_MS = 60_000
const MAX = 60

function getClientIp(req: Request): string {
  const xf = req.headers.get('x-forwarded-for')
  if (xf) {
    const first = xf.split(',')[0]?.trim()
    if (first && first.length > 0) return first
  }
  const real = req.headers.get('x-real-ip')
  if (real && real.trim().length > 0) return real.trim()
  return '127.0.0.1'
}

export function middleware(req: Request) {
  const url = new URL(req.url)
  if (!url.pathname.startsWith('/api')) return NextResponse.next()

  const ip = getClientIp(req)
  const now = Date.now()
  const record = hits.get(ip)

  if (!record || now - record.ts > WINDOW_MS) {
    hits.set(ip, { count: 1, ts: now })
  } else {
    record.count += 1
    if (record.count > MAX) {
      return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 })
    }
  }

  return NextResponse.next()
}

export const config = { matcher: ['/api/:path*'] }
