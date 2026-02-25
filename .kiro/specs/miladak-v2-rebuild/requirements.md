# Requirements Document

## Introduction

إعادة بناء موقع "ميلادك" (Miladak) - منصة حاسبة العمر والأدوات الترفيهية العربية. الهدف هو إنشاء نسخة جديدة سريعة، نظيفة، جذابة، محسّنة للسيو (SEO)، ومهيأة للربح من Google AdSense.

المشروع الأساسي يحتوي على:
- حاسبة العمر الرئيسية مع إحصاءات تفصيلية
- 17 أداة متنوعة (حاسبة BMI، السعرات، الحمل، الأعياد، إلخ)
- نظام مقالات مع تصنيفات
- قاعدة بيانات SQLite للأحداث التاريخية والمشاهير
- دعم الوضع الداكن/الفاتح
- تصميم متجاوب للموبايل

## Glossary

- **Miladak_System**: نظام موقع ميلادك الجديد المُعاد بناؤه
- **Age_Calculator**: حاسبة العمر الرئيسية التي تحسب العمر بالسنوات والأشهر والأيام والساعات
- **Tool**: أداة حسابية متخصصة (مثل حاسبة BMI، السعرات، الحمل)
- **Article**: مقال محتوى نصي مع صورة وتصنيف
- **SEO_Metadata**: بيانات وصفية لتحسين ظهور الصفحة في محركات البحث
- **AdSense_Slot**: موضع إعلان Google AdSense في الصفحة
- **Core_Web_Vitals**: مقاييس Google لأداء الصفحة (LCP, FID, CLS)
- **Structured_Data**: بيانات JSON-LD لمحركات البحث
- **RTL_Layout**: تخطيط من اليمين لليسار للغة العربية

## Requirements

### Requirement 1: البنية الأساسية والأداء

**User Story:** كمستخدم، أريد أن يتم تحميل الموقع بسرعة فائقة، حتى أتمكن من استخدام الأدوات دون انتظار.

#### Acceptance Criteria

1. WHEN a user visits any page THEN the Miladak_System SHALL render the initial content within 1.5 seconds (LCP target)
2. WHEN the page loads THEN the Miladak_System SHALL achieve a Cumulative Layout Shift (CLS) score below 0.1
3. WHEN a user interacts with any element THEN the Miladak_System SHALL respond within 100 milliseconds (FID target)
4. WHEN the application builds THEN the Miladak_System SHALL produce optimized JavaScript bundles with code splitting per route
5. WHEN static assets are requested THEN the Miladak_System SHALL serve them with appropriate cache headers (1 year for immutable assets)

### Requirement 2: حاسبة العمر الرئيسية

**User Story:** كمستخدم، أريد حساب عمري بدقة مع إحصاءات مفصلة وممتعة، حتى أعرف معلومات شيقة عن حياتي.

#### Acceptance Criteria

1. WHEN a user enters a valid birth date THEN the Age_Calculator SHALL display the exact age in years, months, days, hours, minutes, and seconds
2. WHEN a user enters a birth date THEN the Age_Calculator SHALL calculate and display the Hijri (Islamic) calendar equivalent
3. WHEN age is calculated THEN the Age_Calculator SHALL display fun statistics (heartbeats, breaths, meals eaten, etc.)
4. WHEN age is calculated THEN the Age_Calculator SHALL show the zodiac sign (Western and Chinese) with descriptions
5. WHEN a user attempts to enter an invalid date THEN the Age_Calculator SHALL display a clear error message in Arabic
6. WHEN age data is serialized for storage THEN the Age_Calculator SHALL encode it using JSON format
7. WHEN age data is retrieved from storage THEN the Age_Calculator SHALL decode and validate the JSON structure

### Requirement 3: الأدوات الحسابية

**User Story:** كمستخدم، أريد الوصول لمجموعة متنوعة من الأدوات الحسابية المفيدة، حتى أستفيد من الموقع في جوانب متعددة من حياتي.

#### Acceptance Criteria

1. WHEN a user visits the tools page THEN the Miladak_System SHALL display all available tools organized by category
2. WHEN a user selects a tool THEN the Miladak_System SHALL load the tool page with proper SEO metadata
3. WHEN a user uses any calculator tool THEN the Tool SHALL validate inputs and display results immediately
4. WHEN a tool generates results THEN the Tool SHALL provide an option to share results on social media
5. WHEN tool data is serialized THEN the Tool SHALL encode calculation results using JSON format
6. WHEN tool data is parsed from user input THEN the Tool SHALL validate against expected data types

### Requirement 4: نظام المقالات

**User Story:** كمستخدم، أريد قراءة مقالات مفيدة متعلقة بالعمر والصحة، حتى أستفيد من محتوى إضافي قيّم.

#### Acceptance Criteria

1. WHEN a user visits the articles page THEN the Miladak_System SHALL display articles with pagination and category filtering
2. WHEN a user clicks on an article THEN the Miladak_System SHALL display the full article with proper formatting and images
3. WHEN an article page loads THEN the Miladak_System SHALL display related articles based on category and keywords
4. WHEN an article is viewed THEN the Miladak_System SHALL increment the view counter
5. WHEN article content is stored THEN the Miladak_System SHALL serialize it using JSON format for metadata
6. WHEN article content is retrieved THEN the Miladak_System SHALL parse and render the content correctly

### Requirement 5: تحسين محركات البحث المتقدم (Hybrid SEO)

**User Story:** كمالك موقع، أريد أن يظهر موقعي في النتيجة الأولى لمحركات البحث، حتى أحصل على أقصى زيارات عضوية.

#### Acceptance Criteria

1. WHEN any page loads THEN the Miladak_System SHALL include complete meta tags (title, description, keywords, Open Graph, Twitter Cards) with keyword density 2-3%
2. WHEN a page is rendered THEN the Miladak_System SHALL include multiple Structured_Data types (WebSite, Organization, WebApplication, FAQPage, HowTo, BreadcrumbList)
3. WHEN the sitemap is requested THEN the Miladak_System SHALL generate multiple XML sitemaps (main, tools, articles) with lastmod and priority
4. WHEN robots.txt is requested THEN the Miladak_System SHALL serve optimized crawling directives with sitemap references
5. WHEN a page URL is generated THEN the Miladak_System SHALL use SEO-friendly Arabic slugs with target keywords
6. WHEN structured data is generated THEN the Miladak_System SHALL serialize it as valid JSON-LD format
7. WHEN structured data is validated THEN the Miladak_System SHALL ensure round-trip consistency (serialize then parse produces equivalent data)
8. WHEN static pages are built THEN the Miladak_System SHALL use Static Site Generation (SSG) for tools and articles pages
9. WHEN dynamic content is needed THEN the Miladak_System SHALL use Incremental Static Regeneration (ISR) with revalidation
10. WHEN the homepage renders THEN the Miladak_System SHALL include the brand keyword "ميلادك" at least 15 times naturally
11. WHEN internal links are created THEN the Miladak_System SHALL use descriptive anchor text with target keywords
12. WHEN headings are structured THEN the Miladak_System SHALL follow proper H1-H6 hierarchy with keywords in H1 and H2

### Requirement 5.1: تحسين السرعة للسيو (Core Web Vitals)

**User Story:** كمالك موقع، أريد أن يحقق موقعي أعلى درجات Core Web Vitals، حتى يحصل على أفضلية في ترتيب Google.

#### Acceptance Criteria

1. WHEN measuring LCP THEN the Miladak_System SHALL achieve Largest Contentful Paint under 2.5 seconds
2. WHEN measuring FID THEN the Miladak_System SHALL achieve First Input Delay under 100 milliseconds
3. WHEN measuring CLS THEN the Miladak_System SHALL achieve Cumulative Layout Shift under 0.1
4. WHEN images are loaded THEN the Miladak_System SHALL use next/image with lazy loading and WebP/AVIF formats
5. WHEN fonts are loaded THEN the Miladak_System SHALL use font-display: swap with preloading
6. WHEN JavaScript is loaded THEN the Miladak_System SHALL use code splitting and dynamic imports
7. WHEN CSS is loaded THEN the Miladak_System SHALL inline critical CSS and defer non-critical styles

