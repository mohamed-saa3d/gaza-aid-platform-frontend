// Centralized mock data. Replace with real API calls (e.g. via @tanstack/react-query)
// by swapping these constants for fetched data with the same shapes.

export type ProjectStatus = "ongoing" | "urgent"

export interface Project {
  id: string
  slug: string
  title: string
  description: string
  image: string
  category: CategoryId
  status: ProjectStatus
  progress: number
  funded: number
  remaining: number
  target: number
}

export type CategoryId =
  | "water"
  | "food"
  | "shelter"
  | "orphans"
  | "health"
  | "education"
  | "other"

export interface Category {
  id: CategoryId
  label: string
  icon: "Droplets" | "Utensils" | "Home" | "Users" | "HeartPulse" | "BookOpen" | "LayoutGrid"
}

export const categories: Category[] = [
  { id: "other", label: "مشاريع أخرى", icon: "LayoutGrid" },
  { id: "orphans", label: "كفالة الأيتام", icon: "Users" },
  { id: "education", label: "التعليم والتنمية", icon: "BookOpen" },
  { id: "health", label: "الصحة والرعاية", icon: "HeartPulse" },
  { id: "shelter", label: "الإيواء والمأوى", icon: "Home" },
  { id: "food", label: "الغذاء والإطعام", icon: "Utensils" },
  { id: "water", label: "المياه والإصحاح", icon: "Droplets" },
]

export const filterCategories: { id: CategoryId | "all"; label: string }[] = [
  { id: "all", label: "الكل" },
  { id: "water", label: "مياه وإصحاح" },
  { id: "urgent" as CategoryId, label: "إغاثة عاجلة" },
  { id: "orphans", label: "كفالة أيتام" },
  { id: "health", label: "صحة" },
  { id: "food", label: "غذاء" },
  { id: "shelter", label: "إيواء" },
]

export const projects: Project[] = [
  {
    id: "p1",
    slug: "kafala-talib-ilm",
    title: "كفالة طالب علم",
    description: "كفالة طالب يتيم لمساعدته في إكمال تعليمه وتأمين مستقبله الدراسي.",
    image: "/images/project-education.png",
    category: "orphans",
    status: "ongoing",
    progress: 40,
    funded: 120000,
    remaining: 80000,
    target: 200000,
  },
  {
    id: "p2",
    slug: "salat-ghadaiya",
    title: "السلة الغذائية للأسر المتعففة",
    description: "توفير سلال غذائية متكاملة للأسر المتعففة في مختلف مناطق قطاع غزة.",
    image: "/images/project-food-basket.png",
    category: "food",
    status: "ongoing",
    progress: 75,
    funded: 210000,
    remaining: 70000,
    target: 280000,
  },
  {
    id: "p3",
    slug: "bir-khanyounis-7",
    title: "بئر رقم (7) - خانيونس",
    description: "حفر وتجهيز بئر مياه عميق لتوفير مياه شرب نظيفة لأهالي منطقة خانيونس.",
    image: "/images/project-well.png",
    category: "water",
    status: "urgent",
    progress: 60,
    funded: 108000,
    remaining: 162000,
    target: 270000,
  },
  {
    id: "p4",
    slug: "miyah-wa-isha",
    title: "مشروع المياه والإصحاح",
    description: "تحسين خدمات المياه والصرف الصحي في المناطق الأكثر احتياجاً.",
    image: "/images/project-sanitation.png",
    category: "water",
    status: "ongoing",
    progress: 55,
    funded: 137500,
    remaining: 112500,
    target: 250000,
  },
  {
    id: "p5",
    slug: "eiwaa-aailat",
    title: "إيواء العائلات المتضررة",
    description: "توفير خيام ومواد إيواء للعائلات التي فقدت منازلها بسبب العدوان.",
    image: "/images/project-shelter.png",
    category: "shelter",
    status: "urgent",
    progress: 30,
    funded: 10000,
    remaining: 90000,
    target: 100000,
  },
  {
    id: "p6",
    slug: "eiyada-tibiya",
    title: "عيادة طبية متنقلة",
    description: "تجهيز وتشغيل عيادة طبية متنقلة لتقديم الرعاية الصحية للأهالي في المناطق النائية.",
    image: "/images/project-clinic.png",
    category: "health",
    status: "ongoing",
    progress: 65,
    funded: 195000,
    remaining: 105000,
    target: 300000,
  },
  {
    id: "p7",
    slug: "kafala-yatim-2",
    title: "كفالة يتيم شهرية",
    description: "كفالة شهرية مستدامة تضمن للطفل اليتيم الغذاء والتعليم والرعاية الصحية.",
    image: "/images/project-education.png",
    category: "orphans",
    status: "ongoing",
    progress: 50,
    funded: 100000,
    remaining: 100000,
    target: 200000,
  },
  {
    id: "p8",
    slug: "matbakh-khayri",
    title: "المطبخ الخيري",
    description: "توفير وجبات ساخنة يومية للأسر النازحة والمحتاجة في مختلف المناطق.",
    image: "/images/project-food-basket.png",
    category: "food",
    status: "ongoing",
    progress: 45,
    funded: 90000,
    remaining: 110000,
    target: 200000,
  },
  {
    id: "p9",
    slug: "khayam-shitaiya",
    title: "خيام شتوية للنازحين",
    description: "توفير خيام معزولة ومقاومة للبرد للعائلات النازحة قبل دخول فصل الشتاء.",
    image: "/images/project-shelter.png",
    category: "shelter",
    status: "urgent",
    progress: 20,
    funded: 40000,
    remaining: 160000,
    target: 200000,
  },
  {
    id: "p10",
    slug: "qawafil-tibiya",
    title: "قوافل طبية إغاثية",
    description: "إرسال قوافل طبية متخصصة لتقديم العلاج والأدوية في المناطق الأكثر احتياجاً.",
    image: "/images/project-clinic.png",
    category: "health",
    status: "urgent",
    progress: 35,
    funded: 70000,
    remaining: 130000,
    target: 200000,
  },
  {
    id: "p11",
    slug: "bir-artawazi",
    title: "بئر ارتوازي - قرية الرحمة",
    description: "حفر بئر ارتوازي جديد لتوفير مياه الشرب النظيفة لأهالي القرية.",
    image: "/images/project-well.png",
    category: "water",
    status: "ongoing",
    progress: 70,
    funded: 140000,
    remaining: 60000,
    target: 200000,
  },
  {
    id: "p12",
    slug: "dawrat-tadribiya",
    title: "دورات تدريبية للشباب",
    description: "برامج تدريب مهني تمكّن الشباب من دخول سوق العمل وتحسين مستوى دخلهم.",
    image: "/images/project-education.png",
    category: "education",
    status: "ongoing",
    progress: 58,
    funded: 116000,
    remaining: 84000,
    target: 200000,
  },
]

