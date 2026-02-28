/**
 * Detects the language of a given text string using Unicode range heuristics.
 * Returns a language code and display name.
 */
export interface LanguageInfo {
  code: string;
  name: string;
  isRTL: boolean;
}

export function detectLanguage(text: string): LanguageInfo {
  if (!text || text.trim().length === 0) {
    return { code: 'en', name: 'English', isRTL: false };
  }

  const sample = text.trim();

  // Arabic
  if (/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(sample)) {
    return { code: 'ar', name: 'Arabic', isRTL: true };
  }
  // Hebrew
  if (/[\u0590-\u05FF\uFB1D-\uFB4F]/.test(sample)) {
    return { code: 'he', name: 'Hebrew', isRTL: true };
  }
  // Persian/Farsi
  if (/[\u0600-\u06FF]/.test(sample) && /[\u06A9\u06AF\u06CC\u06BE]/.test(sample)) {
    return { code: 'fa', name: 'Persian', isRTL: true };
  }
  // Chinese (CJK)
  if (/[\u4E00-\u9FFF\u3400-\u4DBF]/.test(sample)) {
    return { code: 'zh', name: 'Chinese', isRTL: false };
  }
  // Japanese
  if (/[\u3040-\u309F\u30A0-\u30FF]/.test(sample)) {
    return { code: 'ja', name: 'Japanese', isRTL: false };
  }
  // Korean
  if (/[\uAC00-\uD7AF\u1100-\u11FF]/.test(sample)) {
    return { code: 'ko', name: 'Korean', isRTL: false };
  }
  // Hindi/Devanagari
  if (/[\u0900-\u097F]/.test(sample)) {
    return { code: 'hi', name: 'Hindi', isRTL: false };
  }
  // Thai
  if (/[\u0E00-\u0E7F]/.test(sample)) {
    return { code: 'th', name: 'Thai', isRTL: false };
  }
  // Russian/Cyrillic
  if (/[\u0400-\u04FF]/.test(sample)) {
    return { code: 'ru', name: 'Russian', isRTL: false };
  }
  // Greek
  if (/[\u0370-\u03FF]/.test(sample)) {
    return { code: 'el', name: 'Greek', isRTL: false };
  }
  // Spanish heuristic
  if (/[áéíóúüñ¿¡]/i.test(sample)) {
    return { code: 'es', name: 'Spanish', isRTL: false };
  }
  // French heuristic
  if (/[àâæçèéêëîïôœùûüÿ]/i.test(sample)) {
    return { code: 'fr', name: 'French', isRTL: false };
  }
  // German heuristic
  if (/[äöüß]/i.test(sample)) {
    return { code: 'de', name: 'German', isRTL: false };
  }
  // Portuguese heuristic
  if (/[ãõâêôàáéíóúç]/i.test(sample)) {
    return { code: 'pt', name: 'Portuguese', isRTL: false };
  }

  return { code: 'en', name: 'English', isRTL: false };
}
