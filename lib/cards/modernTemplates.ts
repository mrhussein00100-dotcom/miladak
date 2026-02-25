// Modern Card Templates - مجموعة شاملة من القوالب الحديثة

export interface CardTemplate {
  id: string;
  name: string;
  category: string;
  preview: string;
  style: {
    background: string;
    textColor: string;
    accentColor: string;
    pattern?: string;
  };
}

export const MODERN_CARD_TEMPLATES: CardTemplate[] = [
  // Modern Category - عصري
  {
    id: 'gradient-sunset',
    name: 'غروب ذهبي',
    category: 'modern',
    preview: '🌅',
    style: {
      background:
        'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
      textColor: '#1a202c',
      accentColor: '#c53030',
    },
  },
  {
    id: 'ocean-breeze',
    name: 'نسيم البحر',
    category: 'modern',
    preview: '🌊',
    style: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      textColor: '#ffffff',
      accentColor: '#ffd700',
    },
  },
  {
    id: 'neon-glow',
    name: 'توهج نيون',
    category: 'modern',
    preview: '💫',
    style: {
      background:
        'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
      textColor: '#ffffff',
      accentColor: '#00ffff',
    },
  },
  {
    id: 'aurora-lights',
    name: 'أضواء الشفق',
    category: 'modern',
    preview: '🌌',
    style: {
      background:
        'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      textColor: '#ffffff',
      accentColor: '#ffd700',
    },
  },
  {
    id: 'cyber-punk',
    name: 'سايبر بانك',
    category: 'modern',
    preview: '🤖',
    style: {
      background:
        'linear-gradient(135deg, #0f3460 0%, #e94560 50%, #f27121 100%)',
      textColor: '#ffffff',
      accentColor: '#00ff41',
    },
  },

  // Elegant Category - أنيق
  {
    id: 'royal-purple',
    name: 'بنفسجي ملكي',
    category: 'elegant',
    preview: '👑',
    style: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      textColor: '#ffffff',
      accentColor: '#ffd700',
    },
  },
  {
    id: 'midnight-stars',
    name: 'نجوم منتصف الليل',
    category: 'elegant',
    preview: '⭐',
    style: {
      background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
      textColor: '#ffffff',
      accentColor: '#f39c12',
    },
  },
  {
    id: 'golden-luxury',
    name: 'ذهبي فاخر',
    category: 'elegant',
    preview: '✨',
    style: {
      background: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)',
      textColor: '#2d3748',
      accentColor: '#8b4513',
    },
  },
  {
    id: 'silver-elegance',
    name: 'أناقة فضية',
    category: 'elegant',
    preview: '💎',
    style: {
      background: 'linear-gradient(135deg, #bdc3c7 0%, #2c3e50 100%)',
      textColor: '#ffffff',
      accentColor: '#e74c3c',
    },
  },
  {
    id: 'rose-gold',
    name: 'ذهب وردي',
    category: 'elegant',
    preview: '🌹',
    style: {
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      textColor: '#ffffff',
      accentColor: '#ffd700',
    },
  },

  // Nature Category - طبيعي
  {
    id: 'spring-garden',
    name: 'حديقة الربيع',
    category: 'nature',
    preview: '🌸',
    style: {
      background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      textColor: '#2d3748',
      accentColor: '#48bb78',
    },
  },
  {
    id: 'forest-green',
    name: 'أخضر الغابة',
    category: 'nature',
    preview: '🌲',
    style: {
      background: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)',
      textColor: '#ffffff',
      accentColor: '#ffd700',
    },
  },
  {
    id: 'sunset-beach',
    name: 'شاطئ الغروب',
    category: 'nature',
    preview: '🏖️',
    style: {
      background: 'linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)',
      textColor: '#2d3748',
      accentColor: '#e74c3c',
    },
  },
  {
    id: 'mountain-mist',
    name: 'ضباب الجبال',
    category: 'nature',
    preview: '🏔️',
    style: {
      background: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
      textColor: '#2d3748',
      accentColor: '#4a90e2',
    },
  },
  {
    id: 'autumn-leaves',
    name: 'أوراق الخريف',
    category: 'nature',
    preview: '🍂',
    style: {
      background:
        'linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #4facfe 100%)',
      textColor: '#ffffff',
      accentColor: '#ffd700',
    },
  },

  // Playful Category - مرح
  {
    id: 'candy-pop',
    name: 'حلوى ملونة',
    category: 'playful',
    preview: '🍭',
    style: {
      background: 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)',
      textColor: '#2d3748',
      accentColor: '#e53e3e',
    },
  },
  {
    id: 'rainbow-burst',
    name: 'انفجار قوس قزح',
    category: 'playful',
    preview: '🌈',
    style: {
      background:
        'linear-gradient(135deg, #ff0080 0%, #ff8c00 25%, #40e0d0 50%, #ee82ee 75%, #98fb98 100%)',
      textColor: '#ffffff',
      accentColor: '#ffd700',
    },
  },
  {
    id: 'bubble-gum',
    name: 'علكة الفقاعات',
    category: 'playful',
    preview: '🫧',
    style: {
      background:
        'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
      textColor: '#2d3748',
      accentColor: '#ff1493',
    },
  },
  {
    id: 'party-time',
    name: 'وقت الحفلة',
    category: 'playful',
    preview: '🎊',
    style: {
      background:
        'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)',
      textColor: '#ffffff',
      accentColor: '#ffd700',
    },
  },
  {
    id: 'cotton-candy',
    name: 'غزل البنات',
    category: 'playful',
    preview: '🍥',
    style: {
      background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
      textColor: '#2d3748',
      accentColor: '#ff6b6b',
    },
  },

  // Classic Category - كلاسيكي
  {
    id: 'vintage-cream',
    name: 'كريمي عتيق',
    category: 'classic',
    preview: '📜',
    style: {
      background: 'linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%)',
      textColor: '#2d3748',
      accentColor: '#6c5ce7',
    },
  },
  {
    id: 'classic-blue',
    name: 'أزرق كلاسيكي',
    category: 'classic',
    preview: '🎩',
    style: {
      background: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
      textColor: '#ffffff',
      accentColor: '#ffd700',
    },
  },
  {
    id: 'burgundy-wine',
    name: 'نبيذ بورجوندي',
    category: 'classic',
    preview: '🍷',
    style: {
      background: 'linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)',
      textColor: '#ffffff',
      accentColor: '#ffd700',
    },
  },
  {
    id: 'emerald-green',
    name: 'أخضر زمردي',
    category: 'classic',
    preview: '💚',
    style: {
      background: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)',
      textColor: '#ffffff',
      accentColor: '#ffd700',
    },
  },
  {
    id: 'charcoal-gray',
    name: 'رمادي فحمي',
    category: 'classic',
    preview: '🖤',
    style: {
      background: 'linear-gradient(135deg, #636e72 0%, #2d3436 100%)',
      textColor: '#ffffff',
      accentColor: '#00cec9',
    },
  },
];

