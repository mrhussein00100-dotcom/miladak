/**
 * نظام معالجة الأخطاء الشامل لإعادة الصياغة
 */

import type { ErrorState } from '@/types/rewriter-enhanced';

// أنواع الأخطاء المختلفة
export enum ErrorType {
  NETWORK = 'network',
  VALIDATION = 'validation',
  API = 'api',
  CONTENT = 'content',
}

// رسائل الأخطاء المترجمة
export const ERROR_MESSAGES = {
  // أخطاء الشبكة
  NETWORK_ERROR: 'فشل في الاتصال بالخادم. تحقق من اتصالك بالإنترنت.',
  TIMEOUT_ERROR: 'انتهت مهلة الاتصال. حاول مرة أخرى.',
  SERVER_ERROR: 'خطأ في الخادم. حاول مرة أخرى لاحقاً.',

  // أخطاء التحقق
  EMPTY_CONTENT: 'لا يوجد محتوى لإعادة صياغته',
  INVALID_URL: 'الرابط غير صحيح. تأكد من صحة الرابط.',
  CONTENT_TOO_LONG: 'المحتوى طويل جداً. حاول تقليل الطول.',
  CONTENT_TOO_SHORT: 'المحتوى قصير جداً. أضف المزيد من النص.',

  // أخطاء API
  API_KEY_INVALID: 'مفتاح API غير صحيح',
  RATE_LIMIT_EXCEEDED: 'تم تجاوز حد الطلبات. حاول مرة أخرى لاحقاً.',
  MODEL_UNAVAILABLE: 'النموذج غير متاح حالياً. جرب نموذج آخر.',

  // أخطاء المحتوى
  CONTENT_EXTRACTION_FAILED: 'فشل في استخراج المحتوى من الرابط',
  UNSUPPORTED_CONTENT: 'نوع المحتوى غير مدعوم',
  CONTENT_BLOCKED: 'المحتوى محجوب أو محمي',

  // أخطاء عامة
  UNKNOWN_ERROR: 'حدث خطأ غير متوقع',
};

// حلول مقترحة للأخطاء
export const ERROR_SOLUTIONS = {
  [ErrorType.NETWORK]: [
    'تحقق من اتصالك بالإنترنت',
    'أعد تحميل الصفحة',
    'جرب مرة أخرى بعد قليل',
    'تأكد من عدم وجود برامج حجب',
  ],
  [ErrorType.VALIDATION]: [
    'تحقق من صحة البيانات المدخلة',
    'تأكد من أن المحتوى ليس فارغاً',
    'جرب تقليل طول المحتوى',
    'استخدم نص باللغة العربية أو الإنجليزية',
  ],
  [ErrorType.API]: [
    'جرب نموذج ذكاء اصطناعي مختلف',
    'انتظر قليلاً ثم حاول مرة أخرى',
    'تحقق من إعدادات الحساب',
    'تواصل مع الدعم الفني',
  ],
  [ErrorType.CONTENT]: [
    'تأكد من أن الرابط يحتوي على مقال',
    'جرب رابط من موقع إخباري معروف',
    'انسخ المحتوى يدوياً واستخدم التبويب الأول',
    'تأكد من أن الموقع لا يحجب الوصول الآلي',
  ],
};

/**
 * معالج الأخطاء الرئيسي
 */
export class RewriterErrorHandler {
  /**
   * تحليل الخطأ وتحديد نوعه
   */
  static analyzeError(error: any): ErrorState {
    // أخطاء الشبكة
    if (error.name === 'NetworkError' || error.code === 'NETWORK_ERROR') {
      return {
        type: ErrorType.NETWORK,
        message: ERROR_MESSAGES.NETWORK_ERROR,
        details: error.message,
        retryable: true,
      };
    }

    // أخطاء انتهاء المهلة
    if (error.name === 'TimeoutError' || error.code === 'TIMEOUT') {
      return {
        type: ErrorType.NETWORK,
        message: ERROR_MESSAGES.TIMEOUT_ERROR,
        details: error.message,
        retryable: true,
      };
    }

    // أخطاء HTTP
    if (error.status) {
      if (error.status >= 500) {
        return {
          type: ErrorType.NETWORK,
          message: ERROR_MESSAGES.SERVER_ERROR,
          details: `HTTP ${error.status}`,
          retryable: true,
        };
      }

      if (error.status === 429) {
        return {
          type: ErrorType.API,
          message: ERROR_MESSAGES.RATE_LIMIT_EXCEEDED,
          details: 'Rate limit exceeded',
          retryable: true,
        };
      }

      if (error.status === 401 || error.status === 403) {
        return {
          type: ErrorType.API,
          message: ERROR_MESSAGES.API_KEY_INVALID,
          details: 'Authentication failed',
          retryable: false,
        };
      }
    }

    // أخطاء التحقق
    if (error.type === 'validation') {
      return {
        type: ErrorType.VALIDATION,
        message: this.getValidationMessage(error.field, error.value),
        details: error.message,
        retryable: false,
      };
    }

    // أخطاء المحتوى
    if (error.type === 'content') {
      return {
        type: ErrorType.CONTENT,
        message: ERROR_MESSAGES.CONTENT_EXTRACTION_FAILED,
        details: error.message,
        retryable: true,
      };
    }

    // خطأ غير معروف
    return {
      type: ErrorType.NETWORK,
      message: ERROR_MESSAGES.UNKNOWN_ERROR,
      details: error.message || 'Unknown error',
      retryable: true,
    };
  }

