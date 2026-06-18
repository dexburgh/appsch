import { NextResponse } from 'next/server';

const encoder = new TextEncoder();
const payload = encoder.encode(
  'Range requests let clients resume downloads or stream media without reading the entire payload at once.'
);

export async function GET(request) {
  const total = payload.length;
  const rangeHeader = request.headers.get('range') ?? request.headers.get('Range');

  if (!rangeHeader) {
    return new NextResponse(payload, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Length': String(total),
        'Accept-Ranges': 'bytes',
      },
    });
  }

  const match = /^bytes=(\d*)-(\d*)$/.exec(rangeHeader);
  if (!match) {
    return new NextResponse(null, {
      status: 416,
      headers: { 'Content-Range': `bytes */${total}` },
    });
  }

  const start = match[1] ? Number(match[1]) : 0;
  const end = match[2] ? Number(match[2]) : total - 1;

  if (Number.isNaN(start) || Number.isNaN(end) || start > end || end >= total) {
    return new NextResponse(null, {
      status: 416,
      headers: { 'Content-Range': `bytes */${total}` },
    });
  }

  const slice = payload.slice(start, end + 1);
  return new NextResponse(slice, {
    status: 206,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Content-Length': String(slice.length),
      'Content-Range': `bytes ${start}-${end}/${total}`,
      'Accept-Ranges': 'bytes',
    },
  });
}
