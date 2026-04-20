import { getDocsSearchIndex } from '@/lib/docs';
import { NextResponse } from 'next/server';

export async function GET() {
  const items = await getDocsSearchIndex();
  return NextResponse.json(items);
}
