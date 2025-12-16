# Requirements Document

## Introduction

نظام إدارة المقالات والتصنيفات المتكامل للوحة تحكم موقع ميلادك. يوفر هذا النظام إدارة شاملة للمقالات مع دعم الذكاء الاصطناعي لتوليد المحتوى وإعادة صياغته، وتوليد الصور والكلمات المفتاحية والميتا تاج تلقائياً. يتضمن أيضاً نظام توليد مقالات يومي تلقائي.

## Glossary

- **Admin_Panel**: لوحة التحكم الرئيسية لإدارة الموقع
- **Article_Manager**: نظام إدارة المقالات الشامل
- **Category_Manager**: نظام إدارة التصنيفات
- **AI_Generator**: محرك الذكاء الاصطناعي لتوليد المحتوى (Gemini API)
- **Auto_Publisher**: نظام النشر التلقائي اليومي
- **SEO_Analyzer**: محلل تحسين محركات البحث
- **Rich_Editor**: محرر النصوص الغني
- **Image_Generator**: مولد الصور بالذكاء الاصطناعي

## Requirements

### Requirement 1: إدارة المقالات الأساسية

**User Story:** كمدير محتوى، أريد إدارة المقالات بشكل كامل (إضافة، تعديل، حذف، عرض)، حتى أتمكن من التحكم في محتوى الموقع بسهولة.

#### Acceptance Criteria

1. WHEN the admin visits "/admin/articles" THEN THE Article_Manager SHALL display a paginated list of all articles with title, category, status, date, and views count
2. WHEN the admin clicks "إضافة مقال جديد" THEN THE Article_Manager SHALL navigate to "/admin/articles/new" with an empty article form
3. WHEN the admin clicks edit on an article THEN THE Article_Manager SHALL navigate to "/admin/articles/[id]" with pre-filled article data
4. WHEN the admin deletes an article THEN THE Article_Manager SHALL display a confirmation dialog and move the article to trash upon confirmation
5. WHEN the admin searches articles THEN THE Article_Manager SHALL filter results by title, content, or category in real-time
6. WHEN the admin filters by status THEN THE Article_Manager SHALL show only articles matching the selected status (published, draft, scheduled, trash)

### Requirement 2: محرر المقالات المتقدم

**User Story:** كمدير محتوى، أريد محرر نصوص غني ومتقدم، حتى أتمكن من إنشاء مقالات جذابة ومنسقة بشكل احترافي.

#### Acceptance Criteria

1. WHEN the admin creates or edits an article THEN THE Rich_Editor SHALL provide formatting tools including bold, italic, headings (H1-H6), lists, links, and quotes
2. WHEN the admin uploads an image THEN THE Rich_Editor SHALL accept images up to 5MB and display them inline with resize options
3. WHEN the admin types content THEN THE Rich_Editor SHALL auto-save drafts every 30 seconds to prevent data loss
4. WHEN the admin clicks preview THEN THE Rich_Editor SHALL display the article as it will appear on the public site
5. WHEN the admin adds a featured image THEN THE Article_Manager SHALL display image upload with crop and optimization options

### Requirement 3: توليد المحتوى بالذكاء الاصطناعي (مولدات متعددة)

**User Story:** كمدير محتوى، أريد استخدام مولدات ذكاء اصطناعي متعددة لتوليد مقالات طويلة (5000+ كلمة)، حتى أحصل على محتوى شامل وعالي الجودة.

#### Acceptance Criteria

1. WHEN the admin clicks "توليد مقال بالذكاء الاصطناعي" THEN THE AI_Generator SHALL display provider selection with: Gemini (مجاني), OpenAI GPT, Claude, Cohere (مجاني), HuggingFace (مجاني), Local_AI (مولد محلي مخصص)
2. WHEN the admin selects content length THEN THE AI_Generator SHALL support options: قصير (500 كلمة), متوسط (1500 كلمة), طويل (3000 كلمة), شامل (5000+ كلمة)
3. WHEN generating long content (3000+ words) THEN THE AI_Generator SHALL split generation into sections and combine them seamlessly
4. WHEN the admin submits AI generation request THEN THE AI_Generator SHALL generate content in Arabic with proper grammar and context
5. WHEN the admin selects text and clicks "إعادة صياغة" THEN THE AI_Generator SHALL offer multiple rewriting styles: formal, casual, SEO-optimized, simplified
6. WHEN the admin clicks "تحسين المحتوى" THEN THE AI_Generator SHALL enhance grammar, style, readability, and SEO optimization
7. WHEN the admin clicks "توليد عنوان" THEN THE AI_Generator SHALL suggest 10 SEO-optimized Arabic title variations
8. WHEN AI generation fails with one provider THEN THE AI_Generator SHALL automatically fallback to the next available provider
9. WHEN using Local_AI THEN THE AI_Generator SHALL use a custom-built template-based generator optimized for Arabic birthday content

