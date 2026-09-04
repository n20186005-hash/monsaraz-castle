import { getTranslations, getLocale } from 'next-intl/server';

type GroupKey =
  | 'clear'
  | 'partly'
  | 'cloud'
  | 'fog'
  | 'drizzle'
  | 'rain'
  | 'snow'
  | 'showers'
  | 'thunder';

const BCP47: Record<string, string> = {
  pt: 'pt-PT',
  en: 'en-GB',
  zh: 'zh-CN',
  mwl: 'pt-PT',
};

function groupFromWMO(code: number): GroupKey {
  if (code === 0) return 'clear';
  if (code === 1 || code === 2) return 'partly';
  if (code === 3) return 'cloud';
  if (code === 45 || code === 48) return 'fog';
  if (code >= 51 && code <= 57) return 'drizzle';
  if ((code >= 61 && code <= 67) || code === 80) return 'rain';
  if (code >= 71 && code <= 77) return 'snow';
  if (code >= 81 && code <= 82) return 'showers';
  if (code >= 95) return 'thunder';
  return 'partly';
}

function WeatherGlyph({ group, small }: { group: GroupKey; small?: boolean }) {
  const size = small ? 34 : 44;
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 48 48',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2.4,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  switch (group) {
    case 'clear':
      return (
        <svg {...common}>
          <circle cx="24" cy="24" r="7" fill="currentColor" stroke="none" />
          <path d="M24 4v6M24 38v6M4 24h6M38 24h6M10 10l4 4M34 34l4 4M38 10l-4 4M14 34l-4 4" />
        </svg>
      );
    case 'partly':
      return (
        <svg {...common}>
          <path d="M16 16a9 9 0 0 1 17 3 7 7 0 0 1 2 14H17a6 6 0 0 1-1-12" />
          <path d="M20 10V6M28 8v-3" opacity="0.7" />
        </svg>
      );
    case 'cloud':
      return (
        <svg {...common}>
          <path d="M20 18a9 9 0 0 1 16 5 7 7 0 0 1-1 14H18a7 7 0 0 1-1-14 6 6 0 0 1 3-5" />
        </svg>
      );
    case 'fog':
      return (
        <svg {...common}>
          <path d="M6 18h36M10 27h28M14 36h20" opacity="0.8" />
        </svg>
      );
    case 'drizzle':
      return (
        <svg {...common}>
          <path d="M15 12a7 7 0 0 1 13-2 6 6 0 0 1 2 11H18a6 6 0 0 1-3-9" />
          <path d="M18 28v5M25 28v7M32 28v5" opacity="0.8" />
        </svg>
      );
    case 'rain':
      return (
        <svg {...common}>
          <path d="M16 13a8 8 0 0 1 14-3 7 7 0 0 1 3 12H17a7 7 0 0 1-1-9" />
          <path d="M19 30v9M28 30v11M37 30v9" opacity="0.85" />
        </svg>
      );
    case 'snow':
      return (
        <svg {...common}>
          <path d="M15 12a8 8 0 0 1 14-3 7 7 0 0 1 2 13H17a7 7 0 0 1-2-10" />
          <path d="M24 29v9M19 33l10-4M29 33l-10-4" opacity="0.9" />
        </svg>
      );
    case 'showers':
      return (
        <svg {...common}>
          <path d="M16 13a8 8 0 0 1 14-3 7 7 0 0 1 3 12H17a7 7 0 0 1-1-9" />
          <path d="M19 31l-3 8M26 31l-3 8M33 31l-3 8" opacity="0.85" />
        </svg>
      );
    case 'thunder':
      return (
        <svg {...common}>
          <path d="M16 13a8 8 0 0 1 14-3 7 7 0 0 1 3 12H17a7 7 0 0 1-1-9" />
          <path d="M25 24l-6 9h6l-3 8 8-11h-6l5-6h-4z" fill="currentColor" stroke="none" opacity="0.9" />
        </svg>
      );
  }
}

type WeatherData = {
  current?: {
    temperature_2m?: number;
    apparent_temperature?: number;
    relative_humidity_2m?: number;
    wind_speed_10m?: number;
    weather_code?: number;
  };
  daily?: {
    time?: string[];
    weather_code?: number[];
    temperature_2m_max?: number[];
    temperature_2m_min?: number[];
  };
};

