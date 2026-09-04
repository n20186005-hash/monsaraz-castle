import { setRequestLocale } from 'next-intl/server';

const notFoundCopy: Record<string, { code: string; title: string; text: string; back: string }> = {
  pt: {
    code: '404',
    title: 'Página não encontrada',
    text: 'A página que procura não existe ou foi movida. Use o menu acima ou volte à página inicial para continuar a explorar o Castelo de Monsaraz.',
    back: 'Voltar ao início',
  },
  en: {
    code: '404',
    title: 'Page not found',
    text: 'The page you are looking for does not exist or has been moved. Use the menu above or return to the homepage to keep exploring Monsaraz Castle.',
    back: 'Back to homepage',
  },
  zh: {
    code: '404',
    title: '页面未找到',
    text: '您访问的页面不存在或已被移动。可通过上方菜单或返回首页,继续浏览蒙萨拉什城堡指南。',
    back: '返回首页',
  },
  mwl: {
    code: '404',
    title: 'Páigina nó ancuntrada',
    text: 'La páigina que percuras nó eisiste ó fui mudada. Outeliza l menú arriba ó bolta a la páigina percipal para cuntinar a splorar l Castielho de Monsaraz.',
    back: 'Boltar a la páigina percipal',
  },
};

export default async function LocaleNotFound({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const copy = notFoundCopy[locale] || notFoundCopy.pt;

  return (
    <main
      className="min-h-screen flex items-center justify-center px-6 py-16"
      style={{ background: 'var(--bg-secondary)' }}
    >
      <div className="text-center max-w-md">
        <p className="text-5xl font-bold mb-4 text-[#3a7a8d]">{copy.code}</p>
        <h1 className="text-2xl font-semibold mb-3">{copy.title}</h1>
        <p className="text-base opacity-80 mb-8">{copy.text}</p>
        <a
          href={`/${locale}`}
          className="inline-block px-6 py-3 rounded-lg font-medium text-white"
          style={{ background: '#3a7a8d' }}
        >
          {copy.back}
        </a>
      </div>
    </main>
  );
}
