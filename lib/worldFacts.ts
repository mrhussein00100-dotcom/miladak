import { formatNumber } from "@/lib/ageCalculations";
import { getLocalYearSongs } from "./yearSongs";
import { getLocalYearEvents } from "./yearEvents";

function sanitize(text: string): string {
  const noTags = text.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  // Remove footnote brackets, references, and wayback machine text
  let cleaned = noTags.replace(/\[[^\]]*\]/g, "");
  cleaned = cleaned.replace(/نسخة محفوظة.*?مشين\./g, "");
  cleaned = cleaned.replace(/على موقع واي باك مشين\.?/g, "");
  cleaned = cleaned.replace(/\^\s*/g, "");
  cleaned = cleaned.replace(/مؤرشف من.*$/g, "");
  cleaned = cleaned.replace(/اطلع عليه.*$/g, "");
  cleaned = cleaned.replace(/\{\{[^}]*\}\}/g, "");
  return cleaned.replace(/\s+/g, " ").trim();
}

// Egypt and Arab region priority
const EGYPT_KEYWORDS = [
  // Arabic
  "مصر", "مصري", "المصري", "المصرية", "القاهرة", "الإسكندرية", "الجيزة", "النيل", "سيناء", "الأقصر", "أسوان",
  // English
  "Egypt", "Egyptian", "Cairo", "Alexandria", "Giza", "Nile", "Sinai", "Luxor", "Aswan",
];
const ARAB_KEYWORDS = [
  // Gulf + Levant + North Africa (Arabic)
  "السعودية","الإمارات","قطر","الكويت","عمان","البحرين","الأردن","لبنان","سوريا","العراق","فلسطين","المغرب","الجزائر","تونس","ليبيا","السودان","اليمن","موريتانيا","الصومال","جيبوتي","جزر القمر",
  // English
  "Saudi","Emirati","UAE","Qatar","Kuwait","Oman","Bahrain","Jordan","Lebanon","Syria","Iraq","Palestine","Morocco","Algeria","Tunisia","Libya","Sudan","Yemen","Mauritania","Somalia","Djibouti","Comoros",
];

function regionScore(text: string): number {
  const t = (text || "").toLowerCase();
  for (const k of EGYPT_KEYWORDS) { if (t.includes(k.toLowerCase())) return 2; }
  for (const k of ARAB_KEYWORDS) { if (t.includes(k.toLowerCase())) return 1; }
  return 0;
}

