/**
 * SONA v4 Birthday Plugin
 * إضافة أعياد الميلاد - محتوى متخصص في أعياد الميلاد والاحتفالات
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
 * Birthday Plugin
 */
export const birthdayPlugin: SONAPlugin = {
  name: 'birthday',
  version: '1.0.0',
  category: 'أعياد الميلاد',
  enabled: true,
  description: 'محتوى متخصص في أعياد الميلاد والاحتفالات',

  async onInit() {
    console.log('Birthday plugin initialized');
  },

  async onDestroy() {
    console.log('Birthday plugin destroyed');
  },

  afterAnalyze(analysis: TopicAnalysis): TopicAnalysis {
    // Add birthday-specific analysis
    if (analysis.category === 'birthday') {
      // Add milestone celebration section if age is present
      if (analysis.extractedEntities.ages.length > 0) {
        const age = analysis.extractedEntities.ages[0];
        if (
          [
            1, 5, 10, 15, 18, 20, 21, 25, 30, 40, 50, 60, 70, 80, 90, 100,
          ].includes(age)
        ) {
          if (!analysis.suggestedSections.includes('milestone-celebration')) {
            analysis.suggestedSections.push('milestone-celebration');
          }
        }
      }

      // Add name-specific section if name is present
      if (analysis.extractedEntities.names.length > 0) {
        if (!analysis.suggestedSections.includes('personalized-wishes')) {
          analysis.suggestedSections.push('personalized-wishes');
        }
      }

      // Add birthday-specific keywords
      const birthdayKeywords = [
        'عيد ميلاد',
        'تهنئة',
        'احتفال',
        'كيكة',
        'هدية',
        'شموع',
      ];
      for (const keyword of birthdayKeywords) {
        if (!analysis.keywords.includes(keyword)) {
          analysis.keywords.push(keyword);
        }
      }
    }

    return analysis;
  },

  afterGenerate(content: GeneratedContent): GeneratedContent {
    // Add birthday-specific CTAs
    if (content.content.includes('عيد ميلاد')) {
      const birthdayCTAs = [
        'جرب أداة حساب العمر من ميلادك لمعرفة عمرك بالتفصيل!',
        'اكتشف برجك وصفاتك الشخصية مع أدوات ميلادك!',
        'أنشئ بطاقة تهنئة مميزة لأحبائك!',
      ];

      // Add a random CTA if not already present
      const randomCTA =
        birthdayCTAs[Math.floor(Math.random() * birthdayCTAs.length)];
      if (!content.content.includes(randomCTA)) {
        content.content += `\n\n<p class="cta">${randomCTA}</p>`;
      }
    }

    return content;
  },

  async getKnowledge(): Promise<KnowledgeData> {
    try {
      const knowledgePath = path.join(DATA_PATH, 'knowledge/birthday.json');
      const data = fs.readFileSync(knowledgePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.warn('Failed to load birthday knowledge:', error);
      return {
        facts: [
          'يحتفل الناس بأعياد الميلاد منذ آلاف السنين',
          'تقليد إطفاء الشموع يعود للحضارة اليونانية القديمة',
          'أغنية عيد الميلاد السعيد هي من أشهر الأغاني في العالم',
        ],
        tips: [
          'خطط للاحتفال مسبقاً لضمان نجاحه',
          'اختر هدية تناسب شخصية صاحب العيد',
          'لا تنسَ التقاط الصور لتوثيق اللحظات السعيدة',
        ],
        traditions: {
          arabic: ['تقديم الكيكة مع الشموع', 'غناء أغنية عيد الميلاد'],
          western: ['نفخ الشموع وتمني أمنية', 'فتح الهدايا'],
        },
      };
    }
  },

  async getTemplates(): Promise<Templates> {
    try {
      const introsPath = path.join(DATA_PATH, 'templates/intros/birthday.json');
      const conclusionsPath = path.join(
        DATA_PATH,
        'templates/conclusions/birthday.json'
      );
      const paragraphsPath = path.join(
        DATA_PATH,
        'templates/paragraphs/birthday.json'
      );

      const intros = JSON.parse(fs.readFileSync(introsPath, 'utf-8'));
      const conclusions = JSON.parse(fs.readFileSync(conclusionsPath, 'utf-8'));
      const paragraphs = JSON.parse(fs.readFileSync(paragraphsPath, 'utf-8'));

      return {
        intros: intros.templates || [],
        conclusions: conclusions.templates || [],
        paragraphs: { birthday: paragraphs.templates || [] },
      };
    } catch (error) {
      console.warn('Failed to load birthday templates:', error);
      return {
        intros: [],
        conclusions: [],
        paragraphs: {},
      };
    }
  },

  async getSynonyms(): Promise<SynonymDictionary> {
    return {
      'عيد ميلاد': ['يوم الميلاد', 'ذكرى الميلاد', 'عيد العمر'],
      سعيد: ['مبارك', 'سعيد', 'مميز', 'رائع'],
      احتفال: ['حفلة', 'مناسبة', 'فرحة', 'بهجة'],
      هدية: ['تذكار', 'عطية', 'منحة', 'إهداء'],
      تهنئة: ['مباركة', 'تبريك', 'تمنيات', 'أمنيات'],
    };
  },
};

export default birthdayPlugin;
