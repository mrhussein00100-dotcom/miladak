# Requirements Document

## Introduction

هذا المستند يحدد متطلبات تطوير موقع ميلادك v2 بشكل متقدم واحترافي. الهدف هو إنشاء موقع أجمل وأكثر تطوراً من الموقع الأساسي (miladak_base) مع إصلاح جميع المشاكل الحالية وإضافة مزايا جديدة متقدمة.

### المشاكل الحالية المكتشفة:
1. **النافبار بسيط جداً** - لا يحتوي على قوائم منسدلة أو بحث أو تصميم متقدم
2. **صفحة الأدوات لا تعرض شيء** - قاعدة البيانات غير مهيأة أو فارغة
3. **صفحة المقالات لا تعرض شيء** - نفس المشكلة
4. **التصميم العام بسيط** - يحتاج لتحسينات جمالية كبيرة
5. **مزايا كثيرة مفقودة** - مقارنة بالموقع الأساسي

## Glossary

- **Miladak_System**: نظام موقع ميلادك v2 الشامل
- **Navbar_Component**: مكون شريط التنقل الرئيسي
- **Tools_Page**: صفحة عرض الأدوات الحسابية
- **Articles_Page**: صفحة عرض المقالات
- **Theme_System**: نظام تبديل المظهر (فاتح/داكن/ميلادك/النظام)
- **Database_System**: نظام قاعدة البيانات SQLite
- **API_Layer**: طبقة واجهات برمجة التطبيقات
- **UI_Components**: مكونات واجهة المستخدم

---

## Requirements

### Requirement 1: إصلاح وتطوير النافبار

**User Story:** كمستخدم، أريد نافبار متقدم وجميل يسهل التنقل في الموقع، حتى أتمكن من الوصول لجميع الأقسام بسرعة وسهولة.

#### Acceptance Criteria

1. WHEN the user loads any page THEN the Miladak_System SHALL display a sticky navbar with glass morphism effect and smooth backdrop blur
2. WHEN the user hovers over the tools menu THEN the Navbar_Component SHALL display a dropdown menu showing tool categories with featured tools under each category
3. WHEN the user hovers over the articles menu THEN the Navbar_Component SHALL display a dropdown menu showing article categories with article count for each category
4. WHEN the user clicks the theme toggle THEN the Theme_System SHALL display a dropdown with four options: light, dark, miladak, and system
5. WHEN the user views the navbar on mobile THEN the Navbar_Component SHALL display a hamburger menu that opens a full-screen mobile navigation with all menu items
6. WHEN the user scrolls down the page THEN the Navbar_Component SHALL add a shadow effect and reduce transparency to improve readability
7. WHEN the navbar loads THEN the Navbar_Component SHALL fetch tool categories and article categories from the API to populate dropdown menus

---

### Requirement 2: إصلاح صفحة الأدوات

**User Story:** كمستخدم، أريد رؤية جميع الأدوات المتاحة بتصميم جذاب ومنظم، حتى أتمكن من اختيار الأداة المناسبة بسهولة.

#### Acceptance Criteria

1. WHEN the user visits the tools page THEN the Tools_Page SHALL display all tools grouped by category with icons and descriptions
2. WHEN the database is empty THEN the Database_System SHALL initialize with default tools data including 17 tools across 4 categories
3. WHEN the user clicks on a category filter THEN the Tools_Page SHALL filter tools to show only tools from the selected category
4. WHEN the user types in the search box THEN the Tools_Page SHALL filter tools in real-time based on title and description match
5. WHEN tools are displayed THEN the Tools_Page SHALL show featured tools in a highlighted section at the top
6. WHEN the user hovers over a tool card THEN the UI_Components SHALL apply a lift animation and glow effect
7. WHEN the tools page loads THEN the API_Layer SHALL return tools data with category information in a single optimized query

---

### Requirement 3: إصلاح صفحة المقالات

**User Story:** كمستخدم، أريد قراءة مقالات مفيدة معروضة بتصميم جميل، حتى أستفيد من المحتوى المقدم.

#### Acceptance Criteria

1. WHEN the user visits the articles page THEN the Articles_Page SHALL display all published articles with images, titles, excerpts, and metadata
2. WHEN the database is empty THEN the Database_System SHALL initialize with sample articles data including at least 10 articles across multiple categories
3. WHEN the user clicks on a category filter THEN the Articles_Page SHALL filter articles to show only articles from the selected category
4. WHEN the user types in the search box THEN the Articles_Page SHALL filter articles in real-time based on title and excerpt match
5. WHEN articles are displayed THEN the Articles_Page SHALL show featured articles in a highlighted carousel at the top
6. WHEN the user views an article card THEN the UI_Components SHALL display read time, view count, and category badge
7. WHEN the articles page loads THEN the API_Layer SHALL return articles data with pagination support and category information

---

### Requirement 4: تهيئة قاعدة البيانات

**User Story:** كمطور، أريد قاعدة بيانات مهيأة بشكل صحيح مع بيانات افتراضية، حتى يعمل الموقع بشكل صحيح من البداية.

#### Acceptance Criteria

