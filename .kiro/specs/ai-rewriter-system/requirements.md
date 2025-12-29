# Requirements Document

## Introduction

نظام إعادة الصياغة المتقدم بالذكاء الاصطناعي هو أداة شاملة في لوحة التحكم تمكّن المستخدم من إعادة صياغة المحتوى باستخدام نماذج AI متعددة، مع دعم استخلاص المحتوى من الروابط وتوليد الصور تلقائياً، ونقل النتائج مباشرة إلى صفحة إنشاء المقالات.

## Glossary

- **AI_Rewriter_System**: نظام إعادة الصياغة المتقدم في لوحة التحكم
- **Content_Extractor**: مكون استخلاص المحتوى من الروابط الخارجية
- **AI_Model**: نموذج ذكاء اصطناعي (Gemini, Groq, Local, Cohere, HuggingFace)
- **Rewrite_Result**: نتيجة إعادة الصياغة من نموذج معين
- **Article_Editor**: صفحة إنشاء/تحرير المقالات في لوحة التحكم
- **Quality_Score**: درجة جودة المحتوى المُعاد صياغته (1-100)
- **SEO_Score**: درجة تحسين محركات البحث للمحتوى

## Requirements

### Requirement 1: إعادة الصياغة من النص المباشر

**User Story:** As a content manager, I want to rewrite articles by entering text directly, so that I can quickly generate unique content from existing material.

#### Acceptance Criteria

1. WHEN the user enters a title and content in the text input fields, THE AI_Rewriter_System SHALL display character and word count in real-time.
2. WHEN the user selects one or more AI_Model options, THE AI_Rewriter_System SHALL enable the rewrite button for processing.
3. WHEN the user specifies a target word count between 100 and 10000 words, THE AI_Rewriter_System SHALL generate content within 10% of the specified count.
4. WHEN the user initiates rewriting with multiple AI_Model selections, THE AI_Rewriter_System SHALL process all selected models in parallel and display results within 60 seconds.
5. WHILE the rewriting process is active, THE AI_Rewriter_System SHALL display a progress indicator showing the status of each AI_Model.

### Requirement 2: إعادة الصياغة من الرابط

**User Story:** As a content manager, I want to rewrite articles by providing a URL, so that I can quickly transform external content into unique articles.

#### Acceptance Criteria

1. WHEN the user enters a valid URL, THE Content_Extractor SHALL fetch and parse the webpage content within 30 seconds.
2. WHEN the Content_Extractor processes a webpage, THE AI_Rewriter_System SHALL extract the main article title, body text, and metadata while removing advertisements and navigation elements.
3. IF the URL is inaccessible or returns an error, THEN THE AI_Rewriter_System SHALL display a descriptive error message within 10 seconds.
4. WHEN content is successfully extracted, THE AI_Rewriter_System SHALL display a preview of the extracted content before rewriting.
5. WHEN the user confirms the extracted content, THE AI_Rewriter_System SHALL proceed with the rewriting process using the selected AI_Model options.

### Requirement 3: اختيار نماذج AI المتعددة

**User Story:** As a content manager, I want to compare results from multiple AI models, so that I can choose the best rewritten version.

#### Acceptance Criteria

1. THE AI_Rewriter_System SHALL provide selection options for at least 5 AI_Model types: Gemini, Groq, Local, Cohere, and HuggingFace.
2. WHEN the user selects multiple AI_Model options, THE AI_Rewriter_System SHALL display results from each model in a side-by-side comparison view.
3. WHEN displaying Rewrite_Result items, THE AI_Rewriter_System SHALL show Quality_Score and SEO_Score for each result.
4. WHEN the user hovers over a Rewrite_Result, THE AI_Rewriter_System SHALL highlight differences from the original content.

### Requirement 4: توليد الصور التلقائي

**User Story:** As a content manager, I want to generate relevant images for my articles, so that I can enhance visual appeal without manual image searching.

#### Acceptance Criteria

1. WHEN the user enables image generation, THE AI_Rewriter_System SHALL provide options to select image count between 1 and 5.
2. WHEN the user selects an image style (realistic, illustration, diagram), THE AI_Rewriter_System SHALL generate images matching the selected style.
3. WHEN images are generated, THE AI_Rewriter_System SHALL display thumbnails with options to regenerate individual images.
4. WHEN the user approves generated images, THE AI_Rewriter_System SHALL optimize images for web delivery with file sizes under 500KB.
5. WHERE Arabic text overlay is enabled, THE AI_Rewriter_System SHALL add readable Arabic captions to generated images.

