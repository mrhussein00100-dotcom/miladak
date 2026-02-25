# Requirements Document

## Introduction

تحسين شامل لنظام توليد المقالات بالذكاء الاصطناعي لضمان جودة أعلى في الفقرات، صور أكثر دقة وصلة بالموضوع، تنوع أكبر في العناوين الرئيسية المتوافقة مع SEO، ومنع قطع المقال في النهاية. يشمل التحسين جميع نماذج التوليد (SONA v4, v5, v6, Gemini, Groq).

## Glossary

- **Article_Generator**: نظام توليد المقالات الرئيسي الذي يدير جميع مزودي الذكاء الاصطناعي
- **SONA_System**: نظام التوليد المحلي المتقدم بإصداراته المختلفة (v4, v5, v6)
- **Image_Search_Engine**: محرك البحث عن الصور من Pexels و Unsplash
- **Template_Engine**: نظام القوالب الديناميكية لتوليد المحتوى
- **SEO_Title_Generator**: مولد العناوين المتوافقة مع محركات البحث
- **Content_Validator**: نظام التحقق من جودة واكتمال المحتوى
- **Paragraph_Formatter**: نظام تنسيق وضبط الفقرات

## Requirements

### Requirement 1: تحسين جودة الفقرات

**User Story:** كمدير محتوى، أريد أن تكون الفقرات المولدة منسقة ومضبوطة بشكل صحيح، حتى يكون المقال سهل القراءة واحترافي.

#### Acceptance Criteria

1. WHEN the Article_Generator generates a paragraph, THE Paragraph_Formatter SHALL ensure each paragraph contains between 3 to 6 sentences
2. WHEN the Article_Generator generates content, THE Paragraph_Formatter SHALL add proper spacing between paragraphs using HTML tags
3. WHEN the Article_Generator generates a section, THE Content_Validator SHALL verify that no paragraph exceeds 150 words
4. WHEN the Article_Generator generates Arabic content, THE Paragraph_Formatter SHALL ensure proper RTL formatting and punctuation
5. WHEN the Article_Generator generates lists, THE Paragraph_Formatter SHALL format them with proper HTML list tags (ul/ol/li)
6. WHEN the Article_Generator generates headings, THE Paragraph_Formatter SHALL use proper heading hierarchy (H2 for main sections, H3 for subsections)

### Requirement 2: تحسين دقة الصور وصلتها بالموضوع

**User Story:** كمدير محتوى، أريد أن تكون الصور المولدة ذات صلة مباشرة بموضوع المقال وليست مجرد صور عامة عن أعياد الميلاد، حتى يكون المحتوى أكثر جاذبية ومصداقية.

#### Acceptance Criteria

1. WHEN the Image_Search_Engine searches for images, THE Image_Search_Engine SHALL extract specific keywords from the article topic rather than using generic birthday keywords
2. WHEN the Image_Search_Engine searches for zodiac articles, THE Image_Search_Engine SHALL search for constellation and astrology-specific images
3. WHEN the Image_Search_Engine searches for age calculator articles, THE Image_Search_Engine SHALL search for milestone celebration and life journey images
4. WHEN the Image_Search_Engine searches for health articles, THE Image_Search_Engine SHALL search for wellness and health-specific images
5. WHEN the Image_Search_Engine selects a featured image, THE Image_Search_Engine SHALL prioritize images that match the main topic over generic celebration images
6. IF the Image_Search_Engine cannot find topic-specific images, THEN THE Image_Search_Engine SHALL use contextually appropriate fallback images based on article category
7. WHEN the Image_Search_Engine adds images to content, THE Image_Search_Engine SHALL ensure each image has a descriptive alt text matching the surrounding content

### Requirement 3: تنوع العناوين الرئيسية المتوافقة مع SEO

**User Story:** كمدير محتوى، أريد تنوعاً أكبر في العناوين الرئيسية المولدة مع الحفاظ على توافقها مع SEO، حتى لا تتكرر نفس أنماط العناوين.

