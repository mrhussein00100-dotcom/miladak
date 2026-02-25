# مستند التصميم - نظام استخراج بيانات الأدوية من dwaprices.com

## نظرة عامة

يهدف هذا النظام إلى إنشاء حل شامل لاستخراج بيانات الأدوية من موقع dwaprices.com وإدراجها في قاعدة بيانات مشروع mostshfa_pro. النظام مصمم ليكون قابل للصيانة، قابل للتوسع، ومقاوم للأخطاء مع التركيز على جودة البيانات والأداء.

## البنية المعمارية

### النمط المعماري
النظام يتبع نمط **Pipeline Architecture** مع **Modular Design**:

```
[Web Scraper] → [Data Processor] → [Validator] → [Database Manager] → [Reporter]
```

### المكونات الرئيسية

1. **Web Scraping Layer**: استخراج البيانات من الموقع
2. **Data Processing Layer**: تنظيف ومعالجة البيانات
3. **Validation Layer**: التحقق من صحة البيانات
4. **Database Layer**: إدارة قاعدة البيانات
5. **Reporting Layer**: إنشاء التقارير
6. **Error Handling Layer**: إدارة الأخطاء والاستثناءات

## المكونات والواجهات

### 1. Web Scraper Component

```typescript
interface WebScraperConfig {
  baseUrl: string;
  requestDelay: number;
  maxRetries: number;
  userAgent: string;
  timeout: number;
}

interface DrugRawData {
  nameAr: string;
  nameEn?: string;
  categoryName?: string;
  priceText?: string;
  description?: string;
  usage?: string;
  contraindications?: string;
  dosage?: string;
  activeIngredient?: string;
  imageUrl?: string;
  sourceUrl: string;
}

class WebScraper {
  constructor(config: WebScraperConfig);
  
  async scrapeDrugCategories(): Promise<DrugCategory[]>;
  async scrapeDrugsInCategory(categoryUrl: string): Promise<DrugRawData[]>;
  async scrapeDrugDetails(drugUrl: string): Promise<DrugRawData>;
  async downloadImage(imageUrl: string): Promise<string>;
}
```

### 2. Data Processor Component

```typescript
interface ProcessedDrugData {
  nameAr: string;
  nameEn?: string;
  slug: string;
  categoryId?: number;
  priceText?: string;
  description?: string;
  usage?: string;
  contraindications?: string;
  dosage?: string;
  activeIngredient?: string;
  image?: string;
  disclaimer?: string;
}

class DataProcessor {
  cleanText(text: string): string;
  generateSlug(name: string): string;
  normalizePrice(priceText: string): string;
  processArabicText(text: string): string;
  removeDuplicates(drugs: DrugRawData[]): DrugRawData[];
  validateRequiredFields(drug: DrugRawData): boolean;
  
  async processDrugData(rawData: DrugRawData[]): Promise<ProcessedDrugData[]>;
}
```

### 3. Validation Engine Component

```typescript
interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

class ValidationEngine {
  validateDrugName(name: string): ValidationResult;
  validateSlugUniqueness(slug: string): Promise<ValidationResult>;
  validateCategoryExists(categoryId: number): Promise<ValidationResult>;
  validateImageUrl(url: string): ValidationResult;
  validateTextLength(text: string, maxLength: number): ValidationResult;
  
  async validateDrug(drug: ProcessedDrugData): Promise<ValidationResult>;
}
```

### 4. Database Manager Component

```typescript
interface DatabaseStats {
  totalDrugs: number;
  totalCategories: number;
  insertedDrugs: number;
  updatedDrugs: number;
  insertedCategories: number;
  errors: number;
}

class DatabaseManager {
  constructor(prismaClient: PrismaClient);
  
  async createCategory(name: string): Promise<DrugCategory>;
  async findOrCreateCategory(name: string): Promise<DrugCategory>;
  async insertDrug(drug: ProcessedDrugData): Promise<Drug>;
  async updateDrug(id: number, drug: ProcessedDrugData): Promise<Drug>;
  async bulkInsertDrugs(drugs: ProcessedDrugData[]): Promise<DatabaseStats>;
  async getStats(): Promise<DatabaseStats>;
}
```

