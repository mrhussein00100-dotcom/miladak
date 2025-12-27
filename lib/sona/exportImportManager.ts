/**
 * SONA v4 Export/Import Manager
 * مدير التصدير والاستيراد - يدير تصدير واستيراد بيانات SONA
 *
 * Requirements: 16.1, 16.2, 16.3, 16.4, 16.5
 */

import * as fs from 'fs';
import * as path from 'path';
import { settingsManager, SONASettings } from './settingsManager';
import { getContentStats, getGenerationStats } from './db';

// ===========================================
// Types
// ===========================================

export interface ExportOptions {
  includeKnowledge: boolean;
  includeTemplates: boolean;
  includeSynonyms: boolean;
  includePhrases: boolean;
  includeSettings: boolean;
  includeStats: boolean;
  format: 'zip' | 'json';
}

export interface ImportOptions {
  conflictResolution: 'replace' | 'merge' | 'skip';
  validateBeforeImport: boolean;
}

export interface ExportMetadata {
  version: string;
  exportedAt: string;
  exportedBy?: string;
  description?: string;
  contents: string[];
}

export interface ImportResult {
  success: boolean;
  imported: {
    knowledge: number;
    templates: number;
    synonyms: number;
    phrases: number;
    settings: number;
  };
  skipped: number;
  errors: string[];
  warnings: string[];
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  fileInfo?: {
    version?: string;
    exportedAt?: string;
    contents?: string[];
  };
}

export interface ExportData {
  metadata: ExportMetadata;
  knowledge?: Record<string, unknown>;
  templates?: Record<string, unknown>;
  synonyms?: Record<string, string[]>;
  phrases?: Record<string, unknown>;
  settings?: Partial<SONASettings>;
}

// ===========================================
// Default Options
// ===========================================

export const DEFAULT_EXPORT_OPTIONS: ExportOptions = {
  includeKnowledge: true,
  includeTemplates: true,
  includeSynonyms: true,
  includePhrases: true,
  includeSettings: true,
  includeStats: false,
  format: 'json',
};

export const DEFAULT_IMPORT_OPTIONS: ImportOptions = {
  conflictResolution: 'merge',
  validateBeforeImport: true,
};

// ===========================================
// Export/Import Manager Class
// ===========================================

/**
 * Export/Import Manager Class
 * يدير تصدير واستيراد بيانات SONA
 */
export class ExportImportManager {
  private dataBasePath: string;
  private version: string = '4.0.0';

  constructor(dataBasePath?: string) {
    this.dataBasePath =
      dataBasePath || path.join(process.cwd(), 'data', 'sona');
  }

  /**
   * Export SONA data
   * Requirements: 16.1, 16.3
   */
  async export(
    options: Partial<ExportOptions> = {},
    exportedBy?: string
  ): Promise<ExportData> {
    const opts = { ...DEFAULT_EXPORT_OPTIONS, ...options };
    const contents: string[] = [];
    const exportData: ExportData = {
      metadata: {
        version: this.version,
        exportedAt: new Date().toISOString(),
        exportedBy,
        contents: [],
      },
    };

    try {
      // Export knowledge
      if (opts.includeKnowledge) {
        exportData.knowledge = await this.loadKnowledge();
        contents.push('knowledge');
      }

      // Export templates
      if (opts.includeTemplates) {
        exportData.templates = await this.loadTemplates();
        contents.push('templates');
      }

      // Export synonyms
      if (opts.includeSynonyms) {
        exportData.synonyms = await this.loadSynonyms();
        contents.push('synonyms');
      }

      // Export phrases
      if (opts.includePhrases) {
        exportData.phrases = await this.loadPhrases();
        contents.push('phrases');
      }

      // Export settings
      if (opts.includeSettings) {
        exportData.settings = await settingsManager.getSettings();
        contents.push('settings');
      }

      exportData.metadata.contents = contents;

      return exportData;
    } catch (error) {
      console.error('Export failed:', error);
      throw error;
    }
  }

  /**
   * Export data as JSON string
   */
  async exportAsJson(
    options: Partial<ExportOptions> = {},
    exportedBy?: string
  ): Promise<string> {
    const data = await this.export(options, exportedBy);
    return JSON.stringify(data, null, 2);
  }