export const heroStats = [
  { id: "meals", value: "+120K", label: "وجبة غذائية", icon: "UtensilsCrossed" },
  { id: "beneficiaries", value: "+85K", label: "مستفيد", icon: "Users" },
  { id: "projects", value: "+250", label: "مشروع منفذ", icon: "ClipboardCheck" },
  { id: "years", value: "+15", label: "عام من العطاء", icon: "CalendarDays" },
] as const

export const donationReasons = [
  { id: "water", label: "المياه", icon: "Droplet" },
  { id: "food", label: "الطعام", icon: "UtensilsCrossed" },
  { id: "shelter", label: "الإيواء", icon: "Home" },
  { id: "orphans", label: "كفالة اليتيم", icon: "Users" },
  { id: "zakat", label: "زكاة المال", icon: "HandCoins" },
  { id: "wells", label: "آبار المياه", icon: "Droplets" },
] as const

export const quickAmounts = [50, 100, 200] as const

export const whyChooseUs = [
  { id: "reach", title: "نصل للآخرين", description: "نصل للمحتاجين في كل مكان", icon: "HeartHandshake" },
  { id: "transparency", title: "شفافية كاملة", description: "تقارير دورية ووضوح في الأداء", icon: "BarChart3" },
  { id: "execution", title: "تنفيذ محترف", description: "فريق ميداني ذو خبرة", icon: "Users2" },
  { id: "trust", title: "موثوق ومعتمد", description: "مرخصة ومعتمدة رسمياً", icon: "ShieldCheck" },
] as const

export const paymentMethodIcons = [
  { id: "cards", label: "بطاقات ائتمانية", icon: "CreditCard" },
  { id: "bank", label: "تحويل بنكي", icon: "Landmark" },
  { id: "applepay", label: "Apple Pay", icon: "Smartphone" },
] as const

// Projects page updates / progress dashboard
export const projectProgressSeries = [
  { month: "أكتوبر 2025", total: 40, completed: 24 },
  { month: "نوفمبر 2025", total: 46, completed: 30 },
  { month: "ديسمبر 2025", total: 52, completed: 36 },
  { month: "يناير 2026", total: 58, completed: 42 },
  { month: "فبراير 2026", total: 62, completed: 46 },
  { month: "مارس 2026", total: 66, completed: 50 },
  { month: "أبريل 2026", total: 69, completed: 54 },
  { month: "مايو 2026", total: 71, completed: 58 },
  { month: "يونيو 2026", total: 75, completed: 64 },
  { month: "يوليو 2026", total: 78, completed: 68 },
  { month: "أغسطس 2026", total: 82, completed: 72 },
  { month: "سبتمبر 2026", total: 85, completed: 76 },
]

