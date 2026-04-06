import { Translation } from '@prisma/client';

export function getTranslation(
  translations: Translation[] | undefined | null,
  lang: string,
  field: string,
): string {
  if (!translations || !Array.isArray(translations)) return '';
  const reqMatch = translations.find(
    (t) => t.langCode === lang && t.field === field,
  );
  if (reqMatch) return reqMatch.value;

  const matchEn = translations.find(
    (t) => t.langCode === 'en' && t.field === field,
  );
  return matchEn ? matchEn.value : '';
}