function reorderByEgyptArab<T>(items: T[], proj: (x: T) => string): T[] {
  return items
    .map((x, i) => ({ x, i, s: regionScore(proj(x)) }))
    .sort((a, b) => (b.s - a.s) || (a.i - b.i))
    .map(o => o.x);
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: { "accept": "application/json" } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url, { headers: { "accept": "text/html" } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

export async function getOnThisDayEvents(date: Date, preferredLang: "ar" | "en" = "ar", max = 20): Promise<string[]> {
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const langs: ("ar" | "en")[] = preferredLang === "ar" ? ["ar", "en"] : ["en", "ar"];
  for (const lang of langs) {
    try {
      const url = `https://${lang}.wikipedia.org/api/rest_v1/feed/onthisday/events/${mm}/${dd}`;
      const data: any = await fetchJson(url);
      const items = Array.isArray(data?.events) ? data.events : [];
      if (items.length) {
        let result = items.map((it: any) => {
          const y = typeof it.year === "number" ? formatNumber(it.year) : "";
          const text = sanitize(String(it.text ?? ""));
          return y ? `${y} — ${text}` : text;
        });
        // Reorder by Egypt then Arab priority
        result = reorderByEgyptArab<string>(result, x => x as string);
        if (result.length) return result.slice(0, max);
      }
    } catch {}
  }
  return [];
}

async function wikiSearchAr(query: string, limit = 10): Promise<string[]> {
  const url = `https://ar.wikipedia.org/w/api.php?origin=*&action=query&list=search&srsearch=${encodeURIComponent(query)}&srlimit=${limit}&utf8=1&format=json`;
  const data: any = await fetchJson(url);
  const items = Array.isArray(data?.query?.search) ? data.query.search : [];
  const titles = items.map((it: any) => sanitize(String(it?.title || ""))).filter(Boolean);
  return titles;
}

function extractListItemsFromHTML(html: string): string[] {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const lis = Array.from(doc.querySelectorAll("li"));
    let lines = lis.map(li => sanitize(li.textContent || "")).filter(Boolean);
    
    // Remove exact duplicates first
    lines = [...new Set(lines)];
    
    // Filter out unwanted content
    lines = lines.filter(line => {
      const lower = line.toLowerCase();
      
      // MUST have Arabic characters
      if (!hasArabic(line)) return false;
      
      // Exclude references, wayback machine, footnotes
      if (line.startsWith("^")) return false;
      if (line.includes("نسخة محفوظة")) return false;
      if (line.includes("واي باك مشين")) return false;
      if (line.includes("مؤرشف من")) return false;
      if (line.includes("اطلع عليه")) return false;
      if (line.includes("استشهاد")) return false;
      if (line.includes("تحقق من التاريخ")) return false;
      
      // EXCLUDE ALL death/obituary/violence content
      const excludeKeywords = [
        // Death/obituary
        "رحيل", "وفاة", "وفاته", "وفاتها", "توفي", "توفى", "توفيت", 
        "وداع", "ودعنا", "فقدنا", "رحل", "رحلت", "فقد", "فارق", 
        "الراحل", "الراحلة", "المرحوم", "المرحومة", "ذكرى وفاة",
        "ذكرى رحيل", "يفقد", "تفقد", "صراع مع المرض", "بعد معاناة",
        "الفقيد", "الفقيدة", "موت", "موته", "غياب", "رحمة الله", "الله يرحمه",
        "قضى", "قضت", "قضى نحبه", "انتقل", "انتقلت", "يرحل", "ترحل",
        // Violence/military
        "قُتل", "قُتلت", "قتل", "قتلت", "قتلوا", "استشهد", "استشهاد", "شهيد", "شهداء",
        "أُسِر", "أُسرت", "أسر", "اعتقل", "اعتقال", "معتقل",
        "هجوم", "هجمات", "تفجير", "انفجار", "قصف", "غارة", "ضربة",
        "معركة", "حرب", "نزاع", "صراع", "اشتباك", "مواجهة",
        "إرهاب", "إرهابي", "متطرف", "جهاد", "جهادي",
        "عملية عسكرية", "عملية انتحارية", "تنظيم", "جماعة مسلحة",
        "عدوان", "احتلال", "غزو", "ضد المسلمين", "ضد المدنيين",
        // Sensitive political/religious groups
        "القاعدة", "داعش", "الدولة الإسلامية", "جماعة الجهاد", "الجماعة الإسلامية",
        "أبو", "ابن لادن", "الزرقاوي", "الظواهري"
      ];
      for (const keyword of excludeKeywords) {
        if (line.includes(keyword)) return false;
      }
      
      // Exclude list patterns (name, age, nationality OR name with parentheses like combat names)
      if (line.match(/^[^،]+،\s*\d+،/)) return false;
      if (line.match(/^[^(]+\([^)]+\)\s*\./)) return false; // Pattern: Name (status).
      if (line.match(/^أبو\s+\w+\s+المصري/)) return false; // Abu X al-Masri pattern
      
      // Exclude standalone month names
      if (AR_MONTHS.includes(line) || EN_MONTHS.includes(line)) return false;
      
      // Exclude very short lines
      if (line.length < 20) return false;
      
      // Exclude metadata patterns
      if (line.includes("الاسم، العمر")) return false;
      if (line.match(/^\d{4}$/)) return false; // Just years
      
      // Exclude lines that have significant English (more than 20% Latin chars)
      const latinChars = (line.match(/[a-zA-Z]/g) || []).length;
      const totalChars = line.replace(/\s/g, "").length;
      if (totalChars > 0 && latinChars / totalChars > 0.2) return false;
      
      // Extra check: must have reasonable Arabic content (at least 60% Arabic)
      const arabicChars = (line.match(/[\u0600-\u06FF]/g) || []).length;
      if (totalChars > 0 && arabicChars / totalChars < 0.6) return false;
      
      // Exclude very generic/vague statements without substance
      if (line.match(/^[\u0600-\u06FF\s]+\s*\.$/) && line.length < 30) return false;
      
      // Prefer lines with verbs/actions indicating events (opened, signed, announced, etc.)
      // This is a positive filter - we prefer substantive events
      const hasPositiveIndicators = /افتتح|افتتاح|أعلن|إعلان|وقع|توقيع|أطلق|إطلاق|اكتشف|اكتشاف|اخترع|اختراع|بنى|بناء|تأسس|تأسيس|فاز|فوز|نال|حصل|منح|أنشأ|إنشاء|بدأ|بدأت|أقيم|إقامة|أقيمت|عقد|عقدت/.test(line);
      const hasYear = /\d{4}/.test(line); // Events should ideally have years
      
      // If line is short and has no positive indicators, be more strict
      if (line.length < 35 && !hasPositiveIndicators && !hasYear) return false;
      
      // Prefer lines that describe actual events (with context)
      // Not just standalone nouns
      const wordsCount = line.split(/\s+/).length;
      if (wordsCount < 3) return false; // Too short to be meaningful
      
      return true;
    });
    
    // Further clean lines to make them more readable
    lines = lines.map(line => {
      // Remove leading/trailing punctuation artifacts
      line = line.replace(/^[،.:\-\s]+/, "").replace(/[،.:\s]+$/, "");
      // Ensure it ends with proper punctuation
      if (line && !line.match(/[.!؟]$/)) line += ".";
      return line;
    }).filter(Boolean);
    
    return lines;
  } catch { return []; }
}

// Arabic month names and English month names for exact-date pages
const EN_MONTHS = [
  "January","February","March","April","May","June","July","August","September","October","November","December"
];
const AR_MONTHS = [
  "يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"
];

function hasArabic(text: string): boolean {
  return /[\u0600-\u06FF]/.test(text || "");
}

function isMainlyArabic(text: string): boolean {
  const arabicChars = (text.match(/[\u0600-\u06FF]/g) || []).length;
  const totalChars = text.replace(/[\s،.!؟]/g, "").length;
  return totalChars > 0 && arabicChars / totalChars > 0.7;
}

function preferArabicLines(lines: string[]): string[] {
  // Return ONLY Arabic lines, no English fallback
  return lines.filter(hasArabic);
}

async function mwParseSections(lang: "ar"|"en", title: string): Promise<any[]> {
  const url = `https://${lang}.wikipedia.org/w/api.php?origin=*&action=parse&page=${encodeURIComponent(title)}&prop=sections&format=json`;
  const data: any = await fetchJson(url);
  return data?.parse?.sections || [];
}

async function mwParseSectionHTML(lang: "ar"|"en", title: string, index: string): Promise<string> {
  const url = `https://${lang}.wikipedia.org/w/api.php?origin=*&action=parse&page=${encodeURIComponent(title)}&prop=text&section=${encodeURIComponent(index)}&format=json`;
  const data: any = await fetchJson(url);
  const html = data?.parse?.text?.["*"] ?? "";
  return html;
}

async function mwParseFullHTML(lang: "ar"|"en", title: string): Promise<string> {
  const url = `https://${lang}.wikipedia.org/w/api.php?origin=*&action=parse&page=${encodeURIComponent(title)}&prop=text&format=json`;
  const data: any = await fetchJson(url);
  const html = data?.parse?.text?.["*"] ?? "";
  return html;
}

export async function getYearMajorEvents(year: number, preferredLang: "ar" | "en" = "ar", max = 20): Promise<string[]> {
  // ALWAYS use local database - it has clear, diverse, and well-curated events
  const localEvents = getLocalYearEvents(year);
  if (localEvents.length >= 9) {
    return localEvents.slice(0, max);
  }
  
  // If local database doesn't have enough, try Wikipedia as fallback
  const langs: ("ar" | "en")[] = preferredLang === "ar" ? ["ar", "en"] : ["en", "ar"];
  // Egypt-first page titles to try before general year page
  const egyptTitles = [
    { lang: "ar" as const, title: `${year}_في_مصر` },
    { lang: "en" as const, title: `${year}_in_Egypt` },
  ];
  // Try Egypt-specific pages first
  for (const et of egyptTitles) {
    try {
      const sections = await mwParseSections(et.lang, et.title);
      const needle = et.lang === "ar" ? ["أحداث", "الأحداث", "حدث"] : ["Events"];
      const sec = sections.find((s: any) => needle.some(n => String(s?.line || "").includes(n)));
      let html = "";
      if (sec?.index) html = await mwParseSectionHTML(et.lang, et.title, String(sec.index));
      if (!html) html = await mwParseFullHTML(et.lang, et.title);
      const lines = preferArabicLines(reorderByEgyptArab<string>(extractListItemsFromHTML(html), x => x as string)).slice(0, max);
      if (lines.length) {
        // Combine local events with Wikipedia, prioritizing local
        const combined = [...localEvents, ...lines];
        return combined.slice(0, max);
      }
    } catch {}
  }
  for (const lang of langs) {
    try {
      const title = String(year);
      const sections = await mwParseSections(lang, title);
      const needle = lang === "ar" ? ["أحداث", "الأحداث", "حدث"] : ["Events"];
      const sec = sections.find((s: any) => needle.some(n => String(s?.line || "").includes(n)));
      if (sec?.index) {
        const html = await mwParseSectionHTML(lang, title, String(sec.index));
        const lines = preferArabicLines(reorderByEgyptArab<string>(extractListItemsFromHTML(html), x => x as string)).slice(0, max);
        if (lines.length) {
          const combined = [...localEvents, ...lines];
          return combined.slice(0, max);
        }
      }
      // Fallback: whole page list items
      const full = await mwParseFullHTML(lang, title);
      const lines = preferArabicLines(reorderByEgyptArab<string>(extractListItemsFromHTML(full), x => x as string)).slice(0, max);
      if (lines.length) {
        const combined = [...localEvents, ...lines];
        return combined.slice(0, max);
      }
    } catch {}
  }
  // Return local events even if Wikipedia failed
  return localEvents.slice(0, max);
}

export async function getYearTopSongs(year: number, preferredLang: "ar" | "en" = "ar", max = 20): Promise<string[]> {
  const candidates = [
    // Egyptian/Arabic MUSIC-SPECIFIC pages only
    { lang: "ar" as const, title: `${year}_في_الموسيقى_المصرية` },
    { lang: "ar" as const, title: `موسيقى_مصرية_${year}` },
    { lang: "ar" as const, title: `${year}_في_الموسيقى_العربية` },
    { lang: "ar" as const, title: `${year}_في_الموسيقى` },
    { lang: "ar" as const, title: `موسيقى_${year}` },
    { lang: "ar" as const, title: `أغاني_${year}` },
    // English - ONLY Arabic music pages
    { lang: "en" as const, title: `${year}_in_Arabic_music` },
    { lang: "en" as const, title: `${year}_in_Egyptian_music` },
  ];
  for (const c of candidates) {
    try {
      const sections = await mwParseSections(c.lang as any, c.title);
      const arNeedle = ["أغاني", "الأغاني", "الأغاني المنفردة", "أشهر الأغاني", "أفضل المبيعات", "القوائم"];
      const enNeedle = ["Singles", "songs", "number-one", "best-selling", "charts", "Top songs", "Best-selling singles"];
      const needle = c.lang === "ar" ? arNeedle : enNeedle;
      let html = "";
      // Try multiple likely sections
      for (const s of sections) {
        if (needle.some(n => String(s?.line || "").toLowerCase().includes(n.toLowerCase()))) {
          html = await mwParseSectionHTML(c.lang as any, c.title, String(s.index));
          if (html) break;
        }
      }
      if (!html) html = await mwParseFullHTML(c.lang as any, c.title);
      const all = extractListItemsFromHTML(html);
      // Heuristic filter: keep items that look like song entries ONLY
      let filtered = all.filter(t => {
        // Must have Arabic characters OR common song patterns
        const hasArabicText = /[\u0600-\u06FF]/.test(t);
        const hasSongPattern = /[-–—]|"|"|"|\(|\)|»|«/.test(t);
        if (!hasArabicText && !hasSongPattern) return false;
        
        // EXCLUDE event-like patterns (avoid getting events instead of songs)
        // Events often have action verbs like opened, signed, announced
        const hasEventPattern = /افتتح|افتتاح|أعلن|إعلان|وقع|توقيع|بدأ|بدأت|تأسس|أقيم|عقد/.test(t);
        if (hasEventPattern) return false;
        
        // Songs typically have artist/song structure with "-" or quotes
        // Prefer lines that look like: "Song Name" - Artist or Artist - Song
        const lookLikeSong = /[-–—]/.test(t) || /[""«»]/.test(t) || t.includes("–") || t.includes("-");
        
        return t.length > 5 && (lookLikeSong || hasArabicText);
      });
      // Apply Egypt/Arab reordering and Arabic preference
      filtered = reorderByEgyptArab<string>(filtered, x => x as string);
      // Strongly prefer Arabic lines
      const arabicFiltered = filtered.filter(hasArabic);
      if (arabicFiltered.length >= 5) {
        return arabicFiltered.slice(0, max);
      }
      // If not enough Arabic, return what we have
      if (filtered.length) return filtered.slice(0, max);
    } catch {}
  }
  // Fallback to local database - ALWAYS return Arabic/Egyptian songs
  return getLocalYearSongs(year).slice(0, max);
}

export async function getExactDateEvents(date: Date, preferredLang: "ar" | "en" = "ar", max = 15): Promise<string[]> {
  const y = date.getFullYear();
  const m = date.getMonth();
  const d = date.getDate();
  const mm = String(m + 1).padStart(2, "0");
  const dd = String(d).padStart(2, "0");
  const enTitle = `Portal:Current events/${y} ${EN_MONTHS[m]} ${d}`;
  const arMonth = AR_MONTHS[m];
  const arCandidates = [
    `بوابة:أحداث جارية/${d} ${arMonth} ${y}`,
    `بوابة:أحداث جارية/${y} ${arMonth} ${d}`,
    `بوابة:أحداث جارية/${y}/${mm}/${dd}`,
    `بوابة:أحداث_جارية/${y}/${mm}/${dd}`,
    `${d}_${arMonth}_${y}`,
    `${y}/${mm}/${dd}`,
  ];

  // Arabic pages first
  for (const title of arCandidates) {
    try {
      const html = await mwParseFullHTML("ar", title);
      if (html) {
        let lines = extractListItemsFromHTML(html);
        lines = reorderByEgyptArab<string>(lines, x => x as string);
        lines = preferArabicLines(lines);
        if (lines.length) return lines.slice(0, max);
      }
    } catch {}
  }
  
  // Search Wikipedia Arabic for date-specific events
  try {
    const queries = [
      `${d} ${arMonth} ${y} أحداث`,
      `${d} ${arMonth} ${y} مصر`,
      `${y} ${arMonth} ${d}`,
      `أحداث ${d} ${arMonth} ${y}`,
    ];
    for (const q of queries) {
      const results = await wikiSearchAr(q, 5);
      for (const pageTitle of results) {
        try {
          const html = await mwParseFullHTML("ar", pageTitle);
          if (html) {
            let lines = extractListItemsFromHTML(html);
            lines = lines.filter(hasArabic);
            lines = reorderByEgyptArab<string>(lines, x => x as string);
            if (lines.length >= 3) return lines.slice(0, max);
          }
        } catch {}
      }
    }
  } catch {}

  // Try general year page in Arabic and extract relevant date section
  try {
    const html = await mwParseFullHTML("ar", String(y));
    if (html) {
      let lines = extractListItemsFromHTML(html);
      lines = lines.filter(hasArabic);
      lines = reorderByEgyptArab<string>(lines, x => x as string);
      if (lines.length) return lines.slice(0, max);
    }
  } catch {}

  // If no Arabic content found at all, return empty rather than showing English
  return [];
}
