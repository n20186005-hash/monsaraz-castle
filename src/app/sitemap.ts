import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://monsarazcastle.com';
  const locales = ['pt', 'en', 'zh', 'mwl'];
  const routes = ['', '/privacy-policy', '/terms-of-service', '/cookie-settings'];

  const sitemap: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const route of routes) {
      const url = `${baseUrl}/${locale}${route}`;
      const languages: Record<string, string> = {
        pt: `${baseUrl}/pt${route}`,
        en: `${baseUrl}/en${route}`,
        zh: `${baseUrl}/zh${route}`,
        mwl: `${baseUrl}/mwl${route}`,
        'x-default': `${baseUrl}/pt${route}`,
      };

      sitemap.push({
        url,
        lastModified: new Date('2026-09-04'),
        changeFrequency: route === '' ? 'weekly' : 'monthly',
        priority: route === '' ? 1 : 0.5,
        alternates: {
          languages,
        },
      });
    }
  }

  return sitemap;
}
