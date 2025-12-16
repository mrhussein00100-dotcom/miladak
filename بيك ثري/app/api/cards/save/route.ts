/**
 * API endpoint for saving cards
 */
import { NextRequest, NextResponse } from 'next/server';
import {
  validateCardData,
  sanitizeCardData,
  type CardData,
} from '@/lib/cards/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        {
          success: false,
          message: 'بيانات الطلب غير صحيحة',
          error: 'INVALID_REQUEST_BODY',
        },
        { status: 400 }
      );
    }

    const cardData: CardData = {
      name: body.name,
      age: body.age,
      templateId: body.templateId,
      greeting: body.greeting,
      message: body.message,
      signature: body.signature,
      showAge: body.showAge,
      fontId: body.fontId,
    };

    const validation = validateCardData(cardData);
    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          message: 'بيانات البطاقة غير صحيحة',
          errors: validation.errors,
          fieldErrors: validation.fieldErrors,
          error: 'VALIDATION_FAILED',
        },
        { status: 400 }
      );
    }

    const sanitizedData = sanitizeCardData(cardData);
    const cardId = generateUniqueCardId();

    const cardRecord = {
      id: cardId,
      ...sanitizedData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: '2.0',
      status: 'active',
    };

    console.log('Card saved:', cardRecord);
    await new Promise((resolve) => setTimeout(resolve, 500));

    return NextResponse.json({
      success: true,
      cardId: cardId,
      message: 'تم حفظ البطاقة بنجاح ✨',
      data: {
        id: cardId,
        name: sanitizedData.name,
        templateId: sanitizedData.templateId,
        fontId: sanitizedData.fontId,
        createdAt: cardRecord.createdAt,
      },
    });
  } catch (error) {
    console.error('Card save API error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'حدث خطأ في الخادم أثناء حفظ البطاقة',
        error: 'INTERNAL_SERVER_ERROR',
        details: error instanceof Error ? error.message : 'خطأ غير معروف',
      },
      { status: 500 }
    );
  }
}

function generateUniqueCardId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 10);
  return `card_${timestamp}_${random}`;
}

export async function GET() {
  return NextResponse.json(
    { message: 'Method not allowed. Use POST to save cards.' },
    { status: 405 }
  );
}
