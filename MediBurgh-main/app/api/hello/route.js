import { NextResponse } from 'next/server';

const allowHeader = { Allow: 'GET' };

function methodNotAllowed() {
  return NextResponse.json(
    { error: 'Method Not Allowed', hint: 'Use GET for this endpoint.' },
    { status: 405, headers: allowHeader }
  );
}

export async function GET() {
  return NextResponse.json({ message: 'Hello from MediBurgh!', timestamp: new Date().toISOString() });
}

export const POST = methodNotAllowed;
export const PUT = methodNotAllowed;
export const PATCH = methodNotAllowed;
export const DELETE = methodNotAllowed;
export const OPTIONS = () => new NextResponse(null, { status: 204, headers: allowHeader });
