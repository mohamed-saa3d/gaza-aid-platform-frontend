export type Locale = "ar" | "en"

type DictionarySection = Record<string, string>

export type LocaleDictionary = {
  nav: DictionarySection
  footer: DictionarySection
  common: DictionarySection
}

export const dictionary: Record<Locale, LocaleDictionary> = {
  ar: {
    nav: {
      home: "الرئيسية",
      projects: "مشاريعنا",
      live: "بث مباشر",
      news: "الأخبار",
      updates: "تحديثات المشاريع",
      noBank: "تبرع بدون حساب بنكي",
      donate: "تبرع الآن",
    },
    common: {
      menu: "القائمة",
      openMenu: "فتح القائمة",
      profile: "الملف الشخصي",
      language: "العربية",
      home: "الصفحة الرئيسية",
      navigation: "التنقل الرئيسي",
      mobileNavigation: "التنقل - جوال",
    },
    footer: {
      about: "من نحن",
      contact: "تواصل معنا",
      quickLinks: "روابط سريعة",
      help: "المساعدة",
      contactInfo: "معلومات التواصل",
      newsletter: "النشرة البريدية",
      newsletterCopy: "اشترك ليصلك جديد مشاريعنا وأخبارنا",
      subscribe: "اشترك",
      rights: "جميع الحقوق محفوظة",
      orgName: "مؤسسة قدس للإغاثة",
      faq: "الأسئلة الشائعة",
      privacy: "سياسة الخصوصية",
      terms: "الشروط والأحكام",
      createAccount: "أنشئ حساب الآن",
      developerCredit: "تم التصميم والتطوير بواسطة",
      developerName: "محمد سعد",
      description: "مؤسسة خيرية تعمل على تقديم الإغاثة والدعم للمحتاجين في فلسطين وخارجها، وبناء مجتمعات مستدامة.",
      location: "فلسطين",
      socialMedia: "رابط شبكة اجتماعية",
    },
  },
  en: {
    nav: {
      home: "Home",
      projects: "Projects",
      live: "Live",
      news: "News",
      updates: "Project Updates",
      noBank: "Donate Without a Bank Account",
      donate: "Donate Now",
    },
    common: {
      menu: "Menu",
      openMenu: "Open menu",
      profile: "Profile",
      language: "English",
      home: "Home",
      navigation: "Main navigation",
      mobileNavigation: "Mobile navigation",
    },
    footer: {
      about: "About Us",
      contact: "Contact Us",
      quickLinks: "Quick Links",
      help: "Help",
      contactInfo: "Contact Info",
      newsletter: "Newsletter",
      newsletterCopy: "Subscribe to get updates on our projects and news",
      subscribe: "Subscribe",
      rights: "All rights reserved",
      orgName: "Quds Relief Foundation",
      faq: "FAQ",
      privacy: "Privacy Policy",
      terms: "Terms & Conditions",
      createAccount: "Create an account now",
      developerCredit: "Designed and developed by",
      developerName: "Mohamed Saad",
      description: "A charitable organization dedicated to providing relief and support to those in need in Palestine and beyond, and building sustainable communities.",
      location: "Palestine",
      socialMedia: "Social media link",
    },
  },
}