export const TEMPLATE_CATEGORIES = [
  { id: 'all', name: 'الكل', icon: '🎨' },
  { id: 'modern', name: 'عصري', icon: '✨' },
  { id: 'elegant', name: 'أنيق', icon: '👑' },
  { id: 'nature', name: 'طبيعي', icon: '🌿' },
  { id: 'playful', name: 'مرح', icon: '🎉' },
  { id: 'classic', name: 'كلاسيكي', icon: '🎭' },
];

export const GREETING_MESSAGES = [
  'كل عام وأنت بخير',
  'عيد ميلاد سعيد',
  'أجمل التهاني بمناسبة عيد ميلادك',
  'بارك الله في عمرك',
  'عقبال مائة سنة',
  'كل سنة وأنت طيب',
  'أسعد الله أيامك',
  'عيد ميلاد مبارك',
  'تهانينا الحارة بعيد ميلادك',
  'أطال الله في عمرك',
];

export const BIRTHDAY_MESSAGES = [
  'أتمنى لك عاماً مليئاً بالفرح والسعادة',
  'كل عام وأنت أقرب إلى قلبي',
  'أدام الله عليك الصحة والعافية',
  'عسى أن تحقق كل أحلامك في العام الجديد',
  'أتمنى أن يكون هذا العام الأجمل في حياتك',
  'بارك الله لك في عامك الجديد',
  'أسأل الله أن يسعدك في دنياك وآخرتك',
  'عسى كل يوم في حياتك يكون أجمل من الذي قبله',
  'أتمنى لك السعادة والنجاح في كل خطوة',
  'كل عام وأنت بألف خير وسعادة',
  'أدعو الله أن يحفظك ويرعاك',
  'عسى الله أن يبارك في عمرك ويسعدك',
  'أتمنى أن تكون كل أيامك مليئة بالبهجة',
  'كل سنة وأنت أحلى وأغلى',
  'أسأل الله أن يجعل عامك الجديد مليئاً بالخير',
];

export const SIGNATURE_OPTIONS = [
  'مع حبي وتقديري',
  'بكل الحب',
  'من القلب',
  'مع أطيب التمنيات',
  'بأجمل التهاني',
  'مع خالص المحبة',
  'بكل الود',
  'مع أصدق المشاعر',
  'بحب كبير',
  'مع أعذب التهاني',
];
