/**
 * SONA v4 Settings Manager
 * مدير الإعدادات - يدير جميع إعدادات نظام SONA
 *
 * Requirements: 13.1, 13.2, 13.3, 13.4, 13.5
 */

import {
  getAllSettings,
  getSetting,
  updateSetting,
  updateSettings as updateDbSettings,
} from './db';

// ===========================================
// Types
// ===========================================

export type ArticleLength = 'short' | 'medium' | 'long' | 'comprehensive';
export type DiversityLevel = 'low' | 'medium' | 'high' | 'maximum';

export interface WordCountTargets {
  short: number;
  medium: number;
  long: number;
  comprehensive: number;
}

export interface SONASettings {
  // Article Settings
  articleLength: ArticleLength;
  wordCountTargets: WordCountTargets;

  // SEO Settings
  keywordDensity: number; // 1-5%
  minKeywordOccurrences: number;
  maxKeywordOccurrences: number;

  // Quality Settings
  minQualityScore: number; // 0-100
  maxRetries: number;
  diversityLevel: DiversityLevel;

  // Template Settings
  templateRotation: boolean;
  excludedTemplates: string[];
  preferredTemplates: string[];

  // Feature Toggles
  enableSynonymReplacement: boolean;
  enableSentenceVariation: boolean;
  enableFAQGeneration: boolean;
  enableTipsGeneration: boolean;
  enableCTAs: boolean;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export interface SettingsChangeEvent {
  key: string;
  oldValue: unknown;
  newValue: unknown;
  timestamp: Date;
  changedBy?: string;
}

// ===========================================
// Default Settings
// ===========================================

export const DEFAULT_SETTINGS: SONASettings = {
  articleLength: 'medium',
  wordCountTargets: {
    short: 500,
    medium: 1000,
    long: 2000,
    comprehensive: 3000,
  },
  keywordDensity: 3,
  minKeywordOccurrences: 3,
  maxKeywordOccurrences: 5,
  minQualityScore: 70,
  maxRetries: 3,
  diversityLevel: 'high',
  templateRotation: true,
  excludedTemplates: [],
  preferredTemplates: [],
  enableSynonymReplacement: true,
  enableSentenceVariation: true,
  enableFAQGeneration: true,
  enableTipsGeneration: true,
  enableCTAs: true,
};

// ===========================================
// Settings Manager Class
// ===========================================

/**
 * Settings Manager Class
 * يدير إعدادات نظام SONA
 */
export class SettingsManager {
  private cachedSettings: SONASettings | null = null;
  private changeListeners: ((event: SettingsChangeEvent) => void)[] = [];
  private lastFetch: number = 0;
  private cacheTTL: number = 60000; // 1 minute cache

  /**
   * Get all settings
   * Requirements: 13.1
   */
  async getSettings(): Promise<SONASettings> {
    // Check cache
    if (this.cachedSettings && Date.now() - this.lastFetch < this.cacheTTL) {
      return this.cachedSettings;
    }

    try {
      const dbSettings = await getAllSettings();
      this.cachedSettings = this.mergeWithDefaults(dbSettings);
      this.lastFetch = Date.now();
      return this.cachedSettings;
    } catch (error) {
      console.warn(
        'Failed to load settings from database, using defaults:',
        error
      );
      return DEFAULT_SETTINGS;
    }
  }

  /**
   * Merge database settings with defaults
   */
  private mergeWithDefaults(dbSettings: Record<string, unknown>): SONASettings {
    const settings = { ...DEFAULT_SETTINGS };

    for (const [key, value] of Object.entries(dbSettings)) {
      if (key in settings && value !== undefined && value !== null) {
        (settings as Record<string, unknown>)[key] = value;
      }
    }

    return settings;
  }

  /**
   * Update a single setting
   * Requirements: 13.2
   */
  async updateSetting<K extends keyof SONASettings>(
    key: K,
    value: SONASettings[K],
    updatedBy?: string
  ): Promise<void> {
    // Validate the setting
    const validation = this.validateSetting(key, value);
    if (!validation.valid) {
      throw new Error(`Invalid setting value: ${validation.errors.join(', ')}`);
    }

    // Get old value for change event
    const currentSettings = await this.getSettings();
    const oldValue = currentSettings[key];

    // Update in database
    await updateSetting(key, value, updatedBy);

    // Clear cache
    this.cachedSettings = null;

    // Notify listeners
    this.notifyChange({
      key,
      oldValue,
      newValue: value,
      timestamp: new Date(),
      changedBy: updatedBy,
    });
  }

