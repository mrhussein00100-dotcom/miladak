/**
 * Card data validation utilities
 * Validates card data before save operations
 * **Validates: Requirements 3.1, 3.2**
 */

export interface CardValidationResult {
  isValid: boolean;
  errors: string[];
  fieldErrors: Record<string, string>;
}

export interface CardData {
  name: string;
  age?: number;
  templateId: string;
  greeting?: string;
  message?: string;
  signature?: string;
  showAge?: boolean;
  fontId?: string;
}

/**
 * Error messages in Arabic for better user experience
 */
export const ERROR_MESSAGES = {
  name: {
    required: 'يرجى إدخال اسم صاحب البطاقة',
    tooShort: 'يجب أن يكون الاسم أكثر من حرف واحد',
    tooLong: 'يجب أن يكون الاسم أقل من 50 حرف',
  },
  age: {
    negative: 'العمر يجب أن يكون رقم موجب',
    tooHigh: 'العمر يجب أن يكون أقل من 150 سنة',
  },
  templateId: {
    required: 'يرجى اختيار تصميم للبطاقة',
    invalid: 'تصميم البطاقة غير صالح',
  },
  greeting: {
    tooLong: 'التحية يجب أن تكون أقل من 100 حرف',
  },
  message: {
    tooLong: 'الرسالة يجب أن تكون أقل من 500 حرف',
  },
  signature: {
    tooLong: 'التوقيع يجب أن يكون أقل من 50 حرف',
  },
  fontId: {
    invalid: 'الخط المختار غير صالح',
  },
} as const;

/**
 * Validates card data with comprehensive field-specific error messages
 * Returns detailed validation result with Arabic error messages
 */
export function validateCardData(data: CardData): CardValidationResult {
  const errors: string[] = [];
  const fieldErrors: Record<string, string> = {};

  // Validate name field
  if (!data.name || data.name.trim().length === 0) {
    errors.push(ERROR_MESSAGES.name.required);
    fieldErrors.name = ERROR_MESSAGES.name.required;
  } else if (data.name.trim().length < 2) {
    errors.push(ERROR_MESSAGES.name.tooShort);
    fieldErrors.name = ERROR_MESSAGES.name.tooShort;
  } else if (data.name.trim().length > 50) {
    errors.push(ERROR_MESSAGES.name.tooLong);
    fieldErrors.name = ERROR_MESSAGES.name.tooLong;
  }

  // Validate age field (if provided)
  if (data.age !== undefined) {
    if (data.age < 0) {
      errors.push(ERROR_MESSAGES.age.negative);
      fieldErrors.age = ERROR_MESSAGES.age.negative;
    } else if (data.age > 150) {
      errors.push(ERROR_MESSAGES.age.tooHigh);
      fieldErrors.age = ERROR_MESSAGES.age.tooHigh;
    }
  }

  // Validate template selection
  if (!data.templateId || data.templateId.trim().length === 0) {
    errors.push(ERROR_MESSAGES.templateId.required);
    fieldErrors.templateId = ERROR_MESSAGES.templateId.required;
  } else if (!validateTemplateId(data.templateId)) {
    errors.push(ERROR_MESSAGES.templateId.invalid);
    fieldErrors.templateId = ERROR_MESSAGES.templateId.invalid;
  }

  // Validate greeting (if provided)
  if (data.greeting && data.greeting.length > 100) {
    errors.push(ERROR_MESSAGES.greeting.tooLong);
    fieldErrors.greeting = ERROR_MESSAGES.greeting.tooLong;
  }

  // Validate message (if provided)
  if (data.message && data.message.length > 500) {
    errors.push(ERROR_MESSAGES.message.tooLong);
    fieldErrors.message = ERROR_MESSAGES.message.tooLong;
  }

  // Validate signature (if provided)
  if (data.signature && data.signature.length > 50) {
    errors.push(ERROR_MESSAGES.signature.tooLong);
    fieldErrors.signature = ERROR_MESSAGES.signature.tooLong;
  }

  return {
    isValid: errors.length === 0,
    errors,
    fieldErrors,
  };
}

/**
 * Validates template ID format
 */
export function validateTemplateId(templateId: string): boolean {
  const templateIdRegex = /^[a-z0-9-]+$/;
  return Boolean(
    templateId && templateId.length > 0 && templateIdRegex.test(templateId)
  );
}

/**
 * Sanitizes card data for safe storage
 */
export function sanitizeCardData(data: CardData): CardData {
  return {
    name: data.name?.trim() || '',
    age: data.age && data.age >= 0 ? Math.floor(data.age) : undefined,
    templateId: data.templateId?.trim() || '',
    greeting: data.greeting?.trim() || '',
    message: data.message?.trim() || '',
    signature: data.signature?.trim() || '',
    showAge: Boolean(data.showAge),
    fontId: data.fontId?.trim() || 'cairo',
  };
}