export const projectCompletionSummary = {
  overallRate: 85,
  completedCount: 72,
  activeCount: 85,
}

export interface CompletedUpdate {
  id: string
  title: string
  subtitle: string
  description: string
  image: string
  location: string
  date: string
  beneficiaries: string
}

export const completedUpdates: CompletedUpdate[] = [
  {
    id: "u1",
    title: "إنشاء مدرسة الأمل الأساسية",
    subtitle: "بدعم أهل الخير",
    description: "تم بناء مدرسة متكاملة تضم 12 فصلاً دراسياً، لتوفر التعليم الجيد لأكثر من 600 طالب وطالبة.",
    image: "/images/update-school.png",
    location: "تعز - اليمن",
    date: "1 سبتمبر 2026",
    beneficiaries: "600 طالب",
  },
  {
    id: "u2",
    title: "توزيع 1,000 سلة غذائية - غزة",
    subtitle: "بدعم أهل الخير",
    description: "تم توزيع 1,000 سلة غذائية متكاملة على الأسر المتعففة في قطاع غزة لمساعدتهم على تجاوز الظروف الصعبة.",
    image: "/images/update-distribution.png",
    location: "قطاع غزة - فلسطين",
    date: "5 سبتمبر 2026",
    beneficiaries: "1,000 مستفيد",
  },
  {
    id: "u3",
    title: "بئر ماء ارتوازي - قرية النخيل",
    subtitle: "بدعم أهل الخير",
    description: "تم توفير مصدر مياه نظيف وآمن لأكثر من 350 عائلة في القرية، مما ساهم في تحسين الصحة وتقليل الأمراض.",
    image: "/images/project-well.png",
    location: "الحديدة - اليمن",
    date: "10 سبتمبر 2026",
    beneficiaries: "350 عائلة",
  },
]

// Donation flow
export const featuredDonationProject = {
  title: "كفالة أيتام غزة",
  description: "نوفر الرعاية والدعم الشامل للأيتام في قطاع غزة",
  image: "/images/project-education.png",
  amount: 500,
}

// Profile / dashboard
export const currentUser = {
  name: "محمد سعد",
  status: "متبرع نشط",
  avatar: "/images/hero-child.png",
}

export interface NotificationItem {
  id: string
  title: string
  description: string
  time: string
  unread: boolean
}

export const notifications: NotificationItem[] = [
  {
    id: "n1",
    title: "تذكير:",
    description: "غداً، شكراً لعطائك المستمر. سيتم تجديد تبرعك الشهري بقيمة 200 ر.س",
    time: "الآن",
    unread: true,
  },
  {
    id: "n2",
    title: "تم بنجاح",
    description: "تم بنجاح التبرع الشهري بقيمة 200 ر.س لمشروع سقيا الماء.",
    time: "يوم أمس",
    unread: false,
  },
  {
    id: "n3",
    title: "شكراً لك!",
    description: "شكراً لكا لقد ساهمت في إحداث فرق في حياة مستفيد.",
    time: "منذ 3 أيام",
    unread: false,
  },
  {
    id: "n4",
    title: "تحديث مشروع",
    description: "تم تحديث مشروع بناء المساجد. اضغط لمشاهدة التفاصيل.",
    time: "منذ 7 أيام",
    unread: false,
  },
]

export interface LinkedWallet {
  id: string
  brand: "visa" | "mastercard" | "applepay"
  last4: string
  linkedOn: string
}

export const linkedWallets: LinkedWallet[] = [
  { id: "w1", brand: "applepay", last4: "4242", linkedOn: "12 Linked on 2024" },
]

export const monthlyDonationSettings = {
  isActive: true,
  amount: 200,
  nextChargeDate: "1 سبتمبر",
}

export const platformRating = {
  score: 4.8,
  count: 12540,
}

export interface DonationHistoryItem {
  id: string
  title: string
  amount: number
  date: string
  icon: "Droplets" | "Users" | "ShoppingBasket" | "Utensils"
}