### Requirement 5.2: المحتوى الغني للسيو (Rich Content)

**User Story:** كمالك موقع، أريد محتوى غني ومفيد يجذب الزوار ومحركات البحث، حتى يزيد وقت البقاء في الموقع.

#### Acceptance Criteria

1. WHEN the homepage loads THEN the Miladak_System SHALL display at least 1500 words of unique Arabic content
2. WHEN a tool page loads THEN the Miladak_System SHALL include detailed description, how-to guide, and FAQ section
3. WHEN an article page loads THEN the Miladak_System SHALL display related articles and internal links
4. WHEN content is displayed THEN the Miladak_System SHALL use semantic HTML5 elements (article, section, aside, nav)
5. WHEN FAQ sections are rendered THEN the Miladak_System SHALL include FAQPage structured data for rich snippets
6. WHEN how-to content is displayed THEN the Miladak_System SHALL include HowTo structured data with steps

### Requirement 5.3: الروابط الداخلية والخارجية (Link Building)

**User Story:** كمالك موقع، أريد بنية روابط قوية داخل الموقع، حتى يفهم Google هيكل الموقع بشكل أفضل.

#### Acceptance Criteria

1. WHEN any page renders THEN the Miladak_System SHALL include breadcrumb navigation with BreadcrumbList structured data
2. WHEN tools are displayed THEN the Miladak_System SHALL link to related tools and articles
3. WHEN articles are displayed THEN the Miladak_System SHALL link to related tools and other articles
4. WHEN the footer renders THEN the Miladak_System SHALL include links to all main sections and important pages
5. WHEN navigation is displayed THEN the Miladak_System SHALL use descriptive link text instead of "اقرأ المزيد"

### Requirement 6: جاهزية Google AdSense

**User Story:** كمالك موقع، أريد أن يكون الموقع جاهزاً لعرض إعلانات AdSense، حتى أتمكن من تحقيق دخل من الموقع.

#### Acceptance Criteria

1. WHEN a page loads THEN the Miladak_System SHALL include designated AdSense_Slot positions that comply with AdSense policies
2. WHEN AdSense code is present THEN the Miladak_System SHALL load it asynchronously without blocking page render
3. WHEN content is displayed THEN the Miladak_System SHALL maintain clear separation between ads and content
4. WHEN a page is rendered THEN the Miladak_System SHALL ensure sufficient original content around ad placements
5. WHEN ad configuration is stored THEN the Miladak_System SHALL serialize it using JSON format

### Requirement 7: التصميم والواجهة

**User Story:** كمستخدم، أريد واجهة جميلة وسهلة الاستخدام تدعم العربية بشكل كامل، حتى أستمتع بتجربة استخدام مريحة.

#### Acceptance Criteria

1. WHEN the page loads THEN the Miladak_System SHALL display content in RTL_Layout with proper Arabic typography
2. WHEN a user toggles theme THEN the Miladak_System SHALL switch between light and dark modes with smooth transition
3. WHEN viewed on mobile devices THEN the Miladak_System SHALL display a fully responsive layout optimized for touch
4. WHEN a user navigates THEN the Miladak_System SHALL provide smooth page transitions without full page reloads
5. WHEN theme preference is stored THEN the Miladak_System SHALL serialize it using JSON format in localStorage
6. WHEN theme preference is retrieved THEN the Miladak_System SHALL parse and apply the stored preference

### Requirement 8: قاعدة البيانات والتخزين

**User Story:** كمطور، أريد نظام قاعدة بيانات موثوق وسريع، حتى يعمل الموقع بكفاءة مع البيانات التاريخية.

#### Acceptance Criteria

1. WHEN the application starts THEN the Miladak_System SHALL initialize SQLite database with optimized settings (WAL mode, proper cache)
2. WHEN data is queried THEN the Miladak_System SHALL use prepared statements with parameter binding for security
3. WHEN historical data is requested THEN the Miladak_System SHALL retrieve events, celebrities, and facts for the specified date
4. WHEN database schema is defined THEN the Miladak_System SHALL include proper indexes for frequently queried columns
5. WHEN database records are serialized THEN the Miladak_System SHALL encode complex fields using JSON format
6. WHEN database records are retrieved THEN the Miladak_System SHALL parse JSON fields and validate structure

### Requirement 9: الأمان والخصوصية

**User Story:** كمستخدم، أريد أن تكون بياناتي آمنة ومحمية، حتى أستخدم الموقع بثقة.

#### Acceptance Criteria

1. WHEN HTTP headers are sent THEN the Miladak_System SHALL include security headers (HSTS, X-Frame-Options, CSP)
2. WHEN user input is processed THEN the Miladak_System SHALL sanitize and validate all inputs
3. WHEN cookies are used THEN the Miladak_System SHALL display a consent banner compliant with privacy regulations
4. WHEN sensitive data is handled THEN the Miladak_System SHALL avoid storing personal information unnecessarily

### Requirement 10: التحليلات والمراقبة

**User Story:** كمالك موقع، أريد تتبع أداء الموقع وسلوك المستخدمين، حتى أتمكن من تحسين التجربة باستمرار.

#### Acceptance Criteria

1. WHEN a page loads THEN the Miladak_System SHALL track Core_Web_Vitals metrics
2. WHEN Google Analytics is configured THEN the Miladak_System SHALL send page views and events
3. WHEN errors occur THEN the Miladak_System SHALL log them appropriately for debugging
4. WHEN analytics data is collected THEN the Miladak_System SHALL serialize events using JSON format

### Requirement 11: مؤشرات التحميل الديناميكية

**User Story:** كمستخدم، أريد رؤية مؤشرات تحميل جذابة عند التنقل، حتى أعرف أن الموقع يستجيب لأوامري.

#### Acceptance Criteria

1. WHEN a user clicks on any navigation link THEN the Miladak_System SHALL display an animated loading indicator immediately
2. WHEN a page transition starts THEN the Miladak_System SHALL show a progress bar at the top of the page
3. WHEN content is loading THEN the Miladak_System SHALL display skeleton loaders that match the expected content layout
4. WHEN loading completes THEN the Miladak_System SHALL smoothly transition from loader to actual content
5. WHEN a calculation is processing THEN the Tool SHALL display a spinner with Arabic text indicating progress

### Requirement 12: شاشة الترحيب

**User Story:** كمستخدم جديد، أريد رؤية شاشة ترحيب جميلة تعبر عن محتوى الموقع، حتى أفهم قيمة الموقع من اللحظة الأولى.

#### Acceptance Criteria

1. WHEN a user visits the site for the first time THEN the Miladak_System SHALL display an animated welcome screen
2. WHEN the welcome screen appears THEN the Miladak_System SHALL show the site logo with smooth animation
3. WHEN the welcome screen displays THEN the Miladak_System SHALL present a brief tagline describing the site's purpose in Arabic
4. WHEN the welcome animation completes THEN the Miladak_System SHALL smoothly transition to the main content
5. WHEN a returning user visits THEN the Miladak_System SHALL skip the welcome screen based on localStorage flag
6. WHEN welcome screen preference is stored THEN the Miladak_System SHALL serialize it using JSON format

### Requirement 13: تصميم قوي وجذاب ومتطور

**User Story:** كمستخدم، أريد تصميماً عصرياً وجذاباً يبهرني من اللحظة الأولى، حتى أستمتع بتجربة بصرية استثنائية.

#### Acceptance Criteria

