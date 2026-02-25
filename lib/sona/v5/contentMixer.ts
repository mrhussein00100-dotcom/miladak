/**
 * SONA v5 - Content Mixer
 * خلاط المحتوى الذكي
 *
 * يمزج ويعيد ترتيب المحتوى لإنتاج نصوص فريدة في كل مرة
 */

import { SentenceComposer, sentenceComposer } from './sentenceComposer';
import {
  getRandomPhrase,
  getRandomTransition,
  getRandomConclusion,
  getRandomDescriptive,
  getRandomLinking,
  MASSIVE_INTROS,
  MASSIVE_TRANSITIONS,
  MASSIVE_CONCLUSIONS,
  DESCRIPTIVE_SENTENCES,
} from './massivePhraseBank';

// ============================================
// أنواع البيانات
// ============================================

export interface ContentBlock {
  type: 'intro' | 'section' | 'list' | 'tips' | 'facts' | 'conclusion';
  title?: string;
  content: string;
  priority: number;
}

export interface MixerConfig {
  topic: string;
  category: 'birthday' | 'zodiac' | 'health' | 'dates' | 'general';
  style: 'formal' | 'casual' | 'educational' | 'analytical';
  length: 'short' | 'medium' | 'long' | 'comprehensive';
  entities?: {
    names?: string[];
    ages?: number[];
    zodiacSigns?: string[];
  };
}

// ============================================
// قوالب المحتوى حسب الفئة
// ============================================

