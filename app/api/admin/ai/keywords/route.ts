import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    // Simple keyword extraction logic
    const keywords = extractKeywords(text);

    return NextResponse.json({ keywords });
  } catch (error) {
    console.error('Keywords extraction error:', error);
    return NextResponse.json(
      { error: 'Failed to extract keywords' },
      { status: 500 }
    );
  }
}

function extractKeywords(text: string): string[] {
  // Simple keyword extraction - split by common delimiters and filter
  const words = text
    .toLowerCase()
    .replace(
      /[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\w\s]/g,
      ' '
    )
    .split(/\s+/)
    .filter((word) => word.length > 2)
    .filter((word) => !isStopWord(word));

  // Remove duplicates and return top keywords
  const uniqueWords = [...new Set(words)];
  return uniqueWords.slice(0, 20);
}

function isStopWord(word: string): boolean {
  const arabicStopWords = [
    'في',
    'من',
    'إلى',
    'على',
    'عن',
    'مع',
    'هذا',
    'هذه',
    'ذلك',
    'تلك',
    'التي',
    'الذي',
    'التي',
    'كان',
    'كانت',
    'يكون',
    'تكون',
    'هو',
    'هي',
    'أن',
    'إن',
    'كل',
    'بعض',
    'جميع',
    'كيف',
    'ماذا',
    'متى',
    'أين',
    'لماذا',
  ];

  const englishStopWords = [
    'the',
    'a',
    'an',
    'and',
    'or',
    'but',
    'in',
    'on',
    'at',
    'to',
    'for',
    'of',
    'with',
    'by',
    'is',
    'are',
    'was',
    'were',
    'be',
    'been',
    'have',
    'has',
    'had',
    'do',
    'does',
    'did',
    'will',
    'would',
    'could',
    'should',
  ];

  return arabicStopWords.includes(word) || englishStopWords.includes(word);
}
