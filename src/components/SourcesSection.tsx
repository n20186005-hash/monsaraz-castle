import { getTranslations, getMessages } from 'next-intl/server';

type Source = { name: string; url: string };

export default async function SourcesSection() {
  const t = await getTranslations('sources');
  const messages = (await getMessages()) as any;
  const items = (messages?.sources?.items ?? []) as Source[];

  return (
    <section id="sources" className="section-padding">
      <div className="max-w-3xl mx-auto">
        <h2
          className="font-display text-3xl sm:text-4xl font-semibold mb-3"
          style={{ color: 'var(--text-primary)' }}
        >
          {t('title')}
        </h2>
        <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>
          {t('subtitle')}
        </p>
        <p
          className="inline-block text-xs font-medium px-3 py-1.5 rounded-full mb-8"
          style={{ background: 'var(--tag-bg)', color: 'var(--tag-text)' }}
        >
          {t('updated')}
        </p>

        <ol className="space-y-3">
          {items.map((source, i) => (
            <li key={i}>
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-4 rounded-xl px-5 py-4 transition-opacity hover:opacity-80"
                style={{
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                }}
              >
                <span className="flex items-center gap-3 text-sm font-medium">
                  <span
                    className="text-xs"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {source.name}
                </span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="2"
                  className="shrink-0"
                >
                  <path d="M7 17L17 7M9 7h8v8" />
                </svg>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
