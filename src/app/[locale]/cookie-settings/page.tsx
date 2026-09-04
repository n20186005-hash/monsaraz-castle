import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import CookieSettingsClient from './CookieSettingsClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = 'https://monsarazcastle.com';
  const ptUrl = `${baseUrl}/pt/cookie-settings`;
  const enUrl = `${baseUrl}/en/cookie-settings`;
  const zhUrl = `${baseUrl}/zh/cookie-settings`;
  const mwlUrl = `${baseUrl}/mwl/cookie-settings`;
  const localeUrls: Record<string, string> = {
    pt: ptUrl,
    en: enUrl,
    zh: zhUrl,
    mwl: mwlUrl,
  };
  const selfUrl = localeUrls[locale] || ptUrl;

  return {
    alternates: {
      canonical: selfUrl,
      languages: {
        pt: ptUrl,
        en: enUrl,
        zh: zhUrl,
        mwl: mwlUrl,
        'x-default': ptUrl,
      } as Record<string, string>,
    },
  };
}

export default async function CookiePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <CookieSettingsClient />;
}
