/**
 * SONA v4 Template Engine
 * محرك القوالب - يحمل ويختار ويملأ القوالب
 *
 * Requirements: 2.1, 2.6
 */

import * as fs from 'fs';
import * as path from 'path';
import {
  Template,
  TemplateFile,
  TopicAnalysis,
  TopicCategory,
  ContentTone,
} from './types';

// Base path for SONA data
const SONA_DATA_PATH = path.join(process.cwd(), 'data', 'sona');

/**
 * Template cache to avoid repeated file reads
 */
const templateCache: Map<string, TemplateFile> = new Map();

/**
 * Track used templates to ensure variety
 */
const usedTemplates: Set<string> = new Set();

/**
 * Template Engine Class
 * يدير تحميل واختيار وملء القوالب
 */
export class TemplateEngine {
  private basePath: string;

  constructor(basePath?: string) {
    this.basePath = basePath || SONA_DATA_PATH;
  }

  /**
   * تحميل ملف قوالب
   */
  async loadTemplateFile(filePath: string): Promise<TemplateFile | null> {
    // Check cache first
    if (templateCache.has(filePath)) {
      return templateCache.get(filePath)!;
    }

    const fullPath = path.join(this.basePath, filePath);

    try {
      if (!fs.existsSync(fullPath)) {
        console.warn(`Template file not found: ${fullPath}`);
        return null;
      }

      const content = fs.readFileSync(fullPath, 'utf-8');
      const templateFile = JSON.parse(content) as TemplateFile;

      // Cache the result
      templateCache.set(filePath, templateFile);

      return templateFile;
    } catch (error) {
      console.error(`Error loading template file ${filePath}:`, error);
      return null;
    }
  }

  /**
   * تحميل جميع قوالب المقدمات
   */
  async loadIntroTemplates(category?: TopicCategory): Promise<Template[]> {
    const templates: Template[] = [];

    // Load general intros
    const generalFile = await this.loadTemplateFile(
      'templates/intros/general.json'
    );
    if (generalFile?.templates) {
      templates.push(...generalFile.templates);
    }

    // Load category-specific intros if available
    if (category && category !== 'general') {
      const categoryFile = await this.loadTemplateFile(
        `templates/intros/${category}.json`
      );
      if (categoryFile?.templates) {
        templates.push(...categoryFile.templates);
      }
    }

    return templates;
  }

  /**
   * تحميل جميع قوالب الفقرات
   */
  async loadParagraphTemplates(type?: string): Promise<Template[]> {
    const templates: Template[] = [];
    const paragraphTypes = ['facts', 'tips', 'faq', 'howto', 'general'];

    if (type && paragraphTypes.includes(type)) {
      // Load specific type
      const file = await this.loadTemplateFile(
        `templates/paragraphs/${type}.json`
      );
      if (file?.templates) {
        templates.push(...file.templates);
      }
    } else {
      // Load all paragraph types
      for (const pType of paragraphTypes) {
        const file = await this.loadTemplateFile(
          `templates/paragraphs/${pType}.json`
        );
        if (file?.templates) {
          templates.push(...file.templates);
        }
      }
    }

    // Also load category-specific paragraphs
    const categoryTypes = ['birthday', 'zodiac', 'health'];
    for (const cat of categoryTypes) {
      const file = await this.loadTemplateFile(
        `templates/paragraphs/${cat}.json`
      );
      if (file?.templates) {
        templates.push(...file.templates);
      }
    }

    return templates;
  }

  /**
   * تحميل جميع قوالب الخاتمات
   */
  async loadConclusionTemplates(category?: TopicCategory): Promise<Template[]> {
    const templates: Template[] = [];

    // Load general conclusions
    const generalFile = await this.loadTemplateFile(
      'templates/conclusions/general.json'
    );
    if (generalFile?.templates) {
      templates.push(...generalFile.templates);
    }

    // Load category-specific conclusions if available
    if (category && category !== 'general') {
      const categoryFile = await this.loadTemplateFile(
        `templates/conclusions/${category}.json`
      );
      if (categoryFile?.templates) {
        templates.push(...categoryFile.templates);
      }
    }

    return templates;
  }

