/**
 * TypeScript interfaces للواجهة المحسنة لإعادة الصياغة
 */

// ===== Core Interfaces =====

export interface RewriterState {
  // Content
  title: string;
  sourceContent: string;
  rewrittenContent: string;
  rewrittenTitle: string;
  externalUrl: string;

  // Generated Meta & SEO
  generatedMeta: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    slug: string;
  } | null;

  // UI State
  activeTab: 'text' | 'url';
  isLoading: boolean;
  isFetching: boolean;
  isGeneratingMeta: boolean;
  isSmartFormatting: boolean;

  // Settings
  settings: RewriteSettings;

  // Status
  error: string | null;
  success: string | null;

  // Statistics
  sourceWordCount: number;
  rewrittenWordCount: number;
  modelUsed: string | null;
}

export interface RewriteSettings {
  style: 'professional' | 'simple' | 'creative' | 'academic';
  targetLength: 'shorter' | 'same' | 'longer' | 'much_longer';
  provider: 'groq' | 'gemini' | 'cohere' | 'huggingface' | 'sona-v4';
  enhanceQuality: boolean;
  generateMeta: boolean;
  addToEditor: boolean;
}

// ===== Component Props Interfaces =====

export interface RewriterHeaderProps {
  sourceWordCount: number;
  rewrittenWordCount: number;
  isProcessing: boolean;
}

export interface RewriterTabsProps {
  activeTab: 'text' | 'url';
  onTabChange: (tab: 'text' | 'url') => void;
  disabled: boolean;
}

export interface UrlInputProps {
  url: string;
  onUrlChange: (url: string) => void;
  onFetch: () => void;
  isLoading: boolean;
  disabled: boolean;
}

export interface RewriterSettingsProps {
  settings: RewriteSettings;
  onSettingsChange: (settings: RewriteSettings) => void;
  disabled: boolean;
}

export interface ContentAreaProps {
  title: string;
  sourceContent: string;
  rewrittenContent: string;
  rewrittenTitle?: string;
  isTextMode: boolean;
  onTitleChange: (title: string) => void;
  onSourceChange: (content: string) => void;
  isLoading: boolean;
  generatedMeta: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    slug: string;
  } | null;
  modelUsed?: string;
}

export interface ActionButtonsProps {
  onRewrite: () => void;
  onReset: () => void;
  onCopy: () => void;
  onGenerateMeta: () => void;
  onAddToEditor: () => void;
  onSmartFormat: () => void;
  canRewrite: boolean;
  canCopy: boolean;
  canGenerateMeta: boolean;
  canAddToEditor: boolean;
  canSmartFormat: boolean;
  isLoading: boolean;
  isGeneratingMeta: boolean;
  isSmartFormatting: boolean;
}

export interface StatusMessagesProps {
  error: string | null;
  success: string | null;
  onDismiss: () => void;
}

// ===== API Response Types =====

export interface RewriteResponse {
  success: boolean;
  rewritten_content?: string;
  error?: string;
  metadata?: {
    model_used: string;
    processing_time: number;
    word_count: number;
  };
}

export interface FetchResponse {
  success: boolean;
  content?: string;
  title?: string;
  error?: string;
  metadata?: {
    word_count: number;
    char_count: number;
    images_found: number;
  };
}

// ===== Error Handling =====

export interface ErrorState {
  type: 'network' | 'validation' | 'api' | 'content';
  message: string;
  details?: string;
  retryable: boolean;
}

// ===== Utility Types =====

export type TabType = 'text' | 'url';
export type StyleType = 'professional' | 'simple' | 'creative' | 'academic';
export type LengthType = 'shorter' | 'same' | 'longer' | 'much_longer';
export type ProviderType =
  | 'groq'
  | 'gemini'
  | 'cohere'
  | 'huggingface'
  | 'sona-v4';

// ===== Constants =====

export const DEFAULT_REWRITE_SETTINGS: RewriteSettings = {
  style: 'professional',
  targetLength: 'longer',
  provider: 'gemini',
  enhanceQuality: true,
  generateMeta: true,
  addToEditor: false,
};

export const STYLE_LABELS: Record<StyleType, string> = {
  professional: 'احترافي',
  simple: 'بسيط',
  creative: 'إبداعي',
  academic: 'أكاديمي',
};

export const LENGTH_LABELS: Record<LengthType, string> = {
  shorter: 'أقصر (30% أقل)',
  same: 'نفس الطول',
  longer: 'أطول (50% أكثر)',
  much_longer: 'أطول بكثير (100% أكثر)',
};

export const PROVIDER_LABELS: Record<ProviderType, string> = {
  groq: 'Groq (أسرع)',
  gemini: 'Gemini (أذكى)',
  cohere: 'Cohere (متوازن)',
  huggingface: 'HuggingFace (مفتوح)',
  'sona-v4': 'SONA v4 (محلي متقدم)',
};
