/**
 * SONA Dynamic Content Builder - باني المحتوى الديناميكي
 * يبني محتوى مخصص وغني بناءً على تحليل الموضوع وقاعدة المعرفة
 *
 * Requirements: 3.1, 3.2, 5.1, 5.2, 5.3
 */

import * as fs from 'fs';
import * as path from 'path';
import {
  DeepTopicAnalysis,
  ContentType,
  AudienceType,
} from './enhancedTopicAnalyzer';
import { TopicCategory, ArticleLength, ExtractedEntities } from './types';

// ============================================
// أنواع البيانات
// ============================================

export interface ContentSection {
  type:
    | 'intro'
    | 'facts'
    | 'howto'
    | 'tips'
    | 'examples'
    | 'faq'
    | 'conclusion'
    | 'tools'
    | 'statistics'
    | 'comparison';
  title: string;
  content: string;
  priority: number;
  wordCount: number;
}

export interface KnowledgeEntry {
  facts?: any;
  statistics?: any[];
  examples?: any[];
  tips?: any;
  howTo?: any;
  faq?: any[];
  relatedTools?: any[];
  greetings?: any;
  ideas?: any;
  traditions?: any;
  milestones?: any;
  [key: string]: any;
}

export interface BuilderConfig {
  topic: string;
  analysis: DeepTopicAnalysis;
  knowledge: KnowledgeEntry | null;
  length: ArticleLength;
  entities: ExtractedEntities;
}

// ============================================
// ثوابت
// ============================================

const SONA_DATA_PATH = path.join(process.cwd(), 'data', 'sona');

const SECTION_PRIORITIES: Record<string, number> = {
  intro: 100,
  facts: 90,
  howto: 85,
  tips: 80,
  examples: 75,
  statistics: 70,
  comparison: 65,
  faq: 60,
  tools: 50,
  conclusion: 40,
};

const LENGTH_SECTION_COUNTS: Record<ArticleLength, number> = {
  short: 3,
  medium: 5,
  long: 7,
  comprehensive: 10,
};

// ============================================
// مقدمات متنوعة
// ============================================

const INTRO_TEMPLATES = {
  birthday: {
    withNameAndAge: [
      `نحتفل اليوم بمناسبة عيد ميلاد <strong>{name}</strong> الذي يبلغ من العمر <strong>{age} عاماً</strong>! هذه مناسبة سعيدة تستحق أجمل التهاني والأمنيات.`,
      `في هذا اليوم المميز، نهنئ <strong>{name}</strong> بعيد ميلاده الـ<strong>{age}</strong>! عام جديد مليء بالأمل والسعادة.`,
      `يسعدنا أن نحتفل معكم بعيد ميلاد <strong>{name}</strong> الذي أتم <strong>{age} عاماً</strong> من العمر المبارك.`,
      `اليوم يوم مميز جداً، إنه عيد ميلاد <strong>{name}</strong>! <strong>{age} عاماً</strong> من الحياة والإنجازات.`,
    ],
    withNameOnly: [
      `نحتفل اليوم بعيد ميلاد <strong>{name}</strong>! مناسبة سعيدة نتمنى فيها له/لها عاماً جديداً مليئاً بالسعادة.`,
      `عيد ميلاد سعيد لـ<strong>{name}</strong>! في هذا اليوم المميز، نقدم أجمل التهاني والأمنيات.`,
      `يسعدنا أن نهنئ <strong>{name}</strong> بمناسبة عيد ميلاده السعيد! كل عام وأنت بخير.`,
    ],
    general: [
      `عيد الميلاد من أجمل المناسبات التي نحتفل بها مع أحبائنا. إنه يوم مميز نعبر فيه عن حبنا وتقديرنا.`,
      `الاحتفال بعيد الميلاد تقليد جميل يجمع العائلة والأصدقاء في أجواء من الفرح والسعادة.`,
      `في كل عام، يأتي يوم مميز نحتفل فيه بمرور عام آخر من الحياة - إنه عيد الميلاد!`,
    ],
  },
  zodiac: {
    withSign: [
      `برج <strong>{sign}</strong> من الأبراج المميزة التي تتمتع بصفات فريدة. دعونا نتعرف على كل ما يخص هذا البرج.`,
      `إذا كنت من مواليد برج <strong>{sign}</strong>، فأنت تتمتع بشخصية مميزة. اكتشف صفاتك وتوافقك مع الأبراج الأخرى.`,
      `برج <strong>{sign}</strong> يحمل صفات وخصائص تميز مواليده عن غيرهم. تعرف على كل التفاصيل في هذا المقال.`,
    ],
    general: [
      `الأبراج الفلكية تكشف الكثير عن شخصياتنا وصفاتنا. اكتشف ما يقوله برجك عنك.`,
      `علم الأبراج من أقدم العلوم التي اهتم بها الإنسان. تعرف على برجك وصفاته.`,
    ],
  },
  health: [
    `الصحة هي أغلى ما نملك، ومعرفة المعلومات الصحية الصحيحة أمر ضروري للحفاظ عليها.`,
    `في هذا المقال، نقدم لكم معلومات صحية موثوقة ونصائح عملية للحفاظ على صحتكم.`,
    `صحتك أولوية! تعرف على المعلومات والنصائح التي تساعدك على حياة صحية أفضل.`,
  ],
  dates: [
    `التواريخ والتقويمات جزء أساسي من حياتنا اليومية. تعرف على كيفية التعامل معها بسهولة.`,
    `سواء كنت تحتاج لتحويل التاريخ أو حساب الأيام، نقدم لك كل ما تحتاجه في هذا المقال.`,
  ],
  general: [
    `مرحباً بكم في موقع ميلادك! نقدم لكم في هذا المقال معلومات شاملة ومفيدة.`,
    `في هذا المقال الشامل، سنتناول الموضوع بالتفصيل ونقدم لكم نصائح عملية.`,
    `اكتشفوا معنا كل ما تحتاجون معرفته في هذا الدليل الشامل.`,
  ],
};