  /**
   * الحصول على رسالة خطأ التحقق المناسبة
   */
  private static getValidationMessage(field: string, value: any): string {
    switch (field) {
      case 'content':
        if (!value || value.trim().length === 0) {
          return ERROR_MESSAGES.EMPTY_CONTENT;
        }
        if (value.length > 10000) {
          return ERROR_MESSAGES.CONTENT_TOO_LONG;
        }
        if (value.length < 10) {
          return ERROR_MESSAGES.CONTENT_TOO_SHORT;
        }
        break;

      case 'url':
        return ERROR_MESSAGES.INVALID_URL;

      default:
        return ERROR_MESSAGES.UNKNOWN_ERROR;
    }

    return ERROR_MESSAGES.UNKNOWN_ERROR;
  }

  /**
   * الحصول على الحلول المقترحة للخطأ
   */
  static getSolutions(errorType: ErrorType): string[] {
    return ERROR_SOLUTIONS[errorType] || ERROR_SOLUTIONS[ErrorType.NETWORK];
  }

  /**
   * تسجيل الخطأ للمراقبة
   */
  static logError(error: ErrorState, context?: any) {
    const logData = {
      timestamp: new Date().toISOString(),
      type: error.type,
      message: error.message,
      details: error.details,
      context,
      userAgent:
        typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
      url: typeof window !== 'undefined' ? window.location.href : 'server',
    };

    // في بيئة التطوير، اطبع في الكونسول
    if (process.env.NODE_ENV === 'development') {
      console.error('Rewriter Error:', logData);
    }

    // في بيئة الإنتاج، أرسل للخادم
    if (process.env.NODE_ENV === 'production') {
      // يمكن إضافة خدمة تسجيل الأخطاء هنا
      // مثل Sentry أو LogRocket
    }
  }

  /**
   * إنشاء خطأ مخصص
   */
  static createError(
    type: ErrorType,
    message: string,
    details?: string,
    retryable: boolean = true
  ): ErrorState {
    return {
      type,
      message,
      details,
      retryable,
    };
  }
}

/**
 * دالة مساعدة للتحقق من صحة البيانات
 */
export class RewriterValidator {
  /**
   * التحقق من صحة المحتوى
   */
  static validateContent(content: string): ErrorState | null {
    if (!content || content.trim().length === 0) {
      return RewriterErrorHandler.createError(
        ErrorType.VALIDATION,
        ERROR_MESSAGES.EMPTY_CONTENT,
        'Content is empty',
        false
      );
    }

    if (content.length > 10000) {
      return RewriterErrorHandler.createError(
        ErrorType.VALIDATION,
        ERROR_MESSAGES.CONTENT_TOO_LONG,
        `Content length: ${content.length}`,
        false
      );
    }

    if (content.length < 10) {
      return RewriterErrorHandler.createError(
        ErrorType.VALIDATION,
        ERROR_MESSAGES.CONTENT_TOO_SHORT,
        `Content length: ${content.length}`,
        false
      );
    }

    return null;
  }

  /**
   * التحقق من صحة الرابط
   */
  static validateUrl(url: string): ErrorState | null {
    if (!url || url.trim().length === 0) {
      return RewriterErrorHandler.createError(
        ErrorType.VALIDATION,
        'الرجاء إدخال رابط',
        'URL is empty',
        false
      );
    }

    try {
      new URL(url);
      return null;
    } catch {
      return RewriterErrorHandler.createError(
        ErrorType.VALIDATION,
        ERROR_MESSAGES.INVALID_URL,
        `Invalid URL: ${url}`,
        false
      );
    }
  }

  /**
   * التحقق من صحة الإعدادات
   */
  static validateSettings(settings: any): ErrorState | null {
    if (!settings.models || settings.models.length === 0) {
      return RewriterErrorHandler.createError(
        ErrorType.VALIDATION,
        'يرجى اختيار نموذج واحد على الأقل',
        'No models selected',
        false
      );
    }

    return null;
  }
}

/**
 * Hook مخصص لمعالجة الأخطاء
 */
export function useErrorHandler() {
  const handleError = (error: any, context?: any) => {
    const errorState = RewriterErrorHandler.analyzeError(error);
    RewriterErrorHandler.logError(errorState, context);
    return errorState;
  };

  const getSolutions = (errorType: ErrorType) => {
    return RewriterErrorHandler.getSolutions(errorType);
  };

  return {
    handleError,
    getSolutions,
    validateContent: RewriterValidator.validateContent,
    validateUrl: RewriterValidator.validateUrl,
    validateSettings: RewriterValidator.validateSettings,
  };
}
