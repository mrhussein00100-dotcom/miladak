// مشاهير عرب ومصريين حسب تاريخ الميلاد (يوم/شهر)
// البيانات مرتبة حسب الشهر واليوم

interface Celebrity {
  name: string;
  profession: string;
  birthYear: number;
}

// قاعدة بيانات المشاهير حسب "MM-DD" format
export const CELEBRITIES_BY_DATE: Record<string, Celebrity[]> = {
  // يناير
  "01-01": [
    { name: "فاروق الفيشاوي", profession: "ممثل مصري", birthYear: 1952 }
  ],
  "01-02": [
    { name: "أحمد عز", profession: "ممثل مصري", birthYear: 1971 }
  ],
  "01-03": [
    { name: "محمد الشرنوبي", profession: "مغني مصري", birthYear: 1990 }
  ],
  "01-04": [
    { name: "عمرو محمود ياسين", profession: "ممثل مصري", birthYear: 1985 }
  ],
  "01-05": [
    { name: "نور", profession: "مغنية مصرية", birthYear: 1977 }
  ],
  "01-06": [
    { name: "محمد العدل", profession: "ممثل مصري", birthYear: 1945 }
  ],
  "01-07": [
    { name: "هالة سرحان", profession: "مذيعة مصرية", birthYear: 1970 }
  ],
  "01-08": [
    { name: "محمد أبو داود", profession: "ممثل مصري", birthYear: 1976 }
  ],
  "01-09": [
    { name: "هيثم أحمد زكي", profession: "ممثل مصري", birthYear: 1984 }
  ],
  "01-10": [
    { name: "منى زكي", profession: "ممثلة مصرية", birthYear: 1976 }
  ],
  "01-11": [
    { name: "ياسر جلال", profession: "ممثل مصري", birthYear: 1973 }
  ],
  "01-12": [
    { name: "سامح الصريطي", profession: "مخرج مصري", birthYear: 1940 }
  ],
  "01-13": [
    { name: "أحمد بدوي", profession: "ممثل مصري", birthYear: 1974 }
  ],
  "01-14": [
    { name: "صابرين", profession: "ممثلة مصرية", birthYear: 1964 }
  ],
  "01-15": [
    { name: "نيللي كريم", profession: "ممثلة مصرية", birthYear: 1977 }
  ],
  "01-16": [
    { name: "أحمد داوود", profession: "ممثل مصري", birthYear: 1978 }
  ],
  "01-17": [
    { name: "مصطفى فهمي", profession: "ممثل مصري", birthYear: 1939 }
  ],
  "01-18": [
    { name: "أحمد كمال", profession: "ممثل مصري", birthYear: 1975 }
  ],
  "01-19": [
    { name: "فاروق الفيشاوي", profession: "ممثل مصري", birthYear: 1952 }
  ],
  "01-20": [
    { name: "أحمد السعدني", profession: "ممثل مصري", birthYear: 1979 }
  ],
  "01-21": [
    { name: "محمد الحلو", profession: "ممثل مصري", birthYear: 1976 }
  ],
  "01-22": [
    { name: "سماح أنور", profession: "ممثلة مصرية", birthYear: 1975 }
  ],
  "01-23": [
    { name: "محمد عبد العزيز", profession: "ممثل مصري", birthYear: 1980 }
  ],
  "01-24": [
    { name: "لقاء الخميسي", profession: "ممثلة مصرية", birthYear: 1976 }
  ],
  "01-25": [
    { name: "غادة عبد الرازق", profession: "ممثلة مصرية", birthYear: 1965 }
  ],
  "01-26": [
    { name: "رانيا فريد شوقي", profession: "ممثلة مصرية", birthYear: 1965 }
  ],
  "01-27": [
    { name: "عمرو قابيل", profession: "ممثل مصري", birthYear: 1980 }
  ],
  "01-28": [
    { name: "محمد الباز", profession: "صحفي مصري", birthYear: 1975 }
  ],
  "01-29": [
    { name: "خالد النبوي", profession: "ممثل مصري", birthYear: 1966 }
  ],
  "01-30": [
    { name: "أحمد نادر جلال", profession: "ممثل مصري", birthYear: 1991 }
  ],
  "01-31": [
    { name: "ريم مصطفى", profession: "ممثلة مصرية", birthYear: 1988 }
  ],
  
  // فبراير
  "02-01": [
    { name: "أحمد البدري", profession: "ممثل مصري", birthYear: 1949 }
  ],
  "02-02": [
    { name: "شاكيرا", profession: "مغنية كولومبية", birthYear: 1977 }
  ],
  "02-03": [
    { name: "أحمد حسن", profession: "لاعب كرة قدم مصري", birthYear: 1975 }
  ],
  "02-04": [
    { name: "محمد فريد", profession: "ممثل مصري", birthYear: 1978 }
  ],
  "02-05": [
    { name: "محمود عبد المغني", profession: "ممثل مصري", birthYear: 1939 }
  ],
  "02-06": [
    { name: "عمرو واكد", profession: "ممثل مصري", birthYear: 1973 }
  ],
  "02-07": [
    { name: "أشرف زكي", profession: "ممثل مصري", birthYear: 1960 }
  ],
  "02-08": [
    { name: "محمد عبد الله", profession: "ممثل مصري", birthYear: 1980 }
  ],
  "02-09": [
    { name: "أحمد زاهر", profession: "ممثل مصري", birthYear: 1970 }
  ],
  "02-10": [
    { name: "ليلى علوي", profession: "ممثلة مصرية", birthYear: 1961 }
  ],
  "02-11": [
    { name: "محمد هنيدي", profession: "ممثل مصري", birthYear: 1965 }
  ],
  "02-12": [
    { name: "سامح سعيد", profession: "ممثل مصري", birthYear: 1975 }
  ],
  "02-13": [
    { name: "أحمد صيام", profession: "ممثل مصري", birthYear: 1980 }
  ],
  "02-14": [
    { name: "أحمد عبد العزيز", profession: "ممثل مصري", birthYear: 1945 }
  ],
  "02-15": [
    { name: "أحمد السقا", profession: "ممثل مصري", birthYear: 1973 }
  ],
  "02-16": [
    { name: "محمد السبكي", profession: "منتج مصري", birthYear: 1970 }
  ],
  "02-17": [
    { name: "نجم", profession: "مغني مصري", birthYear: 1979 }
  ],
  "02-18": [
    { name: "محمود حميدة", profession: "ممثل مصري", birthYear: 1953 }
  ],
  "02-19": [
    { name: "محمد صلاح العزب", profession: "ممثل مصري", birthYear: 1965 }
  ],
  "02-20": [
    { name: "رانيا يوسف", profession: "ممثلة مصرية", birthYear: 1973 }
  ],
  "02-21": [
    { name: "عزة الحناوي", profession: "ممثلة مصرية", birthYear: 1946 }
  ],
  "02-22": [
    { name: "نور الشريف", profession: "ممثل مصري", birthYear: 1946 }
  ],
  "02-23": [
    { name: "سمير غانم", profession: "ممثل كوميدي مصري", birthYear: 1937 }
  ],
  "02-24": [
    { name: "كريم عبد العزيز", profession: "ممثل مصري", birthYear: 1975 }
  ],
  "02-25": [
    { name: "أحمد فؤاد سليم", profession: "ممثل مصري", birthYear: 1948 }
  ],
  "02-26": [
    { name: "محمد فريد", profession: "ممثل مصري", birthYear: 1981 }
  ],
  "02-27": [
    { name: "عمرو جمال", profession: "لاعب كرة قدم مصري", birthYear: 1984 }
  ],
  "02-28": [
    { name: "علي الحجار", profession: "مغني مصري", birthYear: 1964 }
  ],
  "02-29": [
    { name: "أحمد مراد", profession: "مؤلف مصري", birthYear: 1978 }
  ],
  
  // مارس
  "03-01": [
    { name: "دنيا سمير غانم", profession: "ممثلة مصرية", birthYear: 1985 },
    { name: "إليسا", profession: "مغنية لبنانية", birthYear: 1972 },
    { name: "محمد صبحي", profession: "ممثل مصري", birthYear: 1948 }
  ],
  "03-02": [
    { name: "أحمد السقا", profession: "ممثل مصري", birthYear: 1973 },
    { name: "صابرين", profession: "ممثلة مصرية", birthYear: 1967 }
  ],
  "03-03": [
    { name: "محمد منير", profession: "ممثل ومخرج مصري", birthYear: 1948 },
    { name: "شذى حسون", profession: "مغنية عراقية", birthYear: 1981 }
  ],
  "03-04": [
    { name: "محمد العربي", profession: "ممثل مصري", birthYear: 1946 },
    { name: "جمال عبد الناصر", profession: "ممثل مصري", birthYear: 1959 }
  ],
  "03-05": [
    { name: "سناء جميل", profession: "ممثلة مصرية", birthYear: 1930 },
    { name: "أحمد رزق", profession: "ممثل مصري", birthYear: 1976 }
  ],
  "03-06": [
    { name: "غادة رجب", profession: "مغنية مصرية", birthYear: 1979 },
    { name: "شعبان عبد الرحيم", profession: "مغني مصري", birthYear: 1957 }
  ],
  "03-07": [
    { name: "حنان ترك", profession: "ممثلة مصرية", birthYear: 1975 },
    { name: "إيمي سمير غانم", profession: "ممثلة مصرية", birthYear: 1987 }
  ],
  "03-08": [
    { name: "عادل إمام", profession: "ممثل مصري", birthYear: 1940 },
    { name: "عبد الرحمن أبو زهرة", profession: "ممثل مصري", birthYear: 1934 }
  ],
  "03-09": [
    { name: "سعاد نصر", profession: "ممثلة مصرية", birthYear: 1953 },
    { name: "يوسف شعبان", profession: "ممثل مصري", birthYear: 1931 }
  ],
  "03-10": [
    { name: "يسرا", profession: "ممثلة مصرية", birthYear: 1955 },
    { name: "أسامة عباس", profession: "ممثل مصري", birthYear: 1939 }
  ],
  "03-11": [
    { name: "سعاد حسني", profession: "ممثلة مصرية", birthYear: 1943 },
    { name: "محمد متولي", profession: "ممثل مصري", birthYear: 1945 }
  ],
  "03-12": [
    { name: "سعيد صالح", profession: "ممثل مصري", birthYear: 1938 },
    { name: "أحمد رمزي", profession: "ممثل مصري", birthYear: 1930 }
  ],
  "03-13": [
    { name: "محمود الجندي", profession: "ممثل مصري", birthYear: 1945 },
    { name: "عبد الله محمود", profession: "ممثل مصري", birthYear: 1964 }
  ],
  "03-14": [
    { name: "صفية العمري", profession: "ممثلة مصرية", birthYear: 1949 },
    { name: "نيكول سابا", profession: "مغنية لبنانية", birthYear: 1974 }
  ],
  "03-15": [
    { name: "فيروز", profession: "ممثلة ومغنية مصرية", birthYear: 1943 },
    { name: "شعبان حسين", profession: "ممثل مصري", birthYear: 1940 }
  ],
  "03-16": [
    { name: "حنان مطاوع", profession: "ممثلة مصرية", birthYear: 1979 },
    { name: "رزان مغربي", profession: "مذيعة ومغنية لبنانية", birthYear: 1973 }
  ],
  "03-17": [
    { name: "دينا", profession: "راقصة وممثلة مصرية", birthYear: 1965 },
    { name: "سيد زيان", profession: "ممثل مصري", birthYear: 1943 }
  ],
  "03-18": [
    { name: "يحيى الفخراني", profession: "ممثل مصري", birthYear: 1945 },
    { name: "خالد الصاوي", profession: "ممثل مصري", birthYear: 1963 }
  ],
  "03-19": [
    { name: "عزت أبو عوف", profession: "ممثل مصري", birthYear: 1948 },
    { name: "هالة فاخر", profession: "ممثلة مصرية", birthYear: 1948 }
  ],
  "03-20": [
    { name: "حمادة هلال", profession: "مغني وممثل مصري", birthYear: 1980 },
    { name: "رغدة", profession: "ممثلة سورية", birthYear: 1957 }
  ],
  "03-21": [
    { name: "نزار قباني", profession: "شاعر سوري", birthYear: 1923 },
    { name: "ياسمين رئيس", profession: "ممثلة مصرية", birthYear: 1985 }
  ],
  "03-22": [
    { name: "نادية الجندي", profession: "ممثلة مصرية", birthYear: 1946 },
    { name: "حسين فهمي", profession: "ممثل مصري", birthYear: 1940 }
  ],
  "03-23": [
    { name: "أحمد مكي", profession: "ممثل ومغني مصري", birthYear: 1978 },
    { name: "طارق العريان", profession: "مخرج مصري", birthYear: 1963 }
  ],
  "03-24": [
    { name: "نادية لطفي", profession: "ممثلة مصرية", birthYear: 1937 },
    { name: "مرام البلوشي", profession: "مغنية كويتية", birthYear: 1979 }
  ],
  "03-25": [
    { name: "باسم يوسف", profession: "إعلامي مصري", birthYear: 1974 },
    { name: "غادة عادل", profession: "ممثلة مصرية", birthYear: 1974 }
  ],
  "03-26": [
    { name: "سيد رجب", profession: "ممثل مصري", birthYear: 1950 },
    { name: "شريف سلامة", profession: "ممثل مصري", birthYear: 1979 }
  ],
  "03-27": [
    { name: "كندة علوش", profession: "ممثلة سورية", birthYear: 1982 },
    { name: "مي سليم", profession: "ممثلة مصرية", birthYear: 1983 }
  ],
  "03-28": [
    { name: "أحمد زكي", profession: "ممثل مصري", birthYear: 1949 },
    { name: "سوسن بدر", profession: "ممثلة مصرية", birthYear: 1957 }
  ],
  "03-29": [
    { name: "سلافة معمار", profession: "ممثلة سورية", birthYear: 1976 },
    { name: "فتحي عبد الوهاب", profession: "ممثل مصري", birthYear: 1971 }
  ],
  "03-30": [
    { name: "عبد الحليم حافظ", profession: "مغني مصري", birthYear: 1929 },
    { name: "علي الحجار", profession: "مغني مصري", birthYear: 1954 }
  ],
  "03-31": [
    { name: "إيمي سمير غانم", profession: "ممثلة مصرية", birthYear: 1987 },
    { name: "ياسمين صبري", profession: "ممثلة مصرية", birthYear: 1987 }
  ],

  // أبريل
  "04-01": [
    { name: "جومانا مراد", profession: "ممثلة سورية", birthYear: 1973 },
    { name: "قصي خولي", profession: "ممثل سوري", birthYear: 1976 }
  ],
  "04-02": [
    { name: "عمرو يوسف", profession: "ممثل مصري", birthYear: 1980 },
    { name: "درة زروق", profession: "ممثلة تونسية", birthYear: 1980 }
  ],
  "04-03": [
    { name: "جوليا بطرس", profession: "مغنية لبنانية", birthYear: 1968 },
    { name: "سوسن بدر", profession: "ممثلة مصرية", birthYear: 1957 }
  ],
  "04-04": [
    { name: "علي ربيع", profession: "ممثل مصري", birthYear: 1989 },
    { name: "هيثم شاكر", profession: "مغني مصري", birthYear: 1983 }
  ],
  "04-05": [
    { name: "إيمان العاصي", profession: "ممثلة مصرية", birthYear: 1985 },
    { name: "هشام ماجد", profession: "ممثل مصري", birthYear: 1980 }
  ],
  "04-06": [
    { name: "جومانا مراد", profession: "ممثلة سورية", birthYear: 1973 },
    { name: "أحمد فهمي", profession: "ممثل مصري", birthYear: 1980 }
  ],
  "04-07": [
    { name: "وليد توفيق", profession: "مغني لبناني", birthYear: 1954 },
    { name: "يحيى الفخراني", profession: "ممثل مصري", birthYear: 1945 }
  ],
  "04-08": [
    { name: "مي عز الدين", profession: "ممثلة مصرية", birthYear: 1980 },
    { name: "طارق العريان", profession: "مخرج مصري", birthYear: 1963 }
  ],
  "04-09": [
    { name: "يوسف الخال", profession: "ممثل لبناني", birthYear: 1977 },
    { name: "سلاف فواخرجي", profession: "ممثلة سورية", birthYear: 1977 }
  ],
  "04-10": [
    { name: "عمر الشريف", profession: "ممثل مصري", birthYear: 1932 },
    { name: "مي نور الشريف", profession: "ممثلة مصرية", birthYear: 1981 }
  ],
  "04-11": [
    { name: "نور", profession: "ممثلة لبنانية", birthYear: 1977 },
    { name: "أحمد بدير", profession: "ممثل مصري", birthYear: 1947 }
  ],
  "04-12": [
    { name: "إسعاد يونس", profession: "ممثلة ومذيعة مصرية", birthYear: 1950 },
    { name: "تامر هجرس", profession: "ممثل مصري", birthYear: 1972 }
  ],
  "04-13": [
    { name: "أحلام", profession: "مغنية إماراتية", birthYear: 1968 },
    { name: "روجينا", profession: "ممثلة مصرية", birthYear: 1973 }
  ],
  "04-14": [
    { name: "مروان خوري", profession: "مغني لبناني", birthYear: 1968 },
    { name: "أحمد السعدني", profession: "ممثل مصري", birthYear: 1979 }
  ],
  "04-15": [
    { name: "يوسف الشريف", profession: "ممثل مصري", birthYear: 1978 },
    { name: "كارول سماحة", profession: "مغنية لبنانية", birthYear: 1972 }
  ],
  "04-16": [
    { name: "روجينا", profession: "ممثلة مصرية", birthYear: 1973 },
    { name: "عمار الشريعي", profession: "موسيقار مصري", birthYear: 1948 }
  ],
  "04-17": [
    { name: "سعيد صالح", profession: "ممثل مصري", birthYear: 1938 },
    { name: "عبلة كامل", profession: "ممثلة مصرية", birthYear: 1960 }
  ],
  "04-18": [
    { name: "حمادة هلال", profession: "مغني وممثل مصري", birthYear: 1980 },
    { name: "بسمة", profession: "ممثلة مصرية", birthYear: 1976 }
  ],
  "04-19": [
    { name: "شيري عادل", profession: "ممثلة مصرية", birthYear: 1988 },
    { name: "أحمد مكي", profession: "ممثل مصري", birthYear: 1980 }
  ],
  "04-20": [
    { name: "رامز جلال", profession: "ممثل ومقدم برامج مصري", birthYear: 1973 },
    { name: "حنان ترك", profession: "ممثلة مصرية", birthYear: 1975 }
  ],
  "04-21": [
    { name: "سيد رجب", profession: "ممثل مصري", birthYear: 1950 },
    { name: "صلاح السعدني", profession: "ممثل مصري", birthYear: 1943 }
  ],
  "04-22": [
    { name: "فيفي عبده", profession: "ممثلة وراقصة مصرية", birthYear: 1953 },
    { name: "هشام عباس", profession: "مغني مصري", birthYear: 1963 }
  ],
  "04-23": [
    { name: "أحمد زاهر", profession: "ممثل مصري", birthYear: 1975 },
    { name: "منة شلبي", profession: "ممثلة مصرية", birthYear: 1982 }
  ],
  "04-24": [
    { name: "شريف منير", profession: "ممثل مصري", birthYear: 1959 },
    { name: "يسرا اللوزي", profession: "ممثلة مصرية", birthYear: 1985 }
  ],
  "04-25": [
    { name: "محمد رياض", profession: "ممثل مصري", birthYear: 1970 },
    { name: "خالد النبوي", profession: "ممثل مصري", birthYear: 1966 }
  ],
  "04-26": [
    { name: "فيفي عبده", profession: "ممثلة مصرية", birthYear: 1953 },
    { name: "هشام ماجد", profession: "ممثل مصري", birthYear: 1980 }
  ],
  "04-27": [
    { name: "هند صبري", profession: "ممثلة تونسية", birthYear: 1979 },
    { name: "رامي عياش", profession: "مغني لبناني", birthYear: 1980 }
  ],
  "04-28": [
    { name: "نور الشريف", profession: "ممثل مصري", birthYear: 1946 },
    { name: "مصطفى قمر", profession: "مغني مصري", birthYear: 1966 }
  ],
  "04-29": [
    { name: "نانسي عجرم", profession: "مغنية لبنانية", birthYear: 1983 },
    { name: "أحمد زاهر", profession: "ممثل مصري", birthYear: 1975 }
  ],
  "04-30": [
    { name: "عاصي الحلاني", profession: "مغني لبناني", birthYear: 1970 },
    { name: "حسن الرداد", profession: "ممثل مصري", birthYear: 1984 }
  ],
  
  // مايو
  "05-01": [
    { name: "صلاح السعدني", profession: "ممثل مصري", birthYear: 1936 }
  ],
  "05-02": [
    { name: "محمد سعد", profession: "ممثل كوميدي مصري", birthYear: 1968 }
  ],
  "05-03": [
    { name: "هشام سليم", profession: "ممثل مصري", birthYear: 1953 }
  ],
  "05-04": [
    { name: "عمرو دياب", profession: "مغني مصري", birthYear: 1961 }
  ],
  "05-05": [
    { name: "رجاء الجداوي", profession: "ممثلة مصرية", birthYear: 1938 }
  ],
  "05-06": [
    { name: "أحمد الفيشاوي", profession: "ممثل مصري", birthYear: 1980 }
  ],
  "05-07": [
    { name: "ليلى زاهر", profession: "ممثلة مصرية", birthYear: 1977 }
  ],
  "05-08": [
    { name: "محمد عادل إمام", profession: "مخرج مصري", birthYear: 1973 }
  ],
  "05-09": [
    { name: "هالة صدقي", profession: "ممثلة مصرية", birthYear: 1961 }
  ],
  "05-10": [
    { name: "ياسمين صبري", profession: "ممثلة مصرية", birthYear: 1990 }
  ],
  "05-11": [
    { name: "أحمد بدير", profession: "ممثل مصري", birthYear: 1950 }
  ],
  "05-12": [
    { name: "كريم فهمي", profession: "ممثل مصري", birthYear: 1976 }
  ],
  "05-13": [
    { name: "هاني رمزي", profession: "ممثل مصري", birthYear: 1969 }
  ],
  "05-14": [
    { name: "حنان ترك", profession: "ممثلة مصرية", birthYear: 1975 }
  ],
  "05-15": [
    { name: "محمد رجب", profession: "ممثل مصري", birthYear: 1978 }
  ],
  "05-16": [
    { name: "نجوى كرم", profession: "مغنية لبنانية", birthYear: 1966 }
  ],
  "05-17": [
    { name: "منة شلبي", profession: "ممثلة مصرية", birthYear: 1982 }
  ],
  "05-18": [
    { name: "روبي", profession: "مغنية مصرية", birthYear: 1981 }
  ],
  "05-19": [
    { name: "سمير صبري", profession: "ممثل مصري", birthYear: 1936 }
  ],
  "05-20": [
    { name: "نبيلة عبيد", profession: "ممثلة مصرية", birthYear: 1945 }
  ],
  "05-21": [
    { name: "محمود حميدة", profession: "ممثل مصري", birthYear: 1953 }
  ],
  "05-22": [
    { name: "لبلبة", profession: "ممثلة مصرية", birthYear: 1945 }
  ],
  "05-23": [
    { name: "أمل رزق", profession: "ممثلة مصرية", birthYear: 1974 }
  ],
  "05-24": [
    { name: "سمير غانم", profession: "ممثل كوميدي مصري", birthYear: 1937 }
  ],
  "05-25": [
    { name: "نيكول سابا", profession: "مغنية وممثلة لبنانية", birthYear: 1974 }
  ],
  "05-26": [
    { name: "إيمان العاصي", profession: "ممثلة مصرية", birthYear: 1980 }
  ],
  "05-27": [
    { name: "أحمد راتب", profession: "ممثل مصري", birthYear: 1949 }
  ],
  "05-28": [
    { name: "مني زكي", profession: "ممثلة مصرية", birthYear: 1976 }
  ],
  "05-29": [
    { name: "ماجد المصري", profession: "ممثل مصري", birthYear: 1970 }
  ],
  "05-30": [
    { name: "أحمد صلاح حسني", profession: "ممثل مصري", birthYear: 1985 }
  ],
  "05-31": [
    { name: "شريهان", profession: "ممثلة مصرية", birthYear: 1964 }
  ],
  
  // يونيو
  "06-01": [
    { name: "أحمد حلمي", profession: "ممثل مصري", birthYear: 1969 }
  ],
  "06-02": [
    { name: "عمرو سعد", profession: "ممثل مصري", birthYear: 1971 }
  ],
  "06-03": [
    { name: "سيد رجب", profession: "ممثل مصري", birthYear: 1960 }
  ],
  "06-04": [
    { name: "خالد سليم", profession: "مغني مصري", birthYear: 1970 }
  ],
  "06-05": [
    { name: "ماجد الكدواني", profession: "ممثل مصري", birthYear: 1971 }
  ],
  "06-06": [
    { name: "شيرين عبد الوهاب", profession: "مغنية مصرية", birthYear: 1980 }
  ],
  "06-07": [
    { name: "محمود الليثي", profession: "مغني شعبي مصري", birthYear: 1970 }
  ],
  "06-08": [
    { name: "محمد عبد الرحمن", profession: "ممثل مصري", birthYear: 1950 }
  ],
  "06-09": [
    { name: "هنا شيحة", profession: "ممثلة مصرية", birthYear: 1985 }
  ],
  "06-10": [
    { name: "كندة علوش", profession: "ممثلة سورية", birthYear: 1982 }
  ],
  "06-11": [
    { name: "بيومي فؤاد", profession: "ممثل مصري", birthYear: 1972 }
  ],
  "06-12": [
    { name: "أحمد مكي", profession: "ممثل ومغني مصري", birthYear: 1977 }
  ],
  "06-13": [
    { name: "علي ربيع", profession: "ممثل كوميدي مصري", birthYear: 1989 }
  ],
  "06-14": [
    { name: "ريم البارودي", profession: "ممثلة مصرية", birthYear: 1976 }
  ],
  "06-15": [
    { name: "محمد فؤاد", profession: "مغني مصري", birthYear: 1961 }
  ],
  "06-16": [
    { name: "محمد نور", profession: "ممثل مصري", birthYear: 1966 }
  ],
  "06-17": [
    { name: "طارق لطفي", profession: "ممثل مصري", birthYear: 1975 }
  ],
  "06-18": [
    { name: "خالد أبو النجا", profession: "ممثل مصري", birthYear: 1966 }
  ],
  "06-19": [
    { name: "هشام ماجد", profession: "ممثل مصري", birthYear: 1980 }
  ],
  "06-20": [
    { name: "كريم محمود عبد العزيز", profession: "ممثل مصري", birthYear: 1988 }
  ],
  "06-21": [
    { name: "آسر ياسين", profession: "ممثل مصري", birthYear: 1981 }
  ],
  "06-22": [
    { name: "محمد هنيدي", profession: "ممثل مصري", birthYear: 1965 }
  ],
  "06-23": [
    { name: "أحمد فتحي", profession: "ممثل مصري", birthYear: 1978 }
  ],
  "06-24": [
    { name: "محمد لطفي", profession: "ممثل مصري", birthYear: 1970 }
  ],
  "06-25": [
    { name: "عمرو يوسف", profession: "ممثل مصري", birthYear: 1980 }
  ],
  "06-26": [
    { name: "أحمد عيد", profession: "ممثل مصري", birthYear: 1980 }
  ],
  "06-27": [
    { name: "كريم قاسم", profession: "ممثل مصري", birthYear: 1973 }
  ],
  "06-28": [
    { name: "محمد شاهين", profession: "ممثل مصري", birthYear: 1980 }
  ],
  "06-29": [
    { name: "ياسر علي ماهر", profession: "ممثل مصري", birthYear: 1980 }
  ],
  "06-30": [
    { name: "مصطفى خاطر", profession: "ممثل مصري", birthYear: 1986 }
  ],
  
  // يوليو
  "07-01": [
    { name: "عز", profession: "مغنية مصرية", birthYear: 1984 }
  ],
  "07-02": [
    { name: "محمد رحيم", profession: "ممثل مصري", birthYear: 1979 }
  ],
  "07-03": [
    { name: "أكرم حسني", profession: "ممثل مصري", birthYear: 1980 }
  ],
  "07-04": [
    { name: "رامي صبري", profession: "مغني مصري", birthYear: 1978 }
  ],
  "07-05": [
    { name: "محمد رمضان", profession: "ممثل ومغني مصري", birthYear: 1988 }
  ],
  "07-06": [
    { name: "إنجي وجدان", profession: "ممثلة مصرية", birthYear: 1976 }
  ],
  "07-07": [
    { name: "أحمد صفوت", profession: "ممثل مصري", birthYear: 1970 }
  ],
  "07-08": [
    { name: "أمير كرارة", profession: "ممثل مصري", birthYear: 1977 }
  ],
  "07-09": [
    { name: "درة", profession: "ممثلة مصرية", birthYear: 1987 }
  ],
  "07-10": [
    { name: "جومانا مراد", profession: "ممثلة مصرية", birthYear: 1984 }
  ],
  "07-11": [
    { name: "أحمد فلوكس", profession: "ممثل مصري", birthYear: 1980 }
  ],
  "07-12": [
    { name: "حمادة هلال", profession: "مغني مصري", birthYear: 1980 }
  ],
  "07-13": [
    { name: "إيمي سمير غانم", profession: "ممثلة مصرية", birthYear: 1987 }
  ],
  "07-14": [
    { name: "محمد ممدوح", profession: "ممثل مصري", birthYear: 1984 }
  ],
  "07-15": [
    { name: "يسرا", profession: "ممثلة مصرية", birthYear: 1955 }
  ],
  "07-16": [
    { name: "أحمد عبد الله محمود", profession: "ممثل مصري", birthYear: 1980 }
  ],
  "07-17": [
    { name: "ريهام عبد الغفور", profession: "ممثلة مصرية", birthYear: 1987 }
  ],
  "07-18": [
    { name: "خالد زكي", profession: "ممثل مصري", birthYear: 1974 }
  ],
  "07-19": [
    { name: "نسرين طافش", profession: "ممثلة سورية", birthYear: 1986 }
  ],
  "07-20": [
    { name: "إدوارد", profession: "ممثل مصري", birthYear: 1969 }
  ],
  "07-21": [
    { name: "تامر حسني", profession: "مغني وممثل مصري", birthYear: 1977 }
  ],
  "07-22": [
    { name: "زينة", profession: "ممثلة مصرية", birthYear: 1977 }
  ],
  "07-23": [
    { name: "هاني عادل", profession: "مغني مصري", birthYear: 1985 }
  ],
  "07-24": [
    { name: "أحمد السيد", profession: "ممثل مصري", birthYear: 1981 }
  ],
  "07-25": [
    { name: "محمد علي", profession: "ممثل مصري", birthYear: 1988 }
  ],
  "07-26": [
    { name: "سلمى أبو ضيف", profession: "ممثلة مصرية", birthYear: 1991 }
  ],
  "07-27": [
    { name: "مروان يونس", profession: "ممثل مصري", birthYear: 1985 }
  ],
  "07-28": [
    { name: "نهى عابدين", profession: "ممثلة مصرية", birthYear: 1988 }
  ],
  "07-29": [
    { name: "محمد هشام عبية", profession: "ممثل مصري", birthYear: 1985 }
  ],
  "07-30": [
    { name: "بسمة", profession: "مغنية مصرية", birthYear: 1973 }
  ],
  "07-31": [
    { name: "خالد الصاوي", profession: "ممثل مصري", birthYear: 1970 }
  ],
  
  // أغسطس
  "08-01": [
    { name: "أحمد وفيق", profession: "ممثل مصري", birthYear: 1976 }
  ],
  "08-02": [
    { name: "محمود عبد العزيز", profession: "ممثل مصري", birthYear: 1946 }
  ],
  "08-03": [
    { name: "مي كساب", profession: "ممثلة مصرية", birthYear: 1983 }
  ],
  "08-04": [
    { name: "سميحة أيوب", profession: "ممثلة مصرية", birthYear: 1932 }
  ],
  "08-05": [
    { name: "رامز جلال", profession: "ممثل مصري", birthYear: 1973 }
  ],
  "08-06": [
    { name: "إيمان", profession: "مغنية مصرية", birthYear: 1969 }
  ],
  "08-07": [
    { name: "أحمد آدم", profession: "ممثل مصري", birthYear: 1950 }
  ],
  "08-08": [
    { name: "نيرمين الفقي", profession: "ممثلة مصرية", birthYear: 1972 }
  ],
  "08-09": [
    { name: "ولاء الشريف", profession: "ممثل مصري", birthYear: 1989 }
  ],
  "08-10": [
    { name: "مروة عبد المنعم", profession: "ممثلة مصرية", birthYear: 1985 }
  ],
  "08-11": [
    { name: "عبد الرحمن أبو زهرة", profession: "ممثل مصري", birthYear: 1977 }
  ],
  "08-12": [
    { name: "لطفي لبيب", profession: "ممثل مصري", birthYear: 1958 }
  ],
  "08-13": [
    { name: "أحمد زكي", profession: "ممثل مصري", birthYear: 1949 }
  ],
  "08-14": [
    { name: "باسم يوسف", profession: "إعلامي مصري", birthYear: 1974 }
  ],
  "08-15": [
    { name: "آيتن عامر", profession: "ممثلة مصرية", birthYear: 1986 }
  ],
  "08-16": [
    { name: "هالة فاخر", profession: "ممثلة مصرية", birthYear: 1958 }
  ],
  "08-17": [
    { name: "محمد كيلاني", profession: "ممثل مصري", birthYear: 1982 }
  ],
  "08-18": [
    { name: "نيللي", profession: "مغنية مصرية", birthYear: 1971 }
  ],
  "08-19": [
    { name: "فيفي عبده", profession: "راقصة مصرية", birthYear: 1962 }
  ],
  "08-20": [
    { name: "محمد جمعة", profession: "ممثل مصري", birthYear: 1983 }
  ],
  "08-21": [
    { name: "نجلاء بدر", profession: "ممثلة مصرية", birthYear: 1954 }
  ],
  "08-22": [
    { name: "محمد منير", profession: "مغني مصري", birthYear: 1954 }
  ],
  "08-23": [
    { name: "منال سلامة", profession: "ممثلة مصرية", birthYear: 1973 }
  ],
  "08-24": [
    { name: "فريال يوسف", profession: "ممثلة مصرية", birthYear: 1947 }
  ],
  "08-25": [
    { name: "محسن محي الدين", profession: "ممثل مصري", birthYear: 1950 }
  ],
  "08-26": [
    { name: "ميس حمدان", profession: "ممثلة سورية", birthYear: 1982 }
  ],
  "08-27": [
    { name: "مدحت صالح", profession: "مغني مصري", birthYear: 1956 }
  ],
  "08-28": [
    { name: "شويكار", profession: "ممثلة مصرية", birthYear: 1936 }
  ],
  "08-29": [
    { name: "خالد صالح", profession: "ممثل مصري", birthYear: 1964 }
  ],
  "08-30": [
    { name: "راندا البحيري", profession: "ممثلة مصرية", birthYear: 1970 }
  ],
  "08-31": [
    { name: "هشام عباس", profession: "مغني مصري", birthYear: 1963 }
  ],
  
  // سبتمبر
  "09-01": [
    { name: "أحمد السعدني", profession: "ممثل مصري", birthYear: 1979 }
  ],
  "09-02": [
    { name: "كاظم الساهر", profession: "مغني عراقي", birthYear: 1957 }
  ],
  "09-03": [
    { name: "نجلاء الإمام", profession: "مذيعة مصرية", birthYear: 1961 }
  ],
  "09-04": [
    { name: "حمدي الميرغني", profession: "ممثل مصري", birthYear: 1983 }
  ],
  "09-05": [
    { name: "داليا مصطفى", profession: "ممثلة مصرية", birthYear: 1988 }
  ],
  "09-06": [
    { name: "سامح حسين", profession: "ممثل مصري", birthYear: 1973 }
  ],
  "09-07": [
    { name: "عبير صبري", profession: "ممثلة مصرية", birthYear: 1971 }
  ],
  "09-08": [
    { name: "محمد الشقنقيري", profession: "ممثل مصري", birthYear: 1980 }
  ],
  "09-09": [
    { name: "رحمة أحمد", profession: "ممثلة مصرية", birthYear: 1988 }
  ],
  "09-10": [
    { name: "هند صبري", profession: "ممثلة تونسية", birthYear: 1979 }
  ],
  "09-11": [
    { name: "باسل خياط", profession: "ممثل سوري", birthYear: 1977 }
  ],
  "09-12": [
    { name: "محمود حافظ", profession: "ممثل مصري", birthYear: 1985 }
  ],
  "09-13": [
    { name: "إنجي المقدم", profession: "ممثلة مصرية", birthYear: 1975 }
  ],
  "09-14": [
    { name: "عفاف شعيب", profession: "ممثلة مصرية", birthYear: 1949 }
  ],
  "09-15": [
    { name: "عمرو عبد الجليل", profession: "ممثل مصري", birthYear: 1961 }
  ],
  "09-16": [
    { name: "عايدة رياض", profession: "ممثلة مصرية", birthYear: 1937 }
  ],
  "09-17": [
    { name: "مصطفى شعبان", profession: "ممثل مصري", birthYear: 1970 }
  ],
  "09-18": [
    { name: "محمد الشرنوبي", profession: "مغني مصري", birthYear: 1990 }
  ],
  "09-19": [
    { name: "كريمة مختار", profession: "ممثلة مصرية", birthYear: 1932 }
  ],
  "09-20": [
    { name: "محمد فراج", profession: "ممثل مصري", birthYear: 1986 }
  ],
  "09-21": [
    { name: "سلوى محمد علي", profession: "ممثلة مصرية", birthYear: 1948 }
  ],
  "09-22": [
    { name: "أحمد حاتم", profession: "ممثل مصري", birthYear: 1980 }
  ],
  "09-23": [
    { name: "ماهر عصام", profession: "ممثل مصري", birthYear: 1968 }
  ],
  "09-24": [
    { name: "صبري فواز", profession: "ممثل مصري", birthYear: 1956 }
  ],
  "09-25": [
    { name: "محمود قابيل", profession: "ممثل مصري", birthYear: 1947 }
  ],
  "09-26": [
    { name: "حلا شيحة", profession: "ممثلة مصرية", birthYear: 1979 }
  ],
  "09-27": [
    { name: "إليسا", profession: "مغنية لبنانية", birthYear: 1972 }
  ],
  "09-28": [
    { name: "عمرو محمود ياسين", profession: "ممثل مصري", birthYear: 1985 }
  ],
  "09-29": [
    { name: "نهال عنبر", profession: "ممثلة مصرية", birthYear: 1990 }
  ],
  "09-30": [
    { name: "محمد عبد الحافظ", profession: "مغني مصري", birthYear: 1978 }
  ],
  
  // أكتوبر
  "10-01": [
    { name: "أحمد بدوي", profession: "ممثل مصري", birthYear: 1974 }
  ],
  "10-02": [
    { name: "سوسن بدر", profession: "ممثلة مصرية", birthYear: 1952 }
  ],
  "10-03": [
    { name: "علي الحجار", profession: "مغني مصري", birthYear: 1964 }
  ],
  "10-04": [
    { name: "أحمد مالك", profession: "ممثل مصري", birthYear: 1989 }
  ],
  "10-05": [
    { name: "هيفاء وهبي", profession: "مغنية لبنانية", birthYear: 1976 }
  ],
  "10-06": [
    { name: "محمد صبحي", profession: "ممثل مصري", birthYear: 1948 }
  ],
  "10-07": [
    { name: "فاطمة عيد", profession: "ممثلة مصرية", birthYear: 1962 }
  ],
  "10-08": [
    { name: "محمد التاجي", profession: "ممثل مصري", birthYear: 1982 }
  ],
  "10-09": [
    { name: "نيرمين ماهر", profession: "ممثلة مصرية", birthYear: 1988 }
  ],
  "10-10": [
    { name: "أحمد حلمي", profession: "ممثل مصري", birthYear: 1969 }
  ],
  "10-11": [
    { name: "محمود الجندي", profession: "ممثل مصري", birthYear: 1938 }
  ],
  "10-12": [
    { name: "شيري عادل", profession: "ممثلة مصرية", birthYear: 1970 }
  ],
  "10-13": [
    { name: "سعيد صالح", profession: "ممثل كوميدي مصري", birthYear: 1936 }
  ],
  "10-14": [
    { name: "إيمان السيد", profession: "ممثلة مصرية", birthYear: 1961 }
  ],
  "10-15": [
    { name: "نجلاء فتحي", profession: "ممثلة مصرية", birthYear: 1951 }
  ],
  "10-16": [
    { name: "رنا رئيس", profession: "ممثلة مصرية", birthYear: 1991 }
  ],
  "10-17": [
    { name: "حمدي الوزير", profession: "ممثل مصري", birthYear: 1943 }
  ],
  "10-18": [
    { name: "عمرو عبد الحميد", profession: "ممثل مصري", birthYear: 1975 }
  ],
  "10-19": [
    { name: "محمود البزاوي", profession: "ممثل مصري", birthYear: 1978 }
  ],
  "10-20": [
    { name: "عمر الشريف", profession: "ممثل مصري", birthYear: 1932 }
  ],
  "10-21": [
    { name: "محمد الأحمد", profession: "ممثل سوري", birthYear: 1982 }
  ],
  "10-22": [
    { name: "طلعت زكريا", profession: "ممثل كوميدي مصري", birthYear: 1960 }
  ],
  "10-23": [
    { name: "إدوارد عبد العزيز", profession: "ممثل مصري", birthYear: 1940 }
  ],
  "10-24": [
    { name: "راغب علامة", profession: "مغني لبناني", birthYear: 1962 }
  ],
  "10-25": [
    { name: "محمد الكيلاني", profession: "ممثل مصري", birthYear: 1965 }
  ],
  "10-26": [
    { name: "رانيا محمود ياسين", profession: "ممثلة مصرية", birthYear: 1979 }
  ],
  "10-27": [
    { name: "إسعاد يونس", profession: "ممثلة مصرية", birthYear: 1958 }
  ],
  "10-28": [
    { name: "دينا", profession: "راقصة مصرية", birthYear: 1965 }
  ],
  "10-29": [
    { name: "عبد الرحيم كمال", profession: "ممثل مصري", birthYear: 1987 }
  ],
  "10-30": [
    { name: "يحيى الفخراني", profession: "ممثل مصري", birthYear: 1945 }
  ],
  "10-31": [
    { name: "محمد عبد الرحمن", profession: "ممثل مصري", birthYear: 1980 }
  ],
  
  // نوفمبر
  "11-01": [
    { name: "محمد صبحي", profession: "ممثل مصري", birthYear: 1948 }
  ],
  "11-02": [
    { name: "نادين نسيب نجيم", profession: "ممثلة لبنانية", birthYear: 1984 }
  ],
  "11-03": [
    { name: "جورج وسوف", profession: "مغني سوري", birthYear: 1961 }
  ],
  "11-04": [
    { name: "أصالة نصري", profession: "مغنية سورية", birthYear: 1969 }
  ],
  "11-05": [
    { name: "هاني سلامة", profession: "ممثل مصري", birthYear: 1968 }
  ],
  "11-06": [
    { name: "أروى", profession: "مغنية يمنية", birthYear: 1985 }
  ],
  "11-07": [
    { name: "محمد رياض", profession: "ممثل مصري", birthYear: 1975 }
  ],
  "11-08": [
    { name: "فردوس عبد الحميد", profession: "ممثلة مصرية", birthYear: 1939 }
  ],
  "11-09": [
    { name: "صافيناز", profession: "راقصة مصرية", birthYear: 1989 }
  ],
  "11-10": [
    { name: "محمد هنيدي", profession: "ممثل مصري", birthYear: 1965 }
  ],
  "11-11": [
    { name: "وائل كفوري", profession: "مغني لبناني", birthYear: 1974 }
  ],
  "11-12": [
    { name: "أحمد السقا", profession: "ممثل مصري", birthYear: 1973 }
  ],
  "11-13": [
    { name: "يارا", profession: "مغنية لبنانية", birthYear: 1983 }
  ],
  "11-14": [
    { name: "معتصم النهار", profession: "ممثل سوري", birthYear: 1985 }
  ],
  "11-15": [
    { name: "عبد العزيز مخيون", profession: "ممثل مصري", birthYear: 1960 }
  ],
  "11-16": [
    { name: "سعاد عبد الله", profession: "ممثلة كويتية", birthYear: 1950 }
  ],
  "11-17": [
    { name: "تيم حسن", profession: "ممثل لبناني", birthYear: 1976 }
  ],
  "11-18": [
    { name: "بوسي", profession: "مغنية مصرية", birthYear: 1971 }
  ],
  "11-19": [
    { name: "أحمد ماهر", profession: "ممثل مصري", birthYear: 1950 }
  ],
  "11-20": [
    { name: "أنغام", profession: "مغنية مصرية", birthYear: 1972 }
  ],
  "11-21": [
    { name: "محمد هنيدي", profession: "ممثل مصري", birthYear: 1965 }
  ],
  "11-22": [
    { name: "طارق العريان", profession: "ممثل مصري", birthYear: 1954 }
  ],
  "11-23": [
    { name: "ميرهان حسين", profession: "ممثلة مصرية", birthYear: 1982 }
  ],
  "11-24": [
    { name: "يسرا اللوزي", profession: "ممثلة مصرية", birthYear: 1985 }
  ],
  "11-25": [
    { name: "أحمد عزمي", profession: "ممثل مصري", birthYear: 1973 }
  ],
  "11-26": [
    { name: "مجدي كامل", profession: "ممثل مصري", birthYear: 1948 }
  ],
  "11-27": [
    { name: "أحمد السلكاوي", profession: "ممثل مصري", birthYear: 1980 }
  ],
  "11-28": [
    { name: "زيزي مصطفى", profession: "ممثلة مصرية", birthYear: 1943 }
  ],
  "11-29": [
    { name: "شريف دسوقي", profession: "ممثل مصري", birthYear: 1970 }
  ],
  "11-30": [
    { name: "حسين الإمام", profession: "ممثل مصري", birthYear: 1934 }
  ],
  
  // ديسمبر
  "12-01": [
    { name: "محمد صلاح", profession: "لاعب كرة قدم مصري", birthYear: 1992 }
  ],
  "12-02": [
    { name: "محمد رمضان", profession: "ممثل ومغني مصري", birthYear: 1988 }
  ],
  "12-03": [
    { name: "هالة سرحان", profession: "مذيعة مصرية", birthYear: 1970 }
  ],
  "12-04": [
    { name: "محمد إمام", profession: "ممثل مصري", birthYear: 1984 }
  ],
  "12-05": [
    { name: "محمد حماقي", profession: "مغني مصري", birthYear: 1975 }
  ],
  "12-06": [
    { name: "مجدي الهواري", profession: "ممثل مصري", birthYear: 1948 }
  ],
  "12-07": [
    { name: "حسن الشافعي", profession: "ممثل مصري", birthYear: 1961 }
  ],
  "12-08": [
    { name: "سهير البابلي", profession: "ممثلة مصرية", birthYear: 1937 }
  ],
  "12-09": [
    { name: "أحمد زاهر", profession: "ممثل مصري", birthYear: 1970 }
  ],
  "12-10": [
    { name: "حسين فهمي", profession: "ممثل مصري", birthYear: 1940 }
  ],
  "12-11": [
    { name: "سمية الألفي", profession: "ممثلة مصرية", birthYear: 1949 }
  ],
  "12-12": [
    { name: "إياد نصار", profession: "ممثل فلسطيني", birthYear: 1972 }
  ],
  "12-13": [
    { name: "نور الشريف", profession: "ممثل مصري", birthYear: 1946 }
  ],
  "12-14": [
    { name: "محمد صبحي", profession: "ممثل مصري", birthYear: 1948 }
  ],
  "12-15": [
    { name: "ياسمين رئيس", profession: "ممثلة مصرية", birthYear: 1985 }
  ],
  "12-16": [
    { name: "غادة عادل", profession: "ممثلة مصرية", birthYear: 1974 }
  ],
  "12-17": [
    { name: "علاء مرسي", profession: "ممثل مصري", birthYear: 1978 }
  ],
  "12-18": [
    { name: "نيللي كريم", profession: "ممثلة مصرية", birthYear: 1977 }
  ],
  "12-19": [
    { name: "محمود باكير", profession: "ممثل مصري", birthYear: 1983 }
  ],
  "12-20": [
    { name: "عبلة كامل", profession: "ممثلة مصرية", birthYear: 1960 }
  ],
  "12-21": [
    { name: "أحمد داش", profession: "ممثل مصري", birthYear: 1987 }
  ],
  "12-22": [
    { name: "عبد الله مشرف", profession: "ممثل مصري", birthYear: 1938 }
  ],
  "12-23": [
    { name: "وفاء عامر", profession: "ممثلة مصرية", birthYear: 1970 }
  ],
  "12-24": [
    { name: "إلهام شاهين", profession: "ممثلة مصرية", birthYear: 1961 }
  ],
  "12-25": [
    { name: "محمود ياسين", profession: "ممثل مصري", birthYear: 1941 }
  ],
  "12-26": [
    { name: "شادي خلف", profession: "ممثل مصري", birthYear: 1980 }
  ],
  "12-27": [
    { name: "حنان مطاوع", profession: "ممثلة مصرية", birthYear: 1959 }
  ],
  "12-28": [
    { name: "دنيا عبد العزيز", profession: "ممثلة مصرية", birthYear: 1979 }
  ],
  "12-29": [
    { name: "سميرة أحمد", profession: "ممثلة مصرية", birthYear: 1932 }
  ],
  "12-30": [
    { name: "عمرو عبد الجليل", profession: "ممثل مصري", birthYear: 1961 }
  ],
  "12-31": [
    { name: "أشرف عبد الباقي", profession: "ممثل مصري", birthYear: 1963 }
  ]
};

// دالة للحصول على المشاهير الذين ولدوا في نفس اليوم
export function getCelebritiesByDate(month: number, day: number): Celebrity[] {
  const key = `${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  return CELEBRITIES_BY_DATE[key] || [];
}

// دالة للحصول على نص عرض مولود
export function formatCelebrity(celebrity: Celebrity): string {
  const currentYear = new Date().getFullYear();
  const age = currentYear - celebrity.birthYear;
  return `${celebrity.name} (${celebrity.profession})`;
}
