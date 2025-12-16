// حسابات العمر النسبي ومقارنة الأعمار
export interface Celebrity {
  name: string;
  nameEn: string;
  birthDate: string;
  profession: string;
  nationality: string;
  description: string;
  imageUrl?: string;
}

export interface HistoricalFigure {
  name: string;
  nameEn: string;
  birthDate: string;
  deathDate?: string;
  profession: string;
  era: string;
  description: string;
  achievements: string[];
}

export interface HistoricalEvent {
  year: number;
  event: string;
  eventEn: string;
  category: 'political' | 'scientific' | 'cultural' | 'religious' | 'sports';
  description: string;
}

export interface AgeComparison {
  userAge: number;
  celebrities: Celebrity[];
  historicalFigures: HistoricalFigure[];
  birthYearEvents: HistoricalEvent[];
  globalAverages: {
    lifeExpectancy: number;
    marriageAge: number;
    retirementAge: number;
    category: string;
  };
}

export class RelativeAgeCalculations {
  // قاعدة بيانات المشاهير
  private static celebrities: Celebrity[] = [
    // مشاهير عرب - مطربين
    {
      name: 'محمد عبده',
      nameEn: 'Mohammed Abdu',
      birthDate: '1949-06-12',
      profession: 'مطرب',
      nationality: 'سعودي',
      description: 'فنان العرب الأول'
    },
    {
      name: 'عمرو دياب',
      nameEn: 'Amr Diab',
      birthDate: '1961-10-11',
      profession: 'مطرب',
      nationality: 'مصري',
      description: 'هضبة الغناء العربي'
    },
    {
      name: 'فيروز',
      nameEn: 'Fairuz',
      birthDate: '1935-11-21',
      profession: 'مطربة',
      nationality: 'لبنانية',
      description: 'سفيرة النجوم إلى القمر'
    },
    {
      name: 'أم كلثوم',
      nameEn: 'Umm Kulthum',
      birthDate: '1904-12-31',
      profession: 'مطربة',
      nationality: 'مصرية',
      description: 'كوكب الشرق'
    },
    {
      name: 'نانسي عجرم',
      nameEn: 'Nancy Ajram',
      birthDate: '1983-05-16',
      profession: 'مطربة',
      nationality: 'لبنانية',
      description: 'نجمة الغناء اللبناني'
    },
    {
      name: 'إليسا',
      nameEn: 'Elissa',
      birthDate: '1972-10-27',
      profession: 'مطربة',
      nationality: 'لبنانية',
      description: 'ملكة الإحساس'
    },
    {
      name: 'تامر حسني',
      nameEn: 'Tamer Hosny',
      birthDate: '1977-08-16',
      profession: 'مطرب وممثل',
      nationality: 'مصري',
      description: 'نجم الجيل'
    },
    {
      name: 'راشد الماجد',
      nameEn: 'Rashed Al Majed',
      birthDate: '1969-07-27',
      profession: 'مطرب',
      nationality: 'سعودي',
      description: 'فنان العرب'
    },
    {
      name: 'ماجد المهندس',
      nameEn: 'Majed Al Mohandes',
      birthDate: '1971-10-25',
      profession: 'مطرب',
      nationality: 'عراقي',
      description: 'مطرب العراق الأول'
    },
    {
      name: 'كاظم الساهر',
      nameEn: 'Kazem Al Saher',
      birthDate: '1957-09-12',
      profession: 'مطرب',
      nationality: 'عراقي',
      description: 'قيصر الأغنية العربية'
    },
    {
      name: 'حسين الجسمي',
      nameEn: 'Hussein Al Jassmi',
      birthDate: '1979-08-25',
      profession: 'مطرب',
      nationality: 'إماراتي',
      description: 'صوت الإمارات'
    },
    {
      name: 'أصالة نصري',
      nameEn: 'Assala Nasri',
      birthDate: '1969-05-15',
      profession: 'مطربة',
      nationality: 'سورية',
      description: 'سلطانة الطرب'
    },

    // ممثلين عرب
    {
      name: 'عادل إمام',
      nameEn: 'Adel Imam',
      birthDate: '1940-05-17',
      profession: 'ممثل',
      nationality: 'مصري',
      description: 'الزعيم كوميديا العرب'
    },
    {
      name: 'أحمد زكي',
      nameEn: 'Ahmed Zaki',
      birthDate: '1949-11-18',
      profession: 'ممثل',
      nationality: 'مصري',
      description: 'كوكب الشرق الراحل'
    },
    {
      name: 'يسرا',
      nameEn: 'Yousra',
      birthDate: '1955-03-10',
      profession: 'ممثلة',
      nationality: 'مصرية',
      description: 'سندريلا الشاشة العربية'
    },
    {
      name: 'نور الشريف',
      nameEn: 'Nour El Sherif',
      birthDate: '1946-04-28',
      profession: 'ممثل',
      nationality: 'مصري',
      description: 'أستاذ الجيل'
    },
    {
      name: 'أحمد السقا',
      nameEn: 'Ahmed El Sakka',
      birthDate: '1973-03-01',
      profession: 'ممثل',
      nationality: 'مصري',
      description: 'نجم الأكشن العربي'
    },
    {
      name: 'هند صبري',
      nameEn: 'Hend Sabry',
      birthDate: '1979-11-20',
      profession: 'ممثلة',
      nationality: 'تونسية',
      description: 'نجمة السينما العربية'
    },

    // رياضيين عرب
    {
      name: 'محمد صلاح',
      nameEn: 'Mohamed Salah',
      birthDate: '1992-06-15',
      profession: 'لاعب كرة قدم',
      nationality: 'مصري',
      description: 'نجم ليفربول والمنتخب المصري'
    },
    {
      name: 'سعد سمير',
      nameEn: 'Saad Samir',
      birthDate: '1989-01-01',
      profession: 'لاعب كرة قدم',
      nationality: 'مصري',
      description: 'قائد الأهلي المصري'
    },
    {
      name: 'رياض محرز',
      nameEn: 'Riyad Mahrez',
      birthDate: '1991-02-21',
      profession: 'لاعب كرة قدم',
      nationality: 'جزائري',
      description: 'نجم مانشستر سيتي'
    },

    // مشاهير عالميين - موسيقى
    {
      name: 'تايلور سويفت',
      nameEn: 'Taylor Swift',
      birthDate: '1989-12-13',
      profession: 'مطربة',
      nationality: 'أمريكية',
      description: 'أميرة البوب'
    },
    {
      name: 'أديل',
      nameEn: 'Adele',
      birthDate: '1988-05-05',
      profession: 'مطربة',
      nationality: 'بريطانية',
      description: 'صوت الجيل الذهبي'
    },
    {
      name: 'بيونسيه',
      nameEn: 'Beyoncé',
      birthDate: '1981-09-04',
      profession: 'مطربة',
      nationality: 'أمريكية',
      description: 'ملكة البوب'
    },
    {
      name: 'إد شيران',
      nameEn: 'Ed Sheeran',
      birthDate: '1991-02-17',
      profession: 'مطرب',
      nationality: 'بريطاني',
      description: 'نجم البوب البريطاني'
    },
    {
      name: 'جاستن بيبر',
      nameEn: 'Justin Bieber',
      birthDate: '1994-03-01',
      profession: 'مطرب',
      nationality: 'كندي',
      description: 'نجم البوب الكندي'
    },
    {
      name: 'أريانا غراندي',
      nameEn: 'Ariana Grande',
      birthDate: '1993-06-26',
      profession: 'مطربة',
      nationality: 'أمريكية',
      description: 'أميرة البوب الجديدة'
    },

    // رياضيين عالميين
    {
      name: 'كريستيانو رونالدو',
      nameEn: 'Cristiano Ronaldo',
      birthDate: '1985-02-05',
      profession: 'لاعب كرة قدم',
      nationality: 'برتغالي',
      description: 'أسطورة كرة القدم'
    },
    {
      name: 'ليونيل ميسي',
      nameEn: 'Lionel Messi',
      birthDate: '1987-06-24',
      profession: 'لاعب كرة قدم',
      nationality: 'أرجنتيني',
      description: 'ساحر الكرة الأرجنتيني'
    },
    {
      name: 'نيمار',
      nameEn: 'Neymar',
      birthDate: '1992-02-05',
      profession: 'لاعب كرة قدم',
      nationality: 'برازيلي',
      description: 'نجم البرازيل'
    },
    {
      name: 'كيليان مبابي',
      nameEn: 'Kylian Mbappé',
      birthDate: '1998-12-20',
      profession: 'لاعب كرة قدم',
      nationality: 'فرنسي',
      description: 'نجم فرنسا الصاعد'
    },
    {
      name: 'سيرينا ويليامز',
      nameEn: 'Serena Williams',
      birthDate: '1981-09-26',
      profession: 'لاعبة تنس',
      nationality: 'أمريكية',
      description: 'أسطورة التنس'
    },

    // ممثلين عالميين
    {
      name: 'ليوناردو دي كابريو',
      nameEn: 'Leonardo DiCaprio',
      birthDate: '1974-11-11',
      profession: 'ممثل',
      nationality: 'أمريكي',
      description: 'نجم هوليوود'
    },
    {
      name: 'براد بيت',
      nameEn: 'Brad Pitt',
      birthDate: '1963-12-18',
      profession: 'ممثل',
      nationality: 'أمريكي',
      description: 'أيقونة السينما'
    },
    {
      name: 'أنجلينا جولي',
      nameEn: 'Angelina Jolie',
      birthDate: '1975-06-04',
      profession: 'ممثلة',
      nationality: 'أمريكية',
      description: 'نجمة هوليوود'
    },
    {
      name: 'ويل سميث',
      nameEn: 'Will Smith',
      birthDate: '1968-09-25',
      profession: 'ممثل',
      nationality: 'أمريكي',
      description: 'نجم الكوميديا والأكشن'
    },
    {
      name: 'سكارليت جوهانسون',
      nameEn: 'Scarlett Johansson',
      birthDate: '1984-11-22',
      profession: 'ممثلة',
      nationality: 'أمريكية',
      description: 'نجمة مارفل'
    },

    // رجال أعمال وتكنولوجيا
    {
      name: 'إيلون ماسك',
      nameEn: 'Elon Musk',
      birthDate: '1971-06-28',
      profession: 'رجل أعمال',
      nationality: 'أمريكي',
      description: 'رائد الفضاء والتكنولوجيا'
    },
    {
      name: 'بيل غيتس',
      nameEn: 'Bill Gates',
      birthDate: '1955-10-28',
      profession: 'رجل أعمال',
      nationality: 'أمريكي',
      description: 'مؤسس مايكروسوفت'
    },
    {
      name: 'مارك زوكربيرغ',
      nameEn: 'Mark Zuckerberg',
      birthDate: '1984-05-14',
      profession: 'رجل أعمال',
      nationality: 'أمريكي',
      description: 'مؤسس فيسبوك'
    },
    {
      name: 'جيف بيزوس',
      nameEn: 'Jeff Bezos',
      birthDate: '1964-01-12',
      profession: 'رجل أعمال',
      nationality: 'أمريكي',
      description: 'مؤسس أمازون'
    },

    // شخصيات ملكية
    {
      name: 'الأمير وليام',
      nameEn: 'Prince William',
      birthDate: '1982-06-21',
      profession: 'أمير',
      nationality: 'بريطاني',
      description: 'أمير ويلز'
    },
    {
      name: 'الأمير هاري',
      nameEn: 'Prince Harry',
      birthDate: '1984-09-15',
      profession: 'أمير',
      nationality: 'بريطاني',
      description: 'دوق ساسكس'
    },

    // شخصيات أخرى مؤثرة
    {
      name: 'أوبرا وينفري',
      nameEn: 'Oprah Winfrey',
      birthDate: '1954-01-29',
      profession: 'إعلامية',
      nationality: 'أمريكية',
      description: 'ملكة الإعلام'
    },
    {
      name: 'ستيف جوبز',
      nameEn: 'Steve Jobs',
      birthDate: '1955-02-24',
      profession: 'رجل أعمال',
      nationality: 'أمريكي',
      description: 'مؤسس آبل (الراحل)'
    },

    // مشاهير إضافيين لتغطية أعمار مختلفة
    {
      name: 'سلينا غوميز',
      nameEn: 'Selena Gomez',
      birthDate: '1992-07-22',
      profession: 'مطربة وممثلة',
      nationality: 'أمريكية',
      description: 'نجمة البوب والتمثيل'
    },
    {
      name: 'شاكيرا',
      nameEn: 'Shakira',
      birthDate: '1977-02-02',
      profession: 'مطربة',
      nationality: 'كولومبية',
      description: 'ملكة اللاتين بوب'
    },
    {
      name: 'جينيفر لوبيز',
      nameEn: 'Jennifer Lopez',
      birthDate: '1969-07-24',
      profession: 'مطربة وممثلة',
      nationality: 'أمريكية',
      description: 'جي لو نجمة متعددة المواهب'
    },
    {
      name: 'توم كروز',
      nameEn: 'Tom Cruise',
      birthDate: '1962-07-03',
      profession: 'ممثل',
      nationality: 'أمريكي',
      description: 'نجم الأكشن العالمي'
    },
    {
      name: 'جوني ديب',
      nameEn: 'Johnny Depp',
      birthDate: '1963-06-09',
      profession: 'ممثل',
      nationality: 'أمريكي',
      description: 'نجم قراصنة الكاريبي'
    },
    {
      name: 'ريهانا',
      nameEn: 'Rihanna',
      birthDate: '1988-02-20',
      profession: 'مطربة ورائدة أعمال',
      nationality: 'باربادوسية',
      description: 'أيقونة الموسيقى والأزياء'
    },
    {
      name: 'كيم كارداشيان',
      nameEn: 'Kim Kardashian',
      birthDate: '1980-10-21',
      profession: 'نجمة تلفزيون الواقع',
      nationality: 'أمريكية',
      description: 'أيقونة وسائل التواصل الاجتماعي'
    },
    {
      name: 'دواين جونسون',
      nameEn: 'Dwayne Johnson',
      birthDate: '1972-05-02',
      profession: 'ممثل ومصارع سابق',
      nationality: 'أمريكي',
      description: 'الصخرة نجم هوليوود'
    },
    {
      name: 'إيما واتسون',
      nameEn: 'Emma Watson',
      birthDate: '1990-04-15',
      profession: 'ممثلة وناشطة',
      nationality: 'بريطانية',
      description: 'نجمة هاري بوتر'
    },
    {
      name: 'ريان رينولدز',
      nameEn: 'Ryan Reynolds',
      birthDate: '1976-10-23',
      profession: 'ممثل',
      nationality: 'كندي',
      description: 'نجم ديدبول'
    },
    {
      name: 'جاستن تيمبرليك',
      nameEn: 'Justin Timberlake',
      birthDate: '1981-01-31',
      profession: 'مطرب وممثل',
      nationality: 'أمريكي',
      description: 'نجم البوب والتمثيل'
    },
    {
      name: 'بريتني سبيرز',
      nameEn: 'Britney Spears',
      birthDate: '1981-12-02',
      profession: 'مطربة',
      nationality: 'أمريكية',
      description: 'أميرة البوب'
    },
    {
      name: 'كريس إيفانز',
      nameEn: 'Chris Evans',
      birthDate: '1981-06-13',
      profession: 'ممثل',
      nationality: 'أمريكي',
      description: 'الكابتن أمريكا'
    },
    {
      name: 'روبرت داوني جونيور',
      nameEn: 'Robert Downey Jr.',
      birthDate: '1965-04-04',
      profession: 'ممثل',
      nationality: 'أمريكي',
      description: 'آيرون مان'
    },
    {
      name: 'مادونا',
      nameEn: 'Madonna',
      birthDate: '1958-08-16',
      profession: 'مطربة',
      nationality: 'أمريكية',
      description: 'ملكة البوب'
    },
    {
      name: 'مايكل جوردان',
      nameEn: 'Michael Jordan',
      birthDate: '1963-02-17',
      profession: 'لاعب كرة سلة سابق',
      nationality: 'أمريكي',
      description: 'أسطورة كرة السلة'
    },
    {
      name: 'تايجر وودز',
      nameEn: 'Tiger Woods',
      birthDate: '1975-12-30',
      profession: 'لاعب غولف',
      nationality: 'أمريكي',
      description: 'أسطورة الغولف'
    },
    {
      name: 'سيرينا ويليامز',
      nameEn: 'Serena Williams',
      birthDate: '1981-09-26',
      profession: 'لاعبة تنس',
      nationality: 'أمريكية',
      description: 'أسطورة التنس'
    },
    {
      name: 'زين مالك',
      nameEn: 'Zayn Malik',
      birthDate: '1993-01-12',
      profession: 'مطرب',
      nationality: 'بريطاني',
      description: 'عضو وان دايركشن السابق'
    },
    {
      name: 'هاري ستايلز',
      nameEn: 'Harry Styles',
      birthDate: '1994-02-01',
      profession: 'مطرب وممثل',
      nationality: 'بريطاني',
      description: 'نجم وان دايركشن السابق'
    }
  ];

