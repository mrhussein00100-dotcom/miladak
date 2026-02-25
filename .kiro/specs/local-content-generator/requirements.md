# Requirements Document

## Introduction

نظام توليد محتوى شامل ومستقر يتفوق على Gemini و Groq في جودة المحتوى العربي. يعتمد على محرك محلي متطور مع قوالب ديناميكية غير محدودة، ويستخدم جدول الكلمات المفتاحية في قاعدة البيانات للتنوع والدقة. يحل مشكلة الفشل المتكرر والمحتوى الفقير والصور المكررة.

## Glossary

- **Unified_Generator**: نظام التوليد الموحد الذي يدير جميع مصادر التوليد
- **Local_Engine**: محرك التوليد المحلي المتطور (أفضل من Gemini/Groq للعربية)
- **API_Engine**: محرك التوليد الخارجي (Gemini, Groq) كخيار إضافي
- **Dynamic_Template_System**: نظام القوالب الديناميكية غير المحدودة
- **Keywords_Database**: جدول الكلمات المفتاحية في قاعدة البيانات
- **Image_Manager**: مدير الصور الذكي (لا تكرار + صلة بالموضوع)
- **Auto_Publisher**: نظام النشر التلقائي للمقالات
- **Quality_Gate**: بوابة الجودة للتحقق من اكتمال المحتوى

## Requirements

### Requirement 1: نظام توليد محلي متفوق

**User Story:** كمستخدم، أريد نظام توليد محلي أفضل من Gemini و Groq في جودة المحتوى العربي، حتى أحصل على مقالات غنية ومتنوعة.

#### Acceptance Criteria

1. THE Local_Engine SHALL produce richer Arabic content than Gemini and Groq
2. THE Local_Engine SHALL use Dynamic_Template_System for unlimited variations
3. THE Local_Engine SHALL use Keywords_Database for topic-specific content
4. THE Local_Engine SHALL never produce poor or repetitive content
5. THE Local_Engine SHALL complete generation in less than 2 seconds
6. THE Local_Engine SHALL never fail regardless of network conditions
7. WHEN user selects Gemini or Groq, THE Unified_Generator SHALL use them as optional providers
8. WHEN external API fails, THE Unified_Generator SHALL automatically fallback to Local_Engine

### Requirement 2: أطوال المقالات المتعددة (مكتملة وغير مقطوعة)

**User Story:** كمستخدم، أريد توليد مقالات بأطوال مختلفة (1000، 3000، 5000 كلمة) مكتملة وغير مقطوعة، حتى تكون جاهزة للنشر.

#### Acceptance Criteria

1. THE Local_Engine SHALL generate short articles with 800-1200 words (complete)
2. THE Local_Engine SHALL generate medium articles with 2000-3000 words (complete)
3. THE Local_Engine SHALL generate long articles with 3500-4500 words (complete)
4. THE Local_Engine SHALL generate comprehensive articles with 5000-6000 words (complete)
5. THE Local_Engine SHALL NEVER produce truncated or incomplete articles
6. THE Local_Engine SHALL scale all sections proportionally to article length
7. THE Quality_Gate SHALL verify article completeness before returning
8. WHEN article is incomplete, THE Local_Engine SHALL add more content until complete

### Requirement 3: الصور التلقائية الدقيقة (بدون تكرار)

**User Story:** كمستخدم، أريد صور تلقائية مرتبطة بالموضوع بدقة ولا تتكرر من مقال لآخر، حتى تكون المقالات فريدة وجذابة.

#### Acceptance Criteria

1. THE Image_Manager SHALL use Keywords_Database for accurate image search
2. THE Image_Manager SHALL translate Arabic keywords to English using Keywords_Database
3. THE Image_Manager SHALL NEVER repeat images across different articles
4. THE Image_Manager SHALL track all used images in database to prevent repetition
5. THE Image_Manager SHALL search Pexels API with topic-specific keywords
6. THE Image_Manager SHALL search Unsplash API as backup source
7. THE Image_Manager SHALL score images by relevance to topic before selection
8. THE Image_Manager SHALL add featured image that matches article topic exactly
9. THE Image_Manager SHALL add 3-5 inline images based on article length
10. WHEN no relevant images found, THE Image_Manager SHALL use category-specific fallback images

### Requirement 4: إضافة الصور اليدوية

**User Story:** كمستخدم، أريد إمكانية إضافة صور يدوياً، حتى أتحكم في محتوى المقال.

#### Acceptance Criteria

1. THE Image_Manager SHALL support manual image upload
2. THE Image_Manager SHALL support image URL input
3. THE Image_Manager SHALL support image search and selection from Pexels/Unsplash
4. WHEN user selects image manually, THE Image_Manager SHALL use it as featured image
5. THE Image_Manager SHALL allow replacing auto-generated images
6. THE Image_Manager SHALL validate image URLs before saving

### Requirement 5: نظام القوالب الديناميكية (غير محدود)

