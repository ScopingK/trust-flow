import { useTrustFlow } from '../context/TrustFlowContext';
import { en } from './en';
import { hi } from './hi';
import { ta } from './ta';
import type { TranslationDict } from './types';
import type { Language } from '../types';

export const dictionaries: Record<Language, TranslationDict> = {
  en,
  hi,
  ta,
};

export function useTranslation() {
  const { state } = useTrustFlow();
  const dict = dictionaries[state.language] || en;

  /**
   * Safe accessor for translation string with fallback to English
   */
  const t = (key: keyof TranslationDict, params?: Record<string, string | number>): string => {
    let str = dict[key] || en[key] || (key as string);
    if (params) {
      Object.entries(params).forEach(([paramKey, val]) => {
        str = str.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(val));
      });
    }
    return str;
  };

  return { t, dict, language: state.language };
}

export * from './types';
