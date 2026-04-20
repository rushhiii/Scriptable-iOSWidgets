import type { MetadataRoute } from 'next';
import { getAllDocSlugs, getDocBySlug } from '@/lib/docs';
import { getSiteUrl } from '@/lib/site-url';

function parseLastModified(value: string | null): Date | undefined {
  if (!value) {
    return undefined;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const generatedAt = new Date();

  const basePages: MetadataRoute.Sitemap = [
    {
      url: new URL('/', siteUrl).toString(),
      lastModified: generatedAt,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: new URL('/docs', siteUrl).toString(),
      lastModified: generatedAt,
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  const slugs = await getAllDocSlugs();
  const docs = await Promise.all(slugs.map((slug) => getDocBySlug(slug)));

  const docPages: MetadataRoute.Sitemap = docs
    .filter((doc): doc is NonNullable<typeof doc> => Boolean(doc))
    .map((doc) => ({
      url: new URL(`/docs/${doc.slugPath}`, siteUrl).toString(),
      lastModified: parseLastModified(doc.updated) ?? generatedAt,
      changeFrequency: 'weekly',
      priority: doc.slugPath === 'home' || doc.slugPath === 'getting-started' ? 0.9 : 0.7,
    }));

  return [...basePages, ...docPages];
}