1. WHEN the application starts THEN the Database_System SHALL check if tables exist and create them if missing
2. WHEN tables are created THEN the Database_System SHALL insert default tool categories: أدوات العمر, أدوات الصحة, أدوات التواريخ, أدوات متنوعة
3. WHEN tables are created THEN the Database_System SHALL insert all 17 tools with correct category assignments and href links
4. WHEN tables are created THEN the Database_System SHALL insert default article categories: صحة, تطوير ذاتي, علاقات, نمط حياة
5. WHEN tables are created THEN the Database_System SHALL insert sample articles with realistic content and images
6. WHEN database initialization completes THEN the Database_System SHALL log success message with table counts

---

### Requirement 5: تصميم عصري فاخر ومبتكر

**User Story:** كمستخدم، أريد تصميم فاخر وأنيق يجعل تجربة استخدام الموقع استثنائية ومميزة عن أي موقع آخر.

#### Acceptance Criteria

1. WHEN any page loads THEN the UI_Components SHALL apply a modern design system with layered glass morphism, gradient meshes, and floating elements
2. WHEN the user interacts with buttons THEN the UI_Components SHALL apply micro-interactions including scale, glow, ripple effects, and smooth color transitions
3. WHEN cards are displayed THEN the UI_Components SHALL apply 3D perspective transforms on hover with dynamic shadows and border gradients
4. WHEN text is displayed THEN the UI_Components SHALL use premium Arabic typography with gradient text effects for headings
5. WHEN the miladak theme is active THEN the Theme_System SHALL apply an exclusive aurora-style animated gradient background
6. WHEN loading states occur THEN the UI_Components SHALL display elegant shimmer animations with gradient overlays
7. WHEN the hero section loads THEN the UI_Components SHALL display animated floating shapes, particle effects, and dynamic gradient backgrounds
8. WHEN sections transition THEN the UI_Components SHALL apply smooth scroll-triggered animations using intersection observer

---

### Requirement 5.1: تخطيط مبتكر ومختلف

**User Story:** كمستخدم، أريد تخطيط صفحات مبتكر ومختلف عن المواقع التقليدية.

#### Acceptance Criteria

1. WHEN the homepage loads THEN the UI_Components SHALL display a full-screen hero with asymmetric layout and floating calculator widget
2. WHEN tools are displayed THEN the Tools_Page SHALL use a masonry grid layout with varying card sizes based on tool importance
3. WHEN articles are displayed THEN the Articles_Page SHALL use a magazine-style layout with featured article taking full width
4. WHEN sections are displayed THEN the UI_Components SHALL use diagonal dividers and wave separators between sections
5. WHEN the footer loads THEN the UI_Components SHALL display a multi-column footer with animated social links and newsletter signup
6. WHEN sidebars are needed THEN the UI_Components SHALL use floating sticky sidebars with smooth scroll behavior

---

### Requirement 5.2: نظام ألوان متقدم وأنيق

**User Story:** كمستخدم، أريد ألوان جميلة ومتناسقة تريح العين وتعطي إحساس بالفخامة.

#### Acceptance Criteria

1. WHEN light theme is active THEN the Theme_System SHALL apply a soft cream background with purple and blue accent gradients
2. WHEN dark theme is active THEN the Theme_System SHALL apply a deep space theme with subtle star particles and aurora accents
3. WHEN miladak theme is active THEN the Theme_System SHALL apply an exclusive purple-to-cyan gradient theme with neon glow effects
4. WHEN colors are applied THEN the Theme_System SHALL ensure WCAG AA contrast ratios for accessibility
5. WHEN gradients are used THEN the UI_Components SHALL apply smooth multi-stop gradients with at least 3 color stops
6. WHEN accent colors are needed THEN the Theme_System SHALL use complementary color pairs for visual harmony

---

### Requirement 6: إضافة مزايا متقدمة للنافبار

**User Story:** كمستخدم، أريد مزايا متقدمة في النافبار مثل البحث السريع والإشعارات.

#### Acceptance Criteria

1. WHEN the user clicks the search icon THEN the Navbar_Component SHALL open a search modal with instant search across tools and articles
2. WHEN the user types in the search modal THEN the Navbar_Component SHALL display search results grouped by type with keyboard navigation support
3. WHEN the user presses Escape THEN the Navbar_Component SHALL close any open dropdown or modal
4. WHEN the user is on mobile THEN the Navbar_Component SHALL support swipe gestures to open and close the mobile menu
5. WHEN dropdown menus are open THEN the Navbar_Component SHALL close them when clicking outside or pressing Escape

---

### Requirement 7: أداء فائق السرعة

**User Story:** كمستخدم، أريد أن يحمل الموقع بسرعة البرق مع تجربة سلسة بدون أي تأخير.

#### Acceptance Criteria

1. WHEN the page loads THEN the Miladak_System SHALL display First Contentful Paint within 1 second and Largest Contentful Paint within 1.5 seconds
2. WHEN images are displayed THEN the UI_Components SHALL use next/image with automatic WebP conversion, blur placeholders, and priority loading for above-fold images
3. WHEN components load THEN the Miladak_System SHALL use dynamic imports with React.lazy for non-critical components
4. WHEN API calls are made THEN the API_Layer SHALL use SWR or React Query for intelligent caching with stale-while-revalidate strategy
5. WHEN the user navigates between pages THEN the Miladak_System SHALL prefetch linked pages on hover for instant navigation
6. WHEN animations run THEN the UI_Components SHALL use CSS transforms and opacity only to ensure 60fps performance
7. WHEN fonts load THEN the Miladak_System SHALL use font-display swap with preloaded critical fonts
8. WHEN the bundle is built THEN the Miladak_System SHALL achieve a Lighthouse performance score above 90

