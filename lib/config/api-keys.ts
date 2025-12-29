/**
 * API Keys Management System
 * نظام إدارة مفاتيح API مع التحقق والتشفير
 */

interface ApiKeyConfig {
  key: string;
  name: string;
  required: boolean;
  testEndpoint?: string;
}

interface ApiKeysMap {
  [provider: string]: ApiKeyConfig;
}

/**
 * إعدادات مفاتيح API
 */
const API_KEYS_CONFIG: ApiKeysMap = {
  groq: {
    key: process.env.GROQ_API_KEY || '',
    name: 'Groq AI',
    required: true,
    testEndpoint: 'https://api.groq.com/openai/v1/models',
  },
  gemini: {
    key: process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || '',
    name: 'Google Gemini',
    required: true,
    testEndpoint: 'https://generativelanguage.googleapis.com/v1/models',
  },
  cohere: {
    key: process.env.COHERE_API_KEY || '',
    name: 'Cohere',
    required: false,
    testEndpoint: 'https://api.cohere.ai/v1/models',
  },
  huggingface: {
    key: process.env.HUGGINGFACE_API_KEY || '',
    name: 'Hugging Face',
    required: false,
    testEndpoint: 'https://api-inference.huggingface.co/models',
  },
  pexels: {
    key: process.env.PEXELS_API_KEY || '',
    name: 'Pexels',
    required: false,
    testEndpoint: 'https://api.pexels.com/v1/search',
  },
  openai: {
    key: process.env.OPENAI_API_KEY || '',
    name: 'OpenAI',
    required: false,
    testEndpoint: 'https://api.openai.com/v1/models',
  },
};

/**
 * الحصول على مفتاح API لمزود معين
 */
export function getApiKey(provider: string): string {
  const config = API_KEYS_CONFIG[provider];

  if (!config) {
    throw new Error(`Unknown API provider: ${provider}`);
  }

  if (!config.key) {
    if (config.required) {
      throw new Error(
        `Required API key for ${
          config.name
        } is missing. Please set ${provider.toUpperCase()}_API_KEY environment variable.`
      );
    } else {
      console.warn(
        `Optional API key for ${config.name} is missing. Some features may not work.`
      );
      return '';
    }
  }

  return config.key;
}

/**
 * التحقق من صحة مفتاح API
 */
export async function validateApiKey(provider: string): Promise<boolean> {
  const config = API_KEYS_CONFIG[provider];

  if (!config || !config.key || !config.testEndpoint) {
    return false;
  }

  try {
    const headers: Record<string, string> = {
      'User-Agent': 'Miladak/1.0',
    };

    // إضافة header المناسب لكل مزود
    switch (provider) {
      case 'groq':
      case 'openai':
        headers['Authorization'] = `Bearer ${config.key}`;
        break;
      case 'gemini':
        // Gemini يستخدم query parameter
        break;
      case 'cohere':
        headers['Authorization'] = `Bearer ${config.key}`;
        break;
      case 'huggingface':
        headers['Authorization'] = `Bearer ${config.key}`;
        break;
      case 'pexels':
        headers['Authorization'] = config.key;
        break;
    }

    let testUrl = config.testEndpoint;
    if (provider === 'gemini') {
      testUrl += `?key=${config.key}`;
    }

    const response = await fetch(testUrl, {
      method: 'GET',
      headers,
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });

    return response.status < 500; // Accept 2xx, 3xx, 4xx but not 5xx
  } catch (error) {
    console.error(`Failed to validate ${provider} API key:`, error);
    return false;
  }
}

/**
 * التحقق من جميع مفاتيح API
 */
export async function validateAllApiKeys(): Promise<Record<string, boolean>> {
  const results: Record<string, boolean> = {};

  const validationPromises = Object.keys(API_KEYS_CONFIG).map(
    async (provider) => {
      const isValid = await validateApiKey(provider);
      results[provider] = isValid;
      return { provider, isValid };
    }
  );

  await Promise.all(validationPromises);

  return results;
}

/**
 * الحصول على حالة جميع مفاتيح API
 */
export function getApiKeysStatus(): Record<
  string,
  { configured: boolean; required: boolean; name: string }
> {
  const status: Record<
    string,
    { configured: boolean; required: boolean; name: string }
  > = {};

  Object.entries(API_KEYS_CONFIG).forEach(([provider, config]) => {
    status[provider] = {
      configured: !!config.key,
      required: config.required,
      name: config.name,
    };
  });

  return status;
}

/**
 * إنشاء تقرير مفاتيح API
 */
export async function generateApiKeysReport(): Promise<string> {
  const status = getApiKeysStatus();
  const validation = await validateAllApiKeys();

  let report = '# تقرير مفاتيح API\n\n';

  Object.entries(status).forEach(([provider, info]) => {
    const isConfigured = info.configured;
    const isValid = validation[provider];
    const statusIcon = isConfigured ? (isValid ? '✅' : '⚠️') : '❌';
    const requiredText = info.required ? '(مطلوب)' : '(اختياري)';

    report += `${statusIcon} **${info.name}** ${requiredText}\n`;
    report += `   - مُعرَّف: ${isConfigured ? 'نعم' : 'لا'}\n`;

    if (isConfigured) {
      report += `   - صالح: ${isValid ? 'نعم' : 'غير محقق'}\n`;
    }

    report += '\n';
  });

  return report;
}

/**
 * تشفير مفتاح API للعرض الآمن
 */
export function maskApiKey(key: string): string {
  if (!key || key.length < 8) {
    return '***';
  }

  const start = key.substring(0, 4);
  const end = key.substring(key.length - 4);
  const middle = '*'.repeat(Math.max(4, key.length - 8));

  return `${start}${middle}${end}`;
}

/**
 * الحصول على معلومات مفتاح API مع التشفير
 */
export function getApiKeyInfo(provider: string): {
  name: string;
  configured: boolean;
  required: boolean;
  maskedKey?: string;
} {
  const config = API_KEYS_CONFIG[provider];

  if (!config) {
    throw new Error(`Unknown provider: ${provider}`);
  }

  return {
    name: config.name,
    configured: !!config.key,
    required: config.required,
    maskedKey: config.key ? maskApiKey(config.key) : undefined,
  };
}
