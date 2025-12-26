export enum SupportedLanguage {
  AUTO = 'AUTO',
  EN = 'EN',
  JA = 'JA',
  ZH_CN = 'ZH_CN',
  ZH_TW = 'ZH_TW',
}

export interface LanguageOption {
  code: SupportedLanguage;
  label: string;
  flag: string; // Emoji flag
  apiName: string; // The name sent to the prompt
}

export interface TranslationHistoryItem {
  id: string;
  sourceLang: SupportedLanguage;
  targetLang: SupportedLanguage;
  original: string;
  translated: string;
  timestamp: number;
}