---

### Requirement 7.1: تجربة مستخدم استثنائية

**User Story:** كمستخدم، أريد تجربة استخدام سلسة وممتعة تجعلني أرغب في العودة للموقع.

#### Acceptance Criteria

1. WHEN the user performs any action THEN the UI_Components SHALL provide immediate visual feedback within 100ms
2. WHEN forms are submitted THEN the UI_Components SHALL show loading states with progress indicators
3. WHEN errors occur THEN the UI_Components SHALL display friendly error messages with suggested actions in Arabic
4. WHEN the user scrolls THEN the UI_Components SHALL apply smooth scroll behavior with momentum
5. WHEN touch gestures are used THEN the UI_Components SHALL support swipe navigation on mobile devices
6. WHEN the user completes a calculation THEN the UI_Components SHALL display results with celebratory micro-animations
7. WHEN content is loading THEN the UI_Components SHALL display skeleton screens that match the final layout exactly

---

### Requirement 8: إضافة صفحات إضافية

**User Story:** كمستخدم، أريد صفحات إضافية مثل الأصدقاء وبطاقات التهنئة.

#### Acceptance Criteria

1. WHEN the user visits the friends page THEN the Miladak_System SHALL display a tool to calculate ages for multiple friends
2. WHEN the user visits the cards page THEN the Miladak_System SHALL display birthday card templates that can be customized and shared
3. WHEN the user visits the pregnancy calculator page THEN the Miladak_System SHALL display a comprehensive pregnancy due date calculator
4. WHEN the user visits the date converter page THEN the Miladak_System SHALL display a Hijri-Gregorian date converter tool

---

### Requirement 9: تحسين SEO والأداء

**User Story:** كمالك موقع، أريد تحسين ظهور الموقع في محركات البحث.

#### Acceptance Criteria

1. WHEN any page loads THEN the Miladak_System SHALL include proper meta tags with title, description, and keywords
2. WHEN the sitemap is requested THEN the Miladak_System SHALL generate a dynamic sitemap including all tools and articles
3. WHEN structured data is needed THEN the Miladak_System SHALL include JSON-LD schema for tools and articles
4. WHEN the robots.txt is requested THEN the Miladak_System SHALL return proper crawling directives
5. WHEN Open Graph tags are needed THEN the Miladak_System SHALL include proper social sharing metadata

---

### Requirement 10: دعم الوضع المظلم المتقدم

**User Story:** كمستخدم، أريد وضع مظلم جميل ومريح للعين.

#### Acceptance Criteria

1. WHEN the user selects dark theme THEN the Theme_System SHALL apply dark colors with proper contrast ratios
2. WHEN the user selects miladak theme THEN the Theme_System SHALL apply a unique dark purple theme with gradient accents
3. WHEN the user selects system theme THEN the Theme_System SHALL detect and follow the operating system preference
4. WHEN theme changes THEN the Theme_System SHALL apply smooth color transitions without page reload
5. WHEN theme is selected THEN the Theme_System SHALL persist the choice in local storage for future visits



---

### Requirement 11: تأثيرات بصرية متقدمة

**User Story:** كمستخدم، أريد تأثيرات بصرية مبهرة تجعل الموقع يبدو احترافياً وعصرياً.

#### Acceptance Criteria

1. WHEN the page loads THEN the UI_Components SHALL display entrance animations for all visible elements with staggered timing
2. WHEN the user scrolls THEN the UI_Components SHALL trigger reveal animations for elements entering the viewport
3. WHEN the user hovers over interactive elements THEN the UI_Components SHALL display magnetic cursor effects and glow trails
4. WHEN numbers are displayed THEN the UI_Components SHALL animate counting up from zero with easing
5. WHEN the background is rendered THEN the UI_Components SHALL display subtle animated gradient mesh or particle effects
6. WHEN modals open THEN the UI_Components SHALL apply backdrop blur with scale-in animation
7. WHEN tooltips appear THEN the UI_Components SHALL animate with spring physics for natural feel

---

### Requirement 12: تصميم متجاوب متقدم

**User Story:** كمستخدم على الجوال، أريد تجربة ممتازة تناسب شاشتي الصغيرة.

#### Acceptance Criteria

1. WHEN viewed on mobile THEN the UI_Components SHALL adapt layout to single column with touch-friendly spacing
2. WHEN viewed on tablet THEN the UI_Components SHALL use a two-column layout with optimized touch targets
3. WHEN viewed on desktop THEN the UI_Components SHALL use full multi-column layouts with hover interactions
4. WHEN the navbar is viewed on mobile THEN the Navbar_Component SHALL transform into a bottom navigation bar for easier thumb access
5. WHEN cards are viewed on mobile THEN the UI_Components SHALL use horizontal scroll carousels instead of grids
6. WHEN forms are used on mobile THEN the UI_Components SHALL use native input types with proper keyboard hints

