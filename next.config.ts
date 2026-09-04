import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

// Server runtime build (no static export) so the weather module can fetch
// Open-Meteo data server-side with ISR caching (next: { revalidate: 1800 }).
// The root "/" request is handled by src/middleware.ts and redirected to the
// default locale (Portuguese, "/pt").
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https' as const, hostname: 'images.unsplash.com' },
    ],
  },
};

export default withNextIntl(nextConfig);