// ============================================
// انتقالات متنوعة
// ============================================

const TRANSITIONS = [
  'بالإضافة إلى ذلك،',
  'من ناحية أخرى،',
  'علاوة على ما سبق،',
  'ومن الجدير بالذكر أن',
  'كما أن',
  'وفي هذا السياق،',
  'ومن المهم أيضاً',
  'وبالنظر إلى',
  'ولا يفوتنا أن نذكر',
  'وفي ما يتعلق بـ',
  'ومن الأمور المهمة',
  'وتجدر الإشارة إلى',
  'ومما يستحق الذكر',
  'وفي إطار ذلك،',
  'ومن هذا المنطلق،',
  'وبناءً على ذلك،',
  'ولعل من أبرز',
  'ومن أهم ما يميز',
  'وفي ضوء ذلك،',
  'ومن الملاحظ أن',
];

// ============================================
// خواتيم متنوعة
// ============================================

const CONCLUSION_TEMPLATES = {
  birthday: {
    withName: [
      `في الختام، نتمنى لـ<strong>{name}</strong> عيد ميلاد سعيد وعاماً جديداً مليئاً بالسعادة والنجاح والصحة.`,
      `ختاماً، كل عام و<strong>{name}</strong> بألف خير. نأمل أن تكون هذه الأفكار قد ألهمتكم لاحتفال مميز.`,
      `نتمنى لـ<strong>{name}</strong> عمراً مديداً وحياة سعيدة. عيد ميلاد سعيد!`,
    ],
    general: [
      `نأمل أن يكون هذا المقال قد أفادكم في التخطيط لاحتفال عيد ميلاد مميز ولا يُنسى.`,
      `شاركوا هذا المقال مع أصدقائكم وأحبائكم، وتابعونا للمزيد من الأفكار والنصائح!`,
    ],
  },
  zodiac: {
    withSign: [
      `هذا كل ما تحتاج معرفته عن برج <strong>{sign}</strong>. نأمل أن تكون هذه المعلومات قد أفادتك.`,
      `تابعونا للمزيد من المقالات عن الأبراج والفلك. اكتشف المزيد عن برج <strong>{sign}</strong> وتوافقه!`,
    ],
    general: [
      `نأمل أن تكون هذه المعلومات قد ساعدتك في فهم برجك بشكل أفضل.`,
      `تابعونا للمزيد من المقالات عن الأبراج والتوقعات الفلكية!`,
    ],
  },
  general: [
    `نأمل أن يكون هذا المقال قد أفادكم. شاركوه مع أصدقائكم وتابعونا للمزيد!`,
    `شكراً لقراءتكم! تابعونا على موقع ميلادك للمزيد من المقالات المفيدة.`,
    `نتمنى أن تكونوا قد استفدتم من هذا المقال. لا تترددوا في مشاركته!`,
  ],
};

// ============================================
// فئة باني المحتوى الديناميكي
// ============================================

export class DynamicContentBuilder {
  private knowledgeCache: Map<string, KnowledgeEntry> = new Map();
  private usedIntros: Set<string> = new Set();
  private usedTransitions: Set<string> = new Set();