---

### Requirement 13: حاسبة العمر المتطورة

**User Story:** كمستخدم، أريد حاسبة عمر متطورة تعطيني معلومات شاملة ومفصلة.

#### Acceptance Criteria

1. WHEN the user enters a birthdate THEN the Miladak_System SHALL calculate age in years, months, days, hours, minutes, and seconds
2. WHEN results are displayed THEN the Miladak_System SHALL show animated counters with real-time seconds update
3. WHEN results are displayed THEN the Miladak_System SHALL show next birthday countdown with days remaining
4. WHEN results are displayed THEN the Miladak_System SHALL show zodiac sign with description in Arabic
5. WHEN results are displayed THEN the Miladak_System SHALL show Chinese zodiac animal with description
6. WHEN results are displayed THEN the Miladak_System SHALL show generation name with characteristics
7. WHEN results are displayed THEN the Miladak_System SHALL show life statistics including heartbeats, breaths, and sleep hours
8. WHEN results are ready THEN the Miladak_System SHALL provide share buttons for social media with generated image



---

### Requirement 14: لوحة تحكم متقدمة وشاملة

**User Story:** كمدير موقع، أريد لوحة تحكم متقدمة وشاملة لإدارة جميع جوانب الموقع بسهولة.

#### Acceptance Criteria

1. WHEN the admin visits the dashboard THEN the Admin_System SHALL display a modern dashboard with real-time statistics cards showing articles count, tools count, visitors count, and messages count
2. WHEN the dashboard loads THEN the Admin_System SHALL display interactive charts showing visitor trends, popular tools, and article views over time
3. WHEN the admin navigates THEN the Admin_System SHALL display a collapsible sidebar with categorized menu items and active state indicators
4. WHEN the admin is on mobile THEN the Admin_System SHALL display a responsive sidebar that slides from the right with backdrop overlay
5. WHEN the admin logs in THEN the Admin_System SHALL authenticate using secure session-based authentication with role-based access control
6. WHEN the admin session expires THEN the Admin_System SHALL redirect to login page with session expired message

---

### Requirement 14.1: إدارة المقالات المتقدمة

**User Story:** كمدير محتوى، أريد إدارة المقالات بسهولة مع محرر نصوص متقدم.

#### Acceptance Criteria

1. WHEN the admin visits articles management THEN the Admin_System SHALL display a data table with search, filter, sort, and pagination capabilities
2. WHEN the admin creates an article THEN the Admin_System SHALL provide a rich text editor with image upload, formatting tools, and preview mode
3. WHEN the admin edits an article THEN the Admin_System SHALL auto-save drafts every 30 seconds to prevent data loss
4. WHEN the admin manages categories THEN the Admin_System SHALL allow creating, editing, and deleting article categories with color assignment
5. WHEN the admin publishes an article THEN the Admin_System SHALL validate required fields and display confirmation dialog
6. WHEN the admin deletes an article THEN the Admin_System SHALL move it to trash with 30-day recovery option

---

### Requirement 14.2: إدارة الأدوات

**User Story:** كمدير موقع، أريد إدارة الأدوات وفئاتها بسهولة.

#### Acceptance Criteria

1. WHEN the admin visits tools management THEN the Admin_System SHALL display all tools with their categories, status, and usage statistics
2. WHEN the admin creates a tool THEN the Admin_System SHALL provide form with title, description, icon selection, category, and href fields
3. WHEN the admin edits a tool THEN the Admin_System SHALL allow updating all tool properties including featured status and sort order
4. WHEN the admin manages tool categories THEN the Admin_System SHALL allow creating, editing, and reordering categories with drag-and-drop
5. WHEN the admin toggles tool status THEN the Admin_System SHALL immediately activate or deactivate the tool on the public site

---

### Requirement 14.3: إدارة المستخدمين والصلاحيات

**User Story:** كمدير موقع، أريد إدارة المستخدمين وصلاحياتهم.

#### Acceptance Criteria

1. WHEN the admin visits users management THEN the Admin_System SHALL display all users with their roles, last login, and status
2. WHEN the admin creates a user THEN the Admin_System SHALL require username, email, password, and role selection
3. WHEN the admin assigns roles THEN the Admin_System SHALL support roles: admin, content_manager, editor, writer, support
4. WHEN a user with limited role logs in THEN the Admin_System SHALL show only permitted menu items and pages
5. WHEN the admin deactivates a user THEN the Admin_System SHALL immediately revoke their access and end active sessions

---

### Requirement 14.4: إدارة الرسائل والتواصل

**User Story:** كمدير موقع، أريد رؤية رسائل الزوار والرد عليها.

#### Acceptance Criteria

1. WHEN the admin visits messages THEN the Admin_System SHALL display all contact form submissions with read/unread status
2. WHEN a new message arrives THEN the Admin_System SHALL show notification badge on the messages menu item
3. WHEN the admin reads a message THEN the Admin_System SHALL mark it as read and display full message details
4. WHEN the admin replies to a message THEN the Admin_System SHALL send email reply and log the response
5. WHEN the admin deletes a message THEN the Admin_System SHALL archive it with option to restore

---

### Requirement 14.5: إدارة SEO والإعدادات