  /**
   * Import SONA data
   * Requirements: 16.2, 16.4
   */
  async import(
    data: ExportData | string,
    options: Partial<ImportOptions> = {}
  ): Promise<ImportResult> {
    const opts = { ...DEFAULT_IMPORT_OPTIONS, ...options };
    const result: ImportResult = {
      success: false,
      imported: {
        knowledge: 0,
        templates: 0,
        synonyms: 0,
        phrases: 0,
        settings: 0,
      },
      skipped: 0,
      errors: [],
      warnings: [],
    };

    try {
      // Parse data if string
      const exportData: ExportData =
        typeof data === 'string' ? JSON.parse(data) : data;

      // Validate if required
      if (opts.validateBeforeImport) {
        const validation = this.validateImportData(exportData);
        if (!validation.valid) {
          result.errors = validation.errors;
          return result;
        }
        result.warnings = validation.warnings;
      }

      // Import knowledge
      if (exportData.knowledge) {
        const count = await this.importKnowledge(
          exportData.knowledge,
          opts.conflictResolution
        );
        result.imported.knowledge = count;
      }

      // Import templates
      if (exportData.templates) {
        const count = await this.importTemplates(
          exportData.templates,
          opts.conflictResolution
        );
        result.imported.templates = count;
      }

      // Import synonyms
      if (exportData.synonyms) {
        const count = await this.importSynonyms(
          exportData.synonyms,
          opts.conflictResolution
        );
        result.imported.synonyms = count;
      }

      // Import phrases
      if (exportData.phrases) {
        const count = await this.importPhrases(
          exportData.phrases,
          opts.conflictResolution
        );
        result.imported.phrases = count;
      }

      // Import settings
      if (exportData.settings) {
        await settingsManager.updateSettings(exportData.settings);
        result.imported.settings = Object.keys(exportData.settings).length;
      }

      result.success = true;
      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      result.errors.push(`Import failed: ${errorMessage}`);
      return result;
    }
  }