const CATEGORY_TEMPLATES = {
  birthday: {
    sections: [
      'أجمل التهاني والتبريكات',
      'أفكار هدايا مميزة',
      'نصائح للاحتفال',
      'عبارات تهنئة من القلب',
      'أفكار لحفلة لا تُنسى',
      'كلمات معبرة للمناسبة',
    ],
    facts: [
      'تقليد إطفاء الشموع يعود للإغريق القدماء الذين كانوا يعتقدون أن الدخان يحمل الأمنيات للآلهة.',
      'أقدم كعكة عيد ميلاد معروفة كانت في ألمانيا في القرن الخامس عشر.',
      'يُحتفل بحوالي 18 مليون عيد ميلاد يومياً حول العالم.',
      'أغنية "عيد ميلاد سعيد" من أكثر الأغاني شهرة في العالم.',
      'في بعض الثقافات، يُعتقد أن الاحتفال بعيد الميلاد يجلب الحظ السعيد.',
    ],
    tips: [
      'اختر هدية تناسب اهتمامات الشخص المحتفى به.',
      'خطط للحفلة مسبقاً لضمان نجاحها.',
      'أضف لمسة شخصية للتهنئة لتكون أكثر تأثيراً.',
      'لا تنسَ التقاط الصور لتوثيق اللحظات السعيدة.',
      'اجعل الاحتفال مفاجأة إن أمكن لإضافة عنصر المفاجأة.',
    ],
  },

  zodiac: {
    sections: [
      'صفات البرج وخصائصه',
      'نقاط القوة والضعف',
      'التوافق مع الأبراج الأخرى',
      'نصائح مهمة لمواليد البرج',
      'مشاهير من هذا البرج',
      'الحجر الكريم واللون المناسب',
    ],
    facts: [
      'الأبراج الفلكية 12 برجاً تمثل مسار الشمس خلال السنة.',
      'كل برج يمتد لحوالي 30 يوماً تقريباً.',
      'الأبراج تنقسم إلى 4 عناصر: النار، التراب، الهواء، الماء.',
      'علم الأبراج من أقدم العلوم التي اهتم بها الإنسان.',
      'كل برج له كوكب حاكم يؤثر على صفات مواليده.',
    ],
    tips: [
      'تعرف على صفات برجك لفهم نفسك بشكل أفضل.',
      'استخدم معرفتك بالأبراج لتحسين علاقاتك.',
      'لا تجعل الأبراج تحدد مصيرك، فأنت صانع قراراتك.',
      'اكتشف توافقك مع الآخرين لعلاقات أفضل.',
      'تذكر أن الأبراج توجيهات عامة وليست قواعد صارمة.',
    ],
  },

  health: {
    sections: [
      'معلومات صحية مهمة',
      'نصائح للحفاظ على الصحة',
      'عادات صحية يومية',
      'أخطاء شائعة يجب تجنبها',
      'متى يجب استشارة الطبيب',
    ],
    facts: [
      'الجسم البشري يحتوي على حوالي 206 عظمة.',
      'القلب ينبض حوالي 100,000 مرة يومياً.',
      'الدماغ يستهلك حوالي 20% من طاقة الجسم.',
      'النوم الكافي ضروري لصحة الجسم والعقل.',
      'شرب الماء بكميات كافية يحسن وظائف الجسم.',
    ],
    tips: [
      'مارس الرياضة بانتظام للحفاظ على لياقتك.',
      'تناول غذاءً متوازناً غنياً بالفيتامينات.',
      'احصل على قسط كافٍ من النوم يومياً.',
      'قلل من التوتر والضغوط النفسية.',
      'أجرِ فحوصات طبية دورية.',
    ],
  },

  dates: {
    sections: [
      'كيفية تحويل التاريخ',
      'الفرق بين التقويمات',
      'حساب الأيام والفترات',
      'معلومات عن التقويم الهجري',
      'معلومات عن التقويم الميلادي',
    ],
    facts: [
      'التقويم الميلادي يعتمد على دورة الشمس.',
      'التقويم الهجري يعتمد على دورة القمر.',
      'الفرق بين السنة الميلادية والهجرية حوالي 11 يوماً.',
      'السنة الكبيسة تحدث كل 4 سنوات في التقويم الميلادي.',
      'الأشهر الهجرية تتراوح بين 29 و30 يوماً.',
    ],
    tips: [
      'استخدم أدوات التحويل الموثوقة للدقة.',
      'تأكد من صحة التاريخ قبل الاعتماد عليه.',
      'احفظ التواريخ المهمة في تقويمك.',
      'تعلم الفرق بين التقويمات المختلفة.',
      'استخدم التطبيقات الذكية لتتبع التواريخ.',
    ],
  },

  general: {
    sections: [
      'معلومات أساسية',
      'نصائح مفيدة',
      'حقائق مثيرة',
      'أسئلة شائعة',
      'خلاصة وتوصيات',
    ],
    facts: [
      'المعرفة قوة، والتعلم المستمر مفتاح النجاح.',
      'التخطيط الجيد نصف النجاح.',
      'الممارسة تصنع الإتقان.',
      'الصبر مفتاح الفرج.',
      'العلم نور والجهل ظلام.',
    ],
    tips: [
      'ابحث دائماً عن مصادر موثوقة للمعلومات.',
      'شارك معرفتك مع الآخرين.',
      'استمر في التعلم والتطور.',
      'طبق ما تتعلمه في حياتك العملية.',
      'كن منفتحاً على الأفكار الجديدة.',
    ],
  },
};

// ============================================
// فئة خلاط المحتوى
// ============================================

export class ContentMixer {
  private composer: SentenceComposer;
  private usedSections: Set<string> = new Set();
  private usedFacts: Set<string> = new Set();
  private usedTips: Set<string> = new Set();

  constructor() {
    this.composer = sentenceComposer;
  }

  /**
   * خلط وتوليد محتوى جديد
   */
  mix(config: MixerConfig): ContentBlock[] {
    const blocks: ContentBlock[] = [];
    const templates =
      CATEGORY_TEMPLATES[config.category] || CATEGORY_TEMPLATES.general;

    // 1. المقدمة
    blocks.push(this.generateIntro(config));

    // 2. الأقسام الرئيسية
    const sectionCount = this.getSectionCount(config.length);
    const shuffledSections = this.shuffleArray([...templates.sections]);

    for (let i = 0; i < Math.min(sectionCount, shuffledSections.length); i++) {
      blocks.push(this.generateSection(shuffledSections[i], config, i));
    }

    // 3. قسم الحقائق
    if (config.length !== 'short') {
      blocks.push(this.generateFactsSection(templates.facts, config));
    }

    // 4. قسم النصائح
    blocks.push(this.generateTipsSection(templates.tips, config));

    // 5. الخاتمة
    blocks.push(this.generateConclusion(config));

    return blocks;
  }

