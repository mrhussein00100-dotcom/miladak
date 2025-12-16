/**
 * SEO Keywords Generator
 * Feature: frontend-database-integration
 * Requirements: 9.1
 */

import {
  CORE_KEYWORDS_AR,
  CORE_KEYWORDS_EN,
  PAGE_KEYWORDS,
  LONG_TAIL_KEYWORDS,
  PageType,
} from './keywords';

/**
 * Generate keywords for a specific page
 * Combines core, page-specific, and long-tail keywords
 * @param pageType - The type of page
 * @param additionalKeywords - Optional additional keywords
 * @returns Array of keywords (100+ keywords)
 */
export function generateKeywords(
  pageType: PageType,
  additionalKeywords: string[] = []
): string[] {
  const keywords = new Set<string>();

  // Add core Arabic keywords
  CORE_KEYWORDS_AR.forEach((kw) => keywords.add(kw));

  // Add core English keywords
  CORE_KEYWORDS_EN.forEach((kw) => keywords.add(kw));

  // Add page-specific keywords
  const pageKeywords = PAGE_KEYWORDS[pageType] || [];
  pageKeywords.forEach((kw) => keywords.add(kw));

  // Add long-tail keywords
  LONG_TAIL_KEYWORDS.forEach((kw) => keywords.add(kw));

  // Add additional keywords
  additionalKeywords.forEach((kw) => keywords.add(kw));

  // Generate variations
  const variations = generateVariations(Array.from(keywords));
  variations.forEach((kw) => keywords.add(kw));

  return Array.from(keywords);
}

/**
 * Generate keyword variations
 */
function generateVariations(keywords: string[]): string[] {
  const variations: string[] = [];

  keywords.forEach((kw) => {
    // Add "ميلادك" prefix/suffix variations
    if (!kw.includes('ميلادك')) {
      variations.push(`${kw} ميلادك`);
      variations.push(`ميلادك ${kw}`);
    }

    // Add "حاسبة" prefix for relevant keywords
    if (
      !kw.includes('حاسبة') &&
      (kw.includes('العمر') || kw.includes('الأيام') || kw.includes('التاريخ'))
    ) {
      variations.push(`حاسبة ${kw}`);
    }

    // Add "اون لاين" suffix
    if (kw.includes('حاسبة') || kw.includes('حساب')) {
      variations.push(`${kw} اون لاين`);
      variations.push(`${kw} مجانا`);
    }
  });

  return variations;
}

/**
 * Generate meta keywords string
 */
export function generateMetaKeywords(
  pageType: PageType,
  additionalKeywords: string[] = []
): string {
  const keywords = generateKeywords(pageType, additionalKeywords);
  return keywords.slice(0, 100).join(', ');
}

/**
 * Get keywords count for a page
 */
export function getKeywordsCount(pageType: PageType): number {
  return generateKeywords(pageType).length;
}