  // قاعدة بيانات الشخصيات التاريخية
  private static historicalFigures: HistoricalFigure[] = [
    // الشخصيات الإسلامية والعربية
    {
      name: 'الرسول محمد ﷺ',
      nameEn: 'Prophet Muhammad',
      birthDate: '571-04-22',
      deathDate: '632-06-08',
      profession: 'رسول ونبي',
      era: 'العصر الإسلامي المبكر',
      description: 'خاتم الأنبياء والمرسلين',
      achievements: ['نشر الإسلام', 'توحيد الجزيرة العربية', 'القرآن الكريم']
    },
    {
      name: 'عمر بن الخطاب',
      nameEn: 'Umar ibn al-Khattab',
      birthDate: '584-01-01',
      deathDate: '644-11-03',
      profession: 'خليفة راشد',
      era: 'العصر الإسلامي المبكر',
      description: 'الفاروق ثاني الخلفاء الراشدين',
      achievements: ['فتح الشام ومصر', 'إنشاء نظام الدواوين', 'العدالة الاجتماعية']
    },
    {
      name: 'صلاح الدين الأيوبي',
      nameEn: 'Saladin',
      birthDate: '1137-01-01',
      deathDate: '1193-03-04',
      profession: 'قائد عسكري وسلطان',
      era: 'العصر الإسلامي الوسيط',
      description: 'محرر القدس',
      achievements: ['تحرير القدس من الصليبيين', 'توحيد المسلمين', 'العدالة والرحمة']
    },
    {
      name: 'هارون الرشيد',
      nameEn: 'Harun al-Rashid',
      birthDate: '766-03-17',
      deathDate: '809-03-24',
      profession: 'خليفة عباسي',
      era: 'العصر الذهبي الإسلامي',
      description: 'خليفة العصر الذهبي',
      achievements: ['ازدهار بيت الحكمة', 'التطور العلمي والثقافي', 'العلاقات الدولية']
    },
    {
      name: 'ابن سينا',
      nameEn: 'Avicenna',
      birthDate: '980-08-22',
      deathDate: '1037-06-21',
      profession: 'طبيب وفيلسوف',
      era: 'العصر الذهبي الإسلامي',
      description: 'أبو الطب الحديث',
      achievements: ['كتاب القانون في الطب', 'الفلسفة الإسلامية', 'الطب والصيدلة']
    },
    {
      name: 'ابن خلدون',
      nameEn: 'Ibn Khaldun',
      birthDate: '1332-05-27',
      deathDate: '1406-03-17',
      profession: 'مؤرخ وعالم اجتماع',
      era: 'العصر الإسلامي المتأخر',
      description: 'مؤسس علم الاجتماع',
      achievements: ['المقدمة', 'نظرية العصبية', 'فلسفة التاريخ']
    },
    {
      name: 'ابن رشد',
      nameEn: 'Averroes',
      birthDate: '1126-04-14',
      deathDate: '1198-12-10',
      profession: 'فيلسوف وطبيب',
      era: 'العصر الذهبي الإسلامي',
      description: 'فيلسوف الأندلس',
      achievements: ['شروح أرسطو', 'الفلسفة الإسلامية', 'الطب والفقه']
    },
    {
      name: 'الخوارزمي',
      nameEn: 'Al-Khwarizmi',
      birthDate: '780-01-01',
      deathDate: '850-01-01',
      profession: 'عالم رياضيات',
      era: 'العصر الذهبي الإسلامي',
      description: 'أبو الجبر',
      achievements: ['علم الجبر', 'الخوارزميات', 'الجغرافيا الرياضية']
    },
    {
      name: 'ابن الهيثم',
      nameEn: 'Alhazen',
      birthDate: '965-01-01',
      deathDate: '1040-01-01',
      profession: 'عالم فيزياء وبصريات',
      era: 'العصر الذهبي الإسلامي',
      description: 'أبو البصريات الحديثة',
      achievements: ['علم البصريات', 'المنهج العلمي', 'الكاميرا المظلمة']
    },

    // الشخصيات العالمية القديمة
    {
      name: 'الإسكندر الأكبر',
      nameEn: 'Alexander the Great',
      birthDate: '356-07-20',
      deathDate: '323-06-10',
      profession: 'قائد عسكري وملك',
      era: 'العصر القديم',
      description: 'فاتح العالم القديم',
      achievements: ['فتح الإمبراطورية الفارسية', 'نشر الثقافة الهيلينية', 'إمبراطورية عظيمة']
    },
    {
      name: 'يوليوس قيصر',
      nameEn: 'Julius Caesar',
      birthDate: '100-07-12',
      deathDate: '44-03-15',
      profession: 'قائد عسكري وسياسي',
      era: 'العصر الروماني',
      description: 'ديكتاتور روما',
      achievements: ['فتح بلاد الغال', 'إصلاحات سياسية', 'التقويم اليولياني']
    },
    {
      name: 'كليوباترا',
      nameEn: 'Cleopatra',
      birthDate: '69-01-01',
      deathDate: '30-08-12',
      profession: 'ملكة مصر',
      era: 'العصر الهلنستي',
      description: 'آخر ملوك مصر القديمة',
      achievements: ['حكم مصر', 'العلاقات الدبلوماسية', 'الثقافة والعلوم']
    },

    // شخصيات عصر النهضة
    {
      name: 'ليوناردو دا فينشي',
      nameEn: 'Leonardo da Vinci',
      birthDate: '1452-04-15',
      deathDate: '1519-05-02',
      profession: 'فنان ومخترع',
      era: 'عصر النهضة',
      description: 'عبقري عصر النهضة',
      achievements: ['لوحة الموناليزا', 'اختراعات متقدمة', 'دراسات تشريحية']
    },
    {
      name: 'مايكل أنجلو',
      nameEn: 'Michelangelo',
      birthDate: '1475-03-06',
      deathDate: '1564-02-18',
      profession: 'فنان ونحات',
      era: 'عصر النهضة',
      description: 'أستاذ النحت والرسم',
      achievements: ['تمثال داود', 'سقف كنيسة سيستين', 'كنيسة القديس بطرس']
    },
    {
      name: 'كريستوفر كولومبوس',
      nameEn: 'Christopher Columbus',
      birthDate: '1451-01-01',
      deathDate: '1506-05-20',
      profession: 'مستكشف',
      era: 'عصر الاستكشاف',
      description: 'مكتشف العالم الجديد',
      achievements: ['اكتشاف الأمريكتين', 'الرحلات الاستكشافية', 'ربط القارات']
    },

    // شخصيات العصر الحديث
    {
      name: 'نابليون بونابرت',
      nameEn: 'Napoleon Bonaparte',
      birthDate: '1769-08-15',
      deathDate: '1821-05-05',
      profession: 'إمبراطور وقائد عسكري',
      era: 'العصر الحديث',
      description: 'إمبراطور فرنسا',
      achievements: ['قانون نابليون', 'الحروب النابليونية', 'إصلاحات إدارية']
    },
    {
      name: 'جورج واشنطن',
      nameEn: 'George Washington',
      birthDate: '1732-02-22',
      deathDate: '1799-12-14',
      profession: 'رئيس وقائد عسكري',
      era: 'العصر الحديث',
      description: 'أول رئيس أمريكي',
      achievements: ['استقلال أمريكا', 'تأسيس الجمهورية', 'الدستور الأمريكي']
    },

    // علماء ومفكرون
    {
      name: 'ألبرت أينشتاين',
      nameEn: 'Albert Einstein',
      birthDate: '1879-03-14',
      deathDate: '1955-04-18',
      profession: 'عالم فيزياء',
      era: 'العصر الحديث',
      description: 'عبقري الفيزياء النظرية',
      achievements: ['نظرية النسبية', 'جائزة نوبل في الفيزياء', 'معادلة E=mc²']
    },
    {
      name: 'إسحاق نيوتن',
      nameEn: 'Isaac Newton',
      birthDate: '1643-01-04',
      deathDate: '1727-03-31',
      profession: 'عالم فيزياء ورياضيات',
      era: 'عصر التنوير',
      description: 'مؤسس الفيزياء الكلاسيكية',
      achievements: ['قوانين الحركة', 'قانون الجاذبية', 'حساب التفاضل والتكامل']
    },
    {
      name: 'تشارلز داروين',
      nameEn: 'Charles Darwin',
      birthDate: '1809-02-12',
      deathDate: '1882-04-19',
      profession: 'عالم أحياء',
      era: 'العصر الحديث',
      description: 'مؤسس نظرية التطور',
      achievements: ['نظرية التطور', 'أصل الأنواع', 'الانتقاء الطبيعي']
    },
    {
      name: 'ماري كوري',
      nameEn: 'Marie Curie',
      birthDate: '1867-11-07',
      deathDate: '1934-07-04',
      profession: 'عالمة فيزياء وكيمياء',
      era: 'العصر الحديث',
      description: 'رائدة في علم الإشعاع',
      achievements: ['اكتشاف الراديوم', 'جائزتا نوبل', 'أول امرأة تفوز بنوبل']
    },

    // قادة ومصلحون
    {
      name: 'مهاتما غاندي',
      nameEn: 'Mahatma Gandhi',
      birthDate: '1869-10-02',
      deathDate: '1948-01-30',
      profession: 'زعيم سياسي ومصلح',
      era: 'العصر الحديث',
      description: 'رائد اللاعنف',
      achievements: ['استقلال الهند', 'المقاومة السلمية', 'العدالة الاجتماعية']
    },
    {
      name: 'نيلسون مانديلا',
      nameEn: 'Nelson Mandela',
      birthDate: '1918-07-18',
      deathDate: '2013-12-05',
      profession: 'رئيس ومناضل',
      era: 'العصر المعاصر',
      description: 'محارب الفصل العنصري',
      achievements: ['إنهاء الفصل العنصري', 'رئاسة جنوب أفريقيا', 'المصالحة الوطنية']
    },
    {
      name: 'مارتن لوثر كينغ',
      nameEn: 'Martin Luther King Jr.',
      birthDate: '1929-01-15',
      deathDate: '1968-04-04',
      profession: 'ناشط حقوق مدنية',
      era: 'العصر المعاصر',
      description: 'زعيم الحقوق المدنية',
      achievements: ['حركة الحقوق المدنية', 'خطاب "لدي حلم"', 'جائزة نوبل للسلام']
    },

    // شخصيات أدبية وثقافية
    {
      name: 'وليم شكسبير',
      nameEn: 'William Shakespeare',
      birthDate: '1564-04-26',
      deathDate: '1616-04-23',
      profession: 'كاتب مسرحي وشاعر',
      era: 'عصر النهضة',
      description: 'أعظم كتاب الإنجليزية',
      achievements: ['هاملت', 'الملك لير', 'روميو وجولييت']
    },
    {
      name: 'المتنبي',
      nameEn: 'Al-Mutanabbi',
      birthDate: '915-01-01',
      deathDate: '965-09-23',
      profession: 'شاعر',
      era: 'العصر العباسي',
      description: 'أعظم شعراء العربية',
      achievements: ['ديوان المتنبي', 'الشعر الحكمي', 'البلاغة العربية']
    }
  ];