1. WHEN the site loads THEN the Miladak_System SHALL display a premium gradient color scheme (purple #8B5CF6, blue #3B82F6, emerald #10B981) with smooth transitions
2. WHEN components render THEN the Miladak_System SHALL use glassmorphism effects with backdrop-blur-md and semi-transparent backgrounds
3. WHEN interactive elements are hovered THEN the Miladak_System SHALL display smooth micro-animations with scale and glow effects
4. WHEN cards are displayed THEN the Miladak_System SHALL use rounded-2xl corners with layered shadows and hover lift effect
5. WHEN icons are shown THEN the Miladak_System SHALL use consistent Lucide icons with gradient coloring
6. WHEN the hero section loads THEN the Miladak_System SHALL display animated floating particles and gradient orbs
7. WHEN buttons are rendered THEN the Miladak_System SHALL use gradient backgrounds with hover glow and press feedback
8. WHEN sections scroll into view THEN the Miladak_System SHALL animate elements with fade-in and slide-up effects
9. WHEN statistics are displayed THEN the Miladak_System SHALL use animated counters with number formatting
10. WHEN dark mode is active THEN the Miladak_System SHALL use deep blue-gray tones with subtle purple accents

### Requirement 13.1: تأثيرات بصرية متقدمة

**User Story:** كمستخدم، أريد تأثيرات بصرية مبهرة تجعل الموقع يبدو احترافياً، حتى أشعر بجودة التجربة.

#### Acceptance Criteria

1. WHEN the background renders THEN the Miladak_System SHALL display animated gradient mesh with subtle movement
2. WHEN cards are hovered THEN the Miladak_System SHALL show 3D tilt effect with perspective transform
3. WHEN loading states appear THEN the Miladak_System SHALL use skeleton loaders with shimmer animation
4. WHEN success actions complete THEN the Miladak_System SHALL display confetti or celebration animations
5. WHEN tooltips appear THEN the Miladak_System SHALL animate with spring physics for natural feel
6. WHEN modals open THEN the Miladak_System SHALL use backdrop blur with smooth scale-in animation
7. WHEN page transitions occur THEN the Miladak_System SHALL use smooth fade and slide animations

### Requirement 13.2: تصميم البطاقات والمكونات

**User Story:** كمستخدم، أريد بطاقات ومكونات جميلة ومنظمة، حتى أجد المعلومات بسهولة.

#### Acceptance Criteria

1. WHEN tool cards are displayed THEN the Miladak_System SHALL show icon, title, description with gradient border on hover
2. WHEN article cards are displayed THEN the Miladak_System SHALL show image, category badge, title, excerpt with read time
3. WHEN stat cards are displayed THEN the Miladak_System SHALL show animated number, label, and trend indicator
4. WHEN feature cards are displayed THEN the Miladak_System SHALL show icon with glow, title, and description
5. WHEN calculator results are displayed THEN the Miladak_System SHALL use segmented cards with clear visual hierarchy

### Requirement 13.3: نظام الألوان الرباعي

**User Story:** كمستخدم، أريد اختيار نظام ألوان يناسب ذوقي من أربعة خيارات مميزة، حتى أستمتع بتجربة شخصية.

#### Acceptance Criteria

1. WHEN theme selector is displayed THEN the Miladak_System SHALL offer four theme options: System (النظام), Light (نهاري), Dark (ليلي), Miladak (ميلادك)
2. WHEN System theme is selected THEN the Miladak_System SHALL follow device preference using prefers-color-scheme media query
3. WHEN Light theme is selected THEN the Miladak_System SHALL use white backgrounds (#FFFFFF), gray-50 sections, and gray-900 text
4. WHEN Dark theme is selected THEN the Miladak_System SHALL use gray-900 backgrounds (#111827), gray-800 sections, and white text
5. WHEN Miladak theme is selected THEN the Miladak_System SHALL use deep purple-blue backgrounds (#0F0A1F), gradient accents, and glowing elements
6. WHEN Miladak theme is active THEN the Miladak_System SHALL display animated gradient mesh background with purple and blue hues
7. WHEN Miladak theme cards are rendered THEN the Miladak_System SHALL use glass effect with purple glow borders
8. WHEN Miladak theme buttons are displayed THEN the Miladak_System SHALL use neon glow effects with gradient fills
9. WHEN theme preference is stored THEN the Miladak_System SHALL persist selection in localStorage using JSON format
10. WHEN theme preference is retrieved THEN the Miladak_System SHALL apply the stored theme immediately on page load
11. WHEN System theme is active and device preference changes THEN the Miladak_System SHALL update theme automatically

### Requirement 13.4: وضع ميلادك الإبداعي (Miladak Theme)

**User Story:** كمستخدم، أريد تجربة وضع "ميلادك" الفريد والمبهر، حتى أشعر بتميز الموقع.

#### Acceptance Criteria

1. WHEN Miladak theme background renders THEN the Miladak_System SHALL display deep space-like gradient (#0F0A1F to #1A0F2E to #0D1B2A)
2. WHEN Miladak theme elements are displayed THEN the Miladak_System SHALL use glowing purple (#A855F7) and cyan (#06B6D4) accents
3. WHEN Miladak theme cards are hovered THEN the Miladak_System SHALL show neon border glow with pulse animation
4. WHEN Miladak theme hero section loads THEN the Miladak_System SHALL display floating stars and aurora-like effects
5. WHEN Miladak theme text is displayed THEN the Miladak_System SHALL use gradient text for headings (purple to cyan)
6. WHEN Miladak theme icons are shown THEN the Miladak_System SHALL apply subtle glow filter
7. WHEN Miladak theme buttons are pressed THEN the Miladak_System SHALL show ripple effect with glow
8. WHEN Miladak theme statistics are displayed THEN the Miladak_System SHALL use animated glowing numbers
9. WHEN Miladak theme navbar is rendered THEN the Miladak_System SHALL use glass effect with subtle purple tint

### Requirement 13.5: الألوان والتدرجات الأساسية

**User Story:** كمستخدم، أريد ألواناً متناسقة وجذابة في جميع الأوضاع، حتى يكون الموقع مريحاً للعين.

#### Acceptance Criteria

1. WHEN primary actions are displayed THEN the Miladak_System SHALL use purple-to-blue gradient (#8B5CF6 to #3B82F6)
2. WHEN secondary actions are displayed THEN the Miladak_System SHALL use emerald-to-teal gradient (#10B981 to #14B8A6)
3. WHEN success states are shown THEN the Miladak_System SHALL use green tones (#22C55E)
4. WHEN warning states are shown THEN the Miladak_System SHALL use amber tones (#F59E0B)
5. WHEN error states are shown THEN the Miladak_System SHALL use red tones (#EF4444)
6. WHEN accent colors are needed THEN the Miladak_System SHALL use cyan (#06B6D4) and pink (#EC4899)
7. WHEN gradients are applied THEN the Miladak_System SHALL use smooth 45-degree angles for visual appeal

### Requirement 14: تجربة موبايل مثل التطبيقات الأصلية

**User Story:** كمستخدم موبايل، أريد تجربة استخدام مثل التطبيقات الأصلية، حتى أشعر بسلاسة وجمال التفاعل.

#### Acceptance Criteria

1. WHEN viewed on mobile (width less than 640px) THEN the Miladak_System SHALL display app-like single-column layout with full-width cards
2. WHEN viewed on tablet (width 640px to 1024px) THEN the Miladak_System SHALL display a two-column grid layout
3. WHEN viewed on desktop (width greater than 1024px) THEN the Miladak_System SHALL display full multi-column layouts
4. WHEN touch gestures are used THEN the Miladak_System SHALL respond to swipe, tap, and long-press interactions
5. WHEN the navbar is displayed on mobile THEN the Miladak_System SHALL show a bottom navigation bar like native apps
6. WHEN scrolling on mobile THEN the Miladak_System SHALL hide/show navbar with smooth animation (iOS-style)
7. WHEN buttons are tapped on mobile THEN the Miladak_System SHALL show haptic-like visual feedback with ripple effect
8. WHEN cards are displayed on mobile THEN the Miladak_System SHALL use full-width rounded cards with subtle shadows
9. WHEN forms are displayed on mobile THEN the Miladak_System SHALL use large touch targets (min 44px) with clear labels
10. WHEN modals open on mobile THEN the Miladak_System SHALL slide up from bottom like native sheets

### Requirement 14.1: التنقل السفلي للموبايل (Bottom Navigation)

**User Story:** كمستخدم موبايل، أريد شريط تنقل سفلي سهل الوصول، حتى أتنقل بين الأقسام بإبهامي.

#### Acceptance Criteria

1. WHEN mobile view is active THEN the Miladak_System SHALL display a fixed bottom navigation bar with 5 main items
2. WHEN bottom nav items are displayed THEN the Miladak_System SHALL show icon and label for each item
3. WHEN an item is active THEN the Miladak_System SHALL highlight it with primary color and scale effect
4. WHEN bottom nav is rendered THEN the Miladak_System SHALL include: Home, Calculator, Tools, Articles, More
5. WHEN "More" is tapped THEN the Miladak_System SHALL show a slide-up menu with additional options
6. WHEN scrolling down THEN the Miladak_System SHALL optionally hide bottom nav to maximize content area
7. WHEN scrolling up THEN the Miladak_System SHALL show bottom nav again with smooth animation

### Requirement 14.2: تجربة اللمس والإيماءات

**User Story:** كمستخدم موبايل، أريد تفاعلات لمس سلسة وطبيعية، حتى أستمتع بالتنقل.

#### Acceptance Criteria

1. WHEN swiping left/right on cards THEN the Miladak_System SHALL navigate between items or reveal actions
2. WHEN pulling down on page THEN the Miladak_System SHALL show pull-to-refresh indicator
3. WHEN long-pressing on items THEN the Miladak_System SHALL show context menu with options
4. WHEN pinch-zooming on results THEN the Miladak_System SHALL allow zooming on detailed content
5. WHEN tapping quickly twice THEN the Miladak_System SHALL trigger quick actions where appropriate
6. WHEN touch feedback is needed THEN the Miladak_System SHALL use subtle scale and opacity changes

### Requirement 14.3: تصميم البطاقات للموبايل

**User Story:** كمستخدم موبايل، أريد بطاقات جميلة ومقروءة على شاشتي الصغيرة، حتى أرى المعلومات بوضوح.

#### Acceptance Criteria

1. WHEN tool cards are displayed on mobile THEN the Miladak_System SHALL use horizontal scroll or vertical list
2. WHEN article cards are displayed on mobile THEN the Miladak_System SHALL show image on top with text below
3. WHEN stat cards are displayed on mobile THEN the Miladak_System SHALL use 2x2 grid with compact design
4. WHEN calculator results are displayed on mobile THEN the Miladak_System SHALL use expandable accordion sections
5. WHEN cards are tapped on mobile THEN the Miladak_System SHALL show press state with scale-down effect

### Requirement 15: إبراز مميزات الموقع

**User Story:** كمستخدم، أريد رؤية مميزات الموقع بوضوح في الصفحة الرئيسية والنافبار، حتى أكتشف جميع الأدوات المتاحة.

#### Acceptance Criteria

1. WHEN the homepage loads THEN the Miladak_System SHALL display a featured tools section with the most popular tools
2. WHEN the navbar is displayed THEN the Miladak_System SHALL include quick access links to main features (Calculator, Tools, Articles)
3. WHEN the homepage renders THEN the Miladak_System SHALL show statistics about the site (number of tools, calculations performed)
4. WHEN tools are listed THEN the Miladak_System SHALL display tool icons and brief descriptions
5. WHEN a feature section loads THEN the Miladak_System SHALL animate elements into view on scroll

### Requirement 16: قاعدة بيانات موحدة

**User Story:** كمطور، أريد قاعدة بيانات موحدة تجمع كل البيانات، حتى يسهل إدارة وصيانة الموقع.

#### Acceptance Criteria

1. WHEN the database initializes THEN the Miladak_System SHALL create a single unified SQLite database file
2. WHEN data is stored THEN the Miladak_System SHALL use consistent table naming conventions in Arabic-friendly format
3. WHEN migrations run THEN the Miladak_System SHALL preserve existing data while updating schema
4. WHEN database is queried THEN the Miladak_System SHALL use a single connection pool for all operations
5. WHEN complex data is stored THEN the Miladak_System SHALL serialize nested objects using JSON format

### Requirement 17: لوحة التحكم الشاملة

**User Story:** كمدير موقع، أريد لوحة تحكم كاملة لإدارة المحتوى، حتى أتمكن من تحديث الموقع بسهولة.

#### Acceptance Criteria

1. WHEN an admin accesses the dashboard THEN the Miladak_System SHALL display statistics overview (articles, views, tools usage)
2. WHEN managing articles THEN the Admin_Panel SHALL provide CRUD operations with rich text editor
3. WHEN creating articles THEN the Admin_Panel SHALL offer AI-powered content generation and rewriting features
4. WHEN editing articles THEN the Admin_Panel SHALL provide SEO analysis and suggestions
5. WHEN managing categories THEN the Admin_Panel SHALL allow creating, editing, and deleting categories
6. WHEN managing tools THEN the Admin_Panel SHALL allow enabling/disabling and reordering tools
7. WHEN admin data is transmitted THEN the Admin_Panel SHALL serialize requests and responses using JSON format
8. WHEN admin authentication is performed THEN the Admin_Panel SHALL validate credentials securely

### Requirement 18: الأدوات المتخصصة (17 أداة)

**User Story:** كمستخدم، أريد الوصول لمجموعة متنوعة من الأدوات الحسابية المتخصصة، حتى أستفيد من الموقع في جوانب متعددة.

#### Acceptance Criteria

1. WHEN a user accesses age-in-seconds tool THEN the Tool SHALL calculate and display age in seconds, minutes, hours with live counter
2. WHEN a user accesses birthday-countdown tool THEN the Tool SHALL display countdown to next birthday with days, hours, minutes
3. WHEN a user accesses bmi-calculator tool THEN the Tool SHALL calculate BMI and display health category in Arabic
4. WHEN a user accesses calorie-calculator tool THEN the Tool SHALL calculate daily calorie needs based on activity level
5. WHEN a user accesses celebration-planner tool THEN the Tool SHALL suggest celebration ideas based on age milestones
6. WHEN a user accesses child-age tool THEN the Tool SHALL calculate child age with developmental milestones
7. WHEN a user accesses child-growth tool THEN the Tool SHALL track and display growth percentiles
8. WHEN a user accesses day-of-week tool THEN the Tool SHALL determine the day of week for any date
9. WHEN a user accesses days-between tool THEN the Tool SHALL calculate days between two dates
10. WHEN a user accesses event-countdown tool THEN the Tool SHALL display countdown to custom events
11. WHEN a user accesses generation-calculator tool THEN the Tool SHALL identify generation (Millennials, Gen Z, etc.)
12. WHEN a user accesses holidays-calculator tool THEN the Tool SHALL display upcoming holidays with countdown
13. WHEN a user accesses islamic-holidays-dates tool THEN the Tool SHALL display Islamic holidays with Hijri dates
14. WHEN a user accesses life-statistics tool THEN the Tool SHALL display fun life statistics (heartbeats, breaths, etc.)
15. WHEN a user accesses pregnancy-stages tool THEN the Tool SHALL calculate pregnancy week and display fetal development
16. WHEN a user accesses relative-age tool THEN the Tool SHALL compare ages between two people
17. WHEN a user accesses timezone-calculator tool THEN the Tool SHALL convert times between timezones

### Requirement 19: البيانات التاريخية والمشاهير

**User Story:** كمستخدم، أريد معرفة أحداث تاريخية ومشاهير ولدوا في نفس يومي، حتى أكتشف معلومات شيقة عن تاريخ ميلادي.

#### Acceptance Criteria

1. WHEN age is calculated THEN the Miladak_System SHALL display historical events that occurred on the birth date
2. WHEN age is calculated THEN the Miladak_System SHALL display famous people born on the same day
3. WHEN age is calculated THEN the Miladak_System SHALL display popular songs from the birth year
4. WHEN age is calculated THEN the Miladak_System SHALL display world statistics from the birth year
5. WHEN historical data is queried THEN the Miladak_System SHALL retrieve data from SQLite database efficiently
6. WHEN historical data is stored THEN the Miladak_System SHALL serialize complex fields using JSON format

### Requirement 20: مقارنة الأعمار مع الأصدقاء

**User Story:** كمستخدم، أريد مقارنة عمري مع أصدقائي، حتى أعرف فرق العمر بيننا بطريقة ممتعة.

#### Acceptance Criteria

1. WHEN a user adds a friend THEN the Miladak_System SHALL calculate and store the friend's age data
2. WHEN friends are added THEN the Miladak_System SHALL display age comparison with visual charts
3. WHEN comparing ages THEN the Miladak_System SHALL show who is older and by how much
4. WHEN friends data is stored THEN the Miladak_System SHALL persist it in localStorage using JSON format
5. WHEN friends data is retrieved THEN the Miladak_System SHALL parse and validate the JSON structure

### Requirement 21: بطاقات التهنئة

**User Story:** كمستخدم، أريد إنشاء بطاقات تهنئة جميلة بعيد الميلاد، حتى أشاركها مع أصدقائي.

#### Acceptance Criteria

1. WHEN a user creates a birthday card THEN the Miladak_System SHALL provide multiple template designs
2. WHEN customizing a card THEN the Miladak_System SHALL allow adding name, age, and custom message
3. WHEN a card is generated THEN the Miladak_System SHALL produce a downloadable image
4. WHEN sharing a card THEN the Miladak_System SHALL provide social media sharing options
5. WHEN card data is processed THEN the Miladak_System SHALL serialize customization options using JSON format

### Requirement 22: تحويل التاريخ الهجري/الميلادي

**User Story:** كمستخدم، أريد تحويل التواريخ بين التقويم الهجري والميلادي، حتى أعرف التاريخ المقابل.

#### Acceptance Criteria

1. WHEN a user enters a Gregorian date THEN the Date_Converter SHALL display the equivalent Hijri date
2. WHEN a user enters a Hijri date THEN the Date_Converter SHALL display the equivalent Gregorian date
3. WHEN converting dates THEN the Date_Converter SHALL use accurate Hijri calendar calculations
4. WHEN displaying results THEN the Date_Converter SHALL show day name in Arabic
5. WHEN date conversion is performed THEN the Date_Converter SHALL validate input format

### Requirement 23: حاسبة الحمل والولادة

**User Story:** كحامل، أريد حساب موعد ولادتي المتوقع ومتابعة مراحل الحمل، حتى أستعد للولادة.

#### Acceptance Criteria

1. WHEN a user enters last menstrual period date THEN the Pregnancy_Calculator SHALL calculate expected due date
2. WHEN pregnancy week is calculated THEN the Pregnancy_Calculator SHALL display current trimester
3. WHEN displaying pregnancy info THEN the Pregnancy_Calculator SHALL show fetal development details
4. WHEN pregnancy data is calculated THEN the Pregnancy_Calculator SHALL display remaining days until due date
5. WHEN pregnancy results are shown THEN the Pregnancy_Calculator SHALL provide week-by-week information

### Requirement 24: الأبراج والتوافق

**User Story:** كمستخدم، أريد معرفة برجي الفلكي والصيني مع صفاته، حتى أكتشف معلومات ممتعة عن شخصيتي.

#### Acceptance Criteria

1. WHEN age is calculated THEN the Miladak_System SHALL display Western zodiac sign with Arabic description
2. WHEN age is calculated THEN the Miladak_System SHALL display Chinese zodiac animal with characteristics
3. WHEN zodiac is displayed THEN the Miladak_System SHALL show birthstone and birth flower for the month
4. WHEN zodiac data is retrieved THEN the Miladak_System SHALL query from database efficiently
5. WHEN zodiac information is displayed THEN the Miladak_System SHALL include lucky colors and numbers



### Requirement 25: صفحات الموقع الأساسية

**User Story:** كمستخدم، أريد الوصول لجميع صفحات الموقع بسهولة، حتى أستفيد من كل الخدمات المتاحة.

#### Acceptance Criteria

1. WHEN a user visits "/" THEN the Miladak_System SHALL display the homepage with hero, calculator, tools, and content sections
2. WHEN a user visits "/tools" THEN the Miladak_System SHALL display all tools organized by category with search and filter
3. WHEN a user visits "/tools/[tool-slug]" THEN the Miladak_System SHALL display the specific tool page with calculator and content
4. WHEN a user visits "/articles" THEN the Miladak_System SHALL display articles list with pagination and category filter
5. WHEN a user visits "/articles/[slug]" THEN the Miladak_System SHALL display the full article with related articles
6. WHEN a user visits "/categories" THEN the Miladak_System SHALL display all article categories with article counts
7. WHEN a user visits "/pregnancy-calculator" THEN the Miladak_System SHALL display the pregnancy due date calculator
8. WHEN a user visits "/date-converter" THEN the Miladak_System SHALL display the Hijri-Gregorian date converter
9. WHEN a user visits "/cards" THEN the Miladak_System SHALL display the birthday card generator
10. WHEN a user visits "/friends" THEN the Miladak_System SHALL display the friends age comparison tool
11. WHEN a user visits "/historical" THEN the Miladak_System SHALL display historical events browser

### Requirement 26: صفحات Google الإلزامية

**User Story:** كمالك موقع، أريد صفحات قانونية متوافقة مع متطلبات Google AdSense، حتى يتم قبول موقعي.

#### Acceptance Criteria

1. WHEN a user visits "/privacy" THEN the Miladak_System SHALL display comprehensive privacy policy in Arabic
2. WHEN a user visits "/terms" THEN the Miladak_System SHALL display terms of service in Arabic
3. WHEN a user visits "/about" THEN the Miladak_System SHALL display about us page with site mission and team info
4. WHEN a user visits "/contact" THEN the Miladak_System SHALL display contact form with email and social links
5. WHEN a user visits "/sitemap" THEN the Miladak_System SHALL display HTML sitemap with all pages organized
6. WHEN privacy policy is displayed THEN the Miladak_System SHALL include sections for data collection, cookies, third-party services
7. WHEN terms of service is displayed THEN the Miladak_System SHALL include sections for usage rules, disclaimers, liability
8. WHEN about page is displayed THEN the Miladak_System SHALL include site description, features, and contact info
9. WHEN contact form is submitted THEN the Miladak_System SHALL validate inputs and send notification

### Requirement 27: صفحات لوحة التحكم

**User Story:** كمدير موقع، أريد لوحة تحكم شاملة لإدارة كل جوانب الموقع، حتى أتحكم في المحتوى بسهولة.

#### Acceptance Criteria

1. WHEN an admin visits "/admin" THEN the Miladak_System SHALL display dashboard with statistics and quick actions
2. WHEN an admin visits "/admin/articles" THEN the Miladak_System SHALL display articles management with CRUD operations
3. WHEN an admin visits "/admin/articles/new" THEN the Miladak_System SHALL display article creation form with rich editor
4. WHEN an admin visits "/admin/articles/[id]" THEN the Miladak_System SHALL display article edit form
5. WHEN an admin visits "/admin/categories" THEN the Miladak_System SHALL display categories management
6. WHEN an admin visits "/admin/tools" THEN the Miladak_System SHALL display tools management with enable/disable
7. WHEN an admin visits "/admin/settings" THEN the Miladak_System SHALL display site settings configuration
8. WHEN admin pages are accessed without authentication THEN the Miladak_System SHALL redirect to login page

### Requirement 28: صفحات الخطأ والحالات الخاصة

**User Story:** كمستخدم، أريد رؤية صفحات خطأ جميلة ومفيدة، حتى أعرف ماذا حدث وكيف أتصرف.

#### Acceptance Criteria

1. WHEN a user visits a non-existent page THEN the Miladak_System SHALL display custom 404 page with search and navigation
2. WHEN a server error occurs THEN the Miladak_System SHALL display custom 500 page with retry option
3. WHEN content is loading THEN the Miladak_System SHALL display loading page with skeleton and progress
4. WHEN offline mode is detected THEN the Miladak_System SHALL display offline page with cached content option
5. WHEN 404 page is displayed THEN the Miladak_System SHALL suggest popular pages and search functionality
6. WHEN error pages are displayed THEN the Miladak_System SHALL maintain consistent branding and navigation

### Requirement 29: صفحات SEO الإضافية

**User Story:** كمالك موقع، أريد صفحات إضافية تساعد في تحسين SEO، حتى يرتفع ترتيب الموقع.

#### Acceptance Criteria

1. WHEN "/sitemap.xml" is requested THEN the Miladak_System SHALL generate XML sitemap with all URLs
2. WHEN "/sitemap-tools.xml" is requested THEN the Miladak_System SHALL generate sitemap for all tools
3. WHEN "/sitemap-articles.xml" is requested THEN the Miladak_System SHALL generate sitemap for all articles
4. WHEN "/robots.txt" is requested THEN the Miladak_System SHALL serve optimized robots directives
5. WHEN "/manifest.json" is requested THEN the Miladak_System SHALL serve PWA manifest for app-like experience
6. WHEN "/rss.xml" is requested THEN the Miladak_System SHALL generate RSS feed for articles
7. WHEN canonical URLs are needed THEN the Miladak_System SHALL include proper canonical tags on all pages


### Requirement 30: ميزات مبتكرة لحساب العمر

**User Story:** كمستخدم، أريد ميزات فريدة ومبتكرة لحساب العمر، حتى أكتشف معلومات لا أجدها في مواقع أخرى.

#### Acceptance Criteria

1. WHEN age is calculated THEN the Miladak_System SHALL display "Age Milestones" showing past and upcoming life events (first day of school, driving age, voting age, etc.)
2. WHEN age is calculated THEN the Miladak_System SHALL show "Life Progress Bar" with percentage of average lifespan lived
3. WHEN age is calculated THEN the Miladak_System SHALL display "Time Capsule" showing what was happening in the world when user was born
4. WHEN age is calculated THEN the Miladak_System SHALL show "Age in Different Planets" (Mars years, Jupiter years, etc.)
5. WHEN age is calculated THEN the Miladak_System SHALL display "Biorhythm Chart" showing physical, emotional, and intellectual cycles
6. WHEN age is calculated THEN the Miladak_System SHALL show "Lucky Numbers" based on birth date numerology
7. WHEN age is calculated THEN the Miladak_System SHALL display "Season of Birth" with personality traits associated

### Requirement 31: مشاركة وتفاعل اجتماعي

**User Story:** كمستخدم، أريد مشاركة نتائجي مع أصدقائي بطرق جذابة، حتى أنشر الموقع وأستمتع مع الآخرين.

#### Acceptance Criteria

1. WHEN results are displayed THEN the Miladak_System SHALL provide "Share as Image" button generating beautiful shareable card
2. WHEN sharing is initiated THEN the Miladak_System SHALL offer WhatsApp, Twitter, Facebook, and copy link options
3. WHEN a shareable link is created THEN the Miladak_System SHALL include birth date parameter for instant calculation
4. WHEN shared content is viewed THEN the Miladak_System SHALL display rich Open Graph preview with age summary
5. WHEN results are generated THEN the Miladak_System SHALL offer "Download PDF Report" with detailed age analysis
6. WHEN comparing with friends THEN the Miladak_System SHALL generate comparison infographic for sharing

### Requirement 32: إشعارات وتذكيرات

**User Story:** كمستخدم، أريد تلقي تذكيرات بأعياد الميلاد والمناسبات، حتى لا أنسى المواعيد المهمة.

#### Acceptance Criteria

1. WHEN a user saves their birth date THEN the Miladak_System SHALL offer birthday reminder notification option
2. WHEN notification permission is granted THEN the Miladak_System SHALL send birthday countdown notifications
3. WHEN friends are added THEN the Miladak_System SHALL offer reminders for friends' birthdays
4. WHEN Islamic holidays approach THEN the Miladak_System SHALL offer notification for upcoming holidays
5. WHEN notification preferences are set THEN the Miladak_System SHALL store them in localStorage using JSON format

### Requirement 33: أدوات إضافية مبتكرة

**User Story:** كمستخدم، أريد أدوات إضافية مفيدة ومبتكرة، حتى أجد كل ما أحتاجه في موقع واحد.

#### Acceptance Criteria

1. WHEN a user accesses "Name Day Calculator" THEN the Tool SHALL find the saint's day or name day for Arabic names
2. WHEN a user accesses "Retirement Calculator" THEN the Tool SHALL calculate years until retirement based on country
3. WHEN a user accesses "Age Difference Calculator" THEN the Tool SHALL compare ages between any two people
4. WHEN a user accesses "Date Calculator" THEN the Tool SHALL add/subtract days, weeks, months, years from any date
5. WHEN a user accesses "Week Number Calculator" THEN the Tool SHALL show week number for any date
6. WHEN a user accesses "Moon Phase Calculator" THEN the Tool SHALL show moon phase for birth date
7. WHEN a user accesses "Season Calculator" THEN the Tool SHALL show which season any date falls in

### Requirement 34: تجربة مستخدم محسّنة

**User Story:** كمستخدم، أريد تجربة استخدام سلسة وممتعة، حتى أعود للموقع مراراً.

#### Acceptance Criteria

1. WHEN a user returns to the site THEN the Miladak_System SHALL remember their last calculated birth date
2. WHEN calculations are performed THEN the Miladak_System SHALL save history of recent calculations
3. WHEN a user scrolls THEN the Miladak_System SHALL show "Back to Top" button with smooth scroll
4. WHEN content is long THEN the Miladak_System SHALL show reading progress indicator
5. WHEN a user is idle THEN the Miladak_System SHALL show subtle animations to maintain engagement
6. WHEN keyboard shortcuts are used THEN the Miladak_System SHALL support common shortcuts (Enter to calculate, Esc to clear)
7. WHEN form fields are focused THEN the Miladak_System SHALL show helpful hints and auto-complete suggestions

### Requirement 35: محتوى تعليمي وترفيهي

**User Story:** كمستخدم، أريد محتوى تعليمي وترفيهي متعلق بالعمر والتواريخ، حتى أتعلم وأستمتع.

#### Acceptance Criteria

1. WHEN the homepage loads THEN the Miladak_System SHALL display "Did You Know?" facts about ages and dates
2. WHEN age is calculated THEN the Miladak_System SHALL show fun facts about the user's age group
3. WHEN a tool page loads THEN the Miladak_System SHALL include educational content about the calculation method
4. WHEN articles are displayed THEN the Miladak_System SHALL categorize them (Health, Celebrations, History, Tips)
5. WHEN seasonal events occur THEN the Miladak_System SHALL display themed content (Ramadan, Eid, New Year)
6. WHEN daily content is needed THEN the Miladak_System SHALL show "Today in History" section

### Requirement 36: إمكانية الوصول والشمولية

**User Story:** كمستخدم ذو احتياجات خاصة، أريد موقعاً يمكنني استخدامه بسهولة، حتى أستفيد من جميع الخدمات.

#### Acceptance Criteria

1. WHEN screen readers are used THEN the Miladak_System SHALL provide proper ARIA labels and roles
2. WHEN keyboard navigation is used THEN the Miladak_System SHALL support full keyboard accessibility
3. WHEN colors are displayed THEN the Miladak_System SHALL maintain WCAG 2.1 AA contrast ratios
4. WHEN text is displayed THEN the Miladak_System SHALL support text resizing up to 200%
5. WHEN animations are shown THEN the Miladak_System SHALL respect prefers-reduced-motion setting
6. WHEN forms are displayed THEN the Miladak_System SHALL include clear labels and error messages
7. WHEN focus is moved THEN the Miladak_System SHALL show visible focus indicators

### Requirement 37: الأداء والتحسين المستمر

**User Story:** كمالك موقع، أريد مراقبة أداء الموقع باستمرار، حتى أحافظ على جودة التجربة.

#### Acceptance Criteria

1. WHEN pages load THEN the Miladak_System SHALL track and report Core Web Vitals to analytics
2. WHEN errors occur THEN the Miladak_System SHALL log them with context for debugging
3. WHEN user interactions happen THEN the Miladak_System SHALL track engagement metrics
4. WHEN performance degrades THEN the Miladak_System SHALL alert through monitoring dashboard
5. WHEN A/B tests are needed THEN the Miladak_System SHALL support feature flags for testing
6. WHEN analytics data is collected THEN the Miladak_System SHALL serialize events using JSON format


### Requirement 38: قاعدة البيانات الشاملة

**User Story:** كمطور، أريد قاعدة بيانات شاملة تحتوي على كل البيانات التاريخية والمرجعية، حتى يقدم الموقع معلومات غنية.

#### Acceptance Criteria

1. WHEN database initializes THEN the Miladak_System SHALL create tables for: years, major_events, daily_events, popular_songs, famous_birthdays, daily_birthdays
2. WHEN database initializes THEN the Miladak_System SHALL create tables for: chinese_zodiac, birthstones, birth_flowers, seasons, lucky_colors
3. WHEN database initializes THEN the Miladak_System SHALL create tables for: articles, categories, admin_users, site_settings
4. WHEN database initializes THEN the Miladak_System SHALL create tables for: tools, tool_categories with proper relationships
5. WHEN years data is stored THEN the Miladak_System SHALL include facts and world_stats as JSON fields for each year (1900-2030)
6. WHEN daily events are stored THEN the Miladak_System SHALL include events for all 365 days with title, description, category
7. WHEN famous birthdays are stored THEN the Miladak_System SHALL include celebrities for each day with name, profession, birth_year
8. WHEN database is queried THEN the Miladak_System SHALL use optimized indexes for year, month, day lookups

### Requirement 39: نتائج حساب العمر التفصيلية

**User Story:** كمستخدم، أريد نتائج تفصيلية وشاملة عند حساب عمري، حتى أكتشف كل المعلومات الممكنة.

#### Acceptance Criteria

1. WHEN age is calculated THEN the Miladak_System SHALL display exact age in: years, months, weeks, days, hours, minutes, seconds
2. WHEN age is calculated THEN the Miladak_System SHALL display Hijri age with: years, months, days
3. WHEN age is calculated THEN the Miladak_System SHALL display next birthday countdown with: days, hours, minutes
4. WHEN age is calculated THEN the Miladak_System SHALL display total days lived, total weeks lived, total months lived
5. WHEN age is calculated THEN the Miladak_System SHALL display day of week born (Saturday, Sunday, etc.)
6. WHEN age is calculated THEN the Miladak_System SHALL display birth season (Spring, Summer, Fall, Winter)
7. WHEN age is calculated THEN the Miladak_System SHALL display generation name (Gen Z, Millennials, Gen X, etc.)

### Requirement 40: إحصاءات الحياة الممتعة

**User Story:** كمستخدم، أريد إحصاءات ممتعة ومدهشة عن حياتي، حتى أكتشف أرقاماً مثيرة للاهتمام.

#### Acceptance Criteria

1. WHEN age is calculated THEN the Miladak_System SHALL display estimated heartbeats (100,000/day average)
2. WHEN age is calculated THEN the Miladak_System SHALL display estimated breaths taken (20,000/day average)
3. WHEN age is calculated THEN the Miladak_System SHALL display estimated blinks (15,000/day average)
4. WHEN age is calculated THEN the Miladak_System SHALL display estimated meals eaten (3/day average)
5. WHEN age is calculated THEN the Miladak_System SHALL display estimated hours slept (8/day average)
6. WHEN age is calculated THEN the Miladak_System SHALL display estimated steps walked (5,000/day average)
7. WHEN age is calculated THEN the Miladak_System SHALL display estimated words spoken (16,000/day average)
8. WHEN age is calculated THEN the Miladak_System SHALL display estimated dreams had (4/night average)
9. WHEN age is calculated THEN the Miladak_System SHALL display estimated laughs (15/day average)
10. WHEN age is calculated THEN the Miladak_System SHALL display estimated cups of water (8/day average)

### Requirement 41: معلومات البرج والفلك

**User Story:** كمستخدم، أريد معرفة برجي وصفاته بالتفصيل، حتى أكتشف جوانب من شخصيتي.

#### Acceptance Criteria

1. WHEN age is calculated THEN the Miladak_System SHALL display Western zodiac sign with Arabic name and symbol
2. WHEN age is calculated THEN the Miladak_System SHALL display zodiac personality traits in Arabic
3. WHEN age is calculated THEN the Miladak_System SHALL display zodiac compatible signs
4. WHEN age is calculated THEN the Miladak_System SHALL display Chinese zodiac animal with characteristics
5. WHEN age is calculated THEN the Miladak_System SHALL display birthstone for the month with meaning
6. WHEN age is calculated THEN the Miladak_System SHALL display birth flower for the month with symbolism
7. WHEN age is calculated THEN the Miladak_System SHALL display lucky color for the month
8. WHEN age is calculated THEN the Miladak_System SHALL display lucky numbers based on birth date

### Requirement 42: الأحداث التاريخية والمشاهير

**User Story:** كمستخدم، أريد معرفة ماذا حدث في يوم ميلادي وسنة ميلادي، حتى أشعر بارتباط مع التاريخ.

#### Acceptance Criteria

1. WHEN age is calculated THEN the Miladak_System SHALL display major world events from birth year
2. WHEN age is calculated THEN the Miladak_System SHALL display famous people born in the same year
3. WHEN age is calculated THEN the Miladak_System SHALL display historical events on the exact birth date
4. WHEN age is calculated THEN the Miladak_System SHALL display celebrities sharing the same birthday
5. WHEN age is calculated THEN the Miladak_System SHALL display popular songs from birth year
6. WHEN age is calculated THEN the Miladak_System SHALL display world population at birth year
7. WHEN age is calculated THEN the Miladak_System SHALL display technology milestones from birth year
8. WHEN age is calculated THEN the Miladak_System SHALL display sports achievements from birth year

### Requirement 43: المقارنات والإنجازات

**User Story:** كمستخدم، أريد مقارنة عمري مع أحداث ومعالم مختلفة، حتى أضع عمري في سياق أوسع.

#### Acceptance Criteria

1. WHEN age is calculated THEN the Miladak_System SHALL compare age with famous historical figures at same age
2. WHEN age is calculated THEN the Miladak_System SHALL show achievements of famous people at user's current age
3. WHEN age is calculated THEN the Miladak_System SHALL display "You are older than X% of world population"
4. WHEN age is calculated THEN the Miladak_System SHALL show life expectancy comparison by country
5. WHEN age is calculated THEN the Miladak_System SHALL display upcoming age milestones (18, 21, 30, 40, 50, etc.)
6. WHEN age is calculated THEN the Miladak_System SHALL show "At your age, [famous person] did [achievement]"

### Requirement 44: التقويمات والتواريخ

**User Story:** كمستخدم، أريد معرفة تاريخ ميلادي بجميع التقويمات، حتى أحتفل بالمناسبات المختلفة.

#### Acceptance Criteria

1. WHEN age is calculated THEN the Miladak_System SHALL display birth date in Gregorian calendar
2. WHEN age is calculated THEN the Miladak_System SHALL display birth date in Hijri calendar
3. WHEN age is calculated THEN the Miladak_System SHALL display birth date in Chinese calendar
4. WHEN age is calculated THEN the Miladak_System SHALL display birth date in Persian calendar
5. WHEN age is calculated THEN the Miladak_System SHALL display birth date in Hebrew calendar
6. WHEN age is calculated THEN the Miladak_System SHALL display Julian day number
7. WHEN age is calculated THEN the Miladak_System SHALL display Unix timestamp of birth

### Requirement 45: العد التنازلي والمناسبات

**User Story:** كمستخدم، أريد معرفة الوقت المتبقي للمناسبات القادمة، حتى أستعد للاحتفال.

#### Acceptance Criteria

1. WHEN age is calculated THEN the Miladak_System SHALL display countdown to next birthday
2. WHEN age is calculated THEN the Miladak_System SHALL display countdown to next Hijri birthday
3. WHEN age is calculated THEN the Miladak_System SHALL display days until next age milestone
4. WHEN age is calculated THEN the Miladak_System SHALL display countdown to next Islamic holiday
5. WHEN age is calculated THEN the Miladak_System SHALL display countdown to New Year
6. WHEN age is calculated THEN the Miladak_System SHALL display days since last birthday


### Requirement 46: عرض النتائج بشكل جذاب ومبهر

**User Story:** كمستخدم، أريد رؤية نتائج حساب عمري بشكل جذاب ومبهر بصرياً، حتى أستمتع بالتجربة وأشاركها.

#### Acceptance Criteria

1. WHEN results are displayed THEN the Miladak_System SHALL show animated header with "نتائج مذهلة! 🎉" and personalized message
2. WHEN main age stats are shown THEN the Miladak_System SHALL display years, months, days in large gradient cards with icons
3. WHEN numbers are displayed THEN the Miladak_System SHALL use CountUp animation for smooth number reveal
4. WHEN Hijri age is shown THEN the Miladak_System SHALL display in separate highlighted card with moon icon
5. WHEN life stats are displayed THEN the Miladak_System SHALL show 8 cards in grid: heartbeats, breaths, sleep days, food kg, movies, steps, words, water
6. WHEN stat cards are rendered THEN the Miladak_System SHALL use gradient backgrounds with hover scale effect
7. WHEN results section loads THEN the Miladak_System SHALL animate elements with staggered fade-in and slide-up

### Requirement 47: قسم حقائق يوم الميلاد

**User Story:** كمستخدم، أريد معرفة حقائق مشوقة عن يوم ميلادي، حتى أكتشف أشياء فريدة.

#### Acceptance Criteria

1. WHEN birthday facts are displayed THEN the Miladak_System SHALL show 8 cards: Chinese zodiac, season, birthstone, birth flower, lucky color, lucky number, day of year, remaining days
2. WHEN fact cards are rendered THEN the Miladak_System SHALL use gradient icons with hover glow effect
3. WHEN famous birthdays are available THEN the Miladak_System SHALL display celebrities born on same day with name, profession, birth year
4. WHEN daily events are available THEN the Miladak_System SHALL display historical events on the birth date
5. WHEN cards are hovered THEN the Miladak_System SHALL show lift effect with scale 1.03 and y-offset -6px

### Requirement 48: قسم الإنجازات والشارات

**User Story:** كمستخدم، أريد رؤية إنجازاتي في الحياة كشارات جميلة، حتى أشعر بالفخر.

#### Acceptance Criteria

1. WHEN achievements are displayed THEN the Miladak_System SHALL show badge-style cards with emoji icons
2. WHEN achievement badges are rendered THEN the Miladak_System SHALL use gradient borders with white/dark inner background
3. WHEN badges are hovered THEN the Miladak_System SHALL show scale 1.1 with 5-degree rotation and sparkle icon
4. WHEN badges animate THEN the Miladak_System SHALL use spring animation with stiffness 200 and damping 15
5. WHEN achievements section loads THEN the Miladak_System SHALL show motivational message at bottom

### Requirement 49: قسم العالم عندما ولدت

**User Story:** كمستخدم، أريد معرفة كيف كان العالم عندما ولدت، حتى أشعر بارتباط مع التاريخ.

#### Acceptance Criteria

1. WHEN world stats are displayed THEN the Miladak_System SHALL show: world population, Egypt population, life expectancy, internet users, mobile phones
2. WHEN astronomical data is shown THEN the Miladak_System SHALL display: Earth rotations, Moon cycles since birth
3. WHEN personal journey is displayed THEN the Miladak_System SHALL show: heartbeats, breaths, steps, sleep hours/years, meals, blinks
4. WHEN year facts are shown THEN the Miladak_System SHALL display interesting facts about birth year
5. WHEN data cards are rendered THEN the Miladak_System SHALL use glass effect with colored icons

### Requirement 50: قسم الأحداث والأغاني

**User Story:** كمستخدم، أريد معرفة أهم الأحداث والأغاني في سنة ميلادي، حتى أكتشف ثقافة تلك الفترة.

#### Acceptance Criteria

1. WHEN major events are displayed THEN the Miladak_System SHALL show up to 20 events from birth year with bullet points
2. WHEN top songs are displayed THEN the Miladak_System SHALL show up to 20 popular songs from birth year
3. WHEN quotes section is shown THEN the Miladak_System SHALL display 4 motivational quotes based on age stage
4. WHEN content is loading THEN the Miladak_System SHALL show loading indicator with Arabic text
5. WHEN lists are long THEN the Miladak_System SHALL use scrollable container with max-height 72

### Requirement 51: قسم عيد الميلاد القادم

**User Story:** كمستخدم، أريد معرفة كم تبقى لعيد ميلادي القادم، حتى أستعد للاحتفال.

#### Acceptance Criteria

1. WHEN next birthday is displayed THEN the Miladak_System SHALL show days remaining with sparkle icon
2. WHEN countdown is shown THEN the Miladak_System SHALL display upcoming age number with cake emoji
3. WHEN progress bar is rendered THEN the Miladak_System SHALL show year progress percentage with gradient fill
4. WHEN birthday section is styled THEN the Miladak_System SHALL use gradient background from primary to secondary colors

### Requirement 52: أزرار المشاركة والتصدير

**User Story:** كمستخدم، أريد مشاركة نتائجي وتصديرها بطرق متعددة، حتى أحتفظ بها وأشاركها.

#### Acceptance Criteria

1. WHEN share options are displayed THEN the Miladak_System SHALL show: copy summary, save card image, print, download PDF, save results image
2. WHEN copy is clicked THEN the Miladak_System SHALL copy text summary to clipboard with success indicator
3. WHEN save card is clicked THEN the Miladak_System SHALL generate PNG image with beautiful design
4. WHEN print is clicked THEN the Miladak_System SHALL open print dialog with formatted results
5. WHEN PDF is clicked THEN the Miladak_System SHALL generate downloadable PDF report
6. WHEN social share is clicked THEN the Miladak_System SHALL open share dialog for WhatsApp, Twitter, Facebook

### Requirement 53: التحريكات والتأثيرات البصرية

**User Story:** كمستخدم، أريد تحريكات سلسة وتأثيرات بصرية جميلة، حتى تكون التجربة ممتعة.

#### Acceptance Criteria

1. WHEN elements appear THEN the Miladak_System SHALL use Framer Motion with opacity 0→1 and y 20→0
2. WHEN cards are hovered THEN the Miladak_System SHALL show scale effect with smooth transition 300ms
3. WHEN numbers count up THEN the Miladak_System SHALL use react-countup with Arabic number formatting
4. WHEN gradient text is displayed THEN the Miladak_System SHALL use animated gradient from purple to blue
5. WHEN glass effect is applied THEN the Miladak_System SHALL use backdrop-blur-md with semi-transparent background
6. WHEN icons are displayed THEN the Miladak_System SHALL use Lucide icons with consistent sizing
