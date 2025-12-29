/**
 * SONA v4 Template Version Manager
 * مدير إصدارات القوالب
 *
 * يوفر نظام إدارة إصدارات شامل للقوالب مع دعم:
 * - حفظ الإصدارات تلقائياً
 * - التراجع إلى إصدارات سابقة
 * - مقارنة الإصدارات
 * - الأرشفة والاستعادة
 */

import {
  saveTemplateVersion,
  getTemplateVersions,
  getTemplateVersion,
  rollbackTemplate,
  archiveTemplate,
  TemplateVersion,
} from './db';
import {
  executePostgresQuery,
  executePostgresQueryOne,
  executePostgresCommand,
} from '../db/postgres';

// ===========================================
// Types
// ===========================================

export interface VersionDiff {
  templateId: string;
  version1: number;
  version2: number;
  added: string[];
  removed: string[];
  modified: DiffLine[];
  summary: string;
}

export interface DiffLine {
  lineNumber: number;
  type: 'added' | 'removed' | 'modified';
  oldContent?: string;
  newContent?: string;
}

export interface VersionInfo {
  templateId: string;
  currentVersion: number;
  totalVersions: number;
  createdAt: Date;
  lastModified: Date;
  isArchived: boolean;
}

export interface VersionManagerOptions {
  maxVersionsToKeep?: number;
  autoArchiveOldVersions?: boolean;
  trackChanges?: boolean;
}

// ===========================================
// Version Manager Class
// ===========================================

export class VersionManager {
  private options: Required<VersionManagerOptions>;

  constructor(options: VersionManagerOptions = {}) {
    this.options = {
      maxVersionsToKeep: options.maxVersionsToKeep ?? 50,
      autoArchiveOldVersions: options.autoArchiveOldVersions ?? true,
      trackChanges: options.trackChanges ?? true,
    };
  }

  /**
   * حفظ إصدار جديد للقالب
   */
  async saveVersion(
    templateId: string,
    templateType: string,
    content: string,
    options?: {
      category?: string;
      variables?: Record<string, unknown>;
      changeDescription?: string;
      createdBy?: string;
    }
  ): Promise<TemplateVersion> {
    // حفظ الإصدار الجديد
    const newVersion = await saveTemplateVersion(
      templateId,
      templateType,
      content,
      options
    );

    // تنظيف الإصدارات القديمة إذا تجاوزت الحد
    if (this.options.autoArchiveOldVersions) {
      await this.cleanupOldVersions(templateId);
    }

    return newVersion;
  }

  /**
   * الحصول على جميع إصدارات قالب
   */
  async getVersions(templateId: string): Promise<TemplateVersion[]> {
    return getTemplateVersions(templateId);
  }

  /**
   * الحصول على إصدار محدد
   */
  async getVersion(
    templateId: string,
    version: number
  ): Promise<TemplateVersion | undefined> {
    return getTemplateVersion(templateId, version);
  }

  /**
   * الحصول على أحدث إصدار
   */
  async getLatestVersion(
    templateId: string
  ): Promise<TemplateVersion | undefined> {
    const versions = await this.getVersions(templateId);
    return versions.length > 0 ? versions[0] : undefined;
  }

  /**
   * التراجع إلى إصدار سابق
   */
  async rollback(
    templateId: string,
    version: number
  ): Promise<TemplateVersion | undefined> {
    return rollbackTemplate(templateId, version);
  }

  /**
   * مقارنة إصدارين
   */
  async compare(
    templateId: string,
    version1: number,
    version2: number
  ): Promise<VersionDiff> {
    const v1 = await this.getVersion(templateId, version1);
    const v2 = await this.getVersion(templateId, version2);

    if (!v1 || !v2) {
      throw new Error(
        `Version not found: ${
          !v1 ? version1 : version2
        } for template ${templateId}`
      );
    }

    return this.computeDiff(templateId, v1, v2);
  }

  /**
   * حساب الفروقات بين إصدارين
   */
  private computeDiff(
    templateId: string,
    v1: TemplateVersion,
    v2: TemplateVersion
  ): VersionDiff {
    const lines1 = v1.content.split('\n');
    const lines2 = v2.content.split('\n');

    const added: string[] = [];
    const removed: string[] = [];
    const modified: DiffLine[] = [];

    // خوارزمية بسيطة للمقارنة سطر بسطر
    const maxLines = Math.max(lines1.length, lines2.length);

    for (let i = 0; i < maxLines; i++) {
      const line1 = lines1[i];
      const line2 = lines2[i];

      if (line1 === undefined && line2 !== undefined) {
        // سطر مضاف
        added.push(line2);
        modified.push({
          lineNumber: i + 1,
          type: 'added',
          newContent: line2,
        });
      } else if (line1 !== undefined && line2 === undefined) {
        // سطر محذوف
        removed.push(line1);
        modified.push({
          lineNumber: i + 1,
          type: 'removed',
          oldContent: line1,
        });
      } else if (line1 !== line2) {
        // سطر معدل
        modified.push({
          lineNumber: i + 1,
          type: 'modified',
          oldContent: line1,
          newContent: line2,
        });
      }
    }

    // إنشاء ملخص
    const summary = this.generateDiffSummary(added, removed, modified);

    return {
      templateId,
      version1: v1.version,
      version2: v2.version,
      added,
      removed,
      modified,
      summary,
    };
  }