**User Story:** كمدير موقع، أريد تحسين SEO وإدارة إعدادات الموقع.

#### Acceptance Criteria

1. WHEN the admin visits SEO settings THEN the Admin_System SHALL display forms for meta titles, descriptions, and keywords for all pages
2. WHEN the admin edits SEO THEN the Admin_System SHALL show character count and preview of search result appearance
3. WHEN the admin visits general settings THEN the Admin_System SHALL allow editing site name, logo, contact info, and social links
4. WHEN the admin manages AdSense THEN the Admin_System SHALL allow configuring ad slots and placement settings
5. WHEN settings are saved THEN the Admin_System SHALL apply changes immediately without requiring site restart

---

### Requirement 14.6: إحصائيات وتقارير متقدمة

**User Story:** كمدير موقع، أريد رؤية إحصائيات تفصيلية عن أداء الموقع.

#### Acceptance Criteria

1. WHEN the admin views analytics THEN the Admin_System SHALL display visitor statistics with daily, weekly, and monthly views
2. WHEN the admin views tool analytics THEN the Admin_System SHALL show most used tools with usage counts and trends
3. WHEN the admin views article analytics THEN the Admin_System SHALL show most viewed articles with read time and engagement metrics
4. WHEN the admin exports data THEN the Admin_System SHALL generate CSV or PDF reports for selected date ranges
5. WHEN real-time data is needed THEN the Admin_System SHALL update statistics every 30 seconds without page refresh

---

### Requirement 14.7: تصميم لوحة التحكم الفاخر

**User Story:** كمدير موقع، أريد لوحة تحكم بتصميم عصري وأنيق.

#### Acceptance Criteria

1. WHEN the admin dashboard loads THEN the Admin_System SHALL display a dark theme with gradient accents and glass morphism cards
2. WHEN the admin interacts with elements THEN the Admin_System SHALL apply smooth animations and micro-interactions
3. WHEN data tables are displayed THEN the Admin_System SHALL use modern table design with hover effects and action buttons
4. WHEN forms are displayed THEN the Admin_System SHALL use floating labels, validation feedback, and loading states
5. WHEN the admin navigates THEN the Admin_System SHALL apply page transition animations for smooth experience
6. WHEN notifications appear THEN the Admin_System SHALL use toast notifications with slide-in animations



---

## 🤖 متطلبات الذكاء الاصطناعي والأتمتة

### Requirement 15: إنشاء المقالات بالذكاء الاصطناعي

**User Story:** كمدير محتوى، أريد إنشاء مقالات كاملة بالذكاء الاصطناعي بضغطة زر واحدة.

#### Acceptance Criteria

1. WHEN the admin clicks "إنشاء مقال بالذكاء الاصطناعي" THEN the AI_System SHALL display a form to enter topic, keywords, and target word count
2. WHEN the admin submits the AI article request THEN the AI_System SHALL generate a complete article with title, introduction, body sections, and conclusion using Gemini API
3. WHEN the article is generated THEN the AI_System SHALL automatically create SEO-optimized meta title, description, and keywords
4. WHEN the article is generated THEN the AI_System SHALL suggest relevant categories and tags based on content analysis
5. WHEN the article is generated THEN the AI_System SHALL create a table of contents from headings automatically
6. WHEN the admin reviews the generated article THEN the AI_System SHALL allow editing before publishing
7. WHEN generating articles THEN the AI_System SHALL ensure minimum 1000 words with proper Arabic grammar and formatting

---

### Requirement 15.1: إعادة صياغة المحتوى

**User Story:** كمدير محتوى، أريد إعادة صياغة النصوص لتحسينها أو جعلها فريدة.

#### Acceptance Criteria

1. WHEN the admin selects text and clicks "إعادة صياغة" THEN the AI_System SHALL rewrite the text while preserving meaning
2. WHEN rewriting content THEN the AI_System SHALL offer multiple rewrite styles: formal, casual, simplified, expanded
3. WHEN rewriting content THEN the AI_System SHALL maintain SEO keywords and important terms
4. WHEN rewriting is complete THEN the AI_System SHALL show original and rewritten text side by side for comparison
5. WHEN the admin approves rewrite THEN the AI_System SHALL replace original text with rewritten version
6. WHEN bulk rewrite is requested THEN the AI_System SHALL process multiple paragraphs sequentially

---

### Requirement 15.2: توليد الصور بالذكاء الاصطناعي

**User Story:** كمدير محتوى، أريد توليد صور مناسبة للمقالات تلقائياً.

#### Acceptance Criteria

1. WHEN the admin clicks "توليد صورة" THEN the AI_System SHALL analyze article content and suggest image prompts
2. WHEN generating images THEN the AI_System SHALL use DALL-E or Stable Diffusion API to create relevant images
3. WHEN images are generated THEN the AI_System SHALL create multiple variations for the admin to choose from
4. WHEN an image is selected THEN the AI_System SHALL automatically optimize it for web with proper compression
5. WHEN an image is added THEN the AI_System SHALL generate alt text and caption automatically in Arabic
6. WHEN featured image is needed THEN the AI_System SHALL create a branded image with article title overlay

---

### Requirement 15.3: تحسين SEO التلقائي

