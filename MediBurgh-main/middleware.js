import { NextResponse } from 'next/server';

export function middleware(req) {
  const url = new URL(req.url);
  // Guard absurdly long URLs to avoid platform-level 414s down the line
  if (url.search && url.search.length > 1500) {
    return new NextResponse('Query too long', { status: 414 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