export const donationHistory: DonationHistoryItem[] = [
  { id: "d1", title: "بئر رقم (7) - خانيونس", amount: 5000, date: "2024-06-01", icon: "Droplets" },
  { id: "d2", title: "كفالة يتيم", amount: 300, date: "2024-06-01", icon: "Users" },
  { id: "d3", title: "السلة الغذائية", amount: 150, date: "2024-05-31", icon: "ShoppingBasket" },
  { id: "d4", title: "المطبخ الخيري", amount: 1000, date: "2024-05-31", icon: "Utensils" },
]

export interface MyProject {
  id: string
  title: string
  image: string
  progress: number
}

export const myProjects: MyProject[] = [
  { id: "m1", title: "السلة الغذائية", image: "/images/project-food-basket.png", progress: 75 },
  { id: "m2", title: "كفالة يتيم", image: "/images/project-education.png", progress: 40 },
  { id: "m3", title: "بئر رقم (7) - خانيونس", image: "/images/project-well.png", progress: 60 },
]

// About page
export const foundationFocusAreas = categories.filter((c) => c.id !== "other")

export const foundationInfo = {
  name: "مؤسسة قدس للإغاثة",
  license: "278/2012",
  founded: "2012",
  description:
    "تأسّست مؤسسة قدس للإغاثة في غزة عام 2012 بموجب ترخيص رقم 278/2012. نلتزم بتقديم العون الإنساني والكرامة لمن هم في أمس الحاجة إليها. نسعى جاهدين لبناء مجتمع متكافل ومستدام.",
}

export const honorStats = {
  count: 22,
  label: "شهيداً",
  description:
    "نقف إجلالاً وإكباراً لأرواح زملائنا من الموظفين والمتطوعين الذين قدموا أرواحهم فداءً للواجب الإنساني أثناء تأديتهم لعملهم وعائلاتهم. تضحياتهم ستظل نبراساً يضيء طريقنا لمواصلة المسيرة.",
}

export const wartimeMission = {
  title: "رسالتنا خلال الحرب",
  paragraphs: [
    "في ظل الظروف الاستثنائية القاسية، تضاعفت مسؤولياتنا. تعمل طواقمنا على مدار الساعة، متحدية الصعاب والمخاطر، لضمان وصول المساعدات ا��حيوية إلى الأسر النازحة والمتضررة.",
    "لقد قمنا بتوسيع عملياتنا لتشمل إنشاء مراكز إيواء مؤقتة، وتوفير المياه الصالحة للشرب، وتوزيع وجبات ساخنة يومية، بالإضافة إلى تقديم الدعم النفسي الأول للأطفال وعائلاتهم. نؤمن بأن الاستمرار في تقديم العون هو شكل من أشكال الصمود والتحدي.",
  ],
}

// News / Media page
export interface NewsArticle {
  id: string
  slug: string
  title: string
  excerpt: string
  image: string
  date: string
  urgent: boolean
}

export const featuredNewsArticle: NewsArticle = {
  id: "n1",
  slug: "hamlat-alshataa-aldafi-3",
  title: "انطلاق المرحلة الثالثة من حملة الشتاء الدافئ في مراكز الإيواء بغزة",
  excerpt:
    "أطلقت مؤسسة قدس إغاثة المرحلة الثالثة من حملة الشتاء الدافئ لتوفير الملابس والبطانيات ومواد التدفئة للأسر النازحة في مراكز الإيواء بقطاع غزة، في ظل استمرار الأوضاع الإنسانية الصعبة والانخفاض الحاد في درجات الحرارة.",
  image: "/images/news-featured-winter.png",
  date: "15 أكتوبر 2026",
  urgent: true,
}

export const newsArticles: NewsArticle[] = [
  {
    id: "n2",
    slug: "tawzi-500-sala-khanyounis",
    title: "توزيع 500 سلة غذائية في مواصي خانيونس",
    excerpt: "بدعم من أهل الخير، تم توزيع 500 سلة غذائية على الأسر المتعففة والنازحة في مواصي خانيونس.",
    image: "/images/news-food-distribution.png",
    date: "10 أكتوبر 2026",
    urgent: false,
  },
  {
    id: "n3",
    slug: "eiyada-mutanaqila-rafah",
    title: "عيادة متنقلة تقدم خدماتها في رفح",
    excerpt: "واصلت العيادة المتنقلة تقديم الخدمات الطبية المجانية للأسر النازحة في مدينة رفح والمناطق المجاورة.",
    image: "/images/news-mobile-clinic.png",
    date: "10 أكتوبر 2026",
    urgent: false,
  },
  {
    id: "n4",
    slug: "iftitah-bir-mya-deir-albalah",
    title: "افتتاح بئر مياه جديد في دير البلح",
    excerpt: "تم بحمد الله افتتاح بئر مياه ارتوازي جديد في منطقة دير البلح، وسيخدم أكثر من 3,000 نسمة من الأهالي والنازحين.",
    image: "/images/news-water-well.png",
    date: "10 أكتوبر 2026",
    urgent: false,
  },
]