#### Acceptance Criteria

1. WHEN the SEO_Title_Generator generates a title, THE SEO_Title_Generator SHALL select from at least 50 different title patterns
2. WHEN the SEO_Title_Generator generates a title, THE SEO_Title_Generator SHALL include the main keyword within the first 60 characters
3. WHEN the SEO_Title_Generator generates a title, THE SEO_Title_Generator SHALL avoid using the same pattern for consecutive articles
4. WHEN the SEO_Title_Generator generates a title, THE SEO_Title_Generator SHALL track recently used patterns and exclude them from selection
5. WHEN the SEO_Title_Generator generates a title for birthday articles, THE SEO_Title_Generator SHALL vary between question formats, statement formats, and list formats
6. WHEN the SEO_Title_Generator generates a title for zodiac articles, THE SEO_Title_Generator SHALL include the zodiac sign name and relevant descriptors
7. THE SEO_Title_Generator SHALL maintain a database of used title patterns with timestamps to prevent repetition within 30 days

### Requirement 4: منع قطع المقال في النهاية

**User Story:** كمدير محتوى، أريد أن ينتهي المقال بشكل كامل ومنطقي دون قطع مفاجئ، حتى يحصل القارئ على تجربة قراءة متكاملة.

#### Acceptance Criteria

1. WHEN the Article_Generator completes an article, THE Content_Validator SHALL verify the article ends with a proper conclusion section
2. WHEN the Article_Generator generates content, THE Content_Validator SHALL ensure the last paragraph is complete and not truncated
3. WHEN the Article_Generator generates content, THE Content_Validator SHALL verify the article contains a call-to-action or closing statement
4. IF the Content_Validator detects an incomplete ending, THEN THE Article_Generator SHALL regenerate the conclusion section
5. WHEN the Article_Generator generates content, THE Content_Validator SHALL check that all opened HTML tags are properly closed
6. WHEN the Article_Generator generates content, THE Content_Validator SHALL verify the word count meets the minimum requirement for the selected length option

### Requirement 5: تطبيق التحسينات على جميع النماذج

**User Story:** كمدير محتوى، أريد أن تُطبق جميع التحسينات على كافة نماذج التوليد المتاحة، حتى أحصل على جودة متسقة بغض النظر عن النموذج المستخدم.

#### Acceptance Criteria

1. WHEN using SONA_v4 provider, THE Article_Generator SHALL apply all paragraph formatting rules
2. WHEN using SONA_v5 provider, THE Article_Generator SHALL apply all paragraph formatting rules
3. WHEN using SONA_v6 provider, THE Article_Generator SHALL apply all paragraph formatting rules
4. WHEN using Gemini provider, THE Article_Generator SHALL apply all paragraph formatting rules
5. WHEN using Groq provider, THE Article_Generator SHALL apply all paragraph formatting rules
6. WHEN using any provider, THE Image_Search_Engine SHALL apply the improved image search logic
7. WHEN using any provider, THE SEO_Title_Generator SHALL apply the diverse title generation logic
8. WHEN using any provider, THE Content_Validator SHALL verify article completeness before returning

### Requirement 6: تحسين قوالب المحتوى

**User Story:** كمدير محتوى، أريد قوالب محتوى أكثر تنوعاً وثراءً، حتى لا تتكرر نفس الصياغات في المقالات المختلفة.

#### Acceptance Criteria

1. THE Template_Engine SHALL maintain at least 100 unique introduction templates per category
2. THE Template_Engine SHALL maintain at least 200 unique section templates per category
3. THE Template_Engine SHALL maintain at least 50 unique conclusion templates per category
4. WHEN the Template_Engine selects a template, THE Template_Engine SHALL track usage and avoid recently used templates
5. WHEN the Template_Engine generates content, THE Template_Engine SHALL use varied transition phrases between sections
6. WHEN the Template_Engine generates content, THE Template_Engine SHALL include contextually relevant facts and statistics
7. THE Template_Engine SHALL support dynamic variable substitution for personalized content
