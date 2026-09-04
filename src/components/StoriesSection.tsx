import { getTranslations, getMessages } from 'next-intl/server';

type Story = { badge: string; title: string; text: string };

export default async function StoriesSection() {
  const t = await getTranslations('stories');
  const messages = (await getMessages()) as any;
  const items = (messages?.stories?.items ?? []) as Story[];

  return (
    <section id="stories" className="section-padding">
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

        <div className="space-y-6">
          {items.map((story, i) => (
            <article
              key={i}
              className="rounded-xl p-6 sm:p-8 relative overflow-hidden"
              style={{
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)',
                borderLeft: '3px solid var(--accent)',
              }}
            >
              <span
                className="inline-block text-[11px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-3"
                style={{ background: 'var(--tag-bg)', color: 'var(--tag-text)' }}
              >
                {story.badge}
              </span>
              <h3
                className="font-display text-xl font-semibold mb-3"
                style={{ color: 'var(--text-primary)' }}
              >
                {story.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {story.text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