  // الأحداث التاريخية حسب السنة
  private static historicalEvents: { [year: number]: HistoricalEvent[] } = {
    // الأحداث الإسلامية والعربية المهمة
    622: [
      {
        year: 622,
        event: 'الهجرة النبوية الشريفة',
        eventEn: 'Hijra',
        category: 'religious',
        description: 'هجرة الرسول ﷺ من مكة إلى المدينة وبداية التقويم الهجري'
      }
    ],
    1187: [
      {
        year: 1187,
        event: 'تحرير القدس على يد صلاح الدين',
        eventEn: 'Liberation of Jerusalem',
        category: 'political',
        description: 'صلاح الدين الأيوبي يحرر القدس من الصليبيين'
      }
    ],
    1453: [
      {
        year: 1453,
        event: 'فتح القسطنطينية',
        eventEn: 'Conquest of Constantinople',
        category: 'political',
        description: 'السلطان محمد الفاتح يفتح القسطنطينية'
      }
    ],
    1948: [
      {
        year: 1948,
        event: 'النكبة وإعلان دولة إسرائيل',
        eventEn: 'Nakba and Israeli Declaration',
        category: 'political',
        description: 'تهجير الفلسطينيين وإعلان دولة إسرائيل'
      }
    ],
    1967: [
      {
        year: 1967,
        event: 'حرب الأيام الستة',
        eventEn: 'Six-Day War',
        category: 'political',
        description: 'احتلال إسرائيل للضفة الغربية وغزة والجولان وسيناء'
      }
    ],
    1973: [
      {
        year: 1973,
        event: 'حرب أكتوبر (يوم الغفران)',
        eventEn: 'Yom Kippur War',
        category: 'political',
        description: 'مصر وسوريا تشنان حرباً لاستعادة الأراضي المحتلة'
      }
    ],
    1979: [
      {
        year: 1979,
        event: 'معاهدة السلام المصرية الإسرائيلية',
        eventEn: 'Egypt-Israel Peace Treaty',
        category: 'political',
        description: 'أول معاهدة سلام بين دولة عربية وإسرائيل'
      }
    ],
    1990: [
      {
        year: 1990,
        event: 'غزو العراق للكويت',
        eventEn: 'Iraqi Invasion of Kuwait',
        category: 'political',
        description: 'صدام حسين يغزو الكويت مما أدى لحرب الخليج'
      }
    ],
    2011: [
      {
        year: 2011,
        event: 'الربيع العربي',
        eventEn: 'Arab Spring',
        category: 'political',
        description: 'موجة ثورات شعبية في العالم العربي بدأت من تونس'
      }
    ],

    // الأحداث العالمية المهمة
    1066: [
      {
        year: 1066,
        event: 'معركة هاستينغز',
        eventEn: 'Battle of Hastings',
        category: 'political',
        description: 'وليام الفاتح يهزم الإنجليز ويصبح ملك إنجلترا'
      }
    ],
    1215: [
      {
        year: 1215,
        event: 'الميثاق الأعظم (ماغنا كارتا)',
        eventEn: 'Magna Carta',
        category: 'political',
        description: 'أول وثيقة تحد من سلطة الملك في إنجلترا'
      }
    ],
    1347: [
      {
        year: 1347,
        event: 'الموت الأسود (الطاعون)',
        eventEn: 'Black Death',
        category: 'scientific',
        description: 'وباء الطاعون يقتل ثلث سكان أوروبا'
      }
    ],
    1492: [
      {
        year: 1492,
        event: 'كولومبوس يصل إلى الأمريكتين',
        eventEn: 'Columbus Reaches Americas',
        category: 'cultural',
        description: 'كريستوفر كولومبوس يكتشف العالم الجديد'
      }
    ],
    1517: [
      {
        year: 1517,
        event: 'الإصلاح البروتستانتي',
        eventEn: 'Protestant Reformation',
        category: 'religious',
        description: 'مارتن لوثر يبدأ الإصلاح الديني في أوروبا'
      }
    ],
    1776: [
      {
        year: 1776,
        event: 'إعلان الاستقلال الأمريكي',
        eventEn: 'American Declaration of Independence',
        category: 'political',
        description: 'الولايات المتحدة تعلن استقلالها عن بريطانيا'
      }
    ],
    1789: [
      {
        year: 1789,
        event: 'الثورة الفرنسية',
        eventEn: 'French Revolution',
        category: 'political',
        description: 'بداية الثورة الفرنسية وسقوط النظام الملكي'
      }
    ],
    1804: [
      {
        year: 1804,
        event: 'نابليون يصبح إمبراطوراً',
        eventEn: 'Napoleon Becomes Emperor',
        category: 'political',
        description: 'نابليون بونابرت يتوج نفسه إمبراطوراً لفرنسا'
      }
    ],
    1815: [
      {
        year: 1815,
        event: 'معركة واترلو',
        eventEn: 'Battle of Waterloo',
        category: 'political',
        description: 'هزيمة نابليون النهائية ونفيه إلى سانت هيلينا'
      }
    ],
    1859: [
      {
        year: 1859,
        event: 'داروين ينشر "أصل الأنواع"',
        eventEn: 'Darwin Publishes Origin of Species',
        category: 'scientific',
        description: 'تشارلز داروين ينشر نظرية التطور'
      }
    ],
    1869: [
      {
        year: 1869,
        event: 'افتتاح قناة السويس',
        eventEn: 'Suez Canal Opening',
        category: 'cultural',
        description: 'افتتاح قناة السويس التي تربط البحرين الأحمر والمتوسط'
      }
    ],
    1876: [
      {
        year: 1876,
        event: 'اختراع الهاتف',
        eventEn: 'Invention of Telephone',
        category: 'scientific',
        description: 'ألكسندر غراهام بيل يخترع الهاتف'
      }
    ],
    1885: [
      {
        year: 1885,
        event: 'اختراع السيارة',
        eventEn: 'Invention of Automobile',
        category: 'scientific',
        description: 'كارل بنز يخترع أول سيارة تعمل بالبنزين'
      }
    ],
    1903: [
      {
        year: 1903,
        event: 'أول طيران للأخوين رايت',
        eventEn: 'Wright Brothers First Flight',
        category: 'scientific',
        description: 'الأخوان رايت يحققان أول طيران بالطائرة'
      }
    ],
    1914: [
      {
        year: 1914,
        event: 'بداية الحرب العالمية الأولى',
        eventEn: 'World War I Begins',
        category: 'political',
        description: 'اغتيال الأرشيدوق فرانز فرديناند يشعل الحرب العالمية الأولى'
      }
    ],
    1917: [
      {
        year: 1917,
        event: 'الثورة الروسية',
        eventEn: 'Russian Revolution',
        category: 'political',
        description: 'سقوط القيصرية الروسية وصعود البلاشفة'
      }
    ],
    1918: [
      {
        year: 1918,
        event: 'نهاية الحرب العالمية الأولى',
        eventEn: 'End of World War I',
        category: 'political',
        description: 'انتهاء الحرب العالمية الأولى بهزيمة ألمانيا'
      }
    ],
    1929: [
      {
        year: 1929,
        event: 'الكساد الكبير',
        eventEn: 'Great Depression',
        category: 'political',
        description: 'انهيار البورصة الأمريكية وبداية الكساد الاقتصادي العالمي'
      }
    ],
    1939: [
      {
        year: 1939,
        event: 'بداية الحرب العالمية الثانية',
        eventEn: 'World War II Begins',
        category: 'political',
        description: 'ألمانيا تغزو بولندا وتبدأ الحرب العالمية الثانية'
      }
    ],
    1945: [
      {
        year: 1945,
        event: 'نهاية الحرب العالمية الثانية',
        eventEn: 'End of World War II',
        category: 'political',
        description: 'استسلام اليابان بعد قنبلتي هيروشيما وناغازاكي'
      }
    ],
    1957: [
      {
        year: 1957,
        event: 'إطلاق سبوتنيك',
        eventEn: 'Sputnik Launch',
        category: 'scientific',
        description: 'الاتحاد السوفيتي يطلق أول قمر صناعي'
      }
    ],
    1961: [
      {
        year: 1961,
        event: 'يوري غاغارين في الفضاء',
        eventEn: 'Yuri Gagarin in Space',
        category: 'scientific',
        description: 'أول إنسان يسافر إلى الفضاء'
      }
    ],
    1963: [
      {
        year: 1963,
        event: 'اغتيال جون كينيدي',
        eventEn: 'JFK Assassination',
        category: 'political',
        description: 'اغتيال الرئيس الأمريكي جون كينيدي في دالاس'
      }
    ],
    1969: [
      {
        year: 1969,
        event: 'هبوط الإنسان على القمر',
        eventEn: 'Moon Landing',
        category: 'scientific',
        description: 'نيل أرمسترونغ أول إنسان يطأ القمر'
      }
    ],
    1975: [
      {
        year: 1975,
        event: 'نهاية حرب فيتنام',
        eventEn: 'End of Vietnam War',
        category: 'political',
        description: 'سقوط سايغون وانتهاء حرب فيتنام'
      }
    ],
    1981: [
      {
        year: 1981,
        event: 'أول حاسوب شخصي من IBM',
        eventEn: 'IBM PC Launch',
        category: 'scientific',
        description: 'IBM تطلق أول حاسوب شخصي'
      }
    ],
    1986: [
      {
        year: 1986,
        event: 'كارثة تشيرنوبل',
        eventEn: 'Chernobyl Disaster',
        category: 'scientific',
        description: 'انفجار مفاعل تشيرنوبل النووي في أوكرانيا'
      }
    ],
    1989: [
      {
        year: 1989,
        event: 'سقوط جدار برلين',
        eventEn: 'Fall of Berlin Wall',
        category: 'political',
        description: 'سقوط جدار برلين ونهاية الحرب الباردة'
      }
    ],
    1991: [
      {
        year: 1991,
        event: 'انهيار الاتحاد السوفيتي',
        eventEn: 'Soviet Union Collapse',
        category: 'political',
        description: 'انهيار الاتحاد السوفيتي وانتهاء الحرب الباردة'
      },
      {
        year: 1991,
        event: 'حرب الخليج الثانية',
        eventEn: 'Gulf War',
        category: 'political',
        description: 'تحرير الكويت من الاحتلال العراقي'
      }
    ],
    1994: [
      {
        year: 1994,
        event: 'الإبادة الجماعية في رواندا',
        eventEn: 'Rwandan Genocide',
        category: 'political',
        description: 'مقتل مئات الآلاف في الإبادة الجماعية برواندا'
      }
    ],
    1995: [
      {
        year: 1995,
        event: 'إطلاق ويندوز 95',
        eventEn: 'Windows 95 Launch',
        category: 'scientific',
        description: 'مايكروسوفت تطلق ويندوز 95 وثورة في عالم الحاسوب'
      }
    ],
    1997: [
      {
        year: 1997,
        event: 'وفاة الأميرة ديانا',
        eventEn: 'Death of Princess Diana',
        category: 'cultural',
        description: 'وفاة الأميرة ديانا في حادث سيارة في باريس'
      }
    ],
    1998: [
      {
        year: 1998,
        event: 'تأسيس جوجل',
        eventEn: 'Google Founded',
        category: 'scientific',
        description: 'لاري بيج وسيرجي برين يؤسسان شركة جوجل'
      }
    ],
    2001: [
      {
        year: 2001,
        event: 'أحداث 11 سبتمبر',
        eventEn: '9/11 Attacks',
        category: 'political',
        description: 'الهجمات الإرهابية على مركز التجارة العالمي والبنتاغون'
      }
    ],
    2003: [
      {
        year: 2003,
        event: 'غزو العراق',
        eventEn: 'Iraq War',
        category: 'political',
        description: 'الولايات المتحدة تغزو العراق وتسقط نظام صدام حسين'
      }
    ],
    2004: [
      {
        year: 2004,
        event: 'تأسيس فيسبوك',
        eventEn: 'Facebook Founded',
        category: 'scientific',
        description: 'مارك زوكربيرغ يؤسس فيسبوك في جامعة هارفارد'
      }
    ],
    2007: [
      {
        year: 2007,
        event: 'إطلاق أول آيفون',
        eventEn: 'iPhone Launch',
        category: 'scientific',
        description: 'آبل تطلق أول آيفون وتثور في عالم الهواتف الذكية'
      }
    ],
    2008: [
      {
        year: 2008,
        event: 'الأزمة المالية العالمية',
        eventEn: 'Global Financial Crisis',
        category: 'political',
        description: 'أكبر أزمة اقتصادية منذ الكساد الكبير'
      }
    ],
    2010: [
      {
        year: 2010,
        event: 'زلزال هايتي المدمر',
        eventEn: 'Haiti Earthquake',
        category: 'scientific',
        description: 'زلزال مدمر يضرب هايتي ويقتل مئات الآلاف'
      }
    ],
    2012: [
      {
        year: 2012,
        event: 'اكتشاف جسيم هيغز',
        eventEn: 'Higgs Boson Discovery',
        category: 'scientific',
        description: 'اكتشاف جسيم هيغز في مصادم الهادرونات الكبير'
      }
    ],
    2016: [
      {
        year: 2016,
        event: 'بريكست - خروج بريطانيا من الاتحاد الأوروبي',
        eventEn: 'Brexit Vote',
        category: 'political',
        description: 'البريطانيون يصوتون لصالح الخروج من الاتحاد الأوروبي'
      }
    ],
    2020: [
      {
        year: 2020,
        event: 'جائحة كوفيد-19',
        eventEn: 'COVID-19 Pandemic',
        category: 'scientific',
        description: 'جائحة عالمية غيرت العالم وأثرت على مليارات البشر'
      }
    ],
    2022: [
      {
        year: 2022,
        event: 'الحرب الروسية الأوكرانية',
        eventEn: 'Russia-Ukraine War',
        category: 'political',
        description: 'روسيا تغزو أوكرانيا في أكبر حرب أوروبية منذ الحرب العالمية الثانية'
      }
    ],
    2023: [
      {
        year: 2023,
        event: 'ثورة الذكاء الاصطناعي',
        eventEn: 'AI Revolution',
        category: 'scientific',
        description: 'إطلاق ChatGPT وبداية عصر جديد من الذكاء الاصطناعي'
      }
    ]
  };