  /**
   * توليد المقدمة
   */
  private generateIntro(config: MixerConfig): ContentBlock {
    const { topic, category, style, entities } = config;
    let introText = '';

    // اختيار نوع المقدمة حسب الأسلوب
    const introType = this.mapStyleToIntroType(style);
    introText = getRandomPhrase(
      introType as keyof typeof MASSIVE_INTROS,
      topic
    );

    // تخصيص المقدمة حسب الكيانات
    if (category === 'birthday' && entities?.names?.[0]) {
      const name = entities.names[0];
      const age = entities.ages?.[0];

      if (age) {
        introText = `نحتفل اليوم بمناسبة عيد ميلاد <strong>${name}</strong> الذي يبلغ من العمر <strong>${age} عاماً</strong>! ${introText}`;
      } else {
        introText = `نحتفل اليوم بعيد ميلاد <strong>${name}</strong>! ${introText}`;
      }
    } else if (category === 'zodiac' && entities?.zodiacSigns?.[0]) {
      const sign = entities.zodiacSigns[0];
      introText = `برج <strong>${sign}</strong> من الأبراج المميزة. ${introText}`;
    }

    // إضافة جملة تمهيدية
    const preview = this.generateContentPreview(category);
    introText += ` ${preview}`;

    return {
      type: 'intro',
      title: 'مقدمة',
      content: `<h2>مقدمة</h2>\n<p>${introText}</p>`,
      priority: 100,
    };
  }

  /**
   * توليد قسم
   */
  private generateSection(
    sectionTitle: string,
    config: MixerConfig,
    index: number
  ): ContentBlock {
    const paragraphs: string[] = [];
    const paragraphCount =
      config.length === 'short' ? 2 : config.length === 'medium' ? 3 : 4;

    // فقرة افتتاحية
    const opener = this.composer.compose(sectionTitle, 'statement', {
      addDescriptor: true,
    });
    paragraphs.push(opener);

    // فقرات المحتوى
    for (let i = 1; i < paragraphCount; i++) {
      const transition = getRandomTransition();
      const descriptive = getRandomDescriptive('importance');
      paragraphs.push(`${transition} ${descriptive}`);
    }

    // تخصيص حسب الفئة
    const customContent = this.generateCategorySpecificContent(
      sectionTitle,
      config
    );
    if (customContent) {
      paragraphs.push(customContent);
    }

    const content = `<h2>${sectionTitle}</h2>\n${paragraphs
      .map((p) => `<p>${p}</p>`)
      .join('\n')}`;

    return {
      type: 'section',
      title: sectionTitle,
      content,
      priority: 90 - index * 5,
    };
  }

  /**
   * توليد قسم الحقائق
   */
  private generateFactsSection(
    facts: string[],
    config: MixerConfig
  ): ContentBlock {
    const shuffledFacts = this.shuffleArray([...facts]);
    const selectedFacts = shuffledFacts.slice(0, 5);

    const transition = getRandomTransition();
    const content = `<h2>حقائق مثيرة</h2>
<p>${transition} إليكم بعض الحقائق المثيرة للاهتمام:</p>
<ul>
${selectedFacts.map((f) => `<li>${f}</li>`).join('\n')}
</ul>`;

    return {
      type: 'facts',
      title: 'حقائق مثيرة',
      content,
      priority: 70,
    };
  }

  /**
   * توليد قسم النصائح
   */
  private generateTipsSection(
    tips: string[],
    config: MixerConfig
  ): ContentBlock {
    const shuffledTips = this.shuffleArray([...tips]);
    const selectedTips = shuffledTips.slice(0, 5);

    const transition = getRandomTransition();
    const content = `<h2>نصائح مهمة</h2>
<p>${transition} إليكم أهم النصائح:</p>
<ul>
${selectedTips.map((t) => `<li>${t}</li>`).join('\n')}
</ul>`;

    return {
      type: 'tips',
      title: 'نصائح مهمة',
      content,
      priority: 75,
    };
  }

