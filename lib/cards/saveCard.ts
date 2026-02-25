/**
 * Card save operations with loading states and error handling
 */
import { CardData, validateCardData, sanitizeCardData } from './validation';

export interface SaveCardResult {
  success: boolean;
  cardId?: string;
  message: string;
  errors?: string[];
}

export interface SaveCardOptions {
  onLoadingStart?: () => void;
  onLoadingEnd?: () => void;
  onProgress?: (progress: number) => void;
}

/**
 * Saves card data with comprehensive error handling and loading states
 */
export async function saveCard(
  cardData: CardData,
  options: SaveCardOptions = {}
): Promise<SaveCardResult> {
  const { onLoadingStart, onLoadingEnd, onProgress } = options;

  try {
    onLoadingStart?.();
    onProgress?.(10);

    // Validate card data
    const validation = validateCardData(cardData);
    if (!validation.isValid) {
      return {
        success: false,
        message: 'بيانات البطاقة غير صحيحة',
        errors: validation.errors,
      };
    }
    onProgress?.(30);

    // Sanitize data
    const sanitizedData = sanitizeCardData(cardData);
    onProgress?.(50);

    // Prepare save request
    const savePayload = {
      ...sanitizedData,
      createdAt: new Date().toISOString(),
      version: '2.0',
    };
    onProgress?.(70);

    // Make API call to save card
    const response = await fetch('/api/cards/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(savePayload),
    });
    onProgress?.(90);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `خطأ في الخادم: ${response.status}`);
    }

    const result = await response.json();
    onProgress?.(100);

    return {
      success: true,
      cardId: result.cardId || generateCardId(),
      message: 'تم حفظ البطاقة بنجاح! 🎉',
    };
  } catch (error) {
    console.error('Card save error:', error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'حدث خطأ غير متوقع أثناء حفظ البطاقة',
      errors: [error instanceof Error ? error.message : 'خطأ غير معروف'],
    };
  } finally {
    onLoadingEnd?.();
  }
}

function generateCardId(): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `card_${timestamp}_${randomStr}`;
}

/**
 * Retries save operation with exponential backoff
 */
export async function saveCardWithRetry(
  cardData: CardData,
  maxRetries: number = 3,
  options: SaveCardOptions = {}
): Promise<SaveCardResult> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await saveCard(cardData, {
        ...options,
        onProgress: (progress) => {
          const adjustedProgress =
            ((attempt - 1) * 100 + progress) / maxRetries;
          options.onProgress?.(adjustedProgress);
        },
      });

      if (result.success) return result;

      if (
        result.errors?.some((error) =>
          error.includes('بيانات البطاقة غير صحيحة')
        )
      ) {
        return result;
      }
      lastError = new Error(result.message);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('خطأ غير معروف');
    }

    if (attempt < maxRetries) {
      const delay = Math.pow(2, attempt - 1) * 1000;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  return {
    success: false,
    message: `فشل في حفظ البطاقة بعد ${maxRetries} محاولات: ${lastError?.message}`,
    errors: [lastError?.message || 'خطأ غير معروف'],
  };
}