export default async function WeatherSection() {
  const t = await getTranslations('weather');
  const locale = await getLocale();
  const bcp = BCP47[locale] || 'pt-PT';

  let data: WeatherData | null = null;
  let fetchedAt: Date | null = null;
  try {
    const url =
      'https://api.open-meteo.com/v1/forecast?' +
      new URLSearchParams({
        latitude: '38.4422826',
        longitude: '-7.3817249',
        current:
          'temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m',
        daily: 'weather_code,temperature_2m_max,temperature_2m_min',
        timezone: 'Europe/Lisbon',
        forecast_days: '6',
        wind_speed_unit: 'kmh',
      }).toString();
    const res = await fetch(url, { next: { revalidate: 1800 } });
    if (res.ok) {
      data = (await res.json()) as WeatherData;
      fetchedAt = new Date();
    }
  } catch {
    data = null;
  }

  const fmtTime = fetchedAt
    ? new Intl.DateTimeFormat(bcp, { hour: '2-digit', minute: '2-digit' }).format(fetchedAt)
    : null;

  const fmtDay = (iso: string) => {
    const d = new Date(`${iso}T12:00:00`);
    const parts = new Intl.DateTimeFormat(bcp, {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    }).formatToParts(d);
    const map: Record<string, string> = {};
    for (const p of parts) map[p.type] = p.value;
    return { weekday: map.weekday || '', date: `${map.day || ''} ${map.month || ''}` };
  };

  const currentGroup = data?.current ? groupFromWMO(data.current.weather_code ?? 1) : null;
  const daily = data?.daily;
  const days =
    daily?.time?.map((day, i) => ({
      iso: day,
      group: groupFromWMO(daily.weather_code?.[i] ?? 1),
      high: daily.temperature_2m_max?.[i],
      low: daily.temperature_2m_min?.[i],
    })) ?? [];

  return (
    <section id="weather" className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-5xl mx-auto">
        <h2
          className="font-display text-3xl sm:text-4xl font-semibold mb-3"
          style={{ color: 'var(--text-primary)' }}
        >
          {t('title')}
        </h2>
        <p className="text-sm mb-8 max-w-3xl" style={{ color: 'var(--text-muted)' }}>
          {t('subtitle')}
        </p>

        {!data || !currentGroup || !daily ? (
          <div
            className="rounded-xl p-8 text-center"
            style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
          >
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {t('unavailable')}
            </p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-[1.1fr_1fr] gap-6 mb-8">
              {/* Current conditions */}
              <div
                className="rounded-xl p-6 sm:p-8"
                style={{
                  background: 'linear-gradient(135deg, rgba(58,122,141,0.92), rgba(35,77,92,0.96))',
                  color: '#fff',
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-white/85 text-xs uppercase tracking-wider font-medium">
                    {t('current')}
                  </span>
                  {fetchedAt && fmtTime && (
                    <span className="text-white/70 text-xs">
                      {t('updated')} {fmtTime}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-5">
                  <WeatherGlyph group={currentGroup} />
                  <div>
                    <div className="text-5xl font-display font-semibold leading-none">
                      {Math.round(data.current?.temperature_2m ?? 0)}°
                    </div>
                    <div className="text-white/90 text-sm mt-2 capitalize">
                      {t(`groups.${currentGroup}`)}
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex flex-wrap gap-2 text-xs text-white/90">
                  <span
                    className="px-3 py-1.5 rounded-full"
                    style={{ background: 'rgba(255,255,255,0.16)' }}
                  >
                    {t('feels')}: {Math.round(data.current?.apparent_temperature ?? 0)}°
                  </span>
                  <span
                    className="px-3 py-1.5 rounded-full"
                    style={{ background: 'rgba(255,255,255,0.16)' }}
                  >
                    {t('wind')}: {Math.round(data.current?.wind_speed_10m ?? 0)} km/h
                  </span>
                  <span
                    className="px-3 py-1.5 rounded-full"
                    style={{ background: 'rgba(255,255,255,0.16)' }}
                  >
                    {t('humidity')}: {Math.round(data.current?.relative_humidity_2m ?? 0)}%
                  </span>
                </div>
              </div>

              {/* Multi-day forecast */}
              <div
                className="rounded-xl p-6"
                style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
              >
                <h3
                  className="font-display text-lg font-semibold mb-4"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {t('forecast')}
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {days.map((day, i) => {
                    const label = fmtDay(day.iso);
                    return (
                      <div
                        key={i}
                        className="rounded-lg p-2 text-center"
                        style={{ background: 'var(--bg-secondary)' }}
                      >
                        <div
                          className="text-[11px] font-medium mb-1 truncate"
                          style={{ color: 'var(--text-secondary)' }}
                          title={label.weekday}
                        >
                          {label.weekday}
                        </div>
                        <div className="flex justify-center mb-1" style={{ color: 'var(--accent)' }}>
                          <WeatherGlyph group={day.group} small />
                        </div>
                        <div
                          className="text-[11px] leading-tight"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          {label.date}
                        </div>
                        <div className="text-xs font-semibold mt-1" style={{ color: 'var(--text-primary)' }}>
                          {day.high != null ? Math.round(day.high) : '–'}°
                          <span style={{ color: 'var(--text-muted)' }}>
                            /{day.low != null ? Math.round(day.low) : '–'}°
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {t('source')}
            </p>
          </>
        )}
      </div>
    </section>
  );
}