### Requirement 3.1: المولد المحلي المخصص (Local AI Generator)

**User Story:** كمدير موقع، أريد مولد محتوى محلي لا يعتمد على APIs خارجية، حتى أضمن استمرارية التوليد حتى عند انقطاع الخدمات.

#### Acceptance Criteria

1. WHEN Local_AI is selected THEN THE AI_Generator SHALL use pre-built Arabic content templates specific to birthday and age topics
2. WHEN generating with Local_AI THEN THE AI_Generator SHALL combine templates with dynamic data (dates, ages, zodiac, events) to create unique articles
3. WHEN Local_AI generates content THEN THE AI_Generator SHALL produce articles between 1000-5000 words based on template complexity
4. WHEN Local_AI is used THEN THE AI_Generator SHALL not require any external API calls or internet connection
5. WHEN templates are insufficient THEN THE Admin_Panel SHALL allow adding new content templates through the admin interface

### Requirement 4: توليد الميتا والكلمات المفتاحية تلقائياً

**User Story:** كمدير محتوى، أريد توليد الميتا تاج والكلمات المفتاحية تلقائياً، حتى أحسن ظهور المقالات في محركات البحث.

#### Acceptance Criteria

1. WHEN the admin clicks "توليد ميتا تلقائي" THEN THE SEO_Analyzer SHALL generate meta title (max 60 chars) and meta description (max 160 chars) based on article content
2. WHEN the admin clicks "توليد كلمات مفتاحية" THEN THE AI_Generator SHALL extract and suggest 10-15 relevant keywords from the article
3. WHEN the admin saves an article without meta THEN THE SEO_Analyzer SHALL auto-generate meta tags before saving
4. WHEN the admin views SEO score THEN THE SEO_Analyzer SHALL display a score (0-100) with improvement suggestions
5. WHEN keywords are generated THEN THE Article_Manager SHALL display them as editable tags with add/remove functionality

### Requirement 5: توليد وجلب الصور الذكي

**User Story:** كمدير محتوى، أريد نظام صور ذكي يجلب صور دقيقة ومعبرة عن المحتوى العربي، حتى تكون الصور متوافقة مع موضوع المقال.

#### Acceptance Criteria

1. WHEN the admin clicks "جلب صورة" THEN THE Image_Generator SHALL display options: Pexels API, Unsplash API, Pixabay API, AI Generation
2. WHEN searching for images THEN THE Image_Generator SHALL use Arabic_Translator to convert Arabic keywords to accurate English search terms
3. WHEN Arabic_Translator converts keywords THEN THE Image_Generator SHALL use a comprehensive Arabic-English dictionary with birthday/celebration context
4. WHEN search results are returned THEN THE Image_Generator SHALL rank images by relevance using keyword matching algorithm
5. WHEN the admin enters Arabic search term THEN THE Image_Generator SHALL suggest related English terms for better results
6. WHEN image search fails to find relevant results THEN THE Image_Generator SHALL suggest alternative keywords based on content analysis
7. WHEN the admin selects an image THEN THE Article_Manager SHALL optimize, resize, and set it as featured image with proper alt text
8. WHEN using AI image generation THEN THE Image_Generator SHALL support DALL-E, Stable Diffusion, or Midjourney APIs

### Requirement 5.1: قاموس الترجمة الذكي للصور

**User Story:** كمدير موقع، أريد قاموس ترجمة ذكي للبحث عن الصور، حتى تكون نتائج البحث دقيقة ومعبرة عن المحتوى العربي.

#### Acceptance Criteria

1. WHEN Arabic_Translator initializes THEN THE Image_Generator SHALL load a dictionary with 1000+ birthday/celebration related terms
2. WHEN translating "عيد ميلاد" THEN THE Arabic_Translator SHALL return contextual terms like "birthday celebration", "birthday party", "birthday cake"
3. WHEN translating zodiac terms THEN THE Arabic_Translator SHALL include visual descriptors (e.g., "الحمل" → "aries zodiac symbol ram")
4. WHEN translating age-related terms THEN THE Arabic_Translator SHALL add context (e.g., "طفل" → "happy child birthday")
5. WHEN a term is not in dictionary THEN THE Arabic_Translator SHALL use AI translation with context hints
6. WHEN the admin adds new terms THEN THE Admin_Panel SHALL allow expanding the dictionary through settings

### Requirement 5.2: إعادة الصياغة المتقدمة

**User Story:** كمدير محتوى، أريد إعادة صياغة المحتوى بطرق متعددة ومولدات مختلفة، حتى أحصل على محتوى فريد ومتنوع.

#### Acceptance Criteria

