import { getTranslations, getMessages } from 'next-intl/server';

type FaqItem = { q: string; a: string };

export default async function FAQSection() {
  const t = await getTranslations('faq');
  const messages = (await getMessages()) as any;
  const items = (messages?.faq?.items ?? []) as FaqItem[];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };

  return (
    <section
      id="faq"
      className="section-padding"
      style={{ background: 'var(--bg-secondary)' }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-3xl mx-auto">
        <h2
          className="font-display text-3xl sm:text-4xl font-semibold mb-10"
          style={{ color: 'var(--text-primary)' }}
        >
          {t('title')}
        </h2>

        <div className="space-y-3">
          {items.map((item, i) => (
            <details
              key={i}
              className="rounded-xl overflow-hidden group"
              style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
            >
              <summary
                className="flex items-center justify-between gap-4 cursor-pointer list-none px-5 py-4"
                style={{ color: 'var(--text-primary)' }}
              >
                <span className="font-medium text-sm sm:text-base leading-snug">{item.q}</span>
                <span
                  className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-transform group-open:rotate-45"
                  style={{ background: 'var(--tag-bg)', color: 'var(--tag-text)' }}
                  aria-hidden="true"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
              </summary>
              <p
                className="px-5 pb-5 text-sm leading-relaxed"
                style={{ color: 'var(--text-secondary)' }}
              >
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
