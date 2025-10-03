import 'server-only';

export const translations = {
    en: () => import('@/assets/locales/en.json').then((module) => module.default),
    zh: () => import('@/assets/locales/zh.json').then((module) => module.default),
};