  /**
   * بناء هيكل المقال الديناميكي
   * Requirements: 3.1
   */
  buildDynamicStructure(config: BuilderConfig): ContentSection[] {
    const sections: ContentSection[] = [];
    const { topic, analysis, knowledge, length, entities } = config;

    // 1. المقدمة (دائماً)
    sections.push(this.generateDynamicIntro(topic, analysis, entities));

    // 2. أقسام المحتوى حسب الفئة والطول
    const contentSections = this.generateContentSections(config);
    sections.push(...contentSections);

    // 3. الأسئلة الشائعة (للمقالات المتوسطة والطويلة)
    if (length !== 'short' && knowledge?.faq) {
      sections.push(this.generateFAQSection(knowledge.faq, topic));
    }

    // 4. الأدوات المرتبطة
    if (knowledge?.relatedTools) {
      sections.push(this.generateToolsSection(knowledge.relatedTools, topic));
    }

    // 5. الخاتمة (دائماً)
    sections.push(this.generateConclusion(topic, analysis, entities));

    // ترتيب الأقسام حسب الأولوية
    return sections.sort((a, b) => b.priority - a.priority);
  }

  /**
   * توليد مقدمة ديناميكية ومتنوعة
   * Requirements: 3.2
   */
  generateDynamicIntro(
    topic: string,
    analysis: DeepTopicAnalysis,
    entities: ExtractedEntities
  ): ContentSection {
    let introText = '';
    const category = analysis.category;
    const name = entities.names?.[0] || '';
    const age = entities.ages?.[0] || 0;
    const sign = entities.zodiacSigns?.[0] || '';

    // اختيار قالب المقدمة المناسب
    if (category === 'birthday') {
      if (name && age) {
        introText = this.getRandomUnused(
          INTRO_TEMPLATES.birthday.withNameAndAge,
          this.usedIntros
        );
        introText = introText
          .replace(/{name}/g, name)
          .replace(/{age}/g, String(age));
      } else if (name) {
        introText = this.getRandomUnused(
          INTRO_TEMPLATES.birthday.withNameOnly,
          this.usedIntros
        );
        introText = introText.replace(/{name}/g, name);
      } else {
        introText = this.getRandomUnused(
          INTRO_TEMPLATES.birthday.general,
          this.usedIntros
        );
      }
    } else if (category === 'zodiac') {
      if (sign) {
        introText = this.getRandomUnused(
          INTRO_TEMPLATES.zodiac.withSign,
          this.usedIntros
        );
        introText = introText.replace(/{sign}/g, sign);
      } else {
        introText = this.getRandomUnused(
          INTRO_TEMPLATES.zodiac.general,
          this.usedIntros
        );
      }
    } else if (category === 'health') {
      introText = this.getRandomUnused(INTRO_TEMPLATES.health, this.usedIntros);
    } else if (category === 'dates') {
      introText = this.getRandomUnused(INTRO_TEMPLATES.dates, this.usedIntros);
    } else {
      introText = this.getRandomUnused(
        INTRO_TEMPLATES.general,
        this.usedIntros
      );
    }

    // إضافة جملة عن محتوى المقال
    const contentPreview = this.generateContentPreview(analysis);
    introText += ` ${contentPreview}`;

    const content = `<h2>مقدمة</h2>\n<p>${introText}</p>`;

    return {
      type: 'intro',
      title: 'مقدمة',
      content,
      priority: SECTION_PRIORITIES.intro,
      wordCount: this.countWords(content),
    };
  }

  /**
   * توليد قسم الحقائق
   * Requirements: 5.1
   */
  generateFactsSection(
    facts: any,
    topic: string,
    category: TopicCategory
  ): ContentSection {
    let factsList: string[] = [];

    // استخراج الحقائق من الهيكل المختلف
    if (Array.isArray(facts)) {
      factsList = facts.map((f) =>
        typeof f === 'string' ? f : f.content || f.fact
      );
    } else if (facts?.scientific) {
      factsList = facts.scientific.map((f: any) => f.content);
    } else if (facts?.interesting) {
      factsList = facts.interesting.map((f: any) => f.content);
    }

    // اختيار 5-7 حقائق عشوائية
    const selectedFacts = this.shuffleArray(factsList).slice(0, 7);

    if (selectedFacts.length === 0) {
      return this.generateGenericFactsSection(topic, category);
    }

    const transition = this.getRandomTransition();
    const content = `<h2>حقائق مثيرة عن ${topic}</h2>
<p>${transition} إليكم بعض الحقائق المثيرة:</p>
<ul>
${selectedFacts.map((f) => `<li>${f}</li>`).join('\n')}
</ul>`;

    return {
      type: 'facts',
      title: `حقائق مثيرة عن ${topic}`,
      content,
      priority: SECTION_PRIORITIES.facts,
      wordCount: this.countWords(content),
    };
  }