**User Story:** كمستخدم، أريد محتوى متنوع وغير مكرر أبداً، حتى تكون كل مقالة فريدة.

#### Acceptance Criteria

1. THE Dynamic_Template_System SHALL generate unlimited template variations
2. THE Dynamic_Template_System SHALL use Keywords_Database for topic-specific phrases
3. THE Dynamic_Template_System SHALL combine multiple template parts dynamically
4. THE Dynamic_Template_System SHALL randomize sentence structures
5. THE Dynamic_Template_System SHALL use synonyms and alternative phrases
6. THE Dynamic_Template_System SHALL track used combinations to prevent repetition
7. WHEN generating content, THE Local_Engine SHALL NEVER use the same template twice
8. THE Dynamic_Template_System SHALL support 1000+ unique intro variations
9. THE Dynamic_Template_System SHALL support 5000+ unique paragraph variations
10. THE Dynamic_Template_System SHALL support 1000+ unique conclusion variations

### Requirement 6: محتوى عربي مكتمل ومتناسب

**User Story:** كمستخدم، أريد محتوى عربي مكتمل بجميع أقسامه ومتناسب مع حجم المقال، حتى يكون جاهزاً للنشر.

#### Acceptance Criteria

1. THE Local_Engine SHALL produce grammatically correct Arabic content
2. THE Local_Engine SHALL include proper HTML structure (h2, h3, p, ul, ol, strong)
3. THE Local_Engine SHALL generate introduction proportional to article length
4. THE Local_Engine SHALL generate main sections proportional to article length (4-15 sections)
5. THE Local_Engine SHALL generate FAQ section proportional to article length (3-10 questions)
6. THE Local_Engine SHALL generate conclusion proportional to article length
7. THE Quality_Gate SHALL validate all sections are present and complete
8. WHEN any section is missing, THE Local_Engine SHALL add it before returning

### Requirement 7: دعم أنواع المحتوى المختلفة (من قاعدة البيانات)

**User Story:** كمستخدم، أريد توليد محتوى لمواضيع مختلفة باستخدام الكلمات المفتاحية من قاعدة البيانات، حتى يكون المحتوى دقيقاً ومتخصصاً.

#### Acceptance Criteria

1. THE Local_Engine SHALL detect content category from topic text
2. THE Local_Engine SHALL load category-specific keywords from Keywords_Database
3. THE Local_Engine SHALL support birthday content with greetings, gift ideas, and celebrations
4. THE Local_Engine SHALL support zodiac content with traits, compatibility, and predictions
5. THE Local_Engine SHALL support health content with tips, facts, and advice
6. THE Local_Engine SHALL support pregnancy content with week-by-week information
7. THE Local_Engine SHALL support age calculator content with milestones
8. THE Local_Engine SHALL support general content for any topic
9. WHEN category is detected, THE Local_Engine SHALL use Keywords_Database for that category

### Requirement 8: عناوين مطابقة للسيو

**User Story:** كمستخدم، أريد عناوين محسنة للسيو وجذابة، حتى تحصل المقالات على ترتيب أفضل في محركات البحث.

#### Acceptance Criteria

1. THE Local_Engine SHALL generate SEO-optimized title (50-70 characters)
2. THE Local_Engine SHALL include focus keyword in title
3. THE Local_Engine SHALL make title attractive and click-worthy
4. THE Local_Engine SHALL generate meta description (150-160 characters)
5. THE Local_Engine SHALL generate 10-15 relevant keywords from Keywords_Database
6. THE Local_Engine SHALL ensure Arabic language SEO optimization
7. THE Local_Engine SHALL vary title structures to avoid repetition

### Requirement 9: النشر التلقائي

**User Story:** كمستخدم، أريد نشر مقالات تلقائياً بجدول زمني، حتى يبقى الموقع نشطاً.

#### Acceptance Criteria

1. THE Auto_Publisher SHALL support scheduled publishing (daily/weekly)
2. THE Auto_Publisher SHALL use Unified_Generator for content creation
3. THE Auto_Publisher SHALL automatically add non-repeating images
4. THE Auto_Publisher SHALL log all publish attempts (success/failure)
5. WHEN publish fails, THE Auto_Publisher SHALL retry with Local_Engine
6. THE Auto_Publisher SHALL support topic rotation from Keywords_Database

### Requirement 10: التوافق مع النظام الحالي

**User Story:** كمستخدم، أريد أن يعمل النظام الجديد مع جميع الوظائف الحالية، حتى لا أفقد أي ميزة.

#### Acceptance Criteria

1. THE Unified_Generator SHALL maintain the same response interface as current system
2. THE Unified_Generator SHALL work with existing admin panel
3. THE Unified_Generator SHALL work with existing auto-publish system
4. THE Unified_Generator SHALL work with existing article editor
5. THE Unified_Generator SHALL support all current content lengths
6. WHEN replacing old system, THE Unified_Generator SHALL not break any existing functionality
7. THE Unified_Generator SHALL not modify or delete any existing database data