### Requirement 5: النقل إلى صفحة إنشاء المقال

**User Story:** As a content manager, I want to transfer rewritten content to the article editor, so that I can publish articles efficiently.

#### Acceptance Criteria

1. WHEN the user clicks the transfer button on a Rewrite_Result, THE AI_Rewriter_System SHALL navigate to the Article_Editor with all fields pre-populated.
2. WHEN transferring content, THE AI_Rewriter_System SHALL populate title, content, meta description, and keywords fields automatically.
3. WHEN generated images exist, THE AI_Rewriter_System SHALL attach images to the article as featured and inline images.
4. WHEN transferring content, THE AI_Rewriter_System SHALL suggest an appropriate category based on content analysis.
5. WHEN the transfer is complete, THE AI_Rewriter_System SHALL save the article as a draft automatically.

### Requirement 6: تحليل جودة المحتوى

**User Story:** As a content manager, I want to see quality metrics for rewritten content, so that I can ensure high-quality output.

#### Acceptance Criteria

1. WHEN a Rewrite_Result is generated, THE AI_Rewriter_System SHALL calculate and display a Quality_Score between 0 and 100.
2. WHEN displaying quality metrics, THE AI_Rewriter_System SHALL show readability score, uniqueness percentage, and SEO_Score.
3. WHEN the Quality_Score is below 70, THE AI_Rewriter_System SHALL highlight the result with a warning indicator.
4. WHEN the user requests improvement suggestions, THE AI_Rewriter_System SHALL provide specific recommendations for enhancing content quality.

### Requirement 7: إعدادات نمط الكتابة

**User Story:** As a content manager, I want to customize the writing style, so that I can match content to my target audience.

#### Acceptance Criteria

1. THE AI_Rewriter_System SHALL provide writing style options: formal, informal, academic, and journalistic.
2. THE AI_Rewriter_System SHALL provide target audience options: general, expert, children, and youth.
3. WHEN the user selects a writing style and audience, THE AI_Rewriter_System SHALL adjust the rewriting prompts accordingly.
4. WHEN generating content for children audience, THE AI_Rewriter_System SHALL use simplified vocabulary and shorter sentences.

### Requirement 8: سجل العمليات والمسودات

**User Story:** As a content manager, I want to access my rewriting history, so that I can review and reuse previous work.

#### Acceptance Criteria

1. WHEN a rewriting operation completes, THE AI_Rewriter_System SHALL save the operation to the history database.
2. WHEN the user accesses the history tab, THE AI_Rewriter_System SHALL display the last 100 operations with timestamps and source types.
3. WHEN the user selects a history item, THE AI_Rewriter_System SHALL restore all settings and results from that operation.
4. WHEN the user deletes a history item, THE AI_Rewriter_System SHALL remove the item and associated data permanently.

### Requirement 9: توليد عناوين بديلة

**User Story:** As a content manager, I want to generate alternative titles, so that I can choose the most engaging headline.

#### Acceptance Criteria

1. WHEN the user requests alternative titles, THE AI_Rewriter_System SHALL generate between 5 and 10 title suggestions.
2. WHEN displaying title suggestions, THE AI_Rewriter_System SHALL show estimated click-through potential for each title.
3. WHEN the user selects an alternative title, THE AI_Rewriter_System SHALL update the rewritten content title accordingly.

### Requirement 10: استخراج الكلمات المفتاحية

**User Story:** As a content manager, I want automatic keyword extraction, so that I can optimize articles for search engines.

#### Acceptance Criteria

1. WHEN content is rewritten, THE AI_Rewriter_System SHALL extract between 5 and 15 relevant keywords automatically.
2. WHEN displaying keywords, THE AI_Rewriter_System SHALL show relevance scores for each keyword.
3. WHEN the user edits keywords, THE AI_Rewriter_System SHALL update the SEO_Score in real-time.
4. WHEN transferring to Article_Editor, THE AI_Rewriter_System SHALL include extracted keywords in the appropriate field.