  /**
   * توليد قسم الخطوات (How-To)
   * Requirements: 5.2
   */
  generateHowToSection(
    howTo: any,
    topic: string,
    analysis: DeepTopicAnalysis
  ): ContentSection {
    let steps: string[] = [];
    let tips: string[] = [];

    if (howTo?.steps) {
      steps = howTo.steps;
    }
    if (howTo?.tips) {
      tips = howTo.tips;
    }

    if (steps.length === 0) {
      return this.generateGenericHowToSection(topic, analysis);
    }

    let content = `<h2>كيفية ${topic}</h2>
<p>اتبع هذه الخطوات البسيطة:</p>
<ol>
${steps
  .map((s, i) => `<li><strong>الخطوة ${i + 1}:</strong> ${s}</li>`)
  .join('\n')}
</ol>`;

    if (tips.length > 0) {
      content += `\n<h3>نصائح مهمة:</h3>
<ul>
${tips
  .slice(0, 3)
  .map((t) => `<li>${t}</li>`)
  .join('\n')}
</ul>`;
    }

    return {
      type: 'howto',
      title: `كيفية ${topic}`,
      content,
      priority: SECTION_PRIORITIES.howto,
      wordCount: this.countWords(content),
    };
  }

  /**
   * توليد قسم النصائح
   * Requirements: 5.3
   */
  generateTipsSection(
    tips: any,
    topic: string,
    entities: ExtractedEntities
  ): ContentSection {
    let tipsList: string[] = [];

    // استخراج النصائح من الهيكل المختلف
    if (Array.isArray(tips)) {
      tipsList = tips.map((t) =>
        typeof t === 'string' ? t : t.content || t.tip
      );
    } else if (tips?.general) {
      tipsList = tips.general;
    } else if (tips?.practical) {
      tipsList = [...(tips.general || []), ...(tips.practical || [])];
    }

    // تخصيص النصائح حسب الكيانات
    const age = entities.ages?.[0];
    if (age && tips?.ageSpecific) {
      const ageCategory = age < 13 ? 'children' : age < 20 ? 'teens' : 'adults';
      if (tips.ageSpecific[ageCategory]) {
        tipsList = [...tipsList, ...tips.ageSpecific[ageCategory]];
      }
    }

    const selectedTips = this.shuffleArray(tipsList).slice(0, 7);

    if (selectedTips.length === 0) {
      return this.generateGenericTipsSection(topic);
    }

    const transition = this.getRandomTransition();
    const content = `<h2>نصائح مهمة</h2>
<p>${transition} إليكم أهم النصائح:</p>
<ul>
${selectedTips.map((t) => `<li>${t}</li>`).join('\n')}
</ul>`;

    return {
      type: 'tips',
      title: 'نصائح مهمة',
      content,
      priority: SECTION_PRIORITIES.tips,
      wordCount: this.countWords(content),
    };
  }

  /**
   * توليد قسم الأمثلة
   */
  generateExamplesSection(examples: any[], topic: string): ContentSection {
    if (!examples || examples.length === 0) {
      return {
        type: 'examples',
        title: 'أمثلة عملية',
        content: '',
        priority: 0,
        wordCount: 0,
      };
    }

    const selectedExamples = this.shuffleArray(examples).slice(0, 3);

    let content = `<h2>أمثلة عملية</h2>\n`;

    selectedExamples.forEach((ex, i) => {
      if (typeof ex === 'string') {
        content += `<h3>مثال ${i + 1}</h3>\n<p>${ex}</p>\n`;
      } else {
        content += `<h3>${ex.scenario || `مثال ${i + 1}`}</h3>\n`;
        if (ex.calculation)
          content += `<p><strong>الحساب:</strong> ${ex.calculation}</p>\n`;
        if (ex.details) content += `<p>${ex.details}</p>\n`;
        if (ex.explanation) content += `<p>${ex.explanation}</p>\n`;
      }
    });

    return {
      type: 'examples',
      title: 'أمثلة عملية',
      content,
      priority: SECTION_PRIORITIES.examples,
      wordCount: this.countWords(content),
    };
  }

  /**
   * توليد قسم الأسئلة الشائعة
   */
  generateFAQSection(faqs: any[], topic: string): ContentSection {
    if (!faqs || faqs.length === 0) {
      return {
        type: 'faq',
        title: 'الأسئلة الشائعة',
        content: '',
        priority: 0,
        wordCount: 0,
      };
    }

    const selectedFaqs = this.shuffleArray(faqs).slice(0, 5);

    let content = `<h2>الأسئلة الشائعة</h2>\n`;

    selectedFaqs.forEach((faq) => {
      content += `<h3>${faq.question}</h3>\n<p>${faq.answer}</p>\n`;
    });

    return {
      type: 'faq',
      title: 'الأسئلة الشائعة',
      content,
      priority: SECTION_PRIORITIES.faq,
      wordCount: this.countWords(content),
    };
  }

