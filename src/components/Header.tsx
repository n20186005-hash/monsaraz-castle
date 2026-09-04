'use client';

import { useTranslations, useLocale } from 'next-intl';
import LanguageToggle from './LanguageToggle';
import ThemeToggle from './ThemeToggle';
import { useState, useEffect } from 'react';

const brandByLocale: Record<string, string> = {
  pt: 'Castelo de Monsaraz',
  en: 'Monsaraz Castle',
  zh: '蒙萨拉什城堡',
  mwl: 'Castielho de Monsaraz',
};

export default function Header() {
  const t = useTranslations('header');
  const locale = useLocale();
  const brand = brandByLocale[locale] || 'Monsaraz Castle';
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const navItems = [
    { key: 'facilities', id: 'facilities' },
    { key: 'stories', id: 'stories' },
    { key: 'gallery', id: 'gallery' },
    { key: 'faq', id: 'faq' },
    { key: 'map', id: 'map' },
  ] as const;

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'var(--bg-secondary)' : 'transparent',
        borderBottom: scrolled ? '1px solid var(--border-color)' : 'none',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <a
          href={`/${locale}`}
          className="font-display text-lg font-semibold tracking-tight"
          style={{ color: scrolled ? 'var(--text-primary)' : '#fff' }}
        >
          {brand}
        </a>

        <nav className="hidden lg:flex items-center gap-5">
          {navItems.map(({ key, id }) => (
            <a
              key={key}
              href={`/${locale}/#${id}`}
              className="text-sm font-medium transition-colors"
              style={{ color: scrolled ? 'var(--text-secondary)' : 'rgba(255,255,255,0.85)' }}
            >
              {t(key)}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LanguageToggle />
        </div>
      </div>
    </header>
  );
}
