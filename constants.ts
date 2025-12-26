import { SupportedLanguage, LanguageOption } from './types';

export const LANGUAGE_OPTIONS: Record<SupportedLanguage, LanguageOption> = {
  [SupportedLanguage.AUTO]: {
    code: SupportedLanguage.AUTO,
    label: 'Detect Language',
    flag: '✨',
    apiName: 'the detected language',
  },
  [SupportedLanguage.JA]: {
    code: SupportedLanguage.JA,
    label: 'Japanese',
    flag: '🇯🇵',
    apiName: 'Japanese',
  },
  [SupportedLanguage.EN]: {
    code: SupportedLanguage.EN,
    label: 'English',
    flag: '🇺🇸',
    apiName: 'English',
  },
  [SupportedLanguage.ZH_CN]: {
    code: SupportedLanguage.ZH_CN,
    label: 'Chinese (Simplified)',
    flag: '🇨🇳',
    apiName: 'Simplified Chinese',
  },
  [SupportedLanguage.ZH_TW]: {
    code: SupportedLanguage.ZH_TW,
    label: 'Chinese (Traditional)',
    flag: '🇹🇼',
    apiName: 'Traditional Chinese',
  },
};

export const SYSTEM_INSTRUCTION = `あなたはプロの翻訳家です。与えられたテキストを、文脈やニュアンスを正確に維持したまま指定の言語に翻訳してください。
不自然な意訳は避け、原文の構造や表現をできるだけ尊重すること。
専門用語や固有名詞は一貫性を保つこと。
出力は翻訳結果のみを返し、余計な解説は含めないこと。`;
