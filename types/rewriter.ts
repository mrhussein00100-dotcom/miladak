// أنواع نظام إعادة الصياغة المتقدم

// أنواع مزودي AI
export type AIProvider =
  | 'gemini'
  | 'groq'
  | 'cohere'
  | 'huggingface'
  | 'local'
  | 'sona-v4'
  | 'sona-enhanced';

// أنماط الكتابة
export type WritingStyle = 'formal' | 'informal' | 'academic' | 'journalistic';

// الجمهور المستهدف
export type TargetAudience = 'general' | 'expert' | 'children' | 'youth';

// أنماط الصور
export type ImageStyle = 'realistic' | 'illustration' | 'diagram';

// نوع المصدر
export type SourceType = 'text' | 'url';

// إعدادات إعادة الصياغة
export interface RewriteSettings {
  models: AIProvider[];
  wordCount: number;
  style: WritingStyle;
  audience: TargetAudience;
  generateImages: boolean;
  imageCount: number;
  imageStyle: ImageStyle;
}

// نتيجة إعادة الصياغة من نموذج واحد
export interface RewriteResult {
  id: string;
  model: AIProvider;
  title: string;
  content: string;
  wordCount: number;
  qualityScore: number;
  readabilityScore: number;
  seoScore: number;
  uniquenessScore: number;
  keywords: string[];
  metaDescription: string;
  suggestedTitles: string[];
  generationTime: number;
  error?: string;
}

// الصورة المولدة
export interface GeneratedImage {
  id: string;
  url: string;
  thumbnailUrl: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  fileSize: number;
}

// المحتوى المستخلص من الرابط
export interface ExtractedContent {
  title: string;
  content: string;
  cleanContent: string;
  author?: string;
  publishDate?: string;
  images: string[];
  metadata: ContentMetadata;
  success: boolean;
  error?: string;
}

// البيانات الوصفية للمحتوى
export interface ContentMetadata {
  description?: string;
  keywords?: string[];
  language?: string;
  wordCount: number;
  siteName?: string;
  ogImage?: string;
}

// طلب إعادة الصياغة
export interface RewriteRequest {
  title: string;
  content: string;
  models: AIProvider[];
  wordCount: number;
  style: WritingStyle;
  audience: TargetAudience;
  generateImages: boolean;
  imageCount?: number;
  imageStyle?: ImageStyle;
}

// استجابة إعادة الصياغة
export interface RewriteResponse {
  success: boolean;
  results: RewriteResult[];
  images?: GeneratedImage[];
  originalAnalysis: OriginalAnalysis;
  historyId?: number;
  error?: string;
}

// تحليل المحتوى الأصلي
export interface OriginalAnalysis {
  wordCount: number;
  readability: number;
  topics: string[];
  language: string;
}

// طلب استخلاص المحتوى
export interface ExtractContentRequest {
  url: string;
  cleanAds: boolean;
  extractImages: boolean;
  extractMetadata: boolean;
}

// طلب توليد الصور
export interface GenerateImagesRequest {
  content: string;
  count: number;
  style: ImageStyle;
  addArabicText?: boolean;
}

// استجابة توليد الصور
export interface GenerateImagesResponse {
  success: boolean;
  images: GeneratedImage[];
  error?: string;
}

// طلب توليد العناوين
export interface GenerateTitlesRequest {
  content: string;
  currentTitle: string;
  count?: number;
}

// استجابة توليد العناوين
export interface GenerateTitlesResponse {
  success: boolean;
  titles: TitleSuggestion[];
  error?: string;
}

// اقتراح عنوان
export interface TitleSuggestion {
  title: string;
  clickPotential: number; // 1-100
  seoScore: number; // 1-100
}

// طلب استخراج الكلمات المفتاحية
export interface ExtractKeywordsRequest {
  content: string;
  maxKeywords?: number;
}

// استجابة استخراج الكلمات المفتاحية
export interface ExtractKeywordsResponse {
  success: boolean;
  keywords: KeywordResult[];
  error?: string;
}

// نتيجة كلمة مفتاحية
export interface KeywordResult {
  keyword: string;
  relevance: number; // 1-100
  frequency: number;
}

// مقاييس الجودة
export interface QualityMetrics {
  overall: number;
  readability: number;
  uniqueness: number;
  seo: number;
  suggestions: string[];
}

// سجل إعادة الصياغة
export interface RewriteHistoryRecord {
  id: number;
  sourceType: SourceType;
  sourceUrl?: string;
  originalTitle: string;
  originalContent: string;
  settings: RewriteSettings;
  results: RewriteResult[];
  images?: GeneratedImage[];
  createdAt: string;
  updatedAt: string;
}

// بيانات النقل للمحرر
export interface ArticleTransferData {
  title: string;
  content: string;
  metaDescription: string;
  keywords: string[];
  images: GeneratedImage[];
  suggestedCategory?: string;
  source: 'rewriter';
  timestamp: number;
}

// خيارات الترجمة للأنماط
export const WRITING_STYLE_LABELS: Record<WritingStyle, string> = {
  formal: 'رسمي',
  informal: 'غير رسمي',
  academic: 'أكاديمي',
  journalistic: 'صحفي',
};

export const TARGET_AUDIENCE_LABELS: Record<TargetAudience, string> = {
  general: 'عام',
  expert: 'متخصص',
  children: 'أطفال',
  youth: 'شباب',
};

export const IMAGE_STYLE_LABELS: Record<ImageStyle, string> = {
  realistic: 'واقعية',
  illustration: 'رسوم توضيحية',
  diagram: 'مخططات',
};

export const AI_PROVIDER_LABELS: Record<AIProvider, string> = {
  gemini: 'Gemini',
  groq: 'Groq',
  cohere: 'Cohere',
  huggingface: 'HuggingFace',
  local: 'Local (SONA)',
  'sona-v4': 'SONA v4 (محلي متقدم)',
  'sona-enhanced': 'SONA 4.01 (المحسّن)',
};

// الإعدادات الافتراضية
export const DEFAULT_REWRITE_SETTINGS: RewriteSettings = {
  models: ['gemini'],
  wordCount: 1000,
  style: 'formal',
  audience: 'general',
  generateImages: false,
  imageCount: 2,
  imageStyle: 'realistic',
};
