import {getRequestConfig} from 'next-intl/server';
import {notFound} from 'next/navigation';

const locales = ['en', 'ru', 'uz'];

export default getRequestConfig(async (config) => {
  let locale = await (config as any).requestLocale;
  
  if (!locale) {
    locale = 'ru';
  }

  if (!locales.includes(locale)) notFound();

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});