  /**
   * توليد الخاتمة
   */
  private generateConclusion(config: MixerConfig): ContentBlock {
    const { topic, category, entities } = config;
    let conclusionText = '';

    // خاتمة مخصصة حسب الفئة
    if (category === 'birthday' && entities?.names?.[0]) {
      const name = entities.names[0];
      conclusionText = `في الختام، نتمنى لـ<strong>${name}</strong> عيد ميلاد سعيد وعاماً جديداً مليئاً بالسعادة والنجاح والصحة.`;
    } else if (category === 'zodiac' && entities?.zodiacSigns?.[0]) {
      const sign = entities.zodiacSigns[0];
      conclusionText = `هذا كل ما تحتاج معرفته عن برج <strong>${sign}</strong>. نأمل أن تكون هذه المعلومات قد أفادتك.`;
    } else {
      conclusionText = getRandomConclusion('summary');
    }

    // إضافة دعوة للعمل
    const cta = getRandomConclusion('callToAction');
    conclusionText += ` ${cta}`;

    return {
      type: 'conclusion',
      title: 'الخاتمة',
      content: `<h2>الخاتمة</h2>\n<p>${conclusionText}</p>`,
      priority: 40,
    };
  }

  /**
   * توليد محتوى مخصص حسب الفئة
   */
  private generateCategorySpecificContent(
    sectionTitle: string,
    config: MixerConfig
  ): string | null {
    const { category, entities } = config;

    if (category === 'birthday' && sectionTitle.includes('تهاني')) {
      const greetings = [
        'كل عام وأنت بخير وسعادة!',
        'عيد ميلاد سعيد مليء بالفرح!',
        'أتمنى لك عاماً مليئاً بالنجاح!',
        'دمت بصحة وعافية وسعادة!',
        'عام جديد مليء بالأمل والتفاؤل!',
      ];
      const shuffled = this.shuffleArray(greetings);
      return `<ul>${shuffled
        .slice(0, 3)
        .map((g) => `<li>${g}</li>`)
        .join('\n')}</ul>`;
    }

    if (category === 'zodiac' && entities?.zodiacSigns?.[0]) {
      const sign = entities.zodiacSigns[0];
      if (sectionTitle.includes('صفات')) {
        return `<p>يتميز مواليد برج ${sign} بشخصية فريدة ومميزة تجعلهم محبوبين من الجميع.</p>`;
      }
    }

    return null;
  }

  /**
   * توليد معاينة المحتوى
   */
  private generateContentPreview(category: string): string {
    const previews: Record<string, string[]> = {
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

    const categoryPreviews = previews[category] || previews.general;
    return categoryPreviews[
      Math.floor(Math.random() * categoryPreviews.length)
    ];
  }

  /**
   * تحويل الأسلوب لنوع المقدمة
   */
  private mapStyleToIntroType(style: string): string {
    const mapping: Record<string, string> = {
      formal: 'informative',
      casual: 'storytelling',
      educational: 'educational',
      analytical: 'analytical',
    };
    return mapping[style] || 'informative';
  }

  /**
   * الحصول على عدد الأقسام حسب الطول
   */
  private getSectionCount(length: string): number {
    const counts: Record<string, number> = {
      short: 2,
      medium: 3,
      long: 5,
      comprehensive: 7,
    };
    return counts[length] || 3;
  }

  /**
   * خلط المصفوفة
   */
  private shuffleArray<T>(arr: T[]): T[] {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * إعادة تعيين الحالة
   */
  reset(): void {
    this.usedSections.clear();
    this.usedFacts.clear();
    this.usedTips.clear();
    this.composer.reset();
  }
}

// نسخة جاهزة للاستخدام
export const contentMixer = new ContentMixer();