  /**
   * توليد قسم الأدوات المرتبطة
   */
  generateToolsSection(tools: any[], topic: string): ContentSection {
    if (!tools || tools.length === 0) {
      return {
        type: 'tools',
        title: 'أدوات مفيدة',
        content: '',
        priority: 0,
        wordCount: 0,
      };
    }

    // ترتيب حسب الصلة
    const sortedTools = [...tools].sort(
      (a, b) => (b.relevance || 0) - (a.relevance || 0)
    );
    const selectedTools = sortedTools.slice(0, 4);

    let content = `<h2>أدوات مفيدة من ميلادك</h2>
<p>جرب هذه الأدوات المفيدة:</p>
<ul>
${selectedTools
  .map(
    (t) =>
      `<li><a href="${t.href}"><strong>${t.name}</strong></a>: ${t.description}</li>`
  )
  .join('\n')}
</ul>`;

    return {
      type: 'tools',
      title: 'أدوات مفيدة من ميلادك',
      content,
      priority: SECTION_PRIORITIES.tools,
      wordCount: this.countWords(content),
    };
  }

  /**
   * توليد الخاتمة
   */
  generateConclusion(
    topic: string,
    analysis: DeepTopicAnalysis,
    entities: ExtractedEntities
  ): ContentSection {
    let conclusionText = '';
    const category = analysis.category;
    const name = entities.names?.[0] || '';
    const sign = entities.zodiacSigns?.[0] || '';

    if (category === 'birthday') {
      if (name) {
        conclusionText = this.getRandomUnused(
          CONCLUSION_TEMPLATES.birthday.withName,
          new Set()
        );
        conclusionText = conclusionText.replace(/{name}/g, name);
      } else {
        conclusionText = this.getRandomUnused(
          CONCLUSION_TEMPLATES.birthday.general,
          new Set()
        );
      }
    } else if (category === 'zodiac') {
      if (sign) {
        conclusionText = this.getRandomUnused(
          CONCLUSION_TEMPLATES.zodiac.withSign,
          new Set()
        );
        conclusionText = conclusionText.replace(/{sign}/g, sign);
      } else {
        conclusionText = this.getRandomUnused(
          CONCLUSION_TEMPLATES.zodiac.general,
          new Set()
        );
      }
    } else {
      conclusionText = this.getRandomUnused(
        CONCLUSION_TEMPLATES.general,
        new Set()
      );
    }

    // إضافة دعوة للعمل
    const cta = this.generateCTA(analysis);
    conclusionText += ` ${cta}`;

    const content = `<h2>الخاتمة</h2>\n<p>${conclusionText}</p>`;

    return {
      type: 'conclusion',
      title: 'الخاتمة',
      content,
      priority: SECTION_PRIORITIES.conclusion,
      wordCount: this.countWords(content),
    };
  }

  // ============================================
  // دوال مساعدة خاصة
  // ============================================

  private generateContentSections(config: BuilderConfig): ContentSection[] {
    const { topic, analysis, knowledge, length, entities } = config;
    const sections: ContentSection[] = [];
    const maxSections = LENGTH_SECTION_COUNTS[length];

    // أقسام حسب الفئة
    if (analysis.category === 'birthday') {
      sections.push(...this.generateBirthdaySections(config));
    } else if (analysis.category === 'zodiac') {
      sections.push(...this.generateZodiacSections(config));
    } else if (analysis.category === 'health') {
      sections.push(...this.generateHealthSections(config));
    } else {
      sections.push(...this.generateGeneralSections(config));
    }

    // إضافة أقسام من قاعدة المعرفة
    if (knowledge) {
      if (knowledge.facts) {
        sections.push(
          this.generateFactsSection(knowledge.facts, topic, analysis.category)
        );
      }
      if (knowledge.howTo) {
        sections.push(
          this.generateHowToSection(knowledge.howTo, topic, analysis)
        );
      }
      if (knowledge.tips) {
        sections.push(
          this.generateTipsSection(knowledge.tips, topic, entities)
        );
      }
      if (knowledge.examples) {
        sections.push(this.generateExamplesSection(knowledge.examples, topic));
      }
      if (knowledge.statistics) {
        sections.push(
          this.generateStatisticsSection(knowledge.statistics, topic)
        );
      }
    }

    // تصفية الأقسام الفارغة وترتيبها
    return sections
      .filter((s) => s.content && s.wordCount > 0)
      .sort((a, b) => b.priority - a.priority)
      .slice(0, maxSections);
  }

