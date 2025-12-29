/**
 * SONA v4 Plugin Manager
 * مدير الإضافات - يدير تسجيل وتنفيذ الـ plugins
 *
 * Requirements: 14.1, 14.2, 14.3, 14.4, 14.5
 */

import {
  getAllPlugins,
  getEnabledPlugins,
  togglePlugin as dbTogglePlugin,
  updatePluginConfig,
  registerPlugin as dbRegisterPlugin,
  PluginInfo,
} from './db';
import { TopicAnalysis, GeneratedContent, TopicCategory } from './types';

// ===========================================
// Types
// ===========================================

export interface GenerationRequest {
  topic: string;
  length?: 'short' | 'medium' | 'long' | 'comprehensive';
  style?: 'formal' | 'casual' | 'seo';
  includeKeywords?: string[];
  category?: TopicCategory;
}

export interface KnowledgeData {
  facts: string[];
  tips: string[];
  traditions?: Record<string, string[]>;
  [key: string]: unknown;
}

export interface Templates {
  intros: unknown[];
  paragraphs: Record<string, unknown[]>;
  conclusions: unknown[];
}

export interface SynonymDictionary {
  [word: string]: string[];
}

/**
 * Plugin Interface
 * واجهة الـ Plugin الموحدة
 * Requirements: 14.1
 */
export interface SONAPlugin {
  name: string;
  version: string;
  category: string;
  enabled: boolean;
  description?: string;

  // Lifecycle hooks
  onInit?(): Promise<void>;
  onDestroy?(): Promise<void>;

  // Content hooks
  beforeAnalyze?(topic: string): string | Promise<string>;
  afterAnalyze?(
    analysis: TopicAnalysis
  ): TopicAnalysis | Promise<TopicAnalysis>;
  beforeGenerate?(
    request: GenerationRequest
  ): GenerationRequest | Promise<GenerationRequest>;
  afterGenerate?(
    content: GeneratedContent
  ): GeneratedContent | Promise<GeneratedContent>;

  // Data providers
  getKnowledge?(): Promise<KnowledgeData>;
  getTemplates?(): Promise<Templates>;
  getSynonyms?(): Promise<SynonymDictionary>;
}

export type HookName =
  | 'beforeAnalyze'
  | 'afterAnalyze'
  | 'beforeGenerate'
  | 'afterGenerate';

export interface PluginExecutionResult<T> {
  success: boolean;
  data: T;
  errors: { plugin: string; error: string }[];
}

// ===========================================
// Plugin Manager Class
// ===========================================

/**
 * Plugin Manager Class
 * يدير تسجيل وتنفيذ الـ plugins
 */
export class PluginManager {
  private plugins: Map<string, SONAPlugin> = new Map();
  private initialized: boolean = false;

  /**
   * Register a plugin
   * Requirements: 14.2
   */
  async register(plugin: SONAPlugin): Promise<void> {
    if (this.plugins.has(plugin.name)) {
      console.warn(`Plugin ${plugin.name} is already registered, updating...`);
    }

    // Initialize plugin if it has onInit hook
    if (plugin.onInit) {
      try {
        await plugin.onInit();
      } catch (error) {
        console.error(`Failed to initialize plugin ${plugin.name}:`, error);
        // Continue registration even if init fails
      }
    }

    this.plugins.set(plugin.name, plugin);

    // Register in database
    try {
      await dbRegisterPlugin({
        name: plugin.name,
        display_name: plugin.name,
        version: plugin.version,
        description: plugin.description,
        category: plugin.category,
        enabled: plugin.enabled,
        hooks: this.getPluginHooks(plugin),
      });
    } catch (error) {
      console.warn(
        `Failed to register plugin ${plugin.name} in database:`,
        error
      );
    }
  }

  /**
   * Get hooks supported by a plugin
   */
  private getPluginHooks(plugin: SONAPlugin): string[] {
    const hooks: string[] = [];
    if (plugin.beforeAnalyze) hooks.push('beforeAnalyze');
    if (plugin.afterAnalyze) hooks.push('afterAnalyze');
    if (plugin.beforeGenerate) hooks.push('beforeGenerate');
    if (plugin.afterGenerate) hooks.push('afterGenerate');
    if (plugin.getKnowledge) hooks.push('getKnowledge');
    if (plugin.getTemplates) hooks.push('getTemplates');
    if (plugin.getSynonyms) hooks.push('getSynonyms');
    return hooks;
  }

  /**
   * Unregister a plugin
   * Requirements: 14.2
   */
  async unregister(pluginName: string): Promise<void> {
    const plugin = this.plugins.get(pluginName);
    if (!plugin) {
      console.warn(`Plugin ${pluginName} is not registered`);
      return;
    }

    // Call onDestroy if available
    if (plugin.onDestroy) {
      try {
        await plugin.onDestroy();
      } catch (error) {
        console.error(`Error destroying plugin ${pluginName}:`, error);
      }
    }

    this.plugins.delete(pluginName);
  }

  /**
   * Enable a plugin
   * Requirements: 14.3
   */
  async enable(pluginName: string): Promise<void> {
    const plugin = this.plugins.get(pluginName);
    if (plugin) {
      plugin.enabled = true;
    }

    try {
      await dbTogglePlugin(pluginName, true);
    } catch (error) {
      console.warn(`Failed to enable plugin ${pluginName} in database:`, error);
    }
  }