**User Story:** كمدير محتوى، أريد تحسين SEO لجميع المقالات تلقائياً.

#### Acceptance Criteria

1. WHEN an article is saved THEN the AI_System SHALL analyze content and generate optimized meta title under 60 characters
2. WHEN an article is saved THEN the AI_System SHALL generate meta description under 160 characters with call-to-action
3. WHEN an article is saved THEN the AI_System SHALL extract and suggest focus keywords and LSI keywords
4. WHEN an article is saved THEN the AI_System SHALL generate structured data JSON-LD automatically
5. WHEN SEO analysis runs THEN the AI_System SHALL provide SEO score with improvement suggestions
6. WHEN internal linking is needed THEN the AI_System SHALL suggest relevant internal links to other articles

---

### Requirement 16: النشر التلقائي اليومي

**User Story:** كمدير موقع، أريد نشر مقال جديد تلقائياً كل يوم بدون تدخل مني.

#### Acceptance Criteria

1. WHEN auto-publish is enabled THEN the AI_System SHALL generate and publish one article daily at configured time
2. WHEN generating daily article THEN the AI_System SHALL select topic from predefined topic queue or generate trending topic
3. WHEN generating daily article THEN the AI_System SHALL ensure minimum 1000 words with proper formatting
4. WHEN generating daily article THEN the AI_System SHALL create featured image automatically
5. WHEN generating daily article THEN the AI_System SHALL optimize SEO meta tags automatically
6. WHEN generating daily article THEN the AI_System SHALL assign appropriate category and tags
7. WHEN daily article is published THEN the AI_System SHALL send notification to admin with article link
8. WHEN auto-publish fails THEN the AI_System SHALL retry 3 times and notify admin of failure

---

### Requirement 16.1: جدولة المحتوى

**User Story:** كمدير محتوى، أريد جدولة نشر المقالات في أوقات محددة.

#### Acceptance Criteria

1. WHEN the admin creates an article THEN the Admin_System SHALL allow scheduling publication for future date and time
2. WHEN scheduled time arrives THEN the Admin_System SHALL automatically publish the article
3. WHEN viewing scheduled articles THEN the Admin_System SHALL display calendar view with all scheduled content
4. WHEN managing schedule THEN the Admin_System SHALL allow drag-and-drop rescheduling
5. WHEN schedule conflicts occur THEN the Admin_System SHALL warn admin and suggest alternative times

---

### Requirement 17: إدارة التصنيفات المتقدمة

**User Story:** كمدير محتوى، أريد إدارة تصنيفات المقالات والأدوات بشكل متقدم.

#### Acceptance Criteria

1. WHEN the admin visits categories management THEN the Admin_System SHALL display all categories with article counts and hierarchy
2. WHEN creating a category THEN the Admin_System SHALL allow setting name, slug, description, color, icon, and parent category
3. WHEN editing a category THEN the Admin_System SHALL allow bulk moving articles between categories
4. WHEN deleting a category THEN the Admin_System SHALL require reassigning articles to another category
5. WHEN viewing categories THEN the Admin_System SHALL display category tree with drag-and-drop reordering
6. WHEN AI generates articles THEN the AI_System SHALL auto-assign categories based on content analysis

---

### Requirement 17.1: الوسوم والكلمات المفتاحية

**User Story:** كمدير محتوى، أريد إدارة الوسوم والكلمات المفتاحية بذكاء.

#### Acceptance Criteria

1. WHEN the admin visits tags management THEN the Admin_System SHALL display tag cloud with usage frequency
2. WHEN creating an article THEN the AI_System SHALL suggest relevant tags based on content
3. WHEN managing tags THEN the Admin_System SHALL allow merging similar tags
4. WHEN viewing tag analytics THEN the Admin_System SHALL show which tags drive most traffic
5. WHEN SEO optimization runs THEN the AI_System SHALL suggest trending keywords to target

---

### Requirement 18: قائمة المواضيع للنشر التلقائي

**User Story:** كمدير محتوى، أريد إنشاء قائمة مواضيع ليتم إنشاء مقالات عنها تلقائياً.

#### Acceptance Criteria

1. WHEN the admin visits topic queue THEN the Admin_System SHALL display list of pending topics with priority
2. WHEN adding topics THEN the Admin_System SHALL allow bulk import from CSV or text list
3. WHEN AI generates topics THEN the AI_System SHALL suggest trending topics related to site niche
4. WHEN auto-publish runs THEN the AI_System SHALL pick next topic from queue based on priority
5. WHEN topic is used THEN the Admin_System SHALL mark it as completed with link to generated article
6. WHEN queue is empty THEN the AI_System SHALL generate new topic suggestions automatically

---

### Requirement 19: تكامل Gemini API

**User Story:** كمدير موقع، أريد تكامل سلس مع Gemini API لجميع مهام الذكاء الاصطناعي.

#### Acceptance Criteria

1. WHEN AI features are used THEN the AI_System SHALL connect to Gemini API with configured API key
2. WHEN API calls are made THEN the AI_System SHALL handle rate limiting with exponential backoff
3. WHEN API errors occur THEN the AI_System SHALL display user-friendly error messages in Arabic
4. WHEN API usage is tracked THEN the Admin_System SHALL display usage statistics and costs
5. WHEN configuring AI THEN the Admin_System SHALL allow setting temperature, max tokens, and model version
6. WHEN generating content THEN the AI_System SHALL use Arabic-optimized prompts for best results

