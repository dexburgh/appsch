import { NextResponse } from 'next/server';

const ALLOWED_METHODS = ['GET', 'POST'];

export async function GET() {
  return NextResponse.json({
    methods: ALLOWED_METHODS,
    tip: 'Always send an Allow header when rejecting unsupported verbs.',
  });
}

export async function POST(request) {
  let body = null;
  try {
    body = await request.json();
  } catch (error) {
    body = null;
  }

  return NextResponse.json(
    {
      accepted: true,
      body,
    },
    { status: 201, headers: { Location: '/api/methods' } }
  );
}

function methodNotAllowed(method) {
  return NextResponse.json(
    { error: `${method} is not supported for this route.`, allow: ALLOWED_METHODS },
    { status: 405, headers: { Allow: ALLOWED_METHODS.join(', ') } }
  );
}

export const PUT = (request, context) => methodNotAllowed('PUT');
export const PATCH = () => methodNotAllowed('PATCH');
export const DELETE = () => methodNotAllowed('DELETE');
export const OPTIONS = () => new NextResponse(null, { status: 204, headers: { Allow: ALLOWED_METHODS.join(', ') } });