1. WHEN the admin selects text for rewriting THEN THE AI_Generator SHALL offer provider selection: Gemini, OpenAI, Claude, Cohere, Local_Rewriter
2. WHEN rewriting content THEN THE AI_Generator SHALL support styles: formal (رسمي), casual (عامي), SEO-optimized (محسن للسيو), simplified (مبسط), academic (أكاديمي)
3. WHEN rewriting long content (1000+ words) THEN THE AI_Generator SHALL process in chunks while maintaining coherence
4. WHEN Local_Rewriter is used THEN THE AI_Generator SHALL use synonym replacement, sentence restructuring, and Arabic grammar rules
5. WHEN rewriting completes THEN THE AI_Generator SHALL display original and rewritten text side-by-side for comparison
6. WHEN the admin is unsatisfied THEN THE AI_Generator SHALL allow regenerating with different provider or style
7. WHEN rewriting THEN THE AI_Generator SHALL preserve formatting, links, and special characters

### Requirement 6: إدارة التصنيفات

**User Story:** كمدير محتوى، أريد إدارة تصنيفات المقالات بشكل هرمي، حتى أنظم المحتوى بطريقة منطقية وسهلة التصفح.

#### Acceptance Criteria

1. WHEN the admin visits "/admin/categories" THEN THE Category_Manager SHALL display all categories in a tree structure with article counts
2. WHEN the admin creates a category THEN THE Category_Manager SHALL require name, slug, and optionally description, color, icon, and parent category
3. WHEN the admin edits a category THEN THE Category_Manager SHALL allow updating all properties and bulk moving articles
4. WHEN the admin deletes a category with articles THEN THE Category_Manager SHALL require reassigning articles to another category
5. WHEN the admin reorders categories THEN THE Category_Manager SHALL support drag-and-drop reordering
6. WHEN the admin assigns a color to category THEN THE Category_Manager SHALL display a color picker with preset and custom options

### Requirement 7: النشر التلقائي اليومي

**User Story:** كمدير موقع، أريد نظام نشر تلقائي يومي للمقالات، حتى يبقى الموقع نشطاً بمحتوى جديد دون تدخل يدوي.

#### Acceptance Criteria

1. WHEN auto-publish is enabled THEN THE Auto_Publisher SHALL generate and publish one article daily at the configured time
2. WHEN the admin configures auto-publish THEN THE Auto_Publisher SHALL allow setting topics, categories, publish time, and frequency
3. WHEN auto-publish generates an article THEN THE Auto_Publisher SHALL include AI-generated content, meta tags, keywords, and featured image
4. WHEN auto-publish fails THEN THE Auto_Publisher SHALL log the error and retry after 1 hour (max 3 retries)
5. WHEN the admin views auto-publish history THEN THE Auto_Publisher SHALL display last 30 days of auto-published articles with status

### Requirement 8: جدولة المقالات

**User Story:** كمدير محتوى، أريد جدولة نشر المقالات في وقت محدد، حتى أتحكم في توقيت النشر بشكل مسبق.

#### Acceptance Criteria

1. WHEN the admin sets publish date in the future THEN THE Article_Manager SHALL save the article as "scheduled" status
2. WHEN scheduled time arrives THEN THE Article_Manager SHALL automatically change status to "published"
3. WHEN the admin views scheduled articles THEN THE Article_Manager SHALL display them in a calendar view
4. WHEN the admin edits a scheduled article THEN THE Article_Manager SHALL allow changing the scheduled date/time

### Requirement 9: إحصائيات المقالات

**User Story:** كمدير موقع، أريد رؤية إحصائيات المقالات، حتى أفهم أداء المحتوى وأتخذ قرارات مبنية على البيانات.

#### Acceptance Criteria

1. WHEN the admin views article statistics THEN THE Article_Manager SHALL display views, unique visitors, and average time on page
2. WHEN the admin views dashboard THEN THE Admin_Panel SHALL display top 10 performing articles
3. WHEN the admin views category statistics THEN THE Category_Manager SHALL display article count and total views per category
4. WHEN the admin exports statistics THEN THE Article_Manager SHALL generate a CSV file with selected date range

### Requirement 10: واجهة برمجة التطبيقات (API)

**User Story:** كمطور، أريد واجهة API للمقالات والتصنيفات، حتى أتمكن من التكامل مع الأنظمة الأخرى.

#### Acceptance Criteria

1. WHEN a GET request is sent to "/api/admin/articles" THEN THE Article_Manager SHALL return paginated articles list with filters support
2. WHEN a POST request is sent to "/api/admin/articles" THEN THE Article_Manager SHALL create a new article and return the created object
3. WHEN a PUT request is sent to "/api/admin/articles/[id]" THEN THE Article_Manager SHALL update the article and return the updated object
4. WHEN a DELETE request is sent to "/api/admin/articles/[id]" THEN THE Article_Manager SHALL soft-delete the article
5. WHEN a POST request is sent to "/api/admin/ai/generate" THEN THE AI_Generator SHALL generate content based on provided parameters
6. WHEN API requests are made THEN THE Admin_Panel SHALL validate authentication and return 401 for unauthorized requests