---

### Requirement 20: تحليلات المحتوى الذكية

**User Story:** كمدير محتوى، أريد تحليلات ذكية لأداء المحتوى.

#### Acceptance Criteria

1. WHEN viewing article analytics THEN the AI_System SHALL show engagement score based on views, time on page, and scroll depth
2. WHEN analyzing content THEN the AI_System SHALL identify top performing topics and suggest similar content
3. WHEN analyzing SEO THEN the AI_System SHALL track keyword rankings and suggest improvements
4. WHEN analyzing trends THEN the AI_System SHALL identify seasonal patterns and recommend content calendar
5. WHEN generating reports THEN the AI_System SHALL create weekly content performance summary automatically



---

## 🎨 تحسينات التصميم المتقدمة

### Requirement 21: تصميم Hero Section مبتكر

**User Story:** كمستخدم، أريد Hero Section مبهر يجذب الانتباه فور دخول الموقع.

#### Acceptance Criteria

1. WHEN the homepage loads THEN the UI_Components SHALL display a full-screen hero with animated gradient mesh background
2. WHEN the hero renders THEN the UI_Components SHALL show floating 3D shapes with parallax effect on mouse movement
3. WHEN the hero renders THEN the UI_Components SHALL display animated particles or confetti effect
4. WHEN the hero renders THEN the UI_Components SHALL show the age calculator widget with glassmorphism design floating in the center
5. WHEN the user scrolls THEN the UI_Components SHALL apply smooth parallax scrolling with hero elements moving at different speeds
6. WHEN the hero text appears THEN the UI_Components SHALL animate text with typewriter or reveal effect
7. WHEN CTA buttons are displayed THEN the UI_Components SHALL apply gradient borders with animated glow effect

---

### Requirement 21.1: تصميم البطاقات المتقدم

**User Story:** كمستخدم، أريد بطاقات بتصميم ثلاثي الأبعاد وتأثيرات مبهرة.

#### Acceptance Criteria

1. WHEN cards are displayed THEN the UI_Components SHALL apply 3D tilt effect on hover following mouse position
2. WHEN cards are hovered THEN the UI_Components SHALL show animated gradient border with rainbow effect
3. WHEN cards are displayed THEN the UI_Components SHALL apply glassmorphism with frosted glass effect
4. WHEN cards contain images THEN the UI_Components SHALL apply zoom and parallax effect on hover
5. WHEN cards are clicked THEN the UI_Components SHALL apply ripple effect from click position
6. WHEN cards load THEN the UI_Components SHALL animate entrance with staggered fade-up effect

---

### Requirement 21.2: تأثيرات الخلفية المتحركة

**User Story:** كمستخدم، أريد خلفيات متحركة جميلة تضفي حيوية على الموقع.

#### Acceptance Criteria

1. WHEN dark theme is active THEN the UI_Components SHALL display animated starfield background with twinkling stars
2. WHEN miladak theme is active THEN the UI_Components SHALL display aurora borealis animated gradient
3. WHEN light theme is active THEN the UI_Components SHALL display subtle floating bubbles or shapes
4. WHEN sections change THEN the UI_Components SHALL apply smooth gradient transitions between sections
5. WHEN the user scrolls THEN the UI_Components SHALL apply parallax effect on background elements
6. WHEN performance is limited THEN the UI_Components SHALL reduce animation complexity automatically

---

### Requirement 21.3: الأنيميشن والتفاعلات

**User Story:** كمستخدم، أريد تفاعلات سلسة وأنيميشن جميل في كل مكان.

#### Acceptance Criteria

1. WHEN elements enter viewport THEN the UI_Components SHALL trigger scroll-reveal animations with stagger
2. WHEN buttons are hovered THEN the UI_Components SHALL apply magnetic cursor effect pulling button slightly
3. WHEN numbers are displayed THEN the UI_Components SHALL animate counting up with easing
4. WHEN progress is shown THEN the UI_Components SHALL animate progress bars with gradient fill
5. WHEN modals open THEN the UI_Components SHALL apply scale and blur backdrop animation
6. WHEN page transitions occur THEN the UI_Components SHALL apply smooth crossfade with slide effect
7. WHEN loading states occur THEN the UI_Components SHALL display skeleton with shimmer wave effect

---

## 🤖 تنوع نماذج الذكاء الاصطناعي المجانية

### Requirement 22: دعم نماذج AI متعددة

**User Story:** كمدير موقع، أريد استخدام نماذج ذكاء اصطناعي متعددة مجانية ومدفوعة.

#### Acceptance Criteria

1. WHEN configuring AI THEN the Admin_System SHALL support multiple AI providers: Gemini, OpenAI, Claude, Groq, Ollama
2. WHEN selecting provider THEN the Admin_System SHALL allow choosing between free and paid tiers
3. WHEN free tier is selected THEN the AI_System SHALL use Gemini Free, Groq Free, or local Ollama models
4. WHEN API limits are reached THEN the AI_System SHALL automatically fallback to alternative provider
5. WHEN configuring models THEN the Admin_System SHALL allow setting primary and fallback providers

