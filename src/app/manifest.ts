import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Monsaraz Castle — Visitor Guide',
    short_name: 'Monsaraz Castle',
    description:
      'Complete visitor guide to Monsaraz Castle, the medieval hilltop fortress of the Alentejo, Portugal.',
    start_url: '/pt',
    scope: '/',
    display: 'standalone',
    background_color: '#f9f4ea',
    theme_color: '#3a7a8d',
    lang: 'pt',
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icons/icon-maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
