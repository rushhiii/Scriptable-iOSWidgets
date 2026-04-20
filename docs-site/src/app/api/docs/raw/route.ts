import { getDocBySlug, getFirstDoc } from '@/lib/docs';
import { NextResponse } from 'next/server';

function normalizeSlugParts(rawSlug: string | null): string[] {
  if (!rawSlug) {
    return [];
  }

  return rawSlug
    .split('/')
    .map((segment) => decodeURIComponent(segment.trim()))
    .filter(Boolean);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const requestedSlug = searchParams.get('slug');
  let slugParts = normalizeSlugParts(requestedSlug);

  if (slugParts.length === 0) {
    const firstDoc = await getFirstDoc();

    if (!firstDoc) {
      return new NextResponse('Doc not found', {
        status: 404,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }

    slugParts = firstDoc.slug;
  }

  const doc = await getDocBySlug(slugParts);

  if (!doc) {
    return new NextResponse('Doc not found', {
      status: 404,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  return new NextResponse(doc.body, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=60',
    },
  });
}