// Live stream page
export interface LiveChatMessage {
  id: string
  name: string
  message: string
  time: string
  highlight?: boolean
}

export const liveStreamData = {
  title: "بث مباشر: حملة الإغاثة العاجلة وتوزيع المساعدات",
  description:
    "نقل حي ومباشر لجهودنا الإنسانية في تقديم المساعدات العاجلة لأهلنا المتضررين. كونوا معنا لحظة بلحظة وشاركوا وشاركوا الخير.",
  image: "/images/live-stream-cover.png",
  viewers: "1,250",
  date: "25 مايو 2024",
  location: "غزة - فلسطين",
  goal: 500000,
  funded: 375000,
  progress: 75,
}

export const liveChatMessages: LiveChatMessage[] = [
  { id: "c1", name: "أبو محمد", message: "بارك الله فيكم وجزاكم الله خيراً", time: "10:24" },
  { id: "c2", name: "سارة العتيبي", message: "الله أكبر تم التبرع", time: "10:25", highlight: true },
  { id: "c3", name: "نور العنزي", message: "استمروا، الله يعطيكم العافية", time: "10:26" },
  { id: "c4", name: "أبو العربي", message: "تم التبرع، الله يبارك فيكم", time: "10:27", highlight: true },
]

export const liveQuickAmounts = [100, 200, 500] as const

// FAQ page
export interface FaqItem {
  question: string
  answer: string
}

export interface FaqCategory {
  id: string
  title: string
  items: FaqItem[]
}

export const faqCategories: FaqCategory[] = [
  {
    id: "donations",
    title: "التبرعات",
    items: [
      {
        question: "كيف يمكنني التبرع؟",
        answer: "يمكنك التبرع عبر البطاقات الائتمانية أو Apple Pay من صفحة (تبرع الآن)، أو عبر التحويل المباشر بدون حساب بنكي من صفحة (تبرع بدون حساب بنكي).",
      },
      {
        question: "هل يمكنني إلغاء التبرع الشهري؟",
        answer: "نعم، يمكنك إيقاف أو تعديل تبرعك الشهري في أي وقت من صفحة الملف الشخصي وإعدادات التبرع الشهري.",
      },
      {
        question: "هل هناك حد أدنى لمبلغ التبرع؟",
        answer: "لا يوجد حد أدنى، ويمكنك التبرع بأي مبلغ يناسبك ويحقق أثراً حقيقياً في حياة المحتاجين.",
      },
    ],
  },
  {
    id: "transparency",
    title: "الشفافية والتقارير",
    items: [
      {
        question: "كيف أتابع أثر تبرعي؟",
        answer: "نرسل إشعارات فورية عند إنفاق تبرعك، ويمكنك متابعة تحديثات المشاريع من صفحة (تحديثات المشاريع).",
      },
      {
        question: "هل تصدر المؤسسة تقارير مالية؟",
        answer: "نعم، تصدر المؤسسة تقارير سنوية مفصلة حول أنشطتها وأوجه إنفاق التبرعات، ويمكن طلبها من فريق الدعم.",
      },
    ],
  },
  {
    id: "account",
    title: "الحساب الشخصي",
    items: [
      {
        question: "كيف أنشئ حساباً جديداً؟",
        answer: "يمكنك إنشاء حساب من صفحة (تسجيل جديد) بإدخال بياناتك ثم تأكيد رقم هاتفك عبر رمز التحقق.",
      },
      {
        question: "نسيت رمز الدخول، ماذا أفعل؟",
        answer: "اضغط على رابط (نسيت كلمة المرور) في صفحة تسجيل الدخول لإعادة تعيينها بسهولة.",
      },
    ],
  },
  {
    id: "security",
    title: "الأمان والخصوصية",
    items: [
      {
        question: "هل بياناتي البنكية محفوظة بأمان؟",
        answer: "جميع بيانات الدفع مشفرة ومحمية وفق أعلى معايير الأمان العالمية، ولا يتم تخزين بيانات بطاقتك على خوادمنا.",
      },
      {
        question: "من يمكنه الوصول إلى معلوماتي الشخصية؟",
        answer: "لا نشارك بياناتك مع أي طرف ثالث، وتُستخدم فقط لغرض إدارة تبرعاتك وتحسين تجربتك معنا.",
      },
    ],
  },
]
