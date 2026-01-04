import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db/database';

interface SearchTool {
  id: number;
  title: string;
  description: string | null;
  slug: string;
  icon: string | null;
  category_name: string | null;
}

interface SearchArticle {
  id: number;
  title: string;
  excerpt: string | null;
  slug: string;
  image: string | null;
  category_name: string | null;
}

interface SearchResult {
  id: number;
  title: string;
  slug: string;
  description?: string;
  excerpt?: string;
  image?: string;
  icon?: string;
  type: 'tool' | 'article';
  category?: string;
}

/**
 * إزالة جميع علامات الترقيم العربية والإنجليزية
 * واستبدالها بمسافة للحفاظ على الفصل بين الكلمات
 */
function removePunctuation(text: string): string {
  return (
    text
      // علامات الترقيم العربية - استبدالها بمسافة
      .replace(/[،؛؟!٪٫٬]/g, ' ')
      // علامات الترقيم الإنجليزية الشائعة - استبدالها بمسافة
      .replace(/[.,;:!?%@#$^&*()+=\-_'"<>\/\\|`~]/g, ' ')
      // الأقواس والعلامات الخاصة - استبدالها بمسافة
      .replace(/[\[\]{}«»""'']/g, ' ')
      // الشرطات والخطوط - استبدالها بمسافة
      .replace(/[—–‐‑‒―]/g, ' ')
      // علامات الاقتباس - استبدالها بمسافة
      .replace(/[「」『』【】〈〉《》]/g, ' ')
      // أي رموز أخرى غير الحروف والأرقام والمسافات - استبدالها بمسافة
      .replace(/[^\p{L}\p{N}\s]/gu, ' ')
      // إزالة المسافات المتعددة
      .replace(/\s+/g, ' ')
      .trim()
  );
}

/**
 * تطبيع النص العربي - إزالة الهمزات والتشكيل وعلامات الترقيم
 * لتحسين نتائج البحث
 */
function normalizeArabicText(text: string): string {
  let normalized = text;

  // إزالة علامات الترقيم أولاً
  normalized = removePunctuation(normalized);

  // تحويل جميع أشكال الألف إلى ألف عادية
  normalized = normalized.replace(/[أإآٱ]/g, 'ا');

  // تحويل التاء المربوطة إلى هاء
  normalized = normalized.replace(/ة/g, 'ه');

  // تحويل الياء المقصورة إلى ياء
  normalized = normalized.replace(/ى/g, 'ي');

  // إزالة التشكيل (الفتحة، الضمة، الكسرة، السكون، الشدة، التنوين)
  normalized = normalized.replace(/[\u064B-\u065F\u0670]/g, '');

  // إزالة الهمزة على الواو والياء
  normalized = normalized.replace(/ؤ/g, 'و');
  normalized = normalized.replace(/ئ/g, 'ي');

  // إزالة الهمزة المنفردة
  normalized = normalized.replace(/ء/g, '');

  // إزالة المسافات الزائدة
  normalized = normalized.replace(/\s+/g, ' ').trim();

  return normalized.toLowerCase();
}

/**
 * إنشاء جميع التباديل الممكنة للنص العربي
 * للتعامل مع اختلافات الهمزات والتاء المربوطة والياء
 */
function generateArabicVariations(text: string): string[] {
  let variations: string[] = [text];

  // تحويلات الألف والهمزة - استبدال كل أشكال الألف
  const alefPattern = /[أإآٱا]/g;
  const alefForms = ['ا', 'أ', 'إ', 'آ'];

  // استبدال كل الألفات بنفس الشكل
  alefForms.forEach((alef) => {
    const newVar = text.replace(alefPattern, alef);
    if (newVar !== text && !variations.includes(newVar)) {
      variations.push(newVar);
    }
  });

  // استبدال الألف الأولى فقط بأشكال مختلفة (مهم للكلمات مثل "احجار" -> "أحجار")
  const firstAlefMatch = text.match(/^[أإآٱا]/);
  if (firstAlefMatch) {
    alefForms.forEach((alef) => {
      const newVar = text.replace(/^[أإآٱا]/, alef);
      if (newVar !== text && !variations.includes(newVar)) {
        variations.push(newVar);
      }
    });
  }

  // البحث عن كل الألفات في النص واستبدال كل واحدة على حدة
  const alefMatches = [...text.matchAll(/[أإآٱا]/g)];
  if (alefMatches.length > 0) {
    alefMatches.forEach((match, idx) => {
      alefForms.forEach((alef) => {
        let newVar = text;
        let count = 0;
        newVar = newVar.replace(/[أإآٱا]/g, (m) => {
          if (count === idx) {
            count++;
            return alef;
          }
          count++;
          return m;
        });
        if (newVar !== text && !variations.includes(newVar)) {
          variations.push(newVar);
        }
      });
    });
  }

  // تحويلات التاء المربوطة والهاء
  const currentVars1 = [...variations];
  currentVars1.forEach((v) => {
    const withTa = v.replace(/[ةه]/g, 'ة');
    const withHa = v.replace(/[ةه]/g, 'ه');
    if (!variations.includes(withTa)) variations.push(withTa);
    if (!variations.includes(withHa)) variations.push(withHa);
  });

  // تحويلات الياء والياء المقصورة
  const currentVars2 = [...variations];
  currentVars2.forEach((v) => {
    const withYa = v.replace(/[يى]/g, 'ي');
    const withAlefMaqsura = v.replace(/[يى]/g, 'ى');
    if (!variations.includes(withYa)) variations.push(withYa);
    if (!variations.includes(withAlefMaqsura)) variations.push(withAlefMaqsura);
  });

  // تحويلات الهمزة على الواو والياء
  const currentVars3 = [...variations];
  currentVars3.forEach((v) => {
    const withoutHamza = v.replace(/ؤ/g, 'و').replace(/ئ/g, 'ي');
    if (!variations.includes(withoutHamza)) variations.push(withoutHamza);
  });

  return variations;
}

/**
 * إنشاء أنماط بحث متعددة للنص العربي
 * يشمل البحث بالهمزات وبدونها في الاتجاهين
 * ويشمل البحث بدون علامات الترقيم
 * ويشمل البحث بالكلمات المنفصلة
 */
function createSearchPatterns(searchQuery: string): string[] {
  const patterns: string[] = [];

  // النص الأصلي
  patterns.push(`%${searchQuery}%`);

  // النص بدون علامات الترقيم
  const withoutPunctuation = removePunctuation(searchQuery).trim();
  if (withoutPunctuation && withoutPunctuation !== searchQuery) {
    patterns.push(`%${withoutPunctuation}%`);
  }

  // النص المطبّع بالكامل
  const normalized = normalizeArabicText(searchQuery);
  if (normalized && normalized !== searchQuery.toLowerCase()) {
    patterns.push(`%${normalized}%`);
  }

  // إنشاء جميع التباديل الممكنة للنص الأصلي
  const variations = generateArabicVariations(searchQuery);
  variations.forEach((v) => {
    if (v !== searchQuery) {
      patterns.push(`%${v}%`);
    }
  });

  // إنشاء تباديل للنص بدون علامات ترقيم
  if (withoutPunctuation && withoutPunctuation !== searchQuery) {
    const cleanVariations = generateArabicVariations(withoutPunctuation);
    cleanVariations.forEach((v) => {
      patterns.push(`%${v}%`);
    });
  }

  // البحث بالكلمات المنفصلة (للبحث الجزئي)
  const words = withoutPunctuation.split(/\s+/).filter((w) => w.length >= 2);
  if (words.length > 1) {
    // إضافة كل كلمة كنمط منفصل
    words.forEach((word) => {
      patterns.push(`%${word}%`);
      // إضافة تباديل لكل كلمة
      const wordVariations = generateArabicVariations(word);
      wordVariations.forEach((v) => {
        if (v !== word) {
          patterns.push(`%${v}%`);
        }
      });
    });
  }

  // إزالة التكرارات والأنماط الفارغة
  return [...new Set(patterns)].filter((p) => p !== '%%' && p.length > 2);
}

/**
 * Search API
 * Feature: frontend-database-integration
 * Requirements: 4.3, 5.3, 10.5
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    // دعم كلا المعاملين: q و keyword
    const q = (searchParams.get('q') || searchParams.get('keyword'))?.trim();
    const type = searchParams.get('type'); // tools, articles, or all

    // Validate query
    if (!q || q.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'EMPTY_QUERY',
            message: 'يرجى إدخال كلمة للبحث',
          },
          results: [],
        },
        { status: 400 }
      );
    }

    console.log('Search API - Query:', q);

    const searchPatterns = createSearchPatterns(q);
    const results: SearchResult[] = [];
    const seenToolIds = new Set<number>();
    const seenArticleIds = new Set<number>();

    // Search tools
    if (!type || type === 'all' || type === 'tools') {
      try {
        // البحث بكل الأنماط
        for (const pattern of searchPatterns) {
          const tools = await query<SearchTool>(
            `SELECT t.id, t.title, t.description, t.name as slug, t.icon, c.name as category_name
             FROM tools t
             LEFT JOIN tool_categories c ON t.category_id = c.id
             WHERE CAST(t.is_active AS TEXT) IN ('1', 'true', 't') AND (t.title LIKE ? OR t.description LIKE ? OR t.name LIKE ?)
             ORDER BY t.sort_order ASC
             LIMIT 30`,
            [pattern, pattern, pattern]
          );

          tools.forEach((tool) => {
            if (!seenToolIds.has(tool.id)) {
              seenToolIds.add(tool.id);
              results.push({
                id: tool.id,
                title: tool.title,
                slug: tool.slug,
                description: tool.description || undefined,
                icon: tool.icon || undefined,
                type: 'tool',
                category: tool.category_name || undefined,
              });
            }
          });
        }
      } catch (e) {
        console.error('Error searching tools:', e);
      }
    }

    // Search articles
    if (!type || type === 'all' || type === 'articles') {
      try {
        // البحث بكل الأنماط
        for (const pattern of searchPatterns) {
          const articles = await query<SearchArticle>(
            `SELECT a.id, a.title, a.excerpt, a.slug, a.image, c.name as category_name
             FROM articles a
             LEFT JOIN article_categories c ON CAST(a.category_id AS INTEGER) = c.id
             WHERE CAST(a.published AS TEXT) IN ('1', 'true', 't') AND (a.title LIKE ? OR a.excerpt LIKE ? OR a.content LIKE ?)
             ORDER BY a.created_at DESC
             LIMIT 20`,
            [pattern, pattern, pattern]
          );

          articles.forEach((article) => {
            if (!seenArticleIds.has(article.id)) {
              seenArticleIds.add(article.id);
              results.push({
                id: article.id,
                title: article.title,
                slug: article.slug,
                excerpt: article.excerpt || undefined,
                image: article.image || undefined,
                type: 'article',
                category: article.category_name || undefined,
              });
            }
          });
        }
      } catch (e) {
        console.error('Error searching articles:', e);
      }
    }

    // Sort results: by relevance (exact matches first), then tools first, then articles
    const normalizedQuery = normalizeArabicText(q);
    results.sort((a, b) => {
      // حساب درجة التطابق
      const scoreA = calculateRelevanceScore(a, normalizedQuery);
      const scoreB = calculateRelevanceScore(b, normalizedQuery);

      if (scoreA !== scoreB) return scoreB - scoreA;

      // إذا كانت الدرجة متساوية، الأدوات أولاً
      if (a.type === 'tool' && b.type === 'article') return -1;
      if (a.type === 'article' && b.type === 'tool') return 1;
      return 0;
    });

    return NextResponse.json({
      success: true,
      results,
      query: q,
      total: results.length,
    });
  } catch (error) {
    console.error('Search API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: 'حدث خطأ في البحث',
        },
        results: [],
      },
      { status: 500 }
    );
  }
}

/**
 * حساب درجة صلة النتيجة بالبحث
 */
function calculateRelevanceScore(
  result: SearchResult,
  normalizedQuery: string
): number {
  let score = 0;
  const normalizedTitle = normalizeArabicText(result.title);
  const normalizedDesc = normalizeArabicText(
    result.description || result.excerpt || ''
  );

  // تطابق تام في العنوان
  if (normalizedTitle === normalizedQuery) score += 100;
  // العنوان يبدأ بالبحث
  else if (normalizedTitle.startsWith(normalizedQuery)) score += 80;
  // العنوان يحتوي على البحث
  else if (normalizedTitle.includes(normalizedQuery)) score += 60;

  // الوصف يحتوي على البحث
  if (normalizedDesc.includes(normalizedQuery)) score += 20;

  // البحث بالكلمات المنفصلة
  const queryWords = normalizedQuery.split(/\s+/).filter((w) => w.length >= 2);
  queryWords.forEach((word) => {
    if (normalizedTitle.includes(word)) score += 10;
    if (normalizedDesc.includes(word)) score += 5;
  });

  return score;
}
