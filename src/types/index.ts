export type Locale = 'zh-CN' | 'en-US';
export type ThemeMode = 'light' | 'dark';

export interface LocalizedText {
  'zh-CN': string;
  'en-US': string;
}

export interface LocalizedKeywords {
  'zh-CN': string[];
  'en-US': string[];
}
