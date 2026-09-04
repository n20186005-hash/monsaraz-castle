import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import type { Metadata, Viewport } from 'next';

const baseUrl = 'https://monsarazcastle.com';
const CONTENT_UPDATED = '2026-09-04';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const localeUrls: Record<string, string> = {
  pt: `${baseUrl}/pt`,
  en: `${baseUrl}/en`,
  zh: `${baseUrl}/zh`,
  mwl: `${baseUrl}/mwl`,
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#3a7a8d',
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = (await import(`@/messages/${locale}.json`)).default;
  const selfUrl = localeUrls[locale] || localeUrls.pt;

  const localeMap: Record<string, string> = {
    zh: 'zh_CN',
    en: 'en_US',
    pt: 'pt_PT',
    mwl: 'pt_PT',
  };

  return {
    metadataBase: new URL(baseUrl),
    title: messages.meta.title,
    description: messages.meta.description,
    icons: {
      icon: '/icons/icon.svg',
      apple: '/icons/icon.svg',
    },
    alternates: {
      canonical: selfUrl,
      languages: {
        pt: localeUrls.pt,
        en: localeUrls.en,
        zh: localeUrls.zh,
        mwl: localeUrls.mwl,
        'x-default': localeUrls.pt,
      } as Record<string, string>,
    },
    openGraph: {
      title: messages.meta.title,
      description: messages.meta.description,
      url: selfUrl,
      siteName: 'Castelo de Monsaraz',
      locale: localeMap[locale] || 'pt_PT',
      type: 'website',
      images: [
        {
          url: `${baseUrl}/gallery/monsaraz-castle-1.jpg`,
          width: 1600,
          height: 1200,
          alt: messages.meta.title,
        },
      ],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  const langMap: Record<string, string> = {
    zh: 'zh-CN',
    en: 'en',
    pt: 'pt',
    mwl: 'mwl',
  };

  const selfUrl = localeUrls[locale] || localeUrls.pt;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${baseUrl}/#organization`,
        name: 'Castelo de Monsaraz',
        url: baseUrl,
        logo: {
          '@type': 'ImageObject',
          url: `${baseUrl}/icons/icon.svg`,
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${baseUrl}/#website`,
        url: baseUrl,
        name: 'Monsaraz Castle',
        description: messages.meta.description,
        inLanguage: ['pt', 'en', 'zh', 'mwl'],
        publisher: {
          '@id': `${baseUrl}/#organization`,
        },
      },
      {
        '@type': 'WebPage',
        '@id': `${selfUrl}#webpage`,
        url: selfUrl,
        name: messages.meta.title,
        description: messages.meta.description,
        inLanguage: langMap[locale] || 'pt',
        datePublished: CONTENT_UPDATED,
        dateModified: CONTENT_UPDATED,
        isPartOf: {
          '@id': `${baseUrl}/#website`,
        },
        about: {
          '@id': `${baseUrl}/#attraction`,
        },
      },
      {
        '@type': 'TouristAttraction',
        '@id': `${baseUrl}/#attraction`,
        name: 'Castelo de Monsaraz',
        alternateName: [
          'Monsaraz Castle',
          'Monsaraz',
          'Castelo e muralhas de Monsaraz',
        ],
        description: messages.meta.description,
        url: selfUrl,
        image: [
          `${baseUrl}/gallery/monsaraz-castle-1.jpg`,
          `${baseUrl}/gallery/monsaraz-castle-5.jpg`,
        ],
        isAccessibleForFree: true,
        touristType: ['Castle', 'Medieval fortified village', 'National Monument'],
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Largo do Castelo, Monsaraz',
          addressLocality: 'Reguengos de Monsaraz',
          addressRegion: 'Évora',
          postalCode: '7200-175',
          addressCountry: 'PT',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 38.4422826,
          longitude: -7.3817249,
        },
        hasMap: 'https://maps.app.goo.gl/wPN3d4exqLmb8N7M8',
        openingHoursSpecification: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday',
          ],
          opens: '00:00',
          closes: '23:59',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.7',
          bestRating: '5',
          reviewCount: '14967',
        },
        sameAs: [
          'https://maps.app.goo.gl/wPN3d4exqLmb8N7M8',
          'https://www.cm-reguengos-monsaraz.pt/',
          'https://www.visitportugal.com',
        ],
      },
    ],
  };

  return (
    <html lang={langMap[locale] || 'pt'} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark') {
                    document.documentElement.setAttribute('data-theme', 'dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                var id = 'G-HXM22WWPKP';
                function initGtag(consent) {
                  if (!window.__gaLoaded) {
                    window.__gaLoaded = true;
                    window.dataLayer = window.dataLayer || [];
                    window.gtag = function () { window.dataLayer.push(arguments); };
                    var s = document.createElement('script');
                    s.async = true;
                    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
                    document.head.appendChild(s);
                  }
                  window.gtag('consent', 'update', {
                    analytics_storage: consent ? 'granted' : 'denied'
                  });
                  if (consent) {
                    window.gtag('js', new Date());
                    window.gtag('config', id, { anonymize_ip: true });
                  }
                }
                function applyConsent() {
                  try {
                    var prefs = JSON.parse(localStorage.getItem('cookiePrefs') || '{}');
                    if (prefs.analytics) {
                      initGtag(true);
                    } else if (window.gtag) {
                      initGtag(false);
                    }
                  } catch (e) {}
                }
                applyConsent();
                window.addEventListener('consent-updated', applyConsent);
              })();
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator && location.protocol.indexOf('http') === 0
                  && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
                window.addEventListener('load', function () {
                  navigator.serviceWorker.register('/sw.js').catch(function () {});
                });
              }
            `,
          }}
        />
      </head>
      <body className="min-h-screen">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