  /**
   * اختيار قالب مقدمة مناسب
   */
  async selectIntro(analysis: TopicAnalysis): Promise<Template | null> {
    const templates = await this.loadIntroTemplates(analysis.category);

    if (templates.length === 0) {
      return null;
    }

    // Filter by tone if possible
    let filtered = templates.filter((t) => !t.tone || t.tone === analysis.tone);

    // If no matching tone, use all templates
    if (filtered.length === 0) {
      filtered = templates;
    }

    // Prefer unused templates for variety
    const unused = filtered.filter((t) => !usedTemplates.has(t.id));
    const pool = unused.length > 0 ? unused : filtered;

    // Random selection
    const selected = pool[Math.floor(Math.random() * pool.length)];

    // Mark as used
    usedTemplates.add(selected.id);

    return selected;
  }

  /**
   * اختيار قالب فقرة مناسب
   */
  async selectParagraph(
    sectionType: string,
    analysis?: TopicAnalysis
  ): Promise<Template | null> {
    // Map section types to template types
    const typeMapping: Record<string, string> = {
      facts: 'facts',
      tips: 'tips',
      'health-tips': 'tips',
      faq: 'faq',
      howto: 'howto',
      'how-to': 'howto',
      introduction: 'general',
      overview: 'general',
      details: 'general',
    };

    const templateType = typeMapping[sectionType] || 'general';
    const templates = await this.loadParagraphTemplates(templateType);

    if (templates.length === 0) {
      // Fallback to all paragraphs
      const allTemplates = await this.loadParagraphTemplates();
      if (allTemplates.length === 0) return null;

      const selected =
        allTemplates[Math.floor(Math.random() * allTemplates.length)];
      usedTemplates.add(selected.id);
      return selected;
    }

    // Filter by type if specified in template
    let filtered = templates.filter(
      (t) => !t.type || t.type === sectionType || t.type === templateType
    );

    if (filtered.length === 0) {
      filtered = templates;
    }

    // Prefer unused templates
    const unused = filtered.filter((t) => !usedTemplates.has(t.id));
    const pool = unused.length > 0 ? unused : filtered;

    const selected = pool[Math.floor(Math.random() * pool.length)];
    usedTemplates.add(selected.id);

    return selected;
  }

  /**
   * اختيار قالب خاتمة مناسب
   */
  async selectConclusion(analysis: TopicAnalysis): Promise<Template | null> {
    const templates = await this.loadConclusionTemplates(analysis.category);

    if (templates.length === 0) {
      return null;
    }

    // Filter by tone if possible
    let filtered = templates.filter((t) => !t.tone || t.tone === analysis.tone);

    if (filtered.length === 0) {
      filtered = templates;
    }

    // Prefer unused templates
    const unused = filtered.filter((t) => !usedTemplates.has(t.id));
    const pool = unused.length > 0 ? unused : filtered;

    const selected = pool[Math.floor(Math.random() * pool.length)];
    usedTemplates.add(selected.id);

    return selected;
  }

  /**
   * ملء القالب بالمتغيرات
   */
  fillTemplate(template: string, variables: Record<string, any>): string {
    let result = template;

    // Replace all {variable} patterns
    for (const [key, value] of Object.entries(variables)) {
      const pattern = new RegExp(`\\{${key}\\}`, 'g');
      result = result.replace(pattern, String(value));
    }

    // Remove any unfilled variables
    result = result.replace(/\{[^}]+\}/g, '');

    return result;
  }

  /**
   * الحصول على قائمة القوالب المستخدمة
   */
  getUsedTemplates(): string[] {
    return Array.from(usedTemplates);
  }

  /**
   * إعادة تعيين القوالب المستخدمة
   */
  resetUsedTemplates(): void {
    usedTemplates.clear();
  }

  /**
   * مسح الكاش
   */
  clearCache(): void {
    templateCache.clear();
  }

  /**
   * الحصول على إحصائيات القوالب
   */
  async getTemplateStats(): Promise<{
    intros: number;
    paragraphs: number;
    conclusions: number;
    total: number;
  }> {
    const intros = await this.loadIntroTemplates();
    const paragraphs = await this.loadParagraphTemplates();
    const conclusions = await this.loadConclusionTemplates();

    return {
      intros: intros.length,
      paragraphs: paragraphs.length,
      conclusions: conclusions.length,
      total: intros.length + paragraphs.length + conclusions.length,
    };
  }
}

// Export singleton instance
export const templateEngine = new TemplateEngine();
