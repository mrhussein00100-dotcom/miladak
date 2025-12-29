/**
 * SONA v4 Zodiac Plugin
 * إضافة الأبراج - محتوى متخصص في الأبراج والفلك
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

// Zodiac signs data
const ZODIAC_SIGNS = {
  الحمل: { element: 'ناري', dates: '21 مارس - 19 أبريل', planet: 'المريخ' },
  الثور: { element: 'ترابي', dates: '20 أبريل - 20 مايو', planet: 'الزهرة' },
  الجوزاء: { element: 'هوائي', dates: '21 مايو - 20 يونيو', planet: 'عطارد' },
  السرطان: { element: 'مائي', dates: '21 يونيو - 22 يوليو', planet: 'القمر' },
  الأسد: { element: 'ناري', dates: '23 يوليو - 22 أغسطس', planet: 'الشمس' },
  العذراء: { element: 'ترابي', dates: '23 أغسطس - 22 سبتمبر', planet: 'عطارد' },
  الميزان: {
    element: 'هوائي',
    dates: '23 سبتمبر - 22 أكتوبر',
    planet: 'الزهرة',
  },
  العقرب: { element: 'مائي', dates: '23 أكتوبر - 21 نوفمبر', planet: 'بلوتو' },
  القوس: { element: 'ناري', dates: '22 نوفمبر - 21 ديسمبر', planet: 'المشتري' },
  الجدي: { element: 'ترابي', dates: '22 ديسمبر - 19 يناير', planet: 'زحل' },
  الدلو: { element: 'هوائي', dates: '20 يناير - 18 فبراير', planet: 'أورانوس' },
  الحوت: { element: 'مائي', dates: '19 فبراير - 20 مارس', planet: 'نبتون' },
};

/**
 * Zodiac Plugin
 */
export const zodiacPlugin: SONAPlugin = {
  name: 'zodiac',
  version: '1.0.0',
  category: 'الأبراج',
  enabled: true,
  description: 'محتوى متخصص في الأبراج والفلك',

  async onInit() {
    console.log('Zodiac plugin initialized');
  },

  async onDestroy() {
    console.log('Zodiac plugin destroyed');
  },

  afterAnalyze(analysis: TopicAnalysis): TopicAnalysis {
    if (analysis.category === 'zodiac') {
      // Add zodiac-specific sections
      const zodiacSections = [
        'zodiac-traits',
        'zodiac-compatibility',
        'zodiac-career',
        'zodiac-love',
      ];

      for (const section of zodiacSections) {
        if (!analysis.suggestedSections.includes(section)) {
          analysis.suggestedSections.push(section);
        }
      }

      // Add zodiac-specific keywords
      const zodiacKeywords = ['برج', 'فلك', 'صفات', 'توافق', 'حظ'];
      for (const keyword of zodiacKeywords) {
        if (!analysis.keywords.includes(keyword)) {
          analysis.keywords.push(keyword);
        }
      }

      // Add zodiac sign info if detected
      for (const sign of analysis.extractedEntities.zodiacSigns) {
        const signInfo = ZODIAC_SIGNS[sign as keyof typeof ZODIAC_SIGNS];
        if (signInfo) {
          analysis.keywords.push(signInfo.element);
          analysis.keywords.push(signInfo.planet);
        }
      }
    }

    return analysis;
  },

  afterGenerate(content: GeneratedContent): GeneratedContent {
    // Add zodiac-specific CTAs
    if (content.content.includes('برج')) {
      const zodiacCTAs = [
        'اكتشف توافقك مع الأبراج الأخرى باستخدام أدوات ميلادك!',
        'احسب عمرك واعرف برجك بدقة مع حاسبة العمر!',
        'تعرف على حظك اليوم مع توقعات الأبراج!',
      ];

      const randomCTA =
        zodiacCTAs[Math.floor(Math.random() * zodiacCTAs.length)];
      if (!content.content.includes(randomCTA)) {
        content.content += `\n\n<p class="cta">${randomCTA}</p>`;
      }
    }

    return content;
  },

  async getKnowledge(): Promise<KnowledgeData> {
    try {
      const knowledgePath = path.join(DATA_PATH, 'knowledge/zodiac.json');
      const data = fs.readFileSync(knowledgePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.warn('Failed to load zodiac knowledge:', error);
      return {
        facts: [
          'علم الفلك من أقدم العلوم التي عرفها الإنسان',
          'تقسم الأبراج إلى أربعة عناصر: النار والتراب والهواء والماء',
          'كل برج له كوكب حاكم يؤثر على صفاته',
        ],
        tips: [
          'تعرف على صفات برجك لفهم نفسك بشكل أفضل',
          'استخدم معرفة الأبراج لتحسين علاقاتك',
          'لا تجعل الأبراج تحدد مصيرك بالكامل',
        ],
        zodiacSigns: ZODIAC_SIGNS,
      };
    }
  },

  async getTemplates(): Promise<Templates> {
    try {
      const introsPath = path.join(DATA_PATH, 'templates/intros/zodiac.json');
      const conclusionsPath = path.join(
        DATA_PATH,
        'templates/conclusions/zodiac.json'
      );
      const paragraphsPath = path.join(
        DATA_PATH,
        'templates/paragraphs/zodiac.json'
      );

      const intros = JSON.parse(fs.readFileSync(introsPath, 'utf-8'));
      const conclusions = JSON.parse(fs.readFileSync(conclusionsPath, 'utf-8'));
      const paragraphs = JSON.parse(fs.readFileSync(paragraphsPath, 'utf-8'));

      return {
        intros: intros.templates || [],
        conclusions: conclusions.templates || [],
        paragraphs: { zodiac: paragraphs.templates || [] },
      };
    } catch (error) {
      console.warn('Failed to load zodiac templates:', error);
      return {
        intros: [],
        conclusions: [],
        paragraphs: {},
      };
    }
  },

  async getSynonyms(): Promise<SynonymDictionary> {
    return {
      برج: ['طالع', 'منزلة فلكية', 'بيت فلكي'],
      صفات: ['خصائص', 'سمات', 'مميزات', 'طباع'],
      توافق: ['انسجام', 'تناغم', 'تلاؤم', 'تجانس'],
      حظ: ['طالع', 'نصيب', 'قدر', 'بخت'],
      فلك: ['نجوم', 'كواكب', 'سماء', 'أجرام'],
    };
  },
};

export default zodiacPlugin;