### 5. Report Generator Component

```typescript
interface ScrapingReport {
  startTime: Date;
  endTime: Date;
  duration: number;
  stats: {
    categoriesFound: number;
    drugsScraped: number;
    drugsProcessed: number;
    drugsInserted: number;
    drugsUpdated: number;
    errors: number;
    warnings: number;
  };
  errors: ErrorLog[];
  performance: PerformanceMetrics;
}

class ReportGenerator {
  generateConsoleReport(report: ScrapingReport): void;
  generateFileReport(report: ScrapingReport, filePath: string): Promise<void>;
  generateHTMLReport(report: ScrapingReport): string;
  compareWithPreviousRun(currentReport: ScrapingReport): ComparisonReport;
}
```

## نماذج البيانات

### Drug Model (Enhanced)
```typescript
interface Drug {
  id: number;
  categoryId?: number;
  category?: DrugCategory;
  legacyId?: number;
  nameAr: string;
  nameEn?: string;
  slug: string;
  image?: string;
  usage?: string;
  contraindications?: string;
  dosage?: string;
  activeIngredient?: string;
  disclaimer?: string;
  priceText?: string;
  sourceUrl?: string;        // New field
  lastScrapedAt?: Date;      // New field
  scrapingVersion?: string;  // New field
  createdAt: Date;
  updatedAt: Date;
}
```

### DrugCategory Model (Enhanced)
```typescript
interface DrugCategory {
  id: number;
  name: string;
  legacyId?: number;
  sourceUrl?: string;        // New field
  drugCount?: number;        // Computed field
  lastScrapedAt?: Date;      // New field
  drugs: Drug[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Scraping Session Model
```typescript
interface ScrapingSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  totalCategories: number;
  totalDrugs: number;
  processedDrugs: number;
  errors: number;
  warnings: number;
  configSnapshot: ScrapingConfig;
  logs: ScrapingLog[];
}
```

## خصائص الصحة (Correctness Properties)

*خاصية الصحة هي سمة أو سلوك يجب أن يكون صحيحاً عبر جميع عمليات التنفيذ الصالحة للنظام - في الأساس، بيان رسمي حول ما يجب أن يفعله النظام. الخصائص تعمل كجسر بين المواصفات المقروءة بواسطة الإنسان وضمانات الصحة القابلة للتحقق آلياً.*

سأقوم الآن بتحليل معايير القبول لتحديد الخصائص القابلة للاختبار:

### Property 1: Data Extraction Completeness
*For any* successful scraping operation, all extracted drugs should contain at least an Arabic name and a valid source URL
**Validates: Requirements 1.1, 1.2**

### Property 2: Price Data Consistency
*For any* drug with price information, the extracted price text should be non-empty and properly formatted
**Validates: Requirements 1.3**

### Property 3: Text Cleaning Effectiveness
*For any* raw text input, the processed output should not contain leading/trailing whitespace or unwanted special characters
**Validates: Requirements 2.1**

### Property 4: Duplicate Removal Accuracy
*For any* set of drugs with identical names, the processing should result in a single unique entry per drug
**Validates: Requirements 2.2**

### Property 5: Slug Uniqueness and Format
*For any* generated slug, it should be unique across all drugs and contain only English characters, numbers, and hyphens
**Validates: Requirements 2.8**

### Property 6: Database Category Insertion
*For any* new drug category, it should be successfully inserted into the drug_categories table with a unique name
**Validates: Requirements 3.1**

### Property 7: Drug-Category Relationship Integrity
*For any* inserted drug, it should be properly linked to an existing category in the database
**Validates: Requirements 3.2**

### Property 8: Transaction Consistency
*For any* database operation, if an error occurs during insertion, all related changes should be rolled back
**Validates: Requirements 3.5**

### Property 9: Arabic Name Validation
*For any* drug being validated, it should have a non-empty Arabic name field
**Validates: Requirements 4.1**

### Property 10: Slug Uniqueness Validation
*For any* drug slug being validated, it should not already exist in the database
**Validates: Requirements 4.2**

### Property 11: Report Accuracy
*For any* completed scraping session, the generated report should accurately reflect the actual number of drugs processed
**Validates: Requirements 5.1**

### Property 12: Retry Mechanism Compliance
*For any* failed network request, the system should attempt exactly 3 retries before giving up
**Validates: Requirements 6.1**

### Property 13: Request Rate Limiting
*For any* sequence of web requests, there should be an appropriate delay between consecutive requests
**Validates: Requirements 7.1**

### Property 14: SQL Injection Prevention
*For any* database query, it should use prepared statements to prevent SQL injection attacks
**Validates: Requirements 8.3**

## معالجة الأخطاء

### استراتيجية معالجة الأخطاء

1. **Network Errors**: إعادة المحاولة مع backoff exponential
2. **Parsing Errors**: تسجيل الخطأ والانتقال للعنصر التالي
3. **Database Errors**: rollback transaction وحفظ البيانات في ملف مؤقت
4. **Validation Errors**: تسجيل التحذير وتجاهل السجل غير الصالح

### Error Recovery Mechanisms

```typescript
interface ErrorRecoveryConfig {
  maxRetries: number;
  backoffMultiplier: number;
  tempFileLocation: string;
  enableAutoResume: boolean;
}