  // حساب العمر بالسنوات
  static calculateAge(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  // العثور على المشاهير في نفس العمر
  static findCelebritiesOfSameAge(userBirthDate: Date): Celebrity[] {
    const userAge = this.calculateAge(userBirthDate);
    let sameCelebrities: Celebrity[] = [];

    // البحث الأول: نفس العمر (±2 سنة)
    this.celebrities.forEach(celebrity => {
      const celebBirthDate = new Date(celebrity.birthDate);
      const celebAge = this.calculateAge(celebBirthDate);
      
      if (Math.abs(celebAge - userAge) <= 2) {
        sameCelebrities.push(celebrity);
      }
    });

    // إذا لم نجد نتائج كافية، نوسع البحث (±5 سنوات)
    if (sameCelebrities.length < 3) {
      sameCelebrities = [];
      this.celebrities.forEach(celebrity => {
        const celebBirthDate = new Date(celebrity.birthDate);
        const celebAge = this.calculateAge(celebBirthDate);
        
        if (Math.abs(celebAge - userAge) <= 5) {
          sameCelebrities.push(celebrity);
        }
      });
    }

    // إذا ما زلنا لا نملك نتائج كافية، نوسع أكثر (±10 سنوات)
    if (sameCelebrities.length < 3) {
      sameCelebrities = [];
      this.celebrities.forEach(celebrity => {
        const celebBirthDate = new Date(celebrity.birthDate);
        const celebAge = this.calculateAge(celebBirthDate);
        
        if (Math.abs(celebAge - userAge) <= 10) {
          sameCelebrities.push(celebrity);
        }
      });
    }

    return sameCelebrities.slice(0, 6); // أول 6 مشاهير
  }

  // العثور على الشخصيات التاريخية في نفس العمر
  static findHistoricalFiguresOfSameAge(userBirthDate: Date): HistoricalFigure[] {
    const userAge = this.calculateAge(userBirthDate);
    let sameHistoricalFigures: HistoricalFigure[] = [];

    // البحث الأول: نفس العمر (±3 سنوات)
    this.historicalFigures.forEach(figure => {
      const figureBirthDate = new Date(figure.birthDate);
      let figureAge: number;
      
      if (figure.deathDate) {
        const deathDate = new Date(figure.deathDate);
        figureAge = deathDate.getFullYear() - figureBirthDate.getFullYear();
      } else {
        figureAge = this.calculateAge(figureBirthDate);
      }
      
      if (Math.abs(figureAge - userAge) <= 3) {
        sameHistoricalFigures.push(figure);
      }
    });

    // إذا لم نجد نتائج كافية، نوسع البحث (±7 سنوات)
    if (sameHistoricalFigures.length < 2) {
      sameHistoricalFigures = [];
      this.historicalFigures.forEach(figure => {
        const figureBirthDate = new Date(figure.birthDate);
        let figureAge: number;
        
        if (figure.deathDate) {
          const deathDate = new Date(figure.deathDate);
          figureAge = deathDate.getFullYear() - figureBirthDate.getFullYear();
        } else {
          figureAge = this.calculateAge(figureBirthDate);
        }
        
        if (Math.abs(figureAge - userAge) <= 7) {
          sameHistoricalFigures.push(figure);
        }
      });
    }

    // إذا ما زلنا لا نملك نتائج، نوسع أكثر (±15 سنة)
    if (sameHistoricalFigures.length < 2) {
      sameHistoricalFigures = [];
      this.historicalFigures.forEach(figure => {
        const figureBirthDate = new Date(figure.birthDate);
        let figureAge: number;
        
        if (figure.deathDate) {
          const deathDate = new Date(figure.deathDate);
          figureAge = deathDate.getFullYear() - figureBirthDate.getFullYear();
        } else {
          figureAge = this.calculateAge(figureBirthDate);
        }
        
        if (Math.abs(figureAge - userAge) <= 15) {
          sameHistoricalFigures.push(figure);
        }
      });
    }

    return sameHistoricalFigures.slice(0, 4); // أول 4 شخصيات
  }

  // الحصول على الأحداث التاريخية في سنة الميلاد
  static getBirthYearEvents(birthDate: Date): HistoricalEvent[] {
    const birthYear = birthDate.getFullYear();
    let events: HistoricalEvent[] = [];

    // البحث الأول: السنة نفسها والسنوات المجاورة (±2)
    for (let year = birthYear - 2; year <= birthYear + 2; year++) {
      if (this.historicalEvents[year]) {
        events.push(...this.historicalEvents[year]);
      }
    }

    // إذا لم نجد أحداث كافية، نوسع البحث (±5 سنوات)
    if (events.length < 2) {
      events = [];
      for (let year = birthYear - 5; year <= birthYear + 5; year++) {
        if (this.historicalEvents[year]) {
          events.push(...this.historicalEvents[year]);
        }
      }
    }

    // إذا ما زلنا لا نملك أحداث كافية، نوسع أكثر (±10 سنوات)
    if (events.length < 2) {
      events = [];
      for (let year = birthYear - 10; year <= birthYear + 10; year++) {
        if (this.historicalEvents[year]) {
          events.push(...this.historicalEvents[year]);
        }
      }
    }

    return events.slice(0, 5); // أول 5 أحداث
  }

  // الحصول على المتوسطات العالمية
  static getGlobalAverages(userAge: number) {
    let category = '';
    let lifeExpectancy = 72;
    let marriageAge = 28;
    let retirementAge = 65;

    if (userAge < 18) {
      category = 'مراهق';
      lifeExpectancy = 75;
    } else if (userAge < 30) {
      category = 'شاب';
      lifeExpectancy = 74;
    } else if (userAge < 50) {
      category = 'بالغ';
      lifeExpectancy = 73;
    } else if (userAge < 65) {
      category = 'متوسط العمر';
      lifeExpectancy = 71;
    } else {
      category = 'كبير السن';
      lifeExpectancy = 68;
    }

    return {
      lifeExpectancy,
      marriageAge,
      retirementAge,
      category
    };
  }

  // الحساب الشامل للعمر النسبي
  static calculateRelativeAge(birthDate: Date): AgeComparison {
    const userAge = this.calculateAge(birthDate);
    
    return {
      userAge,
      celebrities: this.findCelebritiesOfSameAge(birthDate),
      historicalFigures: this.findHistoricalFiguresOfSameAge(birthDate),
      birthYearEvents: this.getBirthYearEvents(birthDate),
      globalAverages: this.getGlobalAverages(userAge)
    };
  }

  // تحويل الأرقام للعربية
  static toArabicNumerals(num: number): string {
    const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return num.toString().replace(/[0-9]/g, (digit) => arabicNumerals[parseInt(digit)]);
  }

  // تنسيق التاريخ بالعربية
  static formatArabicDate(date: Date): string {
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}