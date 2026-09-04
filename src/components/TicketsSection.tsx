'use client';

import { useTranslations } from 'next-intl';

export default function TicketsSection() {
  const t = useTranslations('tickets');

  return (
    <section className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-5xl mx-auto">
        <h2
          className="font-display text-3xl sm:text-4xl font-semibold mb-6"
          style={{ color: 'var(--text-primary)' }}
        >
          {t('title')}
        </h2>
        <div className="w-12 h-0.5 mb-10" style={{ background: 'var(--accent)' }} />

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div
            className="rounded-xl p-6"
            style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
          >
            <h3 className="font-display text-xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
              {t('mainTitle')}
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {t('mainText')}
            </p>
          </div>
          <div
            className="rounded-xl p-6"
            style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
          >
            <h3 className="font-display text-xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
              {t('keepTitle')}
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {t('keepText')}
            </p>
          </div>
        </div>

        <div
          className="rounded-xl p-6 mb-6"
          style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
        >
          <h3 className="font-display text-xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
            {t('parkingTitle')}
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {t('parkingText')}
          </p>
        </div>

        <div
          className="rounded-xl p-6"
          style={{
            background: 'rgba(58, 122, 141, 0.12)',
            border: '1px solid rgba(58, 122, 141, 0.45)',
          }}
        >
          <h3 className="font-semibold text-sm uppercase tracking-wide mb-2" style={{ color: 'var(--text-primary)' }}>
            {t('noteTitle')}
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {t('noteText')}
          </p>
        </div>
      </div>
    </section>
  );
}