class ErrorRecoveryManager {
  async handleNetworkError(error: NetworkError): Promise<void>;
  async handleDatabaseError(error: DatabaseError): Promise<void>;
  async saveToTempFile(data: any[]): Promise<string>;
  async resumeFromTempFile(filePath: string): Promise<any[]>;
}
```

## استراتيجية الاختبار

### نهج الاختبار المزدوج

**اختبارات الوحدة (Unit Tests)**:
- اختبار وظائف تنظيف النصوص
- اختبار إنشاء slug
- اختبار validation rules
- اختبار database operations

**اختبارات الخصائص (Property Tests)**:
- اختبار خصائص الصحة العامة
- اختبار مع بيانات عشوائية مُولدة
- التحقق من الخصائص عبر 100+ تكرار لكل اختبار

### Property-Based Testing Configuration

سيتم استخدام مكتبة **fast-check** لـ TypeScript/JavaScript:

```typescript
// Example property test
import fc from 'fast-check';

describe('Drug Processing Properties', () => {
  it('Property 3: Text cleaning effectiveness', () => {
    fc.assert(fc.property(
      fc.string().filter(s => s.length > 0),
      (rawText) => {
        const cleaned = dataProcessor.cleanText(rawText);
        return !cleaned.startsWith(' ') && 
               !cleaned.endsWith(' ') && 
               !cleaned.includes('  ');
      }
    ), { numRuns: 100 });
  });
});
```

**تكوين اختبارات الخصائص**:
- الحد الأدنى 100 تكرار لكل اختبار خاصية
- كل اختبار خاصية يجب أن يشير إلى خاصية التصميم المقابلة
- تنسيق العلامة: **Feature: dwaprices-drug-scraper, Property {number}: {property_text}**

### Integration Testing

```typescript
describe('End-to-End Scraping Process', () => {
  it('should complete full scraping cycle', async () => {
    const scraper = new DrugScraper(testConfig);
    const result = await scraper.runFullScraping();
    
    expect(result.stats.drugsInserted).toBeGreaterThan(0);
    expect(result.stats.errors).toBe(0);
    expect(result.report).toBeDefined();
  });
});
```

## اعتبارات الأداء

### تحسين الأداء

1. **Connection Pooling**: استخدام connection pool لقاعدة البيانات
2. **Batch Processing**: معالجة البيانات في مجموعات
3. **Memory Management**: تحرير الذاكرة بانتظام
4. **Caching**: cache للفئات والبيانات المتكررة

### مراقبة الأداء

```typescript
interface PerformanceMetrics {
  requestsPerSecond: number;
  averageResponseTime: number;
  memoryUsage: number;
  databaseConnectionTime: number;
  processingTime: number;
}

