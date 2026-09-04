import { getTranslations, getMessages } from 'next-intl/server';

type Rule = { title: string; desc: string };

function CheckIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export default async function EtiquetteSection() {
  const t = await getTranslations('etiquette');
  const messages = (await getMessages()) as any;
  const dos = (messages?.etiquette?.dos ?? []) as Rule[];
  const donts = (messages?.etiquette?.donts ?? []) as Rule[];

  return (
    <section id="etiquette" className="section-padding">
      <div className="max-w-5xl mx-auto">
        <h2
          className="font-display text-3xl sm:text-4xl font-semibold mb-3"
          style={{ color: 'var(--text-primary)' }}
        >
          {t('title')}
        </h2>
        <p className="text-base max-w-3xl leading-relaxed mb-8" style={{ color: 'var(--text-muted)' }}>
          {t('subtitle')}
        </p>
        <div className="w-12 h-0.5 mb-10" style={{ background: 'var(--accent)' }} />

        <div className="grid md:grid-cols-2 gap-6">
          {/* Do */}
          <div>
            <div
              className="flex items-center gap-2 mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              <span
                className="flex items-center justify-center w-7 h-7 rounded-full text-white"
                style={{ background: 'var(--accent)' }}
              >
                <CheckIcon />
              </span>
              <h3 className="font-display text-xl font-semibold">{t('doTitle')}</h3>
            </div>
            <div className="space-y-3">
              {dos.map((rule, i) => (
                <div
                  key={i}
                  className="rounded-xl p-4 sm:p-5"
                  style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
                >
                  <p className="font-medium text-sm mb-1" style={{ color: 'var(--text-primary)' }}>
                    {rule.title}
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {rule.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Don't */}
          <div>
            <div
              className="flex items-center gap-2 mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              <span
                className="flex items-center justify-center w-7 h-7 rounded-full text-white"
                style={{ background: 'var(--color-autumn-500)' }}
              >
                <CrossIcon />
              </span>
              <h3 className="font-display text-xl font-semibold">{t('dontTitle')}</h3>
            </div>
            <div className="space-y-3">
              {donts.map((rule, i) => (
                <div
                  key={i}
                  className="rounded-xl p-4 sm:p-5"
                  style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
                >
                  <p className="font-medium text-sm mb-1" style={{ color: 'var(--text-primary)' }}>
                    {rule.title}
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {rule.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p
          className="text-xs mt-8 max-w-3xl leading-relaxed"
          style={{ color: 'var(--text-muted)' }}
        >
          {t('note')}
        </p>
      </div>
    </section>
  );
}