  private generateBirthdaySections(config: BuilderConfig): ContentSection[] {
    const { topic, knowledge, entities } = config;
    const sections: ContentSection[] = [];
    const name = entities.names?.[0] || 'المحتفى به';
    const age = entities.ages?.[0] || 0;

    // قسم التهاني
    if (knowledge?.greetings) {
      const greetingType =
        age < 13 ? 'forKids' : age < 20 ? 'casual' : 'formal';
      const greetings =
        knowledge.greetings[greetingType] || knowledge.greetings.casual || [];
      if (greetings.length > 0) {
        const selectedGreetings = this.shuffleArray(greetings).slice(0, 5);
        sections.push({
          type: 'tips',
          title: `أجمل تهاني عيد الميلاد لـ${name}`,
          content: `<h2>أجمل تهاني عيد الميلاد لـ${name}</h2>
<p>نقدم لكم أجمل عبارات التهنئة:</p>
<ul>
${selectedGreetings.map((g) => `<li>${g}</li>`).join('\n')}
</ul>`,
          priority: 88,
          wordCount: this.countWords(selectedGreetings.join(' ')),
        });
      }
    }

    // قسم أفكار الهدايا
    if (knowledge?.ideas?.gifts) {
      let giftCategory = 'forHim';
      if (age < 13) giftCategory = 'forKids';
      else if (age < 20) giftCategory = 'forTeens';
      else if (age > 60) giftCategory = 'forElderly';

      const gifts = knowledge.ideas.gifts[giftCategory] || [];
      if (gifts.length > 0) {
        const selectedGifts = this.shuffleArray(gifts).slice(0, 7);
        sections.push({
          type: 'tips',
          title: `أفكار هدايا مميزة`,
          content: `<h2>أفكار هدايا مميزة${age ? ` لعمر ${age} سنة` : ''}</h2>
<p>إليكم أفضل أفكار الهدايا:</p>
<ol>
${selectedGifts.map((g) => `<li><strong>${g}</strong></li>`).join('\n')}
</ol>`,
          priority: 85,
          wordCount: this.countWords(selectedGifts.join(' ')),
        });
      }
    }

    // قسم أفكار الاحتفال
    if (knowledge?.ideas?.activities) {
      const activities = this.shuffleArray(knowledge.ideas.activities).slice(
        0,
        5
      );
      sections.push({
        type: 'tips',
        title: 'أفكار للاحتفال',
        content: `<h2>أفكار للاحتفال بعيد الميلاد</h2>
<p>إليكم أفكار رائعة لجعل الحفلة مميزة:</p>
<ul>
${activities.map((a) => `<li>${a}</li>`).join('\n')}
</ul>`,
        priority: 82,
        wordCount: this.countWords(activities.join(' ')),
      });
    }

    // قسم معلومات العمر
    if (age && knowledge?.milestones?.[age.toString()]) {
      const milestone = knowledge.milestones[age.toString()];
      sections.push({
        type: 'facts',
        title: `ماذا يعني عمر ${age} سنة؟`,
        content: `<h2>ماذا يعني عمر ${age} سنة؟</h2>
<p><strong>${milestone.name}</strong>: ${milestone.significance}</p>
${
  milestone.traditions
    ? `<p>من التقاليد المميزة لهذا العمر:</p>
<ul>
${milestone.traditions.map((t: string) => `<li>${t}</li>`).join('\n')}
</ul>`
    : ''
}`,
        priority: 78,
        wordCount: 50,
      });
    }

    return sections;
  }

  private generateZodiacSections(config: BuilderConfig): ContentSection[] {
    const { knowledge, entities } = config;
    const sections: ContentSection[] = [];
    const sign = entities.zodiacSigns?.[0];

    if (!sign || !knowledge) return sections;

    const signData = knowledge[sign] || knowledge;

    // قسم الصفات
    if (signData.traits?.length > 0) {
      sections.push({
        type: 'facts',
        title: `صفات برج ${sign}`,
        content: `<h2>صفات برج ${sign}</h2>
<p>يتميز مواليد برج ${sign} بالعديد من الصفات المميزة:</p>
<ul>
${signData.traits
  .slice(0, 8)
  .map((t: string) => `<li>${t}</li>`)
  .join('\n')}
</ul>`,
        priority: 90,
        wordCount: this.countWords(signData.traits.join(' ')),
      });
    }

    // قسم نقاط القوة والضعف
    if (signData.strengths?.length > 0 || signData.weaknesses?.length > 0) {
      let content = `<h2>نقاط القوة والضعف لبرج ${sign}</h2>\n`;
      if (signData.strengths?.length > 0) {
        content += `<h3>نقاط القوة:</h3>
<ul>
${signData.strengths
  .slice(0, 5)
  .map((s: string) => `<li>${s}</li>`)
  .join('\n')}
</ul>\n`;
      }
      if (signData.weaknesses?.length > 0) {
        content += `<h3>نقاط الضعف:</h3>
<ul>
${signData.weaknesses
  .slice(0, 5)
  .map((w: string) => `<li>${w}</li>`)
  .join('\n')}
</ul>`;
      }
      sections.push({
        type: 'comparison',
        title: `نقاط القوة والضعف لبرج ${sign}`,
        content,
        priority: 85,
        wordCount: this.countWords(content),
      });
    }

    // قسم التوافق
    if (signData.compatibility?.length > 0) {
      sections.push({
        type: 'comparison',
        title: `توافق برج ${sign}`,
        content: `<h2>توافق برج ${sign} مع الأبراج الأخرى</h2>
<p>يتوافق برج ${sign} بشكل جيد مع:</p>
<ul>
${signData.compatibility.map((c: string) => `<li>برج ${c}</li>`).join('\n')}
</ul>
${
  signData.incompatibility?.length > 0
    ? `<p>وقد يواجه تحديات مع: ${signData.incompatibility.join('، ')}</p>`
    : ''
}`,
        priority: 82,
        wordCount: 50,
      });
    }

    // قسم المشاهير
    if (signData.celebrities?.length > 0) {
      sections.push({
        type: 'examples',
        title: `مشاهير من برج ${sign}`,
        content: `<h2>مشاهير من برج ${sign}</h2>
<p>من أشهر مواليد برج ${sign}:</p>
<ul>
${signData.celebrities
  .slice(0, 5)
  .map((c: string) => `<li>${c}</li>`)
  .join('\n')}
</ul>`,
        priority: 70,
        wordCount: 30,
      });
    }

    return sections;
  }