  /**
   * إنشاء ملخص للفروقات
   */
  private generateDiffSummary(
    added: string[],
    removed: string[],
    modified: DiffLine[]
  ): string {
    const parts: string[] = [];

    if (added.length > 0) {
      parts.push(`${added.length} سطر مضاف`);
    }
    if (removed.length > 0) {
      parts.push(`${removed.length} سطر محذوف`);
    }
    const modifiedCount = modified.filter((m) => m.type === 'modified').length;
    if (modifiedCount > 0) {
      parts.push(`${modifiedCount} سطر معدل`);
    }

    return parts.length > 0 ? parts.join('، ') : 'لا توجد تغييرات';
  }

  /**
   * أرشفة قالب
   */
  async archive(templateId: string): Promise<void> {
    await archiveTemplate(templateId);
  }

  /**
   * استعادة قالب من الأرشيف
   */
  async restore(templateId: string): Promise<void> {
    await executePostgresCommand(
      'UPDATE sona_template_versions SET is_archived = false WHERE template_id = $1',
      [templateId]
    );
  }

  /**
   * الحصول على معلومات الإصدار
   */
  async getVersionInfo(templateId: string): Promise<VersionInfo | undefined> {
    const result = await executePostgresQueryOne<{
      template_id: string;
      current_version: number;
      total_versions: string;
      created_at: Date;
      last_modified: Date;
      is_archived: boolean;
    }>(
      `SELECT 
        template_id,
        MAX(version) as current_version,
        COUNT(*) as total_versions,
        MIN(created_at) as created_at,
        MAX(created_at) as last_modified,
        BOOL_OR(is_archived) as is_archived
       FROM sona_template_versions 
       WHERE template_id = $1
       GROUP BY template_id`,
      [templateId]
    );

    if (!result) return undefined;

    return {
      templateId: result.template_id,
      currentVersion: result.current_version,
      totalVersions: parseInt(result.total_versions),
      createdAt: result.created_at,
      lastModified: result.last_modified,
      isArchived: result.is_archived,
    };
  }

  /**
   * البحث في إصدارات القوالب
   */
  async searchVersions(query: {
    templateType?: string;
    category?: string;
    createdBy?: string;
    fromDate?: Date;
    toDate?: Date;
    limit?: number;
  }): Promise<TemplateVersion[]> {
    const conditions: string[] = ['is_archived = false'];
    const params: unknown[] = [];
    let paramIndex = 1;

    if (query.templateType) {
      conditions.push(`template_type = $${paramIndex++}`);
      params.push(query.templateType);
    }

    if (query.category) {
      conditions.push(`category = $${paramIndex++}`);
      params.push(query.category);
    }

    if (query.createdBy) {
      conditions.push(`created_by = $${paramIndex++}`);
      params.push(query.createdBy);
    }

    if (query.fromDate) {
      conditions.push(`created_at >= $${paramIndex++}`);
      params.push(query.fromDate);
    }

    if (query.toDate) {
      conditions.push(`created_at <= $${paramIndex++}`);
      params.push(query.toDate);
    }

    const limit = query.limit ?? 100;
    params.push(limit);

    const sql = `
      SELECT * FROM sona_template_versions 
      WHERE ${conditions.join(' AND ')}
      ORDER BY created_at DESC
      LIMIT $${paramIndex}
    `;

    return executePostgresQuery<TemplateVersion>(sql, params);
  }

  /**
   * الحصول على سجل التغييرات
   */
  async getChangeLog(
    templateId: string,
    limit: number = 20
  ): Promise<
    Array<{
      version: number;
      changeDescription: string | null;
      createdAt: Date;
      createdBy: string | null;
    }>
  > {
    const versions = await executePostgresQuery<{
      version: number;
      change_description: string | null;
      created_at: Date;
      created_by: string | null;
    }>(
      `SELECT version, change_description, created_at, created_by
       FROM sona_template_versions
       WHERE template_id = $1 AND is_archived = false
       ORDER BY version DESC
       LIMIT $2`,
      [templateId, limit]
    );

    return versions.map((v) => ({
      version: v.version,
      changeDescription: v.change_description,
      createdAt: v.created_at,
      createdBy: v.created_by,
    }));
  }

  /**
   * تنظيف الإصدارات القديمة
   */
  private async cleanupOldVersions(templateId: string): Promise<number> {
    const versions = await this.getVersions(templateId);

    if (versions.length <= this.options.maxVersionsToKeep) {
      return 0;
    }

    // الاحتفاظ بأحدث الإصدارات وأرشفة الباقي
    const versionsToArchive = versions.slice(this.options.maxVersionsToKeep);
    let archivedCount = 0;

    for (const version of versionsToArchive) {
      await executePostgresCommand(
        'UPDATE sona_template_versions SET is_archived = true WHERE id = $1',
        [version.id]
      );
      archivedCount++;
    }

    return archivedCount;
  }

