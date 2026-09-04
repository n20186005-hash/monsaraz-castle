'use client';

import { useTranslations } from 'next-intl';

export default function HoursSection() {
  const t = useTranslations('hours');

  return (
    <section className="section-padding">
      <div className="max-w-5xl mx-auto">
        <h2
          className="font-display text-3xl sm:text-4xl font-semibold mb-6"
          style={{ color: 'var(--text-primary)' }}
        >
          {t('title')}
        </h2>
        <div className="w-12 h-0.5 mb-10" style={{ background: 'var(--accent)' }} />

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div
            className="rounded-xl p-6"
            style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
          >
            <h3 className="font-display text-xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
              {t('wallsTitle')}
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {t('wallsText')}
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
          style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--accent)' }}
        >
          <h3 className="font-display text-xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
            {t('seasonTitle')}
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {t('seasonText')}
          </p>
        </div>

        <div
          className="rounded-xl p-6 mb-4"
          style={{
            background: 'rgba(190, 129, 31, 0.12)',
            border: '1px solid rgba(190, 129, 31, 0.45)',
          }}
        >
          <h3 className="font-semibold text-sm uppercase tracking-wide mb-2" style={{ color: 'var(--text-primary)' }}>
            {t('warning')}
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {t('warningTime')}
          </p>
        </div>

        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          {t('tip')}
        </p>
      </div>
    </section>
  );
}