  /**
   * Validate import data
   * Requirements: 16.2
   */
  validateImportData(data: unknown): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!data || typeof data !== 'object') {
      return {
        valid: false,
        errors: ['Invalid data format: expected object'],
        warnings: [],
      };
    }

    const exportData = data as ExportData;

    // Check metadata
    if (!exportData.metadata) {
      errors.push('Missing metadata');
    } else {
      if (!exportData.metadata.version) {
        warnings.push('Missing version in metadata');
      }
      if (!exportData.metadata.exportedAt) {
        warnings.push('Missing export date in metadata');
      }
    }

    // Validate knowledge structure
    if (exportData.knowledge) {
      if (typeof exportData.knowledge !== 'object') {
        errors.push('Invalid knowledge format: expected object');
      }
    }

    // Validate templates structure
    if (exportData.templates) {
      if (typeof exportData.templates !== 'object') {
        errors.push('Invalid templates format: expected object');
      }
    }

    // Validate synonyms structure
    if (exportData.synonyms) {
      if (typeof exportData.synonyms !== 'object') {
        errors.push('Invalid synonyms format: expected object');
      } else {
        for (const [word, syns] of Object.entries(exportData.synonyms)) {
          if (!Array.isArray(syns)) {
            errors.push(`Invalid synonyms for "${word}": expected array`);
          }
        }
      }
    }

    // Validate phrases structure
    if (exportData.phrases) {
      if (typeof exportData.phrases !== 'object') {
        errors.push('Invalid phrases format: expected object');
      }
    }

    // Validate settings structure
    if (exportData.settings) {
      if (typeof exportData.settings !== 'object') {
        errors.push('Invalid settings format: expected object');
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      fileInfo: exportData.metadata
        ? {
            version: exportData.metadata.version,
            exportedAt: exportData.metadata.exportedAt,
            contents: exportData.metadata.contents,
          }
        : undefined,
    };
  }

  /**
   * Export statistics as CSV
   * Requirements: 16.5
   */
  async exportStats(): Promise<string> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const stats = await getGenerationStats(
        thirtyDaysAgo.toISOString().split('T')[0],
        today
      );

      // Create CSV header
      const headers = [
        'التاريخ',
        'إجمالي التوليدات',
        'الناجحة',
        'الفاشلة',
        'متوسط الجودة',
        'متوسط الوقت (مللي ثانية)',
      ];

      const rows = stats.map((stat) => [
        stat.date,
        stat.total_generations,
        stat.successful_generations,
        stat.failed_generations,
        stat.avg_quality_score?.toFixed(2) || '0',
        stat.avg_generation_time || '0',
      ]);

      // Build CSV
      const csv = [headers.join(','), ...rows.map((row) => row.join(','))].join(
        '\n'
      );

      return csv;
    } catch (error) {
      console.error('Failed to export stats:', error);
      return 'التاريخ,إجمالي التوليدات,الناجحة,الفاشلة,متوسط الجودة,متوسط الوقت\n';
    }
  }

  // ===========================================
  // Private Helper Methods
  // ===========================================

  /**
   * Load knowledge files
   */
  private async loadKnowledge(): Promise<Record<string, unknown>> {
    const knowledge: Record<string, unknown> = {};
    const knowledgePath = path.join(this.dataBasePath, 'knowledge');

    try {
      if (fs.existsSync(knowledgePath)) {
        const files = fs.readdirSync(knowledgePath);
        for (const file of files) {
          if (file.endsWith('.json')) {
            const filePath = path.join(knowledgePath, file);
            const content = fs.readFileSync(filePath, 'utf-8');
            const name = file.replace('.json', '');
            knowledge[name] = JSON.parse(content);
          }
        }
      }
    } catch (error) {
      console.error('Failed to load knowledge:', error);
    }

    return knowledge;
  }

  /**
   * Load template files
   */
  private async loadTemplates(): Promise<Record<string, unknown>> {
    const templates: Record<string, unknown> = {};
    const templatesPath = path.join(this.dataBasePath, 'templates');

    try {
      if (fs.existsSync(templatesPath)) {
        const categories = fs.readdirSync(templatesPath);
        for (const category of categories) {
          const categoryPath = path.join(templatesPath, category);
          if (fs.statSync(categoryPath).isDirectory()) {
            templates[category] = {};
            const files = fs.readdirSync(categoryPath);
            for (const file of files) {
              if (file.endsWith('.json')) {
                const filePath = path.join(categoryPath, file);
                const content = fs.readFileSync(filePath, 'utf-8');
                const name = file.replace('.json', '');
                (templates[category] as Record<string, unknown>)[name] =
                  JSON.parse(content);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Failed to load templates:', error);
    }

    return templates;
  }

  /**
   * Load synonyms file
   */
  private async loadSynonyms(): Promise<Record<string, string[]>> {
    const synonymsPath = path.join(
      this.dataBasePath,
      'synonyms',
      'arabic.json'
    );

    try {
      if (fs.existsSync(synonymsPath)) {
        const content = fs.readFileSync(synonymsPath, 'utf-8');
        return JSON.parse(content);
      }
    } catch (error) {
      console.error('Failed to load synonyms:', error);
    }

    return {};
  }

  /**
   * Load phrases files
   */
  private async loadPhrases(): Promise<Record<string, unknown>> {
    const phrases: Record<string, unknown> = {};
    const phrasesPath = path.join(this.dataBasePath, 'phrases');

    try {
      if (fs.existsSync(phrasesPath)) {
        const files = fs.readdirSync(phrasesPath);
        for (const file of files) {
          if (file.endsWith('.json')) {
            const filePath = path.join(phrasesPath, file);
            const content = fs.readFileSync(filePath, 'utf-8');
            const name = file.replace('.json', '');
            phrases[name] = JSON.parse(content);
          }
        }
      }
    } catch (error) {
      console.error('Failed to load phrases:', error);
    }

    return phrases;
  }

  /**
   * Import knowledge data
   */
  private async importKnowledge(
    knowledge: Record<string, unknown>,
    conflictResolution: 'replace' | 'merge' | 'skip'
  ): Promise<number> {
    let count = 0;
    const knowledgePath = path.join(this.dataBasePath, 'knowledge');

    try {
      // Ensure directory exists
      if (!fs.existsSync(knowledgePath)) {
        fs.mkdirSync(knowledgePath, { recursive: true });
      }

      for (const [name, data] of Object.entries(knowledge)) {
        const filePath = path.join(knowledgePath, `${name}.json`);
        const exists = fs.existsSync(filePath);

        if (exists && conflictResolution === 'skip') {
          continue;
        }

        if (exists && conflictResolution === 'merge') {
          const existing = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
          const merged = this.deepMerge(existing, data);
          fs.writeFileSync(filePath, JSON.stringify(merged, null, 2), 'utf-8');
        } else {
          fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
        }

        count++;
      }
    } catch (error) {
      console.error('Failed to import knowledge:', error);
    }

    return count;
  }

  /**
   * Import templates data
   */
  private async importTemplates(
    templates: Record<string, unknown>,
    conflictResolution: 'replace' | 'merge' | 'skip'
  ): Promise<number> {
    let count = 0;
    const templatesPath = path.join(this.dataBasePath, 'templates');

    try {
      for (const [category, categoryData] of Object.entries(templates)) {
        const categoryPath = path.join(templatesPath, category);

        // Ensure directory exists
        if (!fs.existsSync(categoryPath)) {
          fs.mkdirSync(categoryPath, { recursive: true });
        }

        if (typeof categoryData === 'object' && categoryData !== null) {
          for (const [name, data] of Object.entries(
            categoryData as Record<string, unknown>
          )) {
            const filePath = path.join(categoryPath, `${name}.json`);
            const exists = fs.existsSync(filePath);

            if (exists && conflictResolution === 'skip') {
              continue;
            }

            if (exists && conflictResolution === 'merge') {
              const existing = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
              const merged = this.deepMerge(existing, data);
              fs.writeFileSync(
                filePath,
                JSON.stringify(merged, null, 2),
                'utf-8'
              );
            } else {
              fs.writeFileSync(
                filePath,
                JSON.stringify(data, null, 2),
                'utf-8'
              );
            }

            count++;
          }
        }
      }
    } catch (error) {
      console.error('Failed to import templates:', error);
    }

    return count;
  }

  /**
   * Import synonyms data
   */
  private async importSynonyms(
    synonyms: Record<string, string[]>,
    conflictResolution: 'replace' | 'merge' | 'skip'
  ): Promise<number> {
    const synonymsPath = path.join(this.dataBasePath, 'synonyms');
    const filePath = path.join(synonymsPath, 'arabic.json');

    try {
      // Ensure directory exists
      if (!fs.existsSync(synonymsPath)) {
        fs.mkdirSync(synonymsPath, { recursive: true });
      }

      const exists = fs.existsSync(filePath);

      if (exists && conflictResolution === 'skip') {
        return 0;
      }

      if (exists && conflictResolution === 'merge') {
        const existing = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        const merged = this.mergeSynonyms(existing, synonyms);
        fs.writeFileSync(filePath, JSON.stringify(merged, null, 2), 'utf-8');
      } else {
        fs.writeFileSync(filePath, JSON.stringify(synonyms, null, 2), 'utf-8');
      }

      return Object.keys(synonyms).length;
    } catch (error) {
      console.error('Failed to import synonyms:', error);
      return 0;
    }
  }

  /**
   * Import phrases data
   */
  private async importPhrases(
    phrases: Record<string, unknown>,
    conflictResolution: 'replace' | 'merge' | 'skip'
  ): Promise<number> {
    let count = 0;
    const phrasesPath = path.join(this.dataBasePath, 'phrases');

    try {
      // Ensure directory exists
      if (!fs.existsSync(phrasesPath)) {
        fs.mkdirSync(phrasesPath, { recursive: true });
      }

      for (const [name, data] of Object.entries(phrases)) {
        const filePath = path.join(phrasesPath, `${name}.json`);
        const exists = fs.existsSync(filePath);

        if (exists && conflictResolution === 'skip') {
          continue;
        }

        if (exists && conflictResolution === 'merge') {
          const existing = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
          const merged = this.deepMerge(existing, data);
          fs.writeFileSync(filePath, JSON.stringify(merged, null, 2), 'utf-8');
        } else {
          fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
        }

        count++;
      }
    } catch (error) {
      console.error('Failed to import phrases:', error);
    }

    return count;
  }

  /**
   * Deep merge two objects
   */
  private deepMerge(target: unknown, source: unknown): unknown {
    if (Array.isArray(target) && Array.isArray(source)) {
      // Merge arrays by combining unique items
      return [...new Set([...target, ...source])];
    }

    if (
      typeof target === 'object' &&
      target !== null &&
      typeof source === 'object' &&
      source !== null
    ) {
      const result = { ...target } as Record<string, unknown>;
      for (const key of Object.keys(source as Record<string, unknown>)) {
        const sourceValue = (source as Record<string, unknown>)[key];
        if (key in result) {
          result[key] = this.deepMerge(result[key], sourceValue);
        } else {
          result[key] = sourceValue;
        }
      }
      return result;
    }

    return source;
  }

  /**
   * Merge synonyms dictionaries
   */
  private mergeSynonyms(
    existing: Record<string, string[]>,
    incoming: Record<string, string[]>
  ): Record<string, string[]> {
    const result = { ...existing };

    for (const [word, synonyms] of Object.entries(incoming)) {
      if (word in result) {
        // Merge and deduplicate
        result[word] = [...new Set([...result[word], ...synonyms])];
      } else {
        result[word] = synonyms;
      }
    }

    return result;
  }

  /**
   * Get export data size estimate
   */
  async getExportSizeEstimate(
    options: Partial<ExportOptions> = {}
  ): Promise<number> {
    const data = await this.export(options);
    const json = JSON.stringify(data);
    return json.length;
  }

  /**
   * Create a backup of current data
   */
  async createBackup(backupPath: string): Promise<boolean> {
    try {
      const data = await this.exportAsJson();
      fs.writeFileSync(backupPath, data, 'utf-8');
      return true;
    } catch (error) {
      console.error('Failed to create backup:', error);
      return false;
    }
  }

  /**
   * Restore from backup
   */
  async restoreFromBackup(backupPath: string): Promise<ImportResult> {
    try {
      const data = fs.readFileSync(backupPath, 'utf-8');
      return this.import(data, { conflictResolution: 'replace' });
    } catch (error) {
      return {
        success: false,
        imported: {
          knowledge: 0,
          templates: 0,
          synonyms: 0,
          phrases: 0,
          settings: 0,
        },
        skipped: 0,
        errors: [`Failed to restore from backup: ${error}`],
        warnings: [],
      };
    }
  }
}

// Export singleton instance
export const exportImportManager = new ExportImportManager();
