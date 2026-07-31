import 'server-only';

const dictionaries = {
    en: () => import('./en.json').then((m) => m.default),
    ar: () => import('./ar.json').then((m) => m.default),
};

export const getDictionary = async (locale: 'en' | 'ar') => {
    return dictionaries[locale]?.() ?? dictionaries.en();
}