  private generateHealthSections(config: BuilderConfig): ContentSection[] {
    const { topic, knowledge } = config;
    const sections: ContentSection[] = [];

    if (!knowledge) return sections;

    // قسم المعلومات الصحية
    if (knowledge.facts) {
      sections.push(
        this.generateFactsSection(knowledge.facts, topic, 'health')
      );
    }

    // قسم النصائح الصحية
    if (knowledge.tips) {
      sections.push(
        this.generateTipsSection(knowledge.tips, topic, config.entities)
      );
    }

    return sections;
  }

  private generateGeneralSections(config: BuilderConfig): ContentSection[] {
    const { topic, knowledge, analysis } = config;
    const sections: ContentSection[] = [];

    if (!knowledge) {
      // توليد محتوى عام إذا لم تتوفر قاعدة معرفة
      sections.push(this.generateGenericFactsSection(topic, analysis.category));
      sections.push(this.generateGenericTipsSection(topic));
    }

    return sections;
  }

  private generateStatisticsSection(
    statistics: any[],
    topic: string
  ): ContentSection {
    if (!statistics || statistics.length === 0) {
      return {
        type: 'statistics',
        title: 'إحصائيات',
        content: '',
        priority: 0,
        wordCount: 0,
      };
    }

    const selectedStats = this.shuffleArray(statistics).slice(0, 5);

    let content = `<h2>إحصائيات مثيرة</h2>
<ul>
${selectedStats
  .map(
    (s) =>
      `<li><strong>${s.value} ${s.unit || ''}</strong>: ${s.description}</li>`
  )
  .join('\n')}
</ul>`;

    return {
      type: 'statistics',
      title: 'إحصائيات مثيرة',
      content,
      priority: SECTION_PRIORITIES.statistics,
      wordCount: this.countWords(content),
    };
  }

  // ============================================
  // دوال توليد المحتوى العام
  // ============================================

  private generateGenericFactsSection(
    topic: string,
    category: TopicCategory
  ): ContentSection {
    const genericFacts: Record<TopicCategory, string[]> = {
      birthday: [
        'أقدم كعكة عيد ميلاد معروفة كانت في ألمانيا في القرن 15',
        'تقليد إطفاء الشموع يعود للإغريق القدماء',
        'يُحتفل بحوالي 18 مليون عيد ميلاد يومياً حول العالم',
      ],
      zodiac: [
        'الأبراج الفلكية 12 برجاً تمثل مسار الشمس خلال السنة',
        'كل برج يمتد لحوالي 30 يوماً',
        'الأبراج تنقسم إلى 4 عناصر: النار، التراب، الهواء، الماء',
      ],
      health: [
        'الصحة الجيدة تبدأ بالتغذية السليمة والنوم الكافي',
        'ممارسة الرياضة 30 دقيقة يومياً تحسن الصحة العامة',
        'شرب 8 أكواب ماء يومياً ضروري للجسم',
      ],
      dates: [
        'التقويم الميلادي يعتمد على دورة الشمس',
        'التقويم الهجري يعتمد على دورة القمر',
        'الفرق بين السنة الميلادية والهجرية حوالي 11 يوماً',
      ],
      general: [
        'المعرفة قوة، والتعلم المستمر مفتاح النجاح',
        'التخطيط الجيد نصف النجاح',
        'الممارسة تصنع الإتقان',
      ],
    };

    const facts = genericFacts[category] || genericFacts.general;

    return {
      type: 'facts',
      title: `حقائق عن ${topic}`,
      content: `<h2>حقائق مثيرة</h2>
<ul>
${facts.map((f) => `<li>${f}</li>`).join('\n')}
</ul>`,
      priority: SECTION_PRIORITIES.facts - 10,
      wordCount: this.countWords(facts.join(' ')),
    };
  }