class PerformanceMonitor {
  startTimer(operation: string): string;
  endTimer(timerId: string): number;
  recordMetric(name: string, value: number): void;
  generateReport(): PerformanceMetrics;
}
```

## الأمان

### إجراءات الأمان

1. **Input Sanitization**: تنظيف جميع المدخلات
2. **SQL Injection Prevention**: استخدام prepared statements
3. **Rate Limiting**: احترام حدود الموقع المصدر
4. **Error Information**: عدم كشف معلومات حساسة في الأخطاء

### Security Checklist

- ✅ استخدام HTTPS للاتصالات
- ✅ تشفير البيانات الحساسة
- ✅ التحقق من صحة جميع المدخلات
- ✅ استخدام User-Agent مناسب
- ✅ احترام robots.txt
- ✅ تسجيل آمن للأخطاء

## التكامل مع النظام الحالي

### Database Schema Extensions

```sql
-- إضافة حقول جديدة لجدول drugs
ALTER TABLE drugs ADD COLUMN source_url TEXT;
ALTER TABLE drugs ADD COLUMN last_scraped_at DATETIME;
ALTER TABLE drugs ADD COLUMN scraping_version TEXT;

-- إضافة حقول جديدة لجدول drug_categories  
ALTER TABLE drug_categories ADD COLUMN source_url TEXT;
ALTER TABLE drug_categories ADD COLUMN last_scraped_at DATETIME;

-- إنشاء جدول جلسات الاستخراج
CREATE TABLE scraping_sessions (
  id TEXT PRIMARY KEY,
  start_time DATETIME NOT NULL,
  end_time DATETIME,
  status TEXT NOT NULL,
  total_categories INTEGER DEFAULT 0,
  total_drugs INTEGER DEFAULT 0,
  processed_drugs INTEGER DEFAULT 0,
  errors INTEGER DEFAULT 0,
  warnings INTEGER DEFAULT 0,
  config_snapshot TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### API Integration Points

```typescript
// Integration with existing mostshfa_pro APIs
interface MostshfaIntegration {
  updateDrugSearch(): Promise<void>;
  refreshDrugCategories(): Promise<void>;
  notifyAdmins(report: ScrapingReport): Promise<void>;
  updateSitemap(): Promise<void>;
}
```

## خطة النشر

### مراحل النشر

1. **Phase 1**: تطوير وتجريب المكونات الأساسية
2. **Phase 2**: تكامل مع قاعدة البيانات الحالية
3. **Phase 3**: اختبار شامل مع بيانات حقيقية
4. **Phase 4**: نشر في بيئة الإنتاج مع مراقبة

### Rollback Strategy

```typescript
interface RollbackPlan {
  backupDatabase(): Promise<string>;
  restoreFromBackup(backupPath: string): Promise<void>;
  validateDataIntegrity(): Promise<boolean>;
  notifyStakeholders(status: string): Promise<void>;
}
```

## المراقبة والصيانة

### Health Checks

```typescript
interface SystemHealth {
  databaseConnection: boolean;
  websiteAccessibility: boolean;
  diskSpace: number;
  memoryUsage: number;
  lastSuccessfulRun: Date;
}

class HealthChecker {
  async checkSystemHealth(): Promise<SystemHealth>;
  async runDiagnostics(): Promise<DiagnosticReport>;
}
```

### Maintenance Tasks

1. **Daily**: فحص logs والأخطاء
2. **Weekly**: تحليل أداء النظام
3. **Monthly**: تحديث User-Agent وإعدادات الاستخراج
4. **Quarterly**: مراجعة شاملة للكود والأمان