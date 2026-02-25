/**
 * SONA v4 Health Plugin
 * إضافة الصحة - محتوى متخصص في الصحة والعافية
 *
 * Requirements: 14.5
 */

import {
  SONAPlugin,
  KnowledgeData,
  Templates,
  SynonymDictionary,
} from '../pluginManager';
import { TopicAnalysis, GeneratedContent } from '../types';
import * as fs from 'fs';
import * as path from 'path';

const DATA_PATH = path.join(process.cwd(), 'data/sona');

/**
 * Health Plugin
 */
export const healthPlugin: SONAPlugin = {
  name: 'health',
  version: '1.0.0',
  category: 'الصحة',
  enabled: true,
  description: 'محتوى متخصص في الصحة والعافية',

  async onInit() {
    console.log('Health plugin initialized');
  },

  async onDestroy() {
    console.log('Health plugin destroyed');
  },

  afterAnalyze(analysis: TopicAnalysis): TopicAnalysis {
    if (analysis.category === 'health') {
      // Add health-specific sections
      const healthSections = [
        'health-tips',
        'health-facts',
        'health-warnings',
        'health-benefits',
      ];

      for (const section of healthSections) {
        if (!analysis.suggestedSections.includes(section)) {
          analysis.suggestedSections.push(section);
        }
      }

      // Add health-specific keywords
      const healthKeywords = ['صحة', 'عافية', 'تغذية', 'رياضة', 'نوم'];
      for (const keyword of healthKeywords) {
        if (!analysis.keywords.includes(keyword)) {
          analysis.keywords.push(keyword);
        }
      }

      // Add age-specific health info if age is present
      if (analysis.extractedEntities.ages.length > 0) {
        const age = analysis.extractedEntities.ages[0];
        if (age < 18) {
          analysis.suggestedSections.push('child-health');
        } else if (age >= 60) {
          analysis.suggestedSections.push('senior-health');
        }
      }
    }

    return analysis;
  },

  afterGenerate(content: GeneratedContent): GeneratedContent {
    // Add health disclaimer
    if (content.content.includes('صحة') || content.content.includes('طبي')) {
      const disclaimer =
        '<p class="disclaimer">ملاحظة: المعلومات الواردة في هذا المقال للأغراض التثقيفية فقط ولا تغني عن استشارة الطبيب المختص.</p>';

      if (!content.content.includes('disclaimer')) {
        content.content += `\n\n${disclaimer}`;
      }
    }

    // Add health-specific CTAs
    const healthCTAs = [
      'احسب مؤشر كتلة جسمك مع حاسبة BMI من ميلادك!',
      'تعرف على السعرات الحرارية المناسبة لعمرك!',
      'استخدم حاسبة العمر لمتابعة صحتك بشكل أفضل!',
    ];

    const randomCTA = healthCTAs[Math.floor(Math.random() * healthCTAs.length)];
    if (!content.content.includes(randomCTA)) {
      content.content += `\n\n<p class="cta">${randomCTA}</p>`;
    }

    return content;
  },

  async getKnowledge(): Promise<KnowledgeData> {
    try {
      const knowledgePath = path.join(DATA_PATH, 'knowledge/health.json');
      const data = fs.readFileSync(knowledgePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.warn('Failed to load health knowledge:', error);
      return {
        facts: [
          'النوم الكافي ضروري لصحة الجسم والعقل',
          'شرب الماء بكميات كافية يحسن وظائف الجسم',
          'الرياضة المنتظمة تقلل من خطر الأمراض المزمنة',
          'التغذية المتوازنة أساس الصحة الجيدة',
        ],
        tips: [
          'احرص على النوم 7-8 ساعات يومياً',
          'اشرب 8 أكواب من الماء يومياً على الأقل',
          'مارس الرياضة 30 دقيقة يومياً',
          'تناول الخضروات والفواكه بانتظام',
          'قلل من السكريات والأطعمة المصنعة',
        ],
        ageGroups: {
          children: ['التطعيمات مهمة', 'اللعب ضروري للنمو'],
          adults: ['الفحوصات الدورية مهمة', 'إدارة الضغط النفسي'],
          seniors: ['الحفاظ على النشاط', 'متابعة الأدوية بانتظام'],
        },
      };
    }
  },

  async getTemplates(): Promise<Templates> {
    try {
      const introsPath = path.join(DATA_PATH, 'templates/intros/health.json');
      const paragraphsPath = path.join(
        DATA_PATH,
        'templates/paragraphs/health.json'
      );

      const intros = JSON.parse(fs.readFileSync(introsPath, 'utf-8'));
      const paragraphs = JSON.parse(fs.readFileSync(paragraphsPath, 'utf-8'));

      return {
        intros: intros.templates || [],
        conclusions: [],
        paragraphs: { health: paragraphs.templates || [] },
      };
    } catch (error) {
      console.warn('Failed to load health templates:', error);
      return {
        intros: [],
        conclusions: [],
        paragraphs: {},
      };
    }
  },

  async getSynonyms(): Promise<SynonymDictionary> {
    return {
      صحة: ['عافية', 'سلامة', 'لياقة', 'صحة جيدة'],
      مرض: ['علة', 'داء', 'سقم', 'اعتلال'],
      علاج: ['دواء', 'شفاء', 'معالجة', 'استشفاء'],
      تغذية: ['غذاء', 'طعام', 'أكل', 'حمية'],
      رياضة: ['تمارين', 'نشاط بدني', 'لياقة', 'حركة'],
      نوم: ['راحة', 'استرخاء', 'سبات', 'نعاس'],
    };
  },
};

export default healthPlugin;
