import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    // Simple text rewriting - basic formatting and cleanup
    const rewrittenText = simpleRewrite(text);

    return NextResponse.json({
      rewrittenText,
      originalLength: text.length,
      newLength: rewrittenText.length,
    });
  } catch (error) {
    console.error('Simple rewrite error:', error);
    return NextResponse.json(
      { error: 'Failed to rewrite text' },
      { status: 500 }
    );
  }
}

function simpleRewrite(text: string): string {
  // Basic text cleanup and formatting
  return (
    text
      // Fix multiple spaces
      .replace(/\s+/g, ' ')
      // Fix punctuation spacing
      .replace(/\s*([،؛؟!])\s*/g, '$1 ')
      .replace(/\s*([.])\s*/g, '$1 ')
      // Fix Arabic text formatting
      .replace(/([أإآا])\s+([لن])\s+/g, '$1$2 ')
      // Trim and clean
      .trim()
  );
}