  /**
   * Disable a plugin
   * Requirements: 14.3
   */
  async disable(pluginName: string): Promise<void> {
    const plugin = this.plugins.get(pluginName);
    if (plugin) {
      plugin.enabled = false;
    }

    try {
      await dbTogglePlugin(pluginName, false);
    } catch (error) {
      console.warn(
        `Failed to disable plugin ${pluginName} in database:`,
        error
      );
    }
  }

  /**
   * Get a plugin by name
   */
  getPlugin(name: string): SONAPlugin | undefined {
    return this.plugins.get(name);
  }

  /**
   * Get all registered plugins
   */
  getAllPlugins(): SONAPlugin[] {
    return Array.from(this.plugins.values());
  }

  /**
   * Get all enabled plugins
   */
  getEnabledPlugins(): SONAPlugin[] {
    return Array.from(this.plugins.values()).filter((p) => p.enabled);
  }

  /**
   * Execute a hook on all enabled plugins
   * Requirements: 14.3, 14.4
   */
  async executeHook<T>(
    hookName: HookName,
    data: T
  ): Promise<PluginExecutionResult<T>> {
    const errors: { plugin: string; error: string }[] = [];
    let result = data;

    const enabledPlugins = this.getEnabledPlugins();

    for (const plugin of enabledPlugins) {
      const hook = plugin[hookName] as
        | ((data: T) => T | Promise<T>)
        | undefined;
      if (hook) {
        try {
          const hookResult = await hook.call(plugin, result);
          if (hookResult !== undefined) {
            result = hookResult;
          }
        } catch (error) {
          // Requirements: 14.4 - Plugin failure should not stop generation
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          errors.push({ plugin: plugin.name, error: errorMessage });
          console.error(
            `Plugin ${plugin.name} failed on hook ${hookName}:`,
            error
          );
          // Continue with other plugins
        }
      }
    }

    return {
      success: errors.length === 0,
      data: result,
      errors,
    };
  }

  /**
   * Get knowledge from all enabled plugins
   */
  async getKnowledgeFromPlugins(): Promise<Record<string, KnowledgeData>> {
    const knowledge: Record<string, KnowledgeData> = {};

    for (const plugin of this.getEnabledPlugins()) {
      if (plugin.getKnowledge) {
        try {
          knowledge[plugin.category] = await plugin.getKnowledge();
        } catch (error) {
          console.error(
            `Failed to get knowledge from plugin ${plugin.name}:`,
            error
          );
        }
      }
    }

    return knowledge;
  }

  /**
   * Get templates from all enabled plugins
   */
  async getTemplatesFromPlugins(): Promise<Record<string, Templates>> {
    const templates: Record<string, Templates> = {};

    for (const plugin of this.getEnabledPlugins()) {
      if (plugin.getTemplates) {
        try {
          templates[plugin.category] = await plugin.getTemplates();
        } catch (error) {
          console.error(
            `Failed to get templates from plugin ${plugin.name}:`,
            error
          );
        }
      }
    }

    return templates;
  }

  /**
   * Get synonyms from all enabled plugins
   */
  async getSynonymsFromPlugins(): Promise<SynonymDictionary> {
    const synonyms: SynonymDictionary = {};

    for (const plugin of this.getEnabledPlugins()) {
      if (plugin.getSynonyms) {
        try {
          const pluginSynonyms = await plugin.getSynonyms();
          Object.assign(synonyms, pluginSynonyms);
        } catch (error) {
          console.error(
            `Failed to get synonyms from plugin ${plugin.name}:`,
            error
          );
        }
      }
    }

    return synonyms;
  }

  /**
   * Update plugin configuration
   */
  async updateConfig(
    pluginName: string,
    config: Record<string, unknown>
  ): Promise<void> {
    try {
      await updatePluginConfig(pluginName, config);
    } catch (error) {
      console.error(`Failed to update config for plugin ${pluginName}:`, error);
      throw error;
    }
  }

  /**
   * Load plugins from database
   */
  async loadFromDatabase(): Promise<void> {
    try {
      const dbPlugins = await getAllPlugins();
      for (const dbPlugin of dbPlugins) {
        // Only update enabled status for already registered plugins
        const existingPlugin = this.plugins.get(dbPlugin.name);
        if (existingPlugin) {
          existingPlugin.enabled = dbPlugin.enabled;
        }
      }
    } catch (error) {
      console.warn('Failed to load plugins from database:', error);
    }
  }

  /**
   * Get plugin info for API
   */
  async getPluginInfo(): Promise<PluginInfo[]> {
    try {
      return await getAllPlugins();
    } catch (error) {
      // Return in-memory plugins if database fails
      return this.getAllPlugins().map((p) => ({
        id: 0,
        name: p.name,
        display_name: p.name,
        version: p.version,
        description: p.description,
        category: p.category,
        enabled: p.enabled,
        created_at: new Date(),
        updated_at: new Date(),
      }));
    }
  }

  /**
   * Check if a category has a plugin
   */
  hasPluginForCategory(category: string): boolean {
    return this.getEnabledPlugins().some((p) => p.category === category);
  }

  /**
   * Get plugin for a specific category
   */
  getPluginForCategory(category: string): SONAPlugin | undefined {
    return this.getEnabledPlugins().find((p) => p.category === category);
  }

  /**
   * Clear all plugins
   */
  clearAll(): void {
    this.plugins.clear();
    this.initialized = false;
  }

  /**
   * Check if manager is initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Mark as initialized
   */
  markInitialized(): void {
    this.initialized = true;
  }
}

// Export singleton instance
export const pluginManager = new PluginManager();
