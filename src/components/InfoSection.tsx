'use client';

import { useTranslations, useMessages } from 'next-intl';

type Section = { id: string; title: string; content: string };

export default function InfoSection() {
  const t = useTranslations('knowledge');
  const messages = useMessages() as any;
  const sections = (messages?.knowledge?.sections ?? []) as Section[];

  return (
    <section className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-4xl mx-auto">
        <h2
          className="font-display text-3xl sm:text-4xl font-semibold mb-8 text-center"
          style={{ color: 'var(--text-primary)' }}
        >
          {t('title')}
        </h2>
        <div className="w-12 h-0.5 mb-10 mx-auto" style={{ background: 'var(--accent)' }} />

        {t('lead') && (
          <p
            className="text-base sm:text-lg leading-relaxed mb-12 text-center max-w-3xl mx-auto"
            style={{ color: 'var(--text-secondary)' }}
          >
            {t('lead')}
          </p>
        )}

        <div className="space-y-12">
          {sections.map((section, idx) => (
            <article key={section.id || idx}>
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="flex items-center justify-center w-9 h-9 rounded-full text-xs font-bold shrink-0"
                  style={{ background: 'var(--tag-bg)', color: 'var(--tag-text)' }}
                >
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <h3
                  className="font-display text-xl sm:text-2xl font-semibold"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {section.title}
                </h3>
              </div>
              <div className="space-y-4 ml-0 sm:ml-12">
                {section.content
                  .split(/\n\s*\n/)
                  .filter(Boolean)
                  .map((paragraph, i) => (
                    <p
                      key={i}
                      className="leading-relaxed text-sm sm:text-base"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {paragraph}
                    </p>
                  ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
