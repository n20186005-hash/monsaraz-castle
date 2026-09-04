import { getTranslations, getMessages } from 'next-intl/server';

type Facility = { title: string; desc: string };

export default async function FacilitiesSection() {
  const t = await getTranslations('facilities');
  const messages = (await getMessages()) as any;
  const items = (messages?.facilities?.items ?? []) as Facility[];

  return (
    <section id="facilities" className="section-padding">
      <div className="max-w-5xl mx-auto">
        <h2
          className="font-display text-3xl sm:text-4xl font-semibold mb-3"
          style={{ color: 'var(--text-primary)' }}
        >
          {t('title')}
        </h2>
        <p className="text-sm max-w-3xl leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          {t('note')}
        </p>
        <div className="w-12 h-0.5 mt-6 mb-10" style={{ background: 'var(--accent)' }} />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item, i) => (
            <div
              key={i}
              className="rounded-xl p-5"
              style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
            >
              <div className="flex items-center gap-3 mb-3">
                <span
                  className="flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold shrink-0"
                  style={{ background: 'var(--tag-bg)', color: 'var(--tag-text)' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3
                  className="font-display text-base font-semibold leading-snug"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {item.title}
                </h3>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