  private generateGenericTipsSection(topic: string): ContentSection {
    const genericTips = [
      `استفد من المعلومات المتاحة عن ${topic}`,
      'شارك هذا المقال مع من يهمه الأمر',
      'تابعنا للمزيد من المقالات المفيدة',
      'استخدم أدوات ميلادك المجانية',
      'احفظ هذه الصفحة للرجوع إليها لاحقاً',
    ];

    return {
      type: 'tips',
      title: 'نصائح مهمة',
      content: `<h2>نصائح مهمة</h2>
<ul>
${genericTips.map((t) => `<li>${t}</li>`).join('\n')}
</ul>`,
      priority: SECTION_PRIORITIES.tips - 10,
      wordCount: this.countWords(genericTips.join(' ')),
    };
  }

  private generateGenericHowToSection(
    topic: string,
    analysis: DeepTopicAnalysis
  ): ContentSection {
    const steps = [
      `ابحث عن معلومات موثوقة عن ${topic}`,
      'اقرأ المقالات والمصادر المتعددة',
      'طبق ما تعلمته بشكل عملي',
      'شارك معرفتك مع الآخرين',
    ];

    return {
      type: 'howto',
      title: `كيفية ${topic}`,
      content: `<h2>خطوات عملية</h2>
<ol>
${steps
  .map((s, i) => `<li><strong>الخطوة ${i + 1}:</strong> ${s}</li>`)
  .join('\n')}
</ol>`,
      priority: SECTION_PRIORITIES.howto - 10,
      wordCount: this.countWords(steps.join(' ')),
    };
  }

  // ============================================
  // دوال مساعدة
  // ============================================

  private generateContentPreview(analysis: DeepTopicAnalysis): string {
    const previews: Record<TopicCategory, string[]> = {
      birthday: [
        'سنقدم لكم أجمل التهاني وأفكار الهدايا والاحتفال.',
        'اكتشفوا معنا أفكاراً رائعة للاحتفال وعبارات تهنئة مميزة.',
      ],
      zodiac: [
        'تعرفوا على الصفات والتوافقات والنصائح المهمة.',
        'اكتشفوا كل ما يخص هذا البرج من صفات وتوافقات.',
      ],
      health: [
        'نقدم لكم معلومات صحية موثوقة ونصائح عملية.',
        'اكتشفوا النصائح والمعلومات الصحية المهمة.',
      ],
      dates: [
        'تعرفوا على كيفية التعامل مع التواريخ والتقويمات.',
        'نقدم لكم أدوات ومعلومات مفيدة عن التواريخ.',
      ],
      general: [
        'نقدم لكم معلومات شاملة ونصائح عملية.',
        'اكتشفوا كل ما تحتاجون معرفته في هذا الدليل.',
      ],
    };

    const categoryPreviews = previews[analysis.category] || previews.general;
    return this.getRandomUnused(categoryPreviews, new Set());
  }

  private generateCTA(analysis: DeepTopicAnalysis): string {
    const ctas = [
      'لا تنسوا مشاركة هذا المقال مع أصدقائكم!',
      'تابعونا للمزيد من المقالات المفيدة!',
      'جربوا أدوات ميلادك المجانية!',
      'شاركونا آراءكم في التعليقات!',
    ];
    return this.getRandomUnused(ctas, new Set());
  }

  private getRandomTransition(): string {
    return this.getRandomUnused(TRANSITIONS, this.usedTransitions);
  }

  private getRandomUnused(arr: string[], usedSet: Set<string>): string {
    const unused = arr.filter((item) => !usedSet.has(item));
    if (unused.length === 0) {
      usedSet.clear();
      return arr[Math.floor(Math.random() * arr.length)];
    }
    const selected = unused[Math.floor(Math.random() * unused.length)];
    usedSet.add(selected);
    return selected;
  }

  private shuffleArray<T>(arr: T[]): T[] {
    if (!arr || arr.length === 0) return [];
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  private countWords(text: string): number {
    const cleanText = text.replace(/<[^>]*>/g, ' ');
    return cleanText.split(/\s+/).filter((w) => w.length > 0).length;
  }

  /**
   * تحميل قاعدة المعرفة
   */
  loadKnowledge(category: string): KnowledgeEntry | null {
    if (this.knowledgeCache.has(category)) {
      return this.knowledgeCache.get(category) || null;
    }

    const filePath = path.join(SONA_DATA_PATH, 'knowledge', `${category}.json`);
    try {
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(content);
        this.knowledgeCache.set(category, data);
        return data;
      }
    } catch (error) {
      console.error(`Error loading knowledge for ${category}:`, error);
    }
    return null;
  }

  /**
   * إعادة تعيين الحالة
   */
  reset(): void {
    this.usedIntros.clear();
    this.usedTransitions.clear();
  }
}

// تصدير نسخة واحدة
export const dynamicContentBuilder = new DynamicContentBuilder();