  /**
   * Update multiple settings
   * Requirements: 13.2
   */
  async updateSettings(
    settings: Partial<SONASettings>,
    updatedBy?: string
  ): Promise<void> {
    // Validate all settings
    const validation = this.validateSettings(settings);
    if (!validation.valid) {
      throw new Error(`Invalid settings: ${validation.errors.join(', ')}`);
    }

    // Get current settings for change events
    const currentSettings = await this.getSettings();

    // Update in database
    await updateDbSettings(settings, updatedBy);

    // Clear cache
    this.cachedSettings = null;

    // Notify listeners for each changed setting
    for (const [key, value] of Object.entries(settings)) {
      const oldValue = currentSettings[key as keyof SONASettings];
      if (oldValue !== value) {
        this.notifyChange({
          key,
          oldValue,
          newValue: value,
          timestamp: new Date(),
          changedBy: updatedBy,
        });
      }
    }
  }

  /**
   * Reset settings to defaults
   */
  async resetToDefaults(updatedBy?: string): Promise<void> {
    await this.updateSettings(DEFAULT_SETTINGS, updatedBy);
  }

  /**
   * Validate a single setting
   */
  validateSetting<K extends keyof SONASettings>(
    key: K,
    value: SONASettings[K]
  ): ValidationResult {
    const errors: string[] = [];

    switch (key) {
      case 'articleLength':
        if (
          !['short', 'medium', 'long', 'comprehensive'].includes(
            value as string
          )
        ) {
          errors.push(
            'articleLength must be one of: short, medium, long, comprehensive'
          );
        }
        break;

      case 'wordCountTargets':
        const targets = value as WordCountTargets;
        if (typeof targets !== 'object') {
          errors.push('wordCountTargets must be an object');
        } else {
          if (targets.short < 100 || targets.short > 1000) {
            errors.push('wordCountTargets.short must be between 100 and 1000');
          }
          if (targets.medium < 500 || targets.medium > 2000) {
            errors.push('wordCountTargets.medium must be between 500 and 2000');
          }
          if (targets.long < 1000 || targets.long > 5000) {
            errors.push('wordCountTargets.long must be between 1000 and 5000');
          }
          if (targets.comprehensive < 2000 || targets.comprehensive > 10000) {
            errors.push(
              'wordCountTargets.comprehensive must be between 2000 and 10000'
            );
          }
        }
        break;

      case 'keywordDensity':
        if (typeof value !== 'number' || value < 1 || value > 5) {
          errors.push('keywordDensity must be between 1 and 5');
        }
        break;

      case 'minKeywordOccurrences':
        if (typeof value !== 'number' || value < 1 || value > 10) {
          errors.push('minKeywordOccurrences must be between 1 and 10');
        }
        break;

      case 'maxKeywordOccurrences':
        if (typeof value !== 'number' || value < 1 || value > 20) {
          errors.push('maxKeywordOccurrences must be between 1 and 20');
        }
        break;

      case 'minQualityScore':
        if (typeof value !== 'number' || value < 0 || value > 100) {
          errors.push('minQualityScore must be between 0 and 100');
        }
        break;

      case 'maxRetries':
        if (typeof value !== 'number' || value < 1 || value > 10) {
          errors.push('maxRetries must be between 1 and 10');
        }
        break;

      case 'diversityLevel':
        if (!['low', 'medium', 'high', 'maximum'].includes(value as string)) {
          errors.push(
            'diversityLevel must be one of: low, medium, high, maximum'
          );
        }
        break;

      case 'templateRotation':
      case 'enableSynonymReplacement':
      case 'enableSentenceVariation':
      case 'enableFAQGeneration':
      case 'enableTipsGeneration':
      case 'enableCTAs':
        if (typeof value !== 'boolean') {
          errors.push(`${key} must be a boolean`);
        }
        break;

      case 'excludedTemplates':
      case 'preferredTemplates':
        if (!Array.isArray(value)) {
          errors.push(`${key} must be an array`);
        }
        break;
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate multiple settings
   */
  validateSettings(settings: Partial<SONASettings>): ValidationResult {
    const allErrors: string[] = [];

    for (const [key, value] of Object.entries(settings)) {
      const result = this.validateSetting(
        key as keyof SONASettings,
        value as SONASettings[keyof SONASettings]
      );
      allErrors.push(...result.errors);
    }

    // Cross-field validation
    if (settings.minKeywordOccurrences && settings.maxKeywordOccurrences) {
      if (settings.minKeywordOccurrences > settings.maxKeywordOccurrences) {
        allErrors.push(
          'minKeywordOccurrences cannot be greater than maxKeywordOccurrences'
        );
      }
    }

    return {
      valid: allErrors.length === 0,
      errors: allErrors,
    };
  }

  /**
   * Get a specific setting
   */
  async getSetting<K extends keyof SONASettings>(
    key: K
  ): Promise<SONASettings[K]> {
    const settings = await this.getSettings();
    return settings[key];
  }

  /**
   * Get word count target for article length
   * Requirements: 13.3
   */
  async getWordCountTarget(length?: ArticleLength): Promise<number> {
    const settings = await this.getSettings();
    const targetLength = length || settings.articleLength;
    return settings.wordCountTargets[targetLength];
  }

  /**
   * Check if a feature is enabled
   */
  async isFeatureEnabled(
    feature:
      | 'synonymReplacement'
      | 'sentenceVariation'
      | 'faqGeneration'
      | 'tipsGeneration'
      | 'ctas'
  ): Promise<boolean> {
    const settings = await this.getSettings();
    switch (feature) {
      case 'synonymReplacement':
        return settings.enableSynonymReplacement;
      case 'sentenceVariation':
        return settings.enableSentenceVariation;
      case 'faqGeneration':
        return settings.enableFAQGeneration;
      case 'tipsGeneration':
        return settings.enableTipsGeneration;
      case 'ctas':
        return settings.enableCTAs;
      default:
        return false;
    }
  }

  /**
   * Add change listener
   */
  onSettingsChange(listener: (event: SettingsChangeEvent) => void): () => void {
    this.changeListeners.push(listener);
    return () => {
      const index = this.changeListeners.indexOf(listener);
      if (index > -1) {
        this.changeListeners.splice(index, 1);
      }
    };
  }

  /**
   * Notify change listeners
   */
  private notifyChange(event: SettingsChangeEvent): void {
    for (const listener of this.changeListeners) {
      try {
        listener(event);
      } catch (error) {
        console.error('Error in settings change listener:', error);
      }
    }
  }

  /**
   * Clear settings cache
   */
  clearCache(): void {
    this.cachedSettings = null;
    this.lastFetch = 0;
  }

  /**
   * Export settings as JSON
   */
  async exportSettings(): Promise<string> {
    const settings = await this.getSettings();
    return JSON.stringify(settings, null, 2);
  }

  /**
   * Import settings from JSON
   */
  async importSettings(json: string, updatedBy?: string): Promise<void> {
    try {
      const settings = JSON.parse(json) as Partial<SONASettings>;
      const validation = this.validateSettings(settings);
      if (!validation.valid) {
        throw new Error(`Invalid settings: ${validation.errors.join(', ')}`);
      }
      await this.updateSettings(settings, updatedBy);
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error('Invalid JSON format');
      }
      throw error;
    }
  }

  /**
   * Get settings diff between current and provided settings
   */
  async getSettingsDiff(
    newSettings: Partial<SONASettings>
  ): Promise<Record<string, { old: unknown; new: unknown }>> {
    const currentSettings = await this.getSettings();
    const diff: Record<string, { old: unknown; new: unknown }> = {};

    for (const [key, newValue] of Object.entries(newSettings)) {
      const oldValue = currentSettings[key as keyof SONASettings];
      if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
        diff[key] = { old: oldValue, new: newValue };
      }
    }

    return diff;
  }
}

// Export singleton instance
export const settingsManager = new SettingsManager();