---

### Requirement 22.1: نماذج Gemini المجانية

**User Story:** كمدير موقع، أريد استخدام Gemini API المجاني لتوليد المحتوى.

#### Acceptance Criteria

1. WHEN using Gemini THEN the AI_System SHALL support Gemini 1.5 Flash (free tier with 15 RPM)
2. WHEN using Gemini THEN the AI_System SHALL support Gemini 1.5 Pro (free tier with 2 RPM)
3. WHEN rate limits are hit THEN the AI_System SHALL queue requests and process them within limits
4. WHEN configuring Gemini THEN the Admin_System SHALL allow setting safety settings and generation config
5. WHEN generating Arabic content THEN the AI_System SHALL use optimized Arabic prompts for Gemini

---

### Requirement 22.2: نماذج Groq المجانية

**User Story:** كمدير موقع، أريد استخدام Groq API المجاني كبديل سريع.

#### Acceptance Criteria

1. WHEN using Groq THEN the AI_System SHALL support Llama 3.1 70B (free, very fast)
2. WHEN using Groq THEN the AI_System SHALL support Mixtral 8x7B (free, good for Arabic)
3. WHEN Groq is selected THEN the AI_System SHALL leverage its speed for real-time features
4. WHEN configuring Groq THEN the Admin_System SHALL allow setting max tokens and temperature
5. WHEN Groq fails THEN the AI_System SHALL fallback to Gemini automatically

---

### Requirement 22.3: نماذج Ollama المحلية

**User Story:** كمدير موقع، أريد تشغيل نماذج محلية مجانية بدون حدود.

#### Acceptance Criteria

1. WHEN Ollama is configured THEN the AI_System SHALL connect to local Ollama server
2. WHEN using Ollama THEN the AI_System SHALL support Llama 3, Mistral, and Qwen models
3. WHEN Ollama is used THEN the AI_System SHALL have no rate limits or API costs
4. WHEN configuring Ollama THEN the Admin_System SHALL allow setting model name and server URL
5. WHEN Ollama is unavailable THEN the AI_System SHALL fallback to cloud providers

---

### Requirement 22.4: نماذج OpenAI (اختياري)

**User Story:** كمدير موقع، أريد خيار استخدام OpenAI للجودة العالية.

#### Acceptance Criteria

1. WHEN OpenAI is configured THEN the AI_System SHALL support GPT-4o and GPT-4o-mini
2. WHEN using OpenAI THEN the AI_System SHALL track token usage and estimated costs
3. WHEN OpenAI is selected THEN the Admin_System SHALL warn about costs before generation
4. WHEN configuring OpenAI THEN the Admin_System SHALL allow setting organization and project IDs

---

### Requirement 22.5: توليد الصور المجاني

**User Story:** كمدير موقع، أريد توليد صور مجاناً بدون تكاليف.

#### Acceptance Criteria

1. WHEN generating images THEN the AI_System SHALL support Stable Diffusion via Hugging Face (free)
2. WHEN generating images THEN the AI_System SHALL support DALL-E 3 via Bing Image Creator (free)
3. WHEN generating images THEN the AI_System SHALL support Ideogram API (free tier)
4. WHEN generating images THEN the AI_System SHALL support Leonardo.ai (free tier - 150 images/month)
5. WHEN image generation fails THEN the AI_System SHALL fallback to stock image search from Unsplash/Pexels
6. WHEN configuring images THEN the Admin_System SHALL allow setting preferred provider and style

---

### Requirement 23: إدارة حدود API الذكية

**User Story:** كمدير موقع، أريد إدارة ذكية لحدود API لتجنب الأخطاء.

#### Acceptance Criteria

1. WHEN API calls are made THEN the AI_System SHALL track usage per provider in real-time
2. WHEN approaching limits THEN the AI_System SHALL warn admin and suggest switching providers
3. WHEN limits are reached THEN the AI_System SHALL automatically switch to fallback provider
4. WHEN daily reset occurs THEN the AI_System SHALL reset counters and notify admin
5. WHEN viewing usage THEN the Admin_System SHALL display usage dashboard with charts per provider
6. WHEN configuring limits THEN the Admin_System SHALL allow setting custom thresholds per provider

---

### Requirement 24: تحسينات الأداء المتقدمة

**User Story:** كمستخدم، أريد موقع سريع جداً يحمل فوراً.

#### Acceptance Criteria

1. WHEN the site loads THEN the Miladak_System SHALL achieve Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1
2. WHEN images load THEN the UI_Components SHALL use AVIF/WebP with automatic format selection
3. WHEN fonts load THEN the Miladak_System SHALL use variable fonts with subset for Arabic characters only
4. WHEN JavaScript loads THEN the Miladak_System SHALL use tree-shaking and code splitting per route
5. WHEN CSS loads THEN the Miladak_System SHALL use critical CSS inlining and async loading for non-critical
6. WHEN caching is applied THEN the Miladak_System SHALL use stale-while-revalidate for API responses
7. WHEN prefetching THEN the Miladak_System SHALL prefetch visible links on hover with 100ms delay
8. WHEN on slow connection THEN the Miladak_System SHALL detect and reduce animation complexity