  /**
   * الحصول على إحصائيات الإصدارات
   */
  async getVersionStats(): Promise<{
    totalTemplates: number;
    totalVersions: number;
    archivedVersions: number;
    avgVersionsPerTemplate: number;
    recentChanges: number;
  }> {
    const stats = await executePostgresQueryOne<{
      total_templates: string;
      total_versions: string;
      archived_versions: string;
      recent_changes: string;
    }>(
      `SELECT 
        COUNT(DISTINCT template_id) as total_templates,
        COUNT(*) as total_versions,
        COUNT(*) FILTER (WHERE is_archived = true) as archived_versions,
        COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '7 days') as recent_changes
       FROM sona_template_versions`
    );

    const totalTemplates = parseInt(stats?.total_templates || '0');
    const totalVersions = parseInt(stats?.total_versions || '0');

    return {
      totalTemplates,
      totalVersions,
      archivedVersions: parseInt(stats?.archived_versions || '0'),
      avgVersionsPerTemplate:
        totalTemplates > 0
          ? Math.round((totalVersions / totalTemplates) * 10) / 10
          : 0,
      recentChanges: parseInt(stats?.recent_changes || '0'),
    };
  }

  /**
   * نسخ قالب مع جميع إصداراته
   */
  async cloneTemplate(
    sourceTemplateId: string,
    newTemplateId: string
  ): Promise<number> {
    const versions = await this.getVersions(sourceTemplateId);
    let clonedCount = 0;

    for (const version of versions.reverse()) {
      await this.saveVersion(
        newTemplateId,
        version.template_type,
        version.content,
        {
          category: version.category || undefined,
          variables: version.variables || undefined,
          changeDescription: `Cloned from ${sourceTemplateId} v${version.version}`,
        }
      );
      clonedCount++;
    }

    return clonedCount;
  }

  /**
   * دمج إصدارين
   */
  async mergeVersions(
    templateId: string,
    version1: number,
    version2: number,
    mergeStrategy: 'prefer-newer' | 'prefer-older' | 'combine' = 'prefer-newer'
  ): Promise<TemplateVersion> {
    const v1 = await this.getVersion(templateId, version1);
    const v2 = await this.getVersion(templateId, version2);

    if (!v1 || !v2) {
      throw new Error('One or both versions not found');
    }

    let mergedContent: string;

    switch (mergeStrategy) {
      case 'prefer-newer':
        mergedContent = version1 > version2 ? v1.content : v2.content;
        break;
      case 'prefer-older':
        mergedContent = version1 < version2 ? v1.content : v2.content;
        break;
      case 'combine':
        // دمج بسيط - يمكن تحسينه لاحقاً
        mergedContent = `${v1.content}\n\n<!-- Merged from v${version2} -->\n\n${v2.content}`;
        break;
    }

    return this.saveVersion(templateId, v1.template_type, mergedContent, {
      category: v1.category || v2.category || undefined,
      changeDescription: `Merged v${version1} and v${version2} using ${mergeStrategy} strategy`,
    });
  }
}

// ===========================================
// Singleton Instance
// ===========================================

let versionManagerInstance: VersionManager | null = null;

/**
 * الحصول على instance من VersionManager
 */
export function getVersionManager(
  options?: VersionManagerOptions
): VersionManager {
  if (!versionManagerInstance) {
    versionManagerInstance = new VersionManager(options);
  }
  return versionManagerInstance;
}

/**
 * إعادة تعيين instance (للاختبارات)
 */
export function resetVersionManager(): void {
  versionManagerInstance = null;
}

// ===========================================
// Utility Functions
// ===========================================

/**
 * التحقق من صحة محتوى القالب
 */
export function validateTemplateContent(content: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!content || content.trim().length === 0) {
    errors.push('محتوى القالب فارغ');
  }

  if (content.length > 100000) {
    errors.push('محتوى القالب كبير جداً (الحد الأقصى 100,000 حرف)');
  }

  // التحقق من وجود متغيرات صالحة
  const variablePattern = /\{([^}]+)\}/g;
  const variables = content.match(variablePattern);
  if (variables) {
    for (const variable of variables) {
      const varName = variable.slice(1, -1);
      if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(varName)) {
        errors.push(`اسم متغير غير صالح: ${variable}`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * استخراج المتغيرات من القالب
 */
export function extractTemplateVariables(content: string): string[] {
  const variablePattern = /\{([^}]+)\}/g;
  const variables: Set<string> = new Set();

  let match;
  while ((match = variablePattern.exec(content)) !== null) {
    variables.add(match[1]);
  }

  return Array.from(variables);
}

/**
 * إنشاء معرف فريد للقالب
 */
export function generateTemplateId(
  type: string,
  category: string,
  index?: number
): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 6);
  const suffix = index !== undefined ? `_${index}` : '';
  return `${type}_${category}_${timestamp}_${random}${suffix}`;